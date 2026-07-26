'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Order, OrderItem, Product, OrderStatus } from '@prisma/client';
import { format } from 'date-fns';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

type OrderWithItems = Order & {
  items: (OrderItem & {
    product: Product;
  })[];
};

interface OrderCardProps {
  order: OrderWithItems;
}

export function OrderCard({ order }: OrderCardProps) {
  const [reordered, setReordered] = useState(false);

  const handleReorder = () => {
    setReordered(true);
    // Real implementation would add items to cart here
    setTimeout(() => {
      setReordered(false);
    }, 2000);
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'DELIVERED':
        return (
          <span className="px-3 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-green-900/30 text-green-400 border border-green-400/20 md:bg-primary/20 md:text-primary md:border-primary/30">
            Delivered
          </span>
        );
      case 'PROCESSING':
        return (
          <span className="px-3 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-surface-container-highest text-on-surface-variant border border-outline-variant/20 md:text-secondary md:border-outline-variant/30">
            Processing
          </span>
        );
      default:
        return (
          <span className="px-3 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-primary-container/20 text-primary border border-primary/20 md:bg-surface-container-highest md:text-secondary md:border-outline-variant/30">
            {status.replace('_', ' ')}
          </span>
        );
    }
  };

  const visibleItems = order.items.slice(0, 3);
  const remainingItems = order.items.length - 3;

  return (
    <div className="order-card-gradient md:bg-surface-container-low md:bg-none border border-outline-variant/30 md:border-outline-variant/20 rounded-xl p-5 md:p-6 transition-all hover:border-primary/40 group overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 mb-6 md:mb-0">
        
        {/* Mobile Header: Order Number, Badge, Date & Mobile Price */}
        <div className="flex flex-col md:flex-col gap-1 w-full md:w-auto">
          <div className="flex items-center justify-between md:justify-start gap-3 w-full">
            <div className="flex items-center gap-3">
              <span className="text-label-bold md:text-headline-md font-label-bold md:font-headline-md text-on-background opacity-60 md:opacity-100 md:text-on-surface">
                #{order.orderNumber}
              </span>
              {getStatusBadge(order.status)}
            </div>
            {/* Mobile Only Price */}
            <p className="text-headline-md font-headline-md text-primary md:hidden">
              ${order.total.toFixed(2)}
            </p>
          </div>
          <p className="text-body-md md:text-label-sm font-body-md md:font-label-sm text-on-secondary-container md:text-on-surface-variant uppercase tracking-wider">
            {/* Desktop uses 'Ordered on' prefix, Mobile doesn't */}
            <span className="hidden md:inline">Ordered on </span>
            {format(new Date(order.createdAt), 'MMM dd, yyyy')} 
            <span className="hidden md:inline"> • ${order.total.toFixed(2)} Total</span>
            <span className="md:hidden"> • {format(new Date(order.createdAt), 'hh:mm a')}</span>
          </p>
        </div>

        {/* Desktop Only Price? Actually Desktop design puts price in the text. Let's keep it as is. */}

        {/* Thumbnails */}
        <div className="flex gap-4 md:gap-0 overflow-x-auto md:overflow-visible no-scrollbar mb-8 md:mb-0 md:-space-x-4">
          {visibleItems.map((item, index) => (
            <div 
              key={item.id} 
              className="flex-shrink-0 w-20 h-20 md:w-16 md:h-16 rounded-lg bg-surface-container-high border border-outline-variant/20 md:border-2 md:border-surface-container-low overflow-hidden relative"
              style={{ zIndex: 10 - index }}
            >
              {item.product.images?.[0] ? (
                <Image
                  src={item.product.images[0]}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-surface-container" />
              )}
            </div>
          ))}
          {remainingItems > 0 && (
            <div className="flex-shrink-0 w-20 h-20 md:w-16 md:h-16 rounded-lg bg-surface-container-lowest md:bg-surface-container-highest border border-outline-variant/10 md:border-2 md:border-surface-container-low flex items-center justify-center relative" style={{ zIndex: 0 }}>
              <span className="text-label-bold font-label-bold text-primary md:text-on-surface-variant">+{remainingItems}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full md:w-auto border-t border-outline-variant/20 md:border-none pt-6 md:pt-0">
          <Link 
            href={`/account/orders/${order.id}`}
            className="flex-1 md:flex-none px-8 md:px-6 py-3 rounded-lg border border-white md:border-2 md:border-on-surface-variant/30 text-on-background md:text-on-surface font-label-bold text-label-bold uppercase tracking-wider hover:bg-white md:hover:bg-on-surface-variant/10 hover:text-background md:hover:text-on-surface transition-colors active:scale-95 md:active:scale-100 text-center flex items-center justify-center"
          >
            View Details
          </Link>
          
          <button 
            onClick={handleReorder}
            className={`flex-1 md:flex-none px-8 md:px-6 py-3 rounded-lg font-label-bold text-label-bold uppercase tracking-wider active:scale-95 transition-all flex items-center justify-center text-center ${
              reordered 
                ? 'bg-green-600 text-white' 
                : 'bg-primary-container md:bg-primary text-on-primary-container md:text-on-primary drop-shadow-[0_0_15px_rgba(196,30,92,0.2)] md:glow-primary hover:drop-shadow-[0_0_20px_rgba(196,30,92,0.4)] md:hover:scale-105 md:active:scale-95'
            }`}
          >
            {reordered ? (
              <>
                <CheckCircle className="w-5 h-5 mr-2 animate-bounce" /> ADDED
              </>
            ) : (
              'Reorder'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
