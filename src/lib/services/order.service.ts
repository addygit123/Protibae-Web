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
   * Calculates totals securely using DB prices without creating an order.
   */
  async calculateOrderTotals(items: OrderItemInput[]) {
    if (!items || items.length === 0) {
      throw new Error('Order must contain at least one item.');
    }
    
    const productIds = items.map((item) => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    if (products.length !== productIds.length) {
      throw new Error('One or more products are invalid or unavailable.');
    }

    let subtotal = 0;
    const orderItemsData = items.map((item) => {
      const product = products.find((p) => p.id === item.productId)!;
      const totalBars = item.quantity * parseInt(item.packSize, 10);
      
      if (product.inventory < totalBars) {
        throw new Error(`Insufficient inventory for ${product.name}`);
      }

      const packPrice = getPackPrice(product.price, product.price6, item.packSize);
      subtotal += packPrice * item.quantity;

      return {
        productId: product.id,
        quantity: item.quantity,
        packSize: item.packSize,
        price: packPrice,
      };
    });

    const shipping = subtotal > 499 ? 0 : 250;
    const total = subtotal + shipping;

    return { subtotal, shipping, total, orderItemsData };
  },

  /**
   * Creates a new order, calculates totals securely using DB prices,
   * and generates related Address, OrderItems, and Payment records.
   * Inventory is NOT deducted here.
   */
  async createOrder(
    userId: string,
    items: OrderItemInput[],
    shippingDetails: ShippingDetailsInput,
    razorpayOrderId?: string
  ) {
    // 1 & 2. Calculate totals securely
    const { subtotal, shipping, total, orderItemsData } = await this.calculateOrderTotals(items);

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
              provider: razorpayOrderId ? 'razorpay' : 'checkout_mock',
              amount: total,
              razorpayOrderId: razorpayOrderId || null,
            },
          },
        },
      });

      return newOrder;
    });

    return order;
  },

  /**
   * Finalizes an order upon successful payment verification.
   * Updates payment and order status, and deducts inventory.
   */
  async finalizeOrderPayment(orderId: string, razorpayPaymentId: string) {
    return prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: orderId },
        include: { payment: true, items: true },
      });

      if (!order) throw new Error('Order not found');
      
      // If already paid, prevent double execution
      if (order.status === OrderStatus.PAID) {
        return order;
      }

      // 1. Update Payment Status
      if (order.payment) {
        await tx.payment.update({
          where: { id: order.payment.id },
          data: {
            status: PaymentStatus.SUCCESS,
            razorpayPaymentId,
            transactionId: razorpayPaymentId,
          },
        });
      }

      // 2. Update Order Status
      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.PAID },
      });

      // 3. Deduct Inventory
      for (const item of order.items) {
        const totalBars = item.quantity * parseInt(item.packSize || '1', 10);
        await tx.product.update({
          where: { id: item.productId },
          data: { inventory: { decrement: totalBars } },
        });
      }

      return updatedOrder;
    });
  },

  /**
   * Handles a failed payment attempt.
   */
  async handleFailedPayment(orderId: string, razorpayPaymentId?: string) {
    return prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: orderId },
        include: { payment: true },
      });

      if (!order || order.status === OrderStatus.PAID) return order;

      if (order.payment) {
        await tx.payment.update({
          where: { id: order.payment.id },
          data: {
            status: PaymentStatus.FAILED,
            ...(razorpayPaymentId && { razorpayPaymentId, transactionId: razorpayPaymentId }),
          },
        });
      }

      return tx.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.CANCELLED },
      });
    });
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
