import * as React from 'react';
import { Text, Section } from '@react-email/components';
import { BaseLayout, Header, Footer, Button, theme, Divider, OrderSummary, AddressBlock, ProductCard } from '../components';
import { Address } from '../components/AddressBlock';

interface OrderItem {
  id: string;
  name: string;
  image: string;
  quantity: number;
  price: string;
}

interface OrderConfirmationProps {
  customerName: string;
  orderNumber: string;
  items: OrderItem[];
  subtotal: string;
  shippingCost: string;
  discount?: string;
  tax: string;
  total: string;
  paymentMethod: string;
  shippingAddress: Address;
  billingAddress: Address;
  estimatedDelivery: string;
}

export const OrderConfirmation = ({
  customerName,
  orderNumber,
  items,
  subtotal,
  shippingCost,
  discount,
  tax,
  total,
  paymentMethod,
  shippingAddress,
  billingAddress,
  estimatedDelivery,
}: OrderConfirmationProps) => (
  <BaseLayout previewText={`Order Confirmation #${orderNumber}`}>
    <Header />
    <Section style={{ padding: '20px 0' }}>
      <Text style={{ color: theme.colors.textPrimary, fontSize: '24px', fontWeight: 'bold', margin: '0 0 15px 0' }}>
        Thank You for Your Order, {customerName}!
      </Text>
      <Text style={{ color: theme.colors.textSecondary, fontSize: '16px', lineHeight: '24px', margin: '0 0 20px 0' }}>
        We've received your order <strong>#{orderNumber}</strong> and are getting it ready for shipment. 
        Expected delivery is <strong>{estimatedDelivery}</strong>.
      </Text>
      
      <Divider />
      
      <Section>
        <Text style={{ color: theme.colors.textPrimary, fontSize: '18px', fontWeight: 'bold' }}>Items Ordered</Text>
        {items.map((item) => (
          <ProductCard key={item.id} image={item.image} name={item.name} quantity={item.quantity} price={item.price} />
        ))}
      </Section>

      <OrderSummary 
        subtotal={subtotal} 
        shipping={shippingCost} 
        discount={discount} 
        tax={tax} 
        total={total} 
        paymentMethod={paymentMethod} 
      />

      <Divider />

      <AddressBlock shippingAddress={shippingAddress} billingAddress={billingAddress} />

      <Section style={{ textAlign: 'center', marginTop: '20px' }}>
        <Button href={`https://protibae.com/account/orders/${orderNumber}`}>View Order Details</Button>
      </Section>
    </Section>
    <Footer />
  </BaseLayout>
);

export default OrderConfirmation;
