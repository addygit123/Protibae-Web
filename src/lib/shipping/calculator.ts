

interface CalculateShippingInput {
  subtotal: number;
  items: Array<{ packSize: '1' | '6'; quantity?: number }>;
  providerRate?: number;
}

export function calculateShippingCost(input: CalculateShippingInput) {
  // Free shipping rule: subtotal > 499 OR cart contains a pack of 6
  // But per business rules: "Customer pays: ₹0 shipping. The actual courier cost is an internal business expense."
  // So customer shipping is ALWAYS 0.
  const isFree = true; // For the customer, it is always free/0 charge right now.
  
  return {
    amount: 0, // Customer pays 0
    isFree
  };
}


