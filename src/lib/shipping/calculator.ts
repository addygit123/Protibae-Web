interface CalculateShippingInput {
  subtotal: number;
  items: Array<{ packSize: '1' | '6'; quantity?: number }>;
  providerRate?: number;
}

export function calculateShippingCost(input: CalculateShippingInput) {
  // Free shipping rule: Only when the cart contains a Pack of 6
  const hasPackOf6 = input.items.some(item => item.packSize === '6');

  if (hasPackOf6) {
    return {
      amount: 0,
      isFree: true,
      message: 'Free delivery (Pack of 6 included)'
    };
  }

  // Otherwise, use real provider rate if available, or default to an average estimate (₹55)
  const amount = input.providerRate !== undefined && input.providerRate !== null
    ? input.providerRate
    : 55; // average estimated shipping cost for single bars

  return {
    amount,
    isFree: false,
    message: '₹' + amount + ' shipping applied'
  };
}
