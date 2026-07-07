import { prisma } from '@/lib/prisma';
import { OrderStatus, PaymentStatus, AddressType } from '@prisma/client';
import { randomBytes } from 'crypto';
import { getPackPrice } from '@/lib/store/cart';

interface OrderItemInput {
  productId: string;
  quantity: number;
  packSize: '1' | '6';
}

interface ShippingDetailsInput {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
  email: string;
}

export const orderService = {
  /**
   * Creates a new order, calculates totals securely using DB prices,
   * and generates related Address, OrderItems, and Payment records.
   */
  async createOrder(
    userId: string,
    items: OrderItemInput[],
    shippingDetails: ShippingDetailsInput
  ) {
    if (!items || items.length === 0) {
      throw new Error('Order must contain at least one item.');
    }
    console.log('Items received:', items);
    // 1. Fetch product prices securely from the database
    const productSlugs = items.map((item) => item.productId);
    console.log('Slugs received:', productSlugs);
    const allProducts = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
      },
    });

    console.log('All products in DB:', allProducts);
    const products = await prisma.product.findMany({
      where: {
        slug: {
          in: productSlugs,
        },
      },
    });
    console.log('Products found:', products);

    if (products.length !== productSlugs.length) {
      throw new Error('One or more products are invalid or unavailable.');
    }

    // 2. Calculate totals
    let subtotal = 0;
    const orderItemsData = items.map((item) => {
      const product = products.find((p) => p.slug === item.productId);

      if (!product) {
        throw new Error(`Product not found: ${item.productId}`);
      }

      const totalBars = item.quantity * parseInt(item.packSize, 10);
      if (product.inventory < totalBars) {
        throw new Error(`Insufficient inventory for ${product.name}`);
      }

      const packPrice = getPackPrice(product.price, product.price6, item.packSize);
      const itemTotal = packPrice * item.quantity;
      subtotal += itemTotal;

      return {
        productId: product.id,
        quantity: item.quantity,
        packSize: item.packSize,
        price: packPrice,
      };
    });

    const shipping = subtotal > 499 ? 0 : 250;
    const total = subtotal + shipping;

    // Generate a unique order number (e.g. ORD-12345678)
    const orderNumber = `ORD-${randomBytes(4).toString('hex').toUpperCase()}`;

    // 3. Execute Transaction
    const order = await prisma.$transaction(async (tx) => {
      // Create or update address
      const address = await tx.address.create({
        data: {
          userId,
          type: AddressType.SHIPPING,
          firstName: shippingDetails.firstName,
          lastName: shippingDetails.lastName,
          street: shippingDetails.address,
          city: shippingDetails.city,
          state: 'N/A', // Modify if state is added to checkout
          zip: shippingDetails.postalCode,
          phone: shippingDetails.phone,
          isDefault: true,
        },
      });

      // Create Order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId,
          status: OrderStatus.PENDING,
          subtotal,
          shipping,
          tax: 0,
          total,
          addressId: address.id,
          items: {
            create: orderItemsData,
          },
          payment: {
            create: {
              status: PaymentStatus.PENDING,
              provider: 'checkout_mock',
              amount: total,
            },
          },
        },
      });

      // Update Inventory (Optional depending on business rules, but good practice)
      for (const item of orderItemsData) {
        const totalBars = item.quantity * parseInt(item.packSize, 10);
        await tx.product.update({
          where: { id: item.productId },
          data: { inventory: { decrement: totalBars } },
        });
      }

      return newOrder;
    });

    return order;
  },

  /**
   * Fetch all orders for a specific user
   */
  async getUserOrders(userId: string) {
    return prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        items: true,
      },
    });
  },

  /**
   * Fetch a specific order by ID, ensuring it belongs to the user
   */
  async getOrderById(orderId: string, userId: string) {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: userId,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        address: true,
        payment: true,
      },
    });

    if (!order) {
      throw new Error('Order not found or unauthorized');
    }

    return order;
  },
};
