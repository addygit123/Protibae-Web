import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = Number(searchParams.page) || 1;
  const take = 10;
  const skip = (page - 1) * take;

  const [products, totalProducts] = await Promise.all([
    prisma.product.findMany({
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.product.count(),
  ]);

  const totalPages = Math.ceil(totalProducts / take);

  return (
    <>
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div>
          <h2 className="font-display-hero text-headline-lg text-[#e3e2e7] leading-none mb-2">PRODUCTS</h2>
          <p className="font-body text-[#e1bec3] opacity-80">Manage your catalog, inventory, and pricing.</p>
        </div>
        <button className="px-8 py-3 bg-[#c41e5c] text-white font-label-bold rounded shadow-lg drop-shadow-[0_0_8px_rgba(196,30,92,0.4)] flex items-center gap-2 hover:scale-[1.02] transition-transform uppercase tracking-widest">
          <span className="material-symbols-outlined text-[20px]">add</span>
          New Product
        </button>
      </div>

      {/* Filters Bento-ish Bar */}
      <div className="bg-[#1a1b1f] p-6 rounded-xl border border-[#343539] mb-8 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div className="flex flex-col gap-2">
          <label className="font-label-bold text-[12px] text-[#e1bec3] uppercase tracking-wider">Status</label>
          <select className="bg-[#292a2e] border-none rounded text-body-md text-[#e3e2e7] focus:ring-1 focus:ring-[#ffb1c1] h-12">
            <option>All Statuses</option>
            <option>Active</option>
            <option>Draft</option>
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-label-bold text-[12px] text-[#e1bec3] uppercase tracking-wider">Category</label>
          <select className="bg-[#292a2e] border-none rounded text-body-md text-[#e3e2e7] focus:ring-1 focus:ring-[#ffb1c1] h-12">
            <option>All Categories</option>
            <option>Protein Bars</option>
            <option>Pre-Workout</option>
            <option>Supplements</option>
            <option>Apparel</option>
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-label-bold text-[12px] text-[#e1bec3] uppercase tracking-wider">Inventory</label>
          <select className="bg-[#292a2e] border-none rounded text-body-md text-[#e3e2e7] focus:ring-1 focus:ring-[#ffb1c1] h-12">
            <option>All Stock Levels</option>
            <option>In Stock</option>
            <option>Low Stock</option>
            <option>Out of Stock</option>
          </select>
        </div>
        <div className="flex items-center justify-end">
          <button className="h-12 px-6 border-2 border-[#c41e5c] text-[#ffb1c1] font-label-bold rounded hover:bg-[#c41e5c]/10 transition-colors uppercase">
            Clear Filters
          </button>
        </div>
      </div>

      {/* Data Table Surface */}
      <div className="bg-[#1a1b1f] rounded-xl border border-[#343539] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#292a2e]/50 border-b border-[#343539]">
                <th className="px-6 py-4 font-label-bold text-[12px] text-[#e1bec3] uppercase tracking-widest">Product</th>
                <th className="px-6 py-4 font-label-bold text-[12px] text-[#e1bec3] uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 font-label-bold text-[12px] text-[#e1bec3] uppercase tracking-widest">Inventory</th>
                <th className="px-6 py-4 font-label-bold text-[12px] text-[#e1bec3] uppercase tracking-widest">Category</th>
                <th className="px-6 py-4 font-label-bold text-[12px] text-[#e1bec3] uppercase tracking-widest">Price</th>
                <th className="px-6 py-4 font-label-bold text-[12px] text-[#e1bec3] uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#343539]">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-[#e1bec3]">
                    No products found.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-[#343539]/20 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded bg-[#292a2e] border border-[#594045] overflow-hidden flex-shrink-0">
                          {product.images[0] && (
                            <Image 
                              src={product.images[0]} 
                              alt={product.name}
                              width={40} 
                              height={40}
                              className="w-full h-full object-cover" 
                            />
                          )}
                        </div>
                        <div>
                          <p className="font-body font-bold text-[#ffb1c1] line-clamp-1">{product.name}</p>
                          <p className="text-[12px] text-[#e1bec3] line-clamp-1 opacity-70">{product.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-2 py-1 rounded text-[12px] font-bold border uppercase tracking-tighter ${product.isActive ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-[#343539] text-[#e1bec3] border-[#594045]'}`}>
                        {product.isActive ? 'ACTIVE' : 'DRAFT'}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1">
                        <span className={`font-label-bold text-[14px] ${product.inventory === 0 ? 'text-red-400' : product.inventory <= 10 ? 'text-yellow-400' : 'text-[#e3e2e7]'}`}>
                          {product.inventory} in stock
                        </span>
                        {product.inventory <= 10 && (
                          <div className="w-full bg-[#343539] h-1 rounded-full overflow-hidden">
                            <div className={`h-full ${product.inventory === 0 ? 'bg-red-400 w-0' : 'bg-yellow-400 w-[20%]'}`}></div>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-[#e1bec3] text-body-md">{product.category}</td>
                    <td className="px-6 py-5 font-label-bold text-[#e3e2e7]">₹{product.price.toFixed(2)}</td>
                    <td className="px-6 py-5 text-right">
                      <Link href={`/admin/products/${product.id}`} className="p-2 text-[#e1bec3] hover:text-[#ffb1c1] hover:bg-[#ffb1c1]/10 rounded transition-all inline-block">
                        <span className="material-symbols-outlined">edit</span>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Footer */}
        <div className="px-6 py-4 border-t border-[#343539] flex items-center justify-between bg-[#1a1b1f]">
          <span className="font-body text-[#e1bec3] opacity-70">
            Showing {Math.min(skip + 1, totalProducts)} to {Math.min(skip + take, totalProducts)} of {totalProducts} products
          </span>
          <div className="flex items-center gap-2">
            <Link 
              href={page > 1 ? `/admin/products?page=${page - 1}` : '#'}
              className={`p-2 border border-[#343539] rounded text-[#e1bec3] hover:text-[#ffb1c1] hover:border-[#ffb1c1] transition-all ${page <= 1 ? 'opacity-30 pointer-events-none' : ''}`}
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </Link>
            <div className="flex gap-1">
              <button className="w-8 h-8 rounded bg-[#c41e5c] text-white font-label-bold">{page}</button>
            </div>
            <Link 
              href={page < totalPages ? `/admin/products?page=${page + 1}` : '#'}
              className={`p-2 border border-[#343539] rounded text-[#e1bec3] hover:text-[#ffb1c1] hover:border-[#ffb1c1] transition-all ${page >= totalPages ? 'opacity-30 pointer-events-none' : ''}`}
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
