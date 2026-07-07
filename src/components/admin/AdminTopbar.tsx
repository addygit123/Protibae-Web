'use client';

import Image from 'next/image';

export function AdminTopbar() {
  return (
    <header className="sticky top-0 z-40 flex justify-between items-center px-6 py-4 bg-[#121317]/80 backdrop-blur-xl border-b border-[#343539] shadow-sm ml-64 w-[calc(100%-16rem)]">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-full max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#e1bec3] text-[20px]">
            search
          </span>
          <input 
            className="w-full bg-[#1a1b1f] border-none focus:ring-1 focus:ring-[#ffb1c1] text-[#e3e2e7] py-2 pl-10 pr-4 rounded-lg placeholder:text-[#e1bec3]/40 font-body text-[16px]" 
            placeholder="Search data..." 
            type="text"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <button className="text-[#e1bec3] hover:text-[#ffb1c1] transition-colors flex items-center relative">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#ffb1c1] rounded-full"></span>
        </button>
        <button className="text-[#e1bec3] hover:text-[#ffb1c1] transition-colors">
          <span className="material-symbols-outlined">help</span>
        </button>
        <div className="h-8 w-8 rounded-full overflow-hidden border border-[#594045]">
          <Image 
            width={32}
            height={32}
            className="w-full h-full object-cover" 
            alt="Admin Profile" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKUvgXbdCT-Ed5g8p_L6TAB1ylAI735bovQFt8Wppng9tf341l4NcoY0DRLnqt7h0Y91y3ix7805QsF3kB4ONTxXyhr3xv0svqaYuIyE23UaHsokhd9Nxhfzs5x3wGwZo3sk4p2H5u9Hbf6ZgKDAWBUIKW4mlhUqBwvOLArf19SipHh8Y9G7tzc0VWsnLsh-KBQIfXsi7xhmx4b_puoSYKzUvec8NnsuVxUlLORtu8hA1MK6TZInDrjrkJwY-3mqYFLH5zQCfcuKs"
          />
        </div>
      </div>
    </header>
  );
}
