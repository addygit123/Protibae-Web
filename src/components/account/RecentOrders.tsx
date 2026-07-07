'use client';

import { Package, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { OrderStatus, Product } from '@prisma/client';

type Order = {
  id: string;
  orderNumber: string;
  createdAt: Date;
  total: number;
  status: OrderStatus;
  items: {
    product: Product;
    quantity: number;
  }[];
};

interface RecentOrdersProps {
  orders: Order[];
}

export function RecentOrders({ orders }: RecentOrdersProps) {
  return (
    <div className="bg-surface-container-low border-outline-variant/10 rounded-xl border p-6">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-display-hero text-headline-md uppercase">
          Recent Orders
        </h3>
      </div>

      <div className="space-y-4">
        {orders.length === 0 ? (
          <p className="text-on-surface-variant text-sm">No orders yet.</p>
        ) : (
          orders.slice(0, 3).map((order) => (
            <Link
              key={order.id}
              href={`/account/orders/${order.id}`}
              className="bg-surface-container group hover:bg-surface-container-high flex cursor-pointer items-center justify-between rounded-lg p-4 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="bg-surface-container-highest flex h-12 w-12 items-center justify-center rounded">
                  <Package className="text-primary h-6 w-6" />
                </div>

                <div>
                  <p className="text-sm font-bold">{order.orderNumber}</p>

                  <p className="text-on-surface-variant text-xs">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                    {' • '}₹{order.total}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`rounded px-2 py-1 text-[10px] font-bold tracking-wider uppercase ${
                    order.status === 'DELIVERED'
                      ? 'bg-primary/10 text-primary'
                      : order.status === 'PENDING'
                        ? 'bg-secondary-container text-on-secondary-container'
                        : 'bg-surface-variant text-on-surface'
                  }`}
                >
                  {order.status}
                </span>

                <ChevronRight className="text-on-surface-variant h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
