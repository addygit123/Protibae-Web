import { CheckoutFormData } from '@/lib/validations/checkout';

export interface PaymentInitializationData {
  orderId: string;
  amount: number;
  currency: string;
}

export interface PaymentProvider {
  /**
   * Initializes a payment session on the server and returns the necessary data to render the client UI
   */
  initializePayment(amount: number, currency: string): Promise<PaymentInitializationData>;
  
  /**
   * Triggers the client-side payment flow (e.g., opening Razorpay modal)
   */
  processPayment(
    initializationData: PaymentInitializationData,
    formData: CheckoutFormData
  ): Promise<{ success: boolean; paymentId?: string; error?: string }>;
}

/**
 * A mock payment adapter to use until Razorpay is fully integrated.
 * This simulates a network request and success response.
 */
export class MockPaymentAdapter implements PaymentProvider {
  async initializePayment(amount: number, currency: string): Promise<PaymentInitializationData> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          orderId: `mock_order_${Date.now()}`,
          amount,
          currency,
        });
      }, 500);
    });
  }

  async processPayment(
    initializationData: PaymentInitializationData,
    formData: CheckoutFormData
  ): Promise<{ success: boolean; paymentId?: string; error?: string }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate an error if they pick netbanking for testing validation
        if (formData.paymentMethod === 'netbanking') {
          resolve({ success: false, error: 'Net banking is currently unavailable in this mock environment.' });
        } else {
          resolve({ success: true, paymentId: `mock_pay_${Date.now()}` });
        }
      }, 1500);
    });
  }
}

// Export a singleton instance of the active provider
export const paymentProvider: PaymentProvider = new MockPaymentAdapter();
