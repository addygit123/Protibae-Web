import type { NormalizedShipmentStatus } from './types';

export function normalizeShiprocketStatus(status: string): NormalizedShipmentStatus {
  const s = status.trim().toUpperCase();
  switch (s) {
    case 'NEW':
    case 'ORDER CREATED':
      return 'ORDER_CREATED';
    case 'AWB ASSIGNED':
      return 'AWB_ASSIGNED';
    case 'PICKUP SCHEDULED':
    case 'PICKUP GENERATED':
      return 'PICKUP_SCHEDULED';
    case 'OUT FOR PICKUP':
      return 'OUT_FOR_PICKUP';
    case 'PICKED UP':
      return 'PICKED_UP';
    case 'IN TRANSIT':
    case 'SHIPPED':
      return 'IN_TRANSIT';
    case 'OUT FOR DELIVERY':
      return 'OUT_FOR_DELIVERY';
    case 'DELIVERED':
      return 'DELIVERED';
    case 'RTO INITIATED':
    case 'RTO DELIVERED':
      return 'RTO';
    case 'CANCELED':
    case 'CANCELLED':
      return 'CANCELLED';
    default:
      return 'PENDING';
  }
}

export function normalizeNimbusPostStatus(status: string): NormalizedShipmentStatus {
  const s = status.trim().toUpperCase();
  switch (s) {
    case 'NEW':
      return 'ORDER_CREATED';
    case 'AWB_ASSIGNED':
      return 'AWB_ASSIGNED';
    case 'MANIFESTED':
      return 'PICKUP_SCHEDULED';
    case 'IN_TRANSIT':
      return 'IN_TRANSIT';
    case 'OUT_FOR_DELIVERY':
      return 'OUT_FOR_DELIVERY';
    case 'DELIVERED':
      return 'DELIVERED';
    case 'RTO':
      return 'RTO';
    case 'CANCELLED':
      return 'CANCELLED';
    default:
      return 'PENDING';
  }
}

export function normalizePorterStatus(status: string): NormalizedShipmentStatus {
  const s = status.trim().toUpperCase();
  switch (s) {
    case 'ACCEPTED':
      return 'ORDER_CREATED';
    case 'DRIVER_ASSIGNED':
    case 'DRIVER_ARRIVED':
      return 'OUT_FOR_PICKUP';
    case 'ON_THE_WAY':
      return 'IN_TRANSIT';
    case 'ENDED':
    case 'DELIVERED':
      return 'DELIVERED';
    case 'CANCELLED':
      return 'CANCELLED';
    default:
      return 'PENDING';
  }
}

export function normalizeIndiaPostStatus(status: string): NormalizedShipmentStatus {
  const s = status.trim().toUpperCase();
  switch (s) {
    case 'BOOKED':
      return 'AWB_ASSIGNED';
    case 'DISPATCHED':
      return 'IN_TRANSIT';
    case 'OUT_FOR_DELIVERY':
      return 'OUT_FOR_DELIVERY';
    case 'DELIVERED':
      return 'DELIVERED';
    default:
      return 'PENDING';
  }
}

export function isFastDelivery(estDeliveryDate: Date | string | number | null | undefined): boolean {
  if (estDeliveryDate === null || estDeliveryDate === undefined) return false;
  
  if (typeof estDeliveryDate === 'number') {
    return estDeliveryDate <= 1;
  }
  
  const d = new Date(estDeliveryDate);
  if (isNaN(d.getTime())) return false;
  const diffTime = d.getTime() - new Date().getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 1;
}

export function etaLabel(estDeliveryDate: Date | string | number | null | undefined): string {
  if (estDeliveryDate === null || estDeliveryDate === undefined) return 'Standard Delivery';
  
  let diffDays = 0;
  
  if (typeof estDeliveryDate === 'number') {
    diffDays = estDeliveryDate;
  } else {
    const d = new Date(estDeliveryDate);
    if (isNaN(d.getTime())) return 'Standard Delivery';
    const diffTime = d.getTime() - new Date().getTime();
    diffDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  }
  
  if (diffDays === 0) return 'Same Day Delivery';
  if (diffDays === 1) return 'Next Day Delivery';
  return `${diffDays}-${diffDays + 2} Business Days`;
}
