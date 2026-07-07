'use client';

import { useState } from 'react';
import { Search, Bell, HelpCircle } from 'lucide-react';
import Image from 'next/image';
import { signOut, useSession } from 'next-auth/react';

export default function Topbar() {
  const { data: session } = useSession();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  return (
    <header className="sticky top-0 z-40 flex justify-between items-center px-8 py-4 bg-[#121317]/80 backdrop-blur-xl border-b border-[#343539] shadow-sm h-20 shrink-0">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#e1bec3] w-5 h-5" />
          <input 
            className="w-full bg-[#1a1b1f] border-none focus:ring-1 focus:ring-[#c41e5c] text-white py-2 pl-10 pr-4 rounded-lg placeholder:text-[#e1bec3]/40" 
            placeholder="Search data..." 
            type="text" 
          />
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="text-[#e1bec3] hover:text-[#c41e5c] transition-colors flex items-center relative z-50"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#c41e5c] rounded-full"></span>
          </button>
          
          {showNotifications && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
              <div className="absolute right-0 mt-4 w-72 bg-[#1a1b1f] border border-[#343539] shadow-2xl rounded-md p-4 z-50">
                <h4 className="font-label-bold text-[#e3e2e7] mb-3 border-b border-[#343539] pb-2 uppercase tracking-widest text-[12px]">Notifications</h4>
                <div className="py-6 text-center">
                  <Bell className="w-8 h-8 mx-auto text-[#343539] mb-2" />
                  <p className="text-sm text-[#e1bec3] opacity-70">No new notifications</p>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="relative">
          <button 
            onClick={() => setShowHelp(!showHelp)}
            className="text-[#e1bec3] hover:text-[#c41e5c] transition-colors relative z-50"
          >
            <HelpCircle className="w-5 h-5" />
          </button>

          {showHelp && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowHelp(false)} />
              <div className="absolute right-0 mt-4 w-48 bg-[#1a1b1f] border border-[#343539] shadow-2xl rounded-md p-2 z-50">
                <ul className="space-y-1">
                  <li><button className="w-full text-left px-4 py-2 text-sm text-[#e1bec3] hover:bg-[#c41e5c]/10 hover:text-[#c41e5c] rounded transition-colors">Documentation</button></li>
                  <li><button className="w-full text-left px-4 py-2 text-sm text-[#e1bec3] hover:bg-[#c41e5c]/10 hover:text-[#c41e5c] rounded transition-colors">Contact Support</button></li>
                  <li><button className="w-full text-left px-4 py-2 text-sm text-[#e1bec3] hover:bg-[#c41e5c]/10 hover:text-[#c41e5c] rounded transition-colors">Keyboard Shortcuts</button></li>
                </ul>
              </div>
            </>
          )}
        </div>
        <div className="flex items-center gap-4 border-l border-[#343539] pl-6">
          <div className="flex flex-col items-end">
            <span className="text-sm font-bold text-white">{session?.user?.name || 'Admin'}</span>
            <button 
              onClick={() => signOut()}
              className="text-xs text-[#e1bec3] hover:text-[#c41e5c]"
            >
              Log out
            </button>
          </div>
          <div className="h-10 w-10 rounded-full overflow-hidden border border-[#594045] bg-[#1a1b1f] flex items-center justify-center text-[#e1bec3]">
            {session?.user?.image ? (
              <Image 
                src={session.user.image} 
                alt="Profile" 
                width={40} 
                height={40}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="font-bold text-lg">
                {(session?.user?.name || 'A').charAt(0).toUpperCase()}
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
