'use client';

import { signOut } from 'next-auth/react';

export function AdminLogoutButton() {
  return (
    <button 
      type="button" 
      onClick={() => signOut({ callbackUrl: '/login' })}
      className="flex items-center gap-2 px-6 py-2.5 bg-red-500/10 border border-red-500/30 text-red-400 font-label-bold text-[14px] uppercase tracking-widest hover:bg-red-500/20 transition-all rounded"
    >
      <span className="material-symbols-outlined text-[20px]">logout</span>
      Logout
    </button>
  );
}
