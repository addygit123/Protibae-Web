'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { updateProduct, deleteProduct, createProduct } from '@/app/admin/products/actions';
import { ProductImage } from '@/components/shared/ProductImage';
import { cn } from '@/lib/utils';
import type { Product } from '@prisma/client';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export function ProductEditForm({ product }: { product?: Product }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isActive, setIsActive] = useState(product?.isActive ?? true);
  const [inventory, setInventory] = useState(product?.inventory ?? 0);

  // Dynamic Image State
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [uploadingFiles, setUploadingFiles] = useState<{ name: string; progress: number }[]>([]);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Toast Notification State
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Math.random().toString(36).substring(7);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Image Upload handler
  const uploadImageFile = async (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      showToast(`File "${file.name}" exceeds 10MB limit.`, 'error');
      return;
    }
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      showToast(`Unsupported format for "${file.name}". Only PNG, JPEG, and WEBP are allowed.`, 'error');
      return;
    }

    setUploadingFiles(prev => [...prev, { name: file.name, progress: 10 }]);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'protibae/products');
      if (product && product.slug) {
        formData.append('productSlug', product.slug);
      }

      setUploadingFiles(prev => prev.map(f => f.name === file.name ? { ...f, progress: 30 } : f));

      const uploadPromise = new Promise<{ success: boolean; url?: string; error?: string } | any>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/admin/upload');

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const pct = Math.round((event.loaded / event.total) * 100);
            const progressVal = Math.min(95, Math.max(30, pct));
            setUploadingFiles(prev => prev.map(f => f.name === file.name ? { ...f, progress: progressVal } : f));
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              resolve(JSON.parse(xhr.responseText));
            } catch {
              reject(new Error('Invalid server response format'));
            }
          } else {
            try {
              const res = JSON.parse(xhr.responseText);
              reject(new Error(res.error || 'Upload failed'));
            } catch {
              reject(new Error(`Server error: ${xhr.statusText}`));
            }
          }
        };

        xhr.onerror = () => reject(new Error('Network connection failed'));
        xhr.send(formData);
      });

      const res = await uploadPromise;

      if (res.success && res.url) {
        setImages(prev => [...prev, res.url]);
        showToast(`Image "${file.name}" uploaded successfully.`, 'success');
      } else {
        throw new Error(res.error || 'Upload failed');
      }
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Failed to upload image.', 'error');
    } finally {
      setUploadingFiles(prev => prev.filter(f => f.name !== file.name));
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      for (const file of files) {
        await uploadImageFile(file);
      }
      e.target.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      for (const file of files) {
        await uploadImageFile(file);
      }
    }
  };

  const handleDeleteImage = async (urlToDelete: string) => {
    setIsDeleting(urlToDelete);
    try {
      const response = await fetch('/api/admin/upload', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlToDelete }),
      });

      const res = await response.json();
      if (!response.ok) {
        throw new Error(res.error || 'Failed to delete from Cloudinary.');
      }

      setImages(prev => prev.filter(url => url !== urlToDelete));
      showToast('Image deleted from database & Cloudinary.', 'success');
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Failed to delete image from Cloudinary.', 'error');
      // Still remove from local state so UI remains correct
      setImages(prev => prev.filter(url => url !== urlToDelete));
    } finally {
      setIsDeleting(null);
    }
  };

  const handleReplaceImage = async (oldUrl: string, file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      showToast(`File "${file.name}" exceeds 10MB limit.`, 'error');
      return;
    }
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      showToast(`Unsupported format. Only PNG, JPEG, and WEBP are allowed.`, 'error');
      return;
    }

    setIsDeleting(oldUrl);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'protibae/products');
      if (product && product.slug) {
        formData.append('productSlug', product.slug);
      }

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const res = await response.json();
      if (!response.ok) {
        throw new Error(res.error || 'Upload failed');
      }

      // Delete old from Cloudinary
      await fetch('/api/admin/upload', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: oldUrl }),
      });

      setImages(prev => prev.map(url => url === oldUrl ? res.url : url));
      showToast('Image replaced successfully.', 'success');
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Failed to replace image.', 'error');
    } finally {
      setIsDeleting(null);
    }
  };

  const handleMakePrimary = (url: string) => {
    setImages(prev => {
      const filtered = prev.filter(u => u !== url);
      return [url, ...filtered];
    });
    showToast('Image set as primary.', 'success');
  };

  const handleMoveImage = (idx: number, direction: 'left' | 'right') => {
    setImages(prev => {
      const nextImages = [...prev];
      const targetIdx = direction === 'left' ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= nextImages.length) return prev;
      
      const temp = nextImages[idx];
      nextImages[idx] = nextImages[targetIdx];
      nextImages[targetIdx] = temp;
      return nextImages;
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.append('isActive', isActive.toString());
    formData.append('inventory', inventory.toString());
    
    // Append current Cloudinary URLs
    images.forEach(img => formData.append('images', img));
    
    startTransition(async () => {
      const result = product
        ? await updateProduct(product.id, formData)
        : await createProduct(formData);
      if (result.success) {
        showToast(product ? 'Product saved successfully!' : 'Product created successfully!', 'success');
        setTimeout(() => router.push('/admin/products'), 1000);
      } else {
        showToast(result.error || (product ? 'Failed to update product' : 'Failed to create product'), 'error');
      }
    });
  };

  const handleDeleteProduct = async () => {
    if (!product) return;
    if (!window.confirm('Are you sure you want to permanently delete this product and all of its images? This action cannot be undone.')) {
      return;
    }
    
    startTransition(async () => {
      try {
        const res = await deleteProduct(product.id);
        if (res.success) {
          showToast('Product deleted successfully.', 'success');
          router.push('/admin/products');
        } else {
          showToast(res.error || 'Failed to delete product.', 'error');
        }
      } catch (err: any) {
        console.error(err);
        showToast(err.message || 'Failed to delete product.', 'error');
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
            {product ? (
              <>Edit <span className="text-[#ffb1c1]">{product.name}</span></>
            ) : (
              'New Product'
            )}
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
                  defaultValue={product?.name ?? ''}
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
                    defaultValue={product?.description ?? ''}
                    className="w-full bg-[#0d0e12] border-none p-4 text-[#e3e2e7] focus:ring-0 font-body" 
                    rows={8}
                    required
                  ></textarea>
                </div>
              </div>
            </div>
          </section>

          {/* Media Gallery */}
          <section 
            className="bg-[#292a2e] p-8 rounded-xl border border-[#594045] transition-all"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <label className="font-label-bold text-[14px] text-[#e1bec3] uppercase tracking-widest block">Product Gallery</label>
                <span className="text-[10px] text-[#a8898e]">Drag & drop images, or click to upload</span>
              </div>
              <button 
                type="button" 
                onClick={() => document.getElementById('gallery-file-input')?.click()}
                className="text-[#ffb1c1] font-label-bold text-[14px] flex items-center gap-1 hover:underline cursor-pointer font-display-hero uppercase tracking-wider"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                Upload New
              </button>
            </div>
            
            {/* Hidden Input for file uploads */}
            <input
              type="file"
              id="gallery-file-input"
              multiple
              className="hidden"
              accept="image/png, image/jpeg, image/webp"
              onChange={handleFileChange}
            />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {images.map((img: string, idx: number) => (
                <div 
                  key={img} 
                  className={`aspect-square relative group border-2 rounded-lg overflow-hidden transition-all bg-[#0d0e12] ${
                    idx === 0 ? 'border-[#ffb1c1]' : 'border-[#594045] hover:border-[#e1bec3]'
                  }`}
                >
                  <ProductImage 
                    src={img} 
                    alt={`Product Image ${idx + 1}`} 
                    fill 
                    className={cn(
                      "object-cover transition-all duration-300", 
                      idx > 0 && "grayscale group-hover:grayscale-0",
                      isDeleting === img && "opacity-35"
                    )} 
                  />
                  
                  {isDeleting === img && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-2 border-[#ffb1c1] border-t-transparent"></div>
                    </div>
                  )}

                  {isDeleting !== img && (
                    <div className="absolute inset-0 bg-black/75 flex flex-col justify-between p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                      {/* Top Action Row */}
                      <div className="flex justify-between items-center w-full">
                        {idx === 0 ? (
                          <span className="bg-[#ffb1c1] text-[#3f0017] text-[9px] font-black px-2 py-0.5 rounded tracking-widest uppercase">PRIMARY</span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleMakePrimary(img)}
                            className="text-[9px] font-black tracking-widest uppercase bg-[#343539] hover:bg-[#ffb1c1] hover:text-[#3f0017] text-white px-2 py-0.5 rounded transition-colors cursor-pointer"
                          >
                            Set Primary
                          </button>
                        )}
                        
                        <button
                          type="button"
                          onClick={() => handleDeleteImage(img)}
                          className="text-[#ffb4ab] hover:text-red-500 hover:bg-red-500/10 p-1 rounded transition-colors cursor-pointer"
                          title="Delete from database & Cloudinary"
                        >
                          <span className="material-symbols-outlined text-base">delete</span>
                        </button>
                      </div>

                      {/* Bottom Action Row */}
                      <div className="flex justify-between items-center w-full">
                        <div className="flex gap-1">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMoveImage(idx, 'left')}
                            className="p-1.5 text-white hover:text-[#ffb1c1] bg-[#1a1b1f]/80 hover:bg-[#ffb1c1]/20 rounded disabled:opacity-20 disabled:pointer-events-none transition-colors cursor-pointer"
                            title="Move Left"
                          >
                            <span className="material-symbols-outlined text-sm leading-none">arrow_back</span>
                          </button>
                          <button
                            type="button"
                            disabled={idx === images.length - 1}
                            onClick={() => handleMoveImage(idx, 'right')}
                            className="p-1.5 text-white hover:text-[#ffb1c1] bg-[#1a1b1f]/80 hover:bg-[#ffb1c1]/20 rounded disabled:opacity-20 disabled:pointer-events-none transition-colors cursor-pointer"
                            title="Move Right"
                          >
                            <span className="material-symbols-outlined text-sm leading-none">arrow_forward</span>
                          </button>
                        </div>

                        <label className="cursor-pointer p-1.5 text-white hover:text-[#ffb1c1] bg-[#1a1b1f]/80 hover:bg-[#ffb1c1]/20 rounded transition-colors flex items-center justify-center" title="Replace Image">
                          <span className="material-symbols-outlined text-sm leading-none">autorenew</span>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/png, image/jpeg, image/webp"
                            onChange={(e) => {
                              if (e.target.files?.[0]) {
                                handleReplaceImage(img, e.target.files[0]);
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  )}

                  {idx === 0 && isDeleting !== img && (
                    <div className="absolute top-2 left-2 bg-[#ffb1c1] text-[#3f0017] text-[10px] font-bold px-2 py-1 rounded tracking-widest transition-opacity group-hover:opacity-0">PRIMARY</div>
                  )}
                </div>
              ))}

              {uploadingFiles.map((file) => (
                <div key={file.name} className="aspect-square relative border-2 border-dashed border-[#ffb1c1] rounded-lg overflow-hidden flex flex-col items-center justify-center bg-[#1a1b1f] p-4 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#ffb1c1] border-t-transparent mb-2"></div>
                  <p className="text-[10px] text-[#e1bec3] font-bold truncate w-full px-2 mb-1">{file.name}</p>
                  <div className="w-full bg-[#343539] h-1.5 rounded-full overflow-hidden">
                    <div className="h-full bg-[#ffb1c1] transition-all duration-300" style={{ width: `${file.progress}%` }}></div>
                  </div>
                  <p className="text-[9px] text-[#ffb1c1] font-bold mt-1 uppercase tracking-widest">{file.progress}% UPLOADING</p>
                </div>
              ))}
              
              <div 
                onClick={() => document.getElementById('gallery-file-input')?.click()}
                className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-[#594045] rounded-lg hover:border-[#ffb1c1] transition-colors group cursor-pointer bg-[#0d0e12]"
              >
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
                <select name="category" defaultValue={product?.category ?? 'Protein Bars'} className="w-full bg-[#0d0e12] border border-[#594045] rounded-lg p-3 text-[#e3e2e7] focus:ring-1 focus:ring-[#ffb1c1] font-body">
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
                  <input name="price" defaultValue={product?.price ?? ''} className="w-full bg-transparent border-none p-0 text-xl font-display-hero text-[#e3e2e7] focus:ring-0" type="number" step="0.01" required />
                </div>
              </div>
              
              <div className="bg-[#0d0e12] p-4 rounded-lg border border-[#594045]">
                <p className="text-[10px] text-[#e1bec3] uppercase font-bold mb-1 tracking-widest">Pack of 6 Price</p>
                <div className="flex items-center gap-1">
                  <span className="text-[#e1bec3] font-bold">₹</span>
                  <input name="price6" defaultValue={product?.price6 ?? ''} className="w-full bg-transparent border-none p-0 text-xl font-display-hero text-[#e3e2e7] focus:ring-0" type="number" step="0.01" />
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
          {product && (
            <button 
              type="button" 
              onClick={handleDeleteProduct}
              disabled={isPending}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl border border-red-500/20 text-red-400 font-label-bold text-[14px] hover:bg-red-500/10 transition-colors uppercase tracking-widest disabled:opacity-50"
            >
              <span className="material-symbols-outlined">delete</span>
              DELETE PRODUCT
            </button>
          )}
        </div>
      </div>

      {/* Toast Notification Portal */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              'p-4 rounded-lg shadow-2xl border flex items-center gap-3 transition-all duration-300 translate-y-0 opacity-100 bg-[#0d0e12]',
              toast.type === 'success' && 'border-green-500/30 text-green-400',
              toast.type === 'error' && 'border-red-500/30 text-red-400',
              toast.type === 'info' && 'border-[#594045] text-[#e3e2e7]'
            )}
          >
            <span className="material-symbols-outlined shrink-0">
              {toast.type === 'success' && 'check_circle'}
              {toast.type === 'error' && 'error'}
              {toast.type === 'info' && 'info'}
            </span>
            <span className="text-sm font-body font-bold">{toast.message}</span>
            <button
              type="button"
              onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
              className="ml-auto p-1 hover:bg-[#343539] rounded transition-colors text-gray-400 hover:text-white cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
        ))}
      </div>
    </form>
  );
}
