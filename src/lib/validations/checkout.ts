import { z } from 'zod';

export const checkoutSchema = z.object({
  // Step 1: Customer Details
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits').regex(/^[0-9+ ]+$/, 'Invalid phone number format'),

  // Step 2: Shipping Address
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  address: z.string().min(5, 'Street address must be at least 5 characters'),
  city: z.string().min(2, 'City is required'),
  postalCode: z.string().min(5, 'Postal code must be at least 5 digits').max(10),

  // Step 3: Payment Method
  paymentMethod: z.enum(['card', 'upi', 'netbanking', 'cod']),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;
