'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronDown, Lock, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  checkoutSchema,
  type CheckoutFormData,
} from '@/lib/validations/checkout';
import { paymentProvider } from '@/lib/payments/payment-adapter';
import { useCartStore } from '@/lib/store/cart';
import { useRouter } from 'next/navigation';

export function CheckoutForm() {
  const router = useRouter();
  const { getCartTotal, clearCart } = useCartStore();
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    mode: 'onTouched',
    defaultValues: {
      paymentMethod: 'upi',
    },
  });

  const handleNextStep = async (step: 1 | 2 | 3) => {
    let fieldsToValidate: (keyof CheckoutFormData)[] = [];
    if (step === 1) fieldsToValidate = ['email', 'phone'];
    if (step === 2)
      fieldsToValidate = [
        'firstName',
        'lastName',
        'address',
        'city',
        'postalCode',
      ];

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setActiveStep((step + 1) as 1 | 2 | 3);
      // scroll to top of the next step could go here
    }
  };

  const onSubmit = async (data: CheckoutFormData) => {
    setIsProcessing(true);
    setPaymentError(null);
    try {
      const items = useCartStore.getState().items.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
        packSize: i.packSize,
      }));

      // 1. Initialize payment session on server (mock)
      const total = getCartTotal();
      const shipping = total > 499 ? 0 : 250;
      const finalAmount = total + shipping;
      const initData = await paymentProvider.initializePayment(
        finalAmount,
        'INR'
      );

      // 2. Process payment on client (mock)
      const result = await paymentProvider.processPayment(initData, data);

      if (result.success) {
        // 3. Create the real order in the database
        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            items,
            shippingDetails: data,
          }),
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || 'Failed to create order');
        }

        const orderData = await res.json();

        clearCart();
        // Redirect to a success page with the newly created Order ID
        router.push(`/checkout/success?orderId=${orderData.orderId}`);
      } else {
        setPaymentError(result.error || 'Payment failed. Please try again.');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setPaymentError(err.message);
      } else {
        setPaymentError('An unexpected error occurred.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const inputClass = (error?: unknown) =>
    cn(
      'bg-[#1a1b1f] border p-4 w-full focus:outline-none transition-colors rounded',
      error
        ? 'border-[#ffb4ab] focus:border-[#ffb4ab]'
        : 'border-[#594045]/30 focus:border-[#c41e5c] text-[#e3e2e7]'
    );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Step 1: Customer Details */}
      <div
        className={cn(
          'overflow-hidden rounded-lg border bg-[#0d0e12] transition-all duration-300',
          activeStep === 1 ? 'border-[#c41e5c]' : 'border-[#594045]/20'
        )}
      >
        <button
          type="button"
          onClick={() => setActiveStep(1)}
          className={cn(
            'flex w-full items-center justify-between bg-[#1a1b1f]/50 p-6 transition-opacity',
            activeStep !== 1 && 'opacity-50 hover:opacity-100'
          )}
        >
          <div className="flex items-center gap-4">
            <span
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-bold',
                activeStep === 1
                  ? 'border-[#c41e5c] text-[#c41e5c]'
                  : 'border-[#a8898e] text-[#a8898e]'
              )}
            >
              1
            </span>
            <span className="font-display text-headline-md tracking-wider text-[#e3e2e7] uppercase">
              Customer Details
            </span>
          </div>
          {activeStep === 1 ? (
            <ChevronDown className="text-[#c41e5c]" />
          ) : (
            <Lock size={20} className="text-[#a8898e]" />
          )}
        </button>

        <div
          className={cn(
            'overflow-hidden transition-all duration-300',
            activeStep === 1
              ? 'max-h-[1000px] opacity-100'
              : 'max-h-0 opacity-0'
          )}
        >
          <div className="space-y-6 p-8">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <input
                  {...register('email')}
                  type="email"
                  placeholder="Email Address"
                  className={inputClass(errors.email)}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-[#ffb4ab]">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div>
                <input
                  {...register('phone')}
                  type="tel"
                  placeholder="Phone Number"
                  className={inputClass(errors.phone)}
                />
                {errors.phone && (
                  <p className="mt-1 text-xs text-[#ffb4ab]">
                    {errors.phone.message}
                  </p>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleNextStep(1)}
              className="font-display text-label-bold rounded bg-[#c41e5c] px-8 py-4 tracking-widest text-white shadow-[0_0_15px_rgba(196,30,92,0.3)] transition-all hover:scale-105"
            >
              CONTINUE TO SHIPPING
            </button>
          </div>
        </div>
      </div>

      {/* Step 2: Shipping */}
      <div
        className={cn(
          'overflow-hidden rounded-lg border bg-[#0d0e12] transition-all duration-300',
          activeStep === 2 ? 'border-[#c41e5c]' : 'border-[#594045]/20'
        )}
      >
        <button
          type="button"
          onClick={() => {
            if (activeStep > 1) setActiveStep(2);
          }}
          disabled={activeStep < 2}
          className={cn(
            'flex w-full items-center justify-between bg-[#1a1b1f]/50 p-6 transition-opacity',
            activeStep !== 2 && 'opacity-50 hover:opacity-100',
            activeStep < 2 && 'cursor-not-allowed'
          )}
        >
          <div className="flex items-center gap-4">
            <span
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-bold',
                activeStep === 2
                  ? 'border-[#c41e5c] text-[#c41e5c]'
                  : 'border-[#a8898e] text-[#a8898e]'
              )}
            >
              2
            </span>
            <span className="font-display text-headline-md tracking-wider text-[#e3e2e7] uppercase">
              Shipping Address
            </span>
          </div>
          {activeStep === 2 ? (
            <ChevronDown className="text-[#c41e5c]" />
          ) : (
            <Lock size={20} className="text-[#a8898e]" />
          )}
        </button>

        <div
          className={cn(
            'overflow-hidden transition-all duration-300',
            activeStep === 2
              ? 'max-h-[1000px] opacity-100'
              : 'max-h-0 opacity-0'
          )}
        >
          <div className="space-y-6 p-8">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <input
                  {...register('firstName')}
                  placeholder="First Name"
                  className={inputClass(errors.firstName)}
                />
                {errors.firstName && (
                  <p className="mt-1 text-xs text-[#ffb4ab]">
                    {errors.firstName.message}
                  </p>
                )}
              </div>
              <div>
                <input
                  {...register('lastName')}
                  placeholder="Last Name"
                  className={inputClass(errors.lastName)}
                />
                {errors.lastName && (
                  <p className="mt-1 text-xs text-[#ffb4ab]">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
              <div className="md:col-span-2">
                <input
                  {...register('address')}
                  placeholder="Street Address"
                  className={inputClass(errors.address)}
                />
                {errors.address && (
                  <p className="mt-1 text-xs text-[#ffb4ab]">
                    {errors.address.message}
                  </p>
                )}
              </div>
              <div>
                <input
                  {...register('city')}
                  placeholder="City"
                  className={inputClass(errors.city)}
                />
                {errors.city && (
                  <p className="mt-1 text-xs text-[#ffb4ab]">
                    {errors.city.message}
                  </p>
                )}
              </div>
              <div>
                <input
                  {...register('postalCode')}
                  placeholder="Postal Code"
                  className={inputClass(errors.postalCode)}
                />
                {errors.postalCode && (
                  <p className="mt-1 text-xs text-[#ffb4ab]">
                    {errors.postalCode.message}
                  </p>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleNextStep(2)}
              className="font-display text-label-bold rounded bg-[#c41e5c] px-8 py-4 tracking-widest text-white shadow-[0_0_15px_rgba(196,30,92,0.3)] transition-all hover:scale-105"
            >
              GO TO PAYMENT
            </button>
          </div>
        </div>
      </div>

      {/* Step 3: Payment */}
      <div
        className={cn(
          'overflow-hidden rounded-lg border bg-[#0d0e12] transition-all duration-300',
          activeStep === 3 ? 'border-[#c41e5c]' : 'border-[#594045]/20'
        )}
      >
        <button
          type="button"
          onClick={() => {
            if (activeStep > 2) setActiveStep(3);
          }}
          disabled={activeStep < 3}
          className={cn(
            'flex w-full items-center justify-between bg-[#1a1b1f]/50 p-6 transition-opacity',
            activeStep !== 3 && 'opacity-50 hover:opacity-100',
            activeStep < 3 && 'cursor-not-allowed'
          )}
        >
          <div className="flex items-center gap-4">
            <span
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-bold',
                activeStep === 3
                  ? 'border-[#c41e5c] text-[#c41e5c]'
                  : 'border-[#a8898e] text-[#a8898e]'
              )}
            >
              3
            </span>
            <span className="font-display text-headline-md tracking-wider text-[#e3e2e7] uppercase">
              Payment Method
            </span>
          </div>
          {activeStep === 3 ? (
            <ChevronDown className="text-[#c41e5c]" />
          ) : (
            <Lock size={20} className="text-[#a8898e]" />
          )}
        </button>

        <div
          className={cn(
            'overflow-hidden transition-all duration-300',
            activeStep === 3
              ? 'max-h-[1000px] opacity-100'
              : 'max-h-0 opacity-0'
          )}
        >
          <div className="space-y-8 p-8">
            <div className="space-y-4">
              <label className="flex cursor-pointer items-center gap-4 rounded border border-[#594045]/30 bg-[#1a1b1f] p-4 transition-colors hover:border-[#c41e5c]/50">
                <input
                  {...register('paymentMethod')}
                  type="radio"
                  value="card"
                  className="h-5 w-5 accent-[#c41e5c]"
                />
                <div className="flex flex-col">
                  <span className="font-bold text-[#e3e2e7]">
                    Credit / Debit Cards
                  </span>
                  <span className="text-xs text-[#e1bec3]">
                    Visa, Mastercard, RuPay
                  </span>
                </div>
              </label>

              <label className="flex cursor-pointer items-center gap-4 rounded border border-[#c41e5c] bg-[#1a1b1f] p-4 shadow-[0_0_10px_rgba(196,30,92,0.1)]">
                <input
                  {...register('paymentMethod')}
                  type="radio"
                  value="upi"
                  className="h-5 w-5 accent-[#c41e5c]"
                />
                <div className="flex flex-col">
                  <span className="font-bold text-[#e3e2e7]">
                    UPI / GPay / PhonePe
                  </span>
                  <span className="text-xs text-[#e1bec3]">
                    Instant checkout with any UPI app
                  </span>
                </div>
              </label>

              <label className="flex cursor-pointer items-center gap-4 rounded border border-[#594045]/30 bg-[#1a1b1f] p-4 transition-colors hover:border-[#c41e5c]/50">
                <input
                  {...register('paymentMethod')}
                  type="radio"
                  value="netbanking"
                  className="h-5 w-5 accent-[#c41e5c]"
                />
                <div className="flex flex-col">
                  <span className="font-bold text-[#e3e2e7]">Net Banking</span>
                  <span className="text-xs text-[#e1bec3]">
                    Support for all major banks
                  </span>
                </div>
              </label>
            </div>

            <div className="rounded-lg border-l-4 border-[#c41e5c] bg-[#1e1f23] p-6">
              <p className="font-body text-sm text-[#e1bec3] italic">
                &quot;Fuel your results safely. We use industry-standard
                encryption to protect your data.&quot;
              </p>
            </div>

            {paymentError && (
              <div className="rounded border border-[#93000a] bg-[#93000a]/20 p-4 text-center text-sm text-[#ffb4ab]">
                {paymentError}
              </div>
            )}

            <button
              type="submit"
              disabled={isProcessing}
              className="font-display text-headline-md flex w-full items-center justify-center gap-3 rounded bg-[#c41e5c] py-6 tracking-widest text-white shadow-[0_0_20px_rgba(196,30,92,0.4)] transition-all hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100"
            >
              {isProcessing ? (
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <>
                  <ShieldCheck size={28} />
                  COMPLETE ORDER
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
