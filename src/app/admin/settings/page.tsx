export default function AdminSettingsPage() {
  return (
    <>
      <div className="mb-12">
        <h3 className="font-display-hero text-headline-lg text-[#e3e2e7] mb-2">SYSTEM SETTINGS</h3>
        <p className="font-body text-[18px] text-[#e1bec3] max-w-2xl">Configure your brand identity, payment gateways, and operational parameters for the PRO-FUEL digital ecosystem.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Vertical Settings Tabs */}
        <nav className="w-full lg:w-64 flex flex-col gap-2 shrink-0">
          <button className="flex items-center gap-3 px-5 py-4 bg-[#c41e5c] text-white font-label-bold text-[14px] rounded-lg drop-shadow-[0_0_15px_rgba(196,30,92,0.3)] transition-all text-left">
            <span className="material-symbols-outlined">branding_watermark</span>
            Brand
          </button>
          <button className="flex items-center gap-3 px-5 py-4 text-[#e1bec3] hover:bg-[#1a1b1f] font-label-bold text-[14px] rounded-lg transition-all text-left">
            <span className="material-symbols-outlined">mail</span>
            Email
          </button>
          <button className="flex items-center gap-3 px-5 py-4 text-[#e1bec3] hover:bg-[#1a1b1f] font-label-bold text-[14px] rounded-lg transition-all text-left">
            <span className="material-symbols-outlined">payments</span>
            Payment
          </button>
          <button className="flex items-center gap-3 px-5 py-4 text-[#e1bec3] hover:bg-[#1a1b1f] font-label-bold text-[14px] rounded-lg transition-all text-left">
            <span className="material-symbols-outlined">local_shipping</span>
            Shipping
          </button>
          <button className="flex items-center gap-3 px-5 py-4 text-[#e1bec3] hover:bg-[#1a1b1f] font-label-bold text-[14px] rounded-lg transition-all text-left">
            <span className="material-symbols-outlined">manage_accounts</span>
            Admin Account
          </button>
        </nav>

        {/* Settings Canvas: Brand Settings (Active) */}
        <div className="flex-1 bg-[#1a1b1f]/40 backdrop-blur-md border border-[#343539] rounded-xl p-8 space-y-10">
          {/* Section: Logo */}
          <section>
            <h4 className="font-label-bold text-[14px] text-[#ffb1c1] uppercase tracking-widest mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-[#ffb1c1]"></span>
              Visual Identity
            </h4>
            <div className="flex flex-col md:flex-row items-start gap-8">
              <div className="w-40 h-40 bg-[#0d0e12] border border-dashed border-[#594045] flex flex-col items-center justify-center gap-2 rounded-lg group cursor-pointer hover:border-[#ffb1c1] transition-colors">
                <span className="material-symbols-outlined text-[#e1bec3] group-hover:text-[#ffb1c1] transition-colors">upload_file</span>
                <span className="font-label-bold text-[12px] text-[#e1bec3] group-hover:text-[#ffb1c1]">Upload Logo</span>
              </div>
              <div className="flex-1 pt-2">
                <p className="font-label-bold text-[14px] text-[#e3e2e7] mb-1">Store Logo</p>
                <p className="font-body text-[12px] text-[#e1bec3] mb-4">Recommended: 512x512px SVG or PNG. Maximum file size 2MB.</p>
                <div className="flex gap-4">
                  <button className="px-4 py-2 border border-[#594045] text-[#e3e2e7] font-label-bold text-[12px] hover:bg-[#343539] transition-all rounded">Replace</button>
                  <button className="px-4 py-2 text-red-400 font-label-bold text-[12px] hover:bg-red-400/10 transition-all rounded">Remove</button>
                </div>
              </div>
            </div>
          </section>

          <hr className="border-[#343539]" />

          {/* Section: Brand Color */}
          <section>
            <h4 className="font-label-bold text-[14px] text-[#ffb1c1] uppercase tracking-widest mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-[#ffb1c1]"></span>
              Brand Color
            </h4>
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-[#c41e5c] drop-shadow-[0_0_15px_rgba(196,30,92,0.3)] border-4 border-[#292a2e] cursor-pointer"></div>
              <div className="flex-1">
                <div className="relative w-full max-w-sm">
                  <input className="w-full bg-[#1a1b1f] border border-[#594045] p-3 font-label-bold text-[14px] uppercase text-[#ffb1c1] focus:ring-1 focus:ring-[#ffb1c1] focus:border-[#ffb1c1] rounded" type="text" defaultValue="#C41E5C" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#e1bec3] cursor-pointer">colorize</span>
                </div>
                <p className="font-body text-[12px] text-[#e1bec3] mt-2">Primary accent color used for buttons, links, and high-impact UI elements.</p>
              </div>
            </div>
          </section>

          <hr className="border-[#343539]" />

          {/* Section: Metadata */}
          <section>
            <h4 className="font-label-bold text-[14px] text-[#ffb1c1] uppercase tracking-widest mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-[#ffb1c1]"></span>
              Store Metadata
            </h4>
            <div className="space-y-6">
              <div>
                <label className="block font-label-bold text-[14px] text-[#e3e2e7] mb-2">Store Name</label>
                <input className="w-full bg-[#1a1b1f] border border-[#594045] p-3 font-body text-[16px] text-[#e3e2e7] focus:ring-1 focus:ring-[#ffb1c1] focus:border-[#ffb1c1] rounded" type="text" defaultValue="PRO-FUEL PERFORMANCE" />
              </div>
              <div>
                <label className="block font-label-bold text-[14px] text-[#e3e2e7] mb-2">SEO Description</label>
                <textarea className="w-full bg-[#1a1b1f] border border-[#594045] p-3 font-body text-[16px] text-[#e3e2e7] focus:ring-1 focus:ring-[#ffb1c1] focus:border-[#ffb1c1] rounded" rows={3} defaultValue="The world's most advanced high-protein fuel for elite athletes and urban explorers. No fillers, no excuses. Just pure performance."></textarea>
              </div>
            </div>
          </section>

          {/* Footer Actions */}
          <div className="pt-10 flex justify-end gap-4">
            <button className="px-8 py-3 border border-[#594045] text-[#e3e2e7] font-label-bold text-[14px] uppercase tracking-widest hover:bg-[#343539] transition-all rounded">Discard</button>
            <button className="px-8 py-3 bg-[#c41e5c] text-white font-label-bold text-[14px] uppercase tracking-widest drop-shadow-[0_0_15px_rgba(196,30,92,0.3)] hover:brightness-110 transition-all rounded">Save Changes</button>
          </div>
        </div>
      </div>

      {/* System Footer */}
      <footer className="mt-16 pt-8 border-t border-[#343539] flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
          <span className="font-body text-[12px] text-[#e1bec3]">© 2024 PRO-FUEL DIGITAL OPS</span>
          <div className="flex gap-4">
            <a className="font-body text-[12px] text-[#e1bec3] hover:text-[#ffb1c1] transition-colors" href="#">Privacy Policy</a>
            <a className="font-body text-[12px] text-[#e1bec3] hover:text-[#ffb1c1] transition-colors" href="#">Terms of Service</a>
          </div>
        </div>
        <form action="/api/auth/signout" method="POST">
          <button type="submit" className="flex items-center gap-2 px-6 py-2.5 bg-red-500/10 border border-red-500/30 text-red-400 font-label-bold text-[14px] uppercase tracking-widest hover:bg-red-500/20 transition-all rounded">
            <span className="material-symbols-outlined text-[20px]">logout</span>
            Logout
          </button>
        </form>
      </footer>
    </>
  );
}
