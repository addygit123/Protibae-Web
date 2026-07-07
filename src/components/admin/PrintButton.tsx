'use client';

import Link from 'next/link';

export function PrintButton({ orderId }: { orderId: string }) {
  return (
    <Link 
      href={`/admin/orders/${orderId}/invoice`}
      target="_blank"
      className="flex items-center justify-center gap-2 px-6 py-4 border-2 border-[#e3e2e7] text-[#e3e2e7] font-label-bold text-[14px] uppercase tracking-widest hover:bg-white hover:text-black transition-all rounded w-full"
    >
      <span className="material-symbols-outlined" aria-hidden="true">receipt</span> Print Invoice
    </Link>
  );
}
