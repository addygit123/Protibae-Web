'use client';

import { useState } from 'react';
import { Order, OrderItem, Product, OrderStatus } from '@prisma/client';
import { OrderCard } from './OrderCard';
import { Search, ChevronDown, ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';
import Link from 'next/link';

type OrderWithItems = Order & {
  items: (OrderItem & {
    product: Product;
  })[];
};

interface OrdersClientProps {
  initialOrders: OrderWithItems[];
}

export function OrdersClient({ initialOrders }: OrdersClientProps) {
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'DELIVERED' | 'PROCESSING' | 'IN_TRANSIT' | 'CANCELLED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Note: For simplicity, ACTIVE maps to PENDING/PROCESSING/PAID in this context.
  const filteredOrders = initialOrders.filter((order) => {
    // Basic search by order number
    if (searchQuery && !order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    if (filter === 'ALL') return true;
    if (filter === 'ACTIVE') return ['PENDING', 'PROCESSING', 'PAID'].includes(order.status);
    if (filter === 'CANCELLED') return order.status === 'CANCELLED';
    if (filter === 'DELIVERED') return order.status === 'DELIVERED';
    if (filter === 'PROCESSING') return order.status === 'PROCESSING';
    if (filter === 'IN_TRANSIT') return order.status === 'SHIPPED'; // Assuming SHIPPED maps to IN TRANSIT
    
    return true;
  });

  return (
    <div className="w-full">
      {/* Header & Desktop Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-12">
        <div>
          <h1 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg uppercase tracking-tight text-on-background">
            Order History
          </h1>
          {/* Desktop Subtitle */}
          <p className="hidden md:block text-on-surface-variant font-body-md mt-2">
            Manage your fuel and track your performance gains.
          </p>
        </div>

        {/* Desktop Controls */}
        <div className="hidden md:flex flex-row gap-4 items-center w-auto">
          {/* Search Bar */}
          <div className="relative w-64">
            <input 
              type="text"
              placeholder="SEARCH ORDERS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-4 py-2 text-on-surface focus:outline-none focus:border-primary transition-all font-label-bold text-label-bold uppercase"
            />
            <Search className="absolute right-3 top-2.5 text-on-surface-variant w-4 h-4" />
          </div>

          {/* Filter Dropdown */}
          <div className="relative w-48">
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-4 py-2 text-on-surface appearance-none focus:outline-none focus:border-primary transition-all font-label-bold text-label-bold uppercase"
            >
              <option value="ALL">ALL ORDERS</option>
              <option value="DELIVERED">DELIVERED</option>
              <option value="IN_TRANSIT">IN TRANSIT</option>
              <option value="PROCESSING">PROCESSING</option>
            </select>
            <ChevronDown className="absolute right-3 top-2.5 text-on-surface-variant w-4 h-4 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Mobile Filters (Chips) */}
      <div className="flex md:hidden gap-3 overflow-x-auto no-scrollbar pb-2 mb-6">
        <button 
          onClick={() => setFilter('ALL')}
          className={`px-6 py-2 rounded-full font-label-bold text-label-bold active:scale-95 transition-all whitespace-nowrap ${
            filter === 'ALL' 
              ? 'bg-primary-container text-on-primary-container' 
              : 'border border-outline-variant/50 text-on-background hover:bg-surface-container-high'
          }`}
        >
          All
        </button>
        <button 
          onClick={() => setFilter('ACTIVE')}
          className={`px-6 py-2 rounded-full font-label-bold text-label-bold active:scale-95 transition-all whitespace-nowrap ${
            filter === 'ACTIVE' 
              ? 'bg-primary-container text-on-primary-container' 
              : 'border border-outline-variant/50 text-on-background hover:bg-surface-container-high'
          }`}
        >
          Active
        </button>
        <button 
          onClick={() => setFilter('CANCELLED')}
          className={`px-6 py-2 rounded-full font-label-bold text-label-bold active:scale-95 transition-all whitespace-nowrap ${
            filter === 'CANCELLED' 
              ? 'bg-primary-container text-on-primary-container' 
              : 'border border-outline-variant/50 text-on-background hover:bg-surface-container-high'
          }`}
        >
          Cancelled
        </button>
      </div>

      {/* Orders List */}
      {filteredOrders.length > 0 ? (
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-32 h-32 mb-8 bg-surface-container-low rounded-full flex items-center justify-center border border-outline-variant/20 relative overflow-hidden">
            <ShoppingCart className="w-16 h-16 text-primary opacity-40" />
          </div>
          <h3 className="text-headline-md font-headline-md mb-2">No orders found.</h3>
          <p className="text-body-lg font-body-lg text-on-secondary-container mb-8 max-w-xs">
            {initialOrders.length === 0 
              ? "Ready to fuel up? Your next performance boost is just a click away." 
              : "Try adjusting your filters or search."}
          </p>
          {initialOrders.length === 0 && (
            <Link 
              href="/shop"
              className="px-12 py-4 rounded-lg bg-primary-container text-on-primary-container font-label-bold text-label-bold uppercase tracking-widest active:scale-95 transition-all shadow-lg hover:shadow-primary/20 block w-fit mx-auto"
            >
              Shop Now
            </Link>
          )}
        </div>
      )}

      {/* Desktop Pagination */}
      {filteredOrders.length > 0 && (
        <div className="mt-12 hidden md:flex justify-center items-center space-x-4">
          <button className="w-10 h-10 rounded-full border border-outline-variant/30 flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex space-x-2">
            <button className="w-10 h-10 rounded-full bg-primary text-on-primary font-label-bold flex items-center justify-center">1</button>
          </div>
          <button className="w-10 h-10 rounded-full border border-outline-variant/30 flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
