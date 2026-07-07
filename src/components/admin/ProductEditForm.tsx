'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { updateProduct } from '@/app/admin/products/actions';
import Image from 'next/image';

export function ProductEditForm({ product }: { product: any }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isActive, setIsActive] = useState(product.isActive);
  const [inventory, setInventory] = useState(product.inventory);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.append('isActive', isActive.toString());
    formData.append('inventory', inventory.toString());
    
    startTransition(async () => {
      const result = await updateProduct(product.id, formData);
      if (result.success) {
        router.push('/admin/products');
      } else {
        alert(result.error);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="h-full flex flex-col min-h-screen">
      {/* Action Header */}
      <div className="flex justify-between items-end mb-10">
        <div>
          <nav className="flex items-center gap-2 text-[12px] font-label-bold text-[#e1bec3] opacity-80 mb-2">
            <span className="cursor-pointer hover:text-[#ffb1c1] transition-colors" onClick={() => router.push('/admin/products')}>Products</span>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-[#e3e2e7]">Edit Product</span>
          </nav>
          <h2 className="font-display-hero text-headline-md text-[#e3e2e7] tracking-tight">
            Edit <span className="text-[#ffb1c1]">{product.name}</span>
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => router.push('/admin/products')} className="px-6 py-2 rounded-lg font-label-bold text-[14px] text-[#e3e2e7] hover:bg-[#343539] transition-colors">
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={isPending}
            className="px-8 py-2 rounded-lg bg-[#c41e5c] text-white font-display-hero text-[20px] drop-shadow-[0_0_10px_rgba(196,30,92,0.4)] hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
          >
            {isPending ? 'SAVING...' : 'SAVE CHANGES'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Content & Media */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Product Identity Section */}
          <section className="bg-[#292a2e] p-8 rounded-xl border border-[#594045]">
            <div className="space-y-6">
              <div>
                <label className="block font-label-bold text-[14px] text-[#e1bec3] mb-2 uppercase tracking-widest">Product Title</label>
                <input 
                  name="name"
                  defaultValue={product.name}
                  className="w-full bg-[#0d0e12] border border-[#594045] focus:border-[#ffb1c1] focus:ring-1 focus:ring-[#ffb1c1] rounded-lg p-4 font-display-hero text-[24px] text-[#e3e2e7] transition-all" 
                  type="text" 
                  required
                />
              </div>
              
              <div>
                <label className="block font-label-bold text-[14px] text-[#e1bec3] mb-2 uppercase tracking-widest">Description</label>
                <div className="border border-[#594045] rounded-lg overflow-hidden">
                  <div className="bg-[#343539] p-2 flex items-center gap-4 border-b border-[#594045]">
                    <button type="button" className="p-1 hover:text-[#ffb1c1] text-[#e1bec3]"><span className="material-symbols-outlined text-[20px]">format_bold</span></button>
                    <button type="button" className="p-1 hover:text-[#ffb1c1] text-[#e1bec3]"><span className="material-symbols-outlined text-[20px]">format_italic</span></button>
                    <button type="button" className="p-1 hover:text-[#ffb1c1] text-[#e1bec3]"><span className="material-symbols-outlined text-[20px]">format_list_bulleted</span></button>
                    <div className="h-4 w-[1px] bg-[#594045]"></div>
                    <button type="button" className="p-1 hover:text-[#ffb1c1] text-[#e1bec3]"><span className="material-symbols-outlined text-[20px]">link</span></button>
                  </div>
                  <textarea 
                    name="description"
                    defaultValue={product.description}
                    className="w-full bg-[#0d0e12] border-none p-4 text-[#e3e2e7] focus:ring-0 font-body" 
                    rows={8}
                    required
                  ></textarea>
                </div>
              </div>
            </div>
          </section>

          {/* Media Gallery */}
          <section className="bg-[#292a2e] p-8 rounded-xl border border-[#594045]">
            <div className="flex justify-between items-center mb-6">
              <label className="font-label-bold text-[14px] text-[#e1bec3] uppercase tracking-widest">Product Gallery</label>
              <button type="button" className="text-[#ffb1c1] font-label-bold text-[14px] flex items-center gap-1 hover:underline">
                <span className="material-symbols-outlined text-sm">add</span>
                Upload New
              </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {product.images.map((img: string, idx: number) => (
                <div key={idx} className={`aspect-square relative group cursor-pointer border-2 rounded-lg overflow-hidden ${idx === 0 ? 'border-[#ffb1c1]' : 'border-[#594045]'}`}>
                  <Image src={img} alt="Product Image" fill className={`object-cover ${idx > 0 ? 'grayscale group-hover:grayscale-0 transition-all' : ''}`} />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined text-white">{idx === 0 ? 'edit' : 'delete'}</span>
                  </div>
                  {idx === 0 && (
                    <div className="absolute top-2 left-2 bg-[#ffb1c1] text-[#3f0017] text-[10px] font-bold px-2 py-1 rounded tracking-widest">PRIMARY</div>
                  )}
                </div>
              ))}
              
              <div className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-[#594045] rounded-lg hover:border-[#ffb1c1] transition-colors group cursor-pointer">
                <span className="material-symbols-outlined text-[#e1bec3] group-hover:text-[#ffb1c1] mb-2">upload_file</span>
                <span className="text-[10px] text-[#e1bec3] uppercase font-bold tracking-widest">Add Image</span>
              </div>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: Settings & Metadata */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Status & Category */}
          <section className="bg-[#292a2e] p-6 rounded-xl border border-[#594045]">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <label className="font-label-bold text-[14px] text-[#e3e2e7] uppercase tracking-widest">Product Status</label>
                <div className="flex items-center gap-2 bg-[#0d0e12] p-1 rounded-full border border-[#594045]">
                  <button 
                    type="button" 
                    onClick={() => setIsActive(true)}
                    className={`px-4 py-1 text-[10px] font-bold rounded-full transition-all tracking-widest ${isActive ? 'bg-[#ffb1c1] text-[#3f0017]' : 'text-[#e1bec3] hover:text-[#e3e2e7]'}`}
                  >
                    ACTIVE
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setIsActive(false)}
                    className={`px-4 py-1 text-[10px] font-bold rounded-full transition-all tracking-widest ${!isActive ? 'bg-[#ffb1c1] text-[#3f0017]' : 'text-[#e1bec3] hover:text-[#e3e2e7]'}`}
                  >
                    DRAFT
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block font-label-bold text-[14px] text-[#e1bec3] mb-2 uppercase tracking-widest">Category</label>
                <select name="category" defaultValue={product.category} className="w-full bg-[#0d0e12] border border-[#594045] rounded-lg p-3 text-[#e3e2e7] focus:ring-1 focus:ring-[#ffb1c1] font-body">
                  <option value="Protein Bars">Protein Bars</option>
                  <option value="Pre-Workout">Pre-Workout</option>
                  <option value="Supplements">Supplements</option>
                  <option value="Apparel">Apparel</option>
                </select>
              </div>
            </div>
          </section>

          {/* Pricing Cards */}
          <section className="bg-[#292a2e] p-6 rounded-xl border border-[#594045]">
            <label className="block font-label-bold text-[14px] text-[#e1bec3] mb-4 uppercase tracking-widest">Pricing</label>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#0d0e12] p-4 rounded-lg border border-[#594045]">
                <p className="text-[10px] text-[#e1bec3] uppercase font-bold mb-1 tracking-widest">Price</p>
                <div className="flex items-center gap-1">
                  <span className="text-[#ffb1c1] font-bold">₹</span>
                  <input name="price" defaultValue={product.price} className="w-full bg-transparent border-none p-0 text-xl font-display-hero text-[#e3e2e7] focus:ring-0" type="number" step="0.01" required />
                </div>
              </div>
              
              <div className="bg-[#0d0e12] p-4 rounded-lg border border-[#594045] opacity-60">
                <p className="text-[10px] text-[#e1bec3] uppercase font-bold mb-1 tracking-widest">Compare</p>
                <div className="flex items-center gap-1">
                  <span className="text-[#e1bec3] font-bold">₹</span>
                  <input name="compareAtPrice" defaultValue={product.compareAtPrice || ''} className="w-full bg-transparent border-none p-0 text-xl font-display-hero text-[#e3e2e7] focus:ring-0" type="number" step="0.01" />
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex items-center gap-2">
              <input type="checkbox" defaultChecked className="rounded bg-[#0d0e12] border-[#594045] text-[#c41e5c] focus:ring-[#c41e5c]" />
              <span className="text-[12px] text-[#e1bec3]">Charge tax on this product</span>
            </div>
          </section>

          {/* Inventory Levels */}
          <section className="bg-[#292a2e] p-6 rounded-xl border border-[#594045]">
            <label className="block font-label-bold text-[14px] text-[#e1bec3] mb-4 uppercase tracking-widest">Inventory</label>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-[#0d0e12] rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#ffb1c1]">warehouse</span>
                  <span className="text-sm font-body font-bold text-[#e3e2e7]">Main Warehouse</span>
                </div>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setInventory(Math.max(0, inventory - 1))} className="w-8 h-8 flex items-center justify-center rounded bg-[#343539] hover:bg-[#594045] transition-colors text-[#e3e2e7]">-</button>
                  <input 
                    type="number" 
                    value={inventory}
                    onChange={(e) => setInventory(parseInt(e.target.value) || 0)}
                    className="w-16 text-center bg-transparent border-none font-bold text-[#ffb1c1] p-0" 
                  />
                  <button type="button" onClick={() => setInventory(inventory + 1)} className="w-8 h-8 flex items-center justify-center rounded bg-[#343539] hover:bg-[#594045] transition-colors text-[#e3e2e7]">+</button>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-[#0d0e12] rounded-lg border border-[#c41e5c]/20">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#ffb1c1]">local_shipping</span>
                  <span className="text-sm font-body font-bold text-[#e3e2e7]">In Transit</span>
                </div>
                <span className="font-bold text-[#e3e2e7]">0</span>
              </div>
              
              <div className="p-4 bg-[#c41e5c]/5 rounded-lg border border-[#c41e5c]/10">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-bold text-[#ffb1c1] uppercase tracking-widest">Stock Health</span>
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${inventory > 10 ? 'text-green-400' : 'text-red-400'}`}>
                    {inventory > 10 ? 'HIGH' : 'LOW'}
                  </span>
                </div>
                <div className="w-full bg-[#343539] h-1.5 rounded-full overflow-hidden">
                  <div className={`h-full ${inventory > 10 ? 'bg-green-400 w-[85%]' : 'bg-red-400 w-[15%]'}`}></div>
                </div>
              </div>
            </div>
          </section>

          {/* Danger Zone */}
          <button type="button" className="w-full flex items-center justify-center gap-2 py-4 rounded-xl border border-red-500/20 text-red-400 font-label-bold text-[14px] hover:bg-red-500/10 transition-colors uppercase tracking-widest">
            <span className="material-symbols-outlined">delete</span>
            ARCHIVE PRODUCT
          </button>
        </div>
      </div>
    </form>
  );
}
