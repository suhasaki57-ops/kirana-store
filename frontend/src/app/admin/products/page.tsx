'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { deleteProduct, toggleStatus } from '@/store/slices/productsAdminSlice';
import { formatPrice } from '@/lib/utils';
import { Search, PlusCircle, Pencil, Trash2, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminProductsPage() {
  const dispatch  = useDispatch();
  const products  = useSelector((s: RootState) => s.productsAdmin.products);
  const [search,  setSearch]  = useState('');
  const [delId,   setDelId]   = useState<string | null>(null);

  const confirmDelete = (id: string) => {
    dispatch(deleteProduct(id));
    setDelId(null);
    toast.success('Product deleted');
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-sm text-muted-foreground">{products.length} total products</p>
        </div>
        <Link href="/admin/products/add"
          className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-700 transition-colors active:scale-95">
          <PlusCircle className="h-4 w-4" /> Add New Product
        </Link>
      </div>

      {/* Search + stats */}
      <div className="flex flex-wrap gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search products, SKU..."
            className="pl-9 pr-3 py-2 text-sm border rounded-xl outline-none focus:ring-2 focus:ring-green-500 w-72 bg-white shadow-sm" />
        </div>
        <div className="flex items-center gap-2 rounded-xl border bg-white px-4 py-2 text-sm shadow-sm">
          <span className="font-bold text-green-700">{products.filter(p => p.status === 'active').length}</span>
          <span className="text-muted-foreground">Active</span>
          <span className="mx-2 text-gray-200">|</span>
          <span className="font-bold text-red-600">{products.filter(p => p.status === 'inactive').length}</span>
          <span className="text-muted-foreground">Inactive</span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              {['Product', 'Category', 'Selling Price', 'MRP', 'Stock', 'Status', 'Actions'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-muted-foreground">
                  No products found
                </td>
              </tr>
            ) : filtered.map(p => (
              <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-11 w-11 overflow-hidden rounded-lg border bg-gray-100 shrink-0">
                      <Image src={p.image} alt={p.name} fill className="object-cover" unoptimized />
                    </div>
                    <div>
                      <p className="font-semibold text-sm leading-snug line-clamp-1">{p.name}</p>
                      <p className="text-xs text-muted-foreground">SKU: {p.sku}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-gray-600">{p.category}</td>
                <td className="px-4 py-3 font-bold text-green-700">{formatPrice(p.price)}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground line-through">{formatPrice(p.mrp)}</td>
                <td className="px-4 py-3">
                  <span className={`font-semibold ${p.stock < 20 ? 'text-red-600' : 'text-gray-700'}`}>{p.stock}</span>
                  {p.stock < 20 && <span className="ml-1 text-[10px] text-red-500">Low</span>}
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => dispatch(toggleStatus(p.id))}
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold transition-colors cursor-pointer active:scale-95
                      ${p.status === 'active' ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                    {p.status}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <Link href={`/products/${p.id}`}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border hover:bg-gray-50 transition-colors">
                      <Eye className="h-3.5 w-3.5 text-gray-500" />
                    </Link>
                    <Link href={`/admin/products/edit/${p.id}`}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors">
                      <Pencil className="h-3.5 w-3.5 text-blue-600" />
                    </Link>
                    <button onClick={() => setDelId(p.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 hover:bg-red-50 transition-colors">
                      <Trash2 className="h-3.5 w-3.5 text-red-500" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete confirm modal */}
      {delId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl animate-fade-in">
            <h3 className="text-base font-bold text-gray-800 mb-2">Delete Product?</h3>
            <p className="text-sm text-muted-foreground mb-5">
              This will permanently delete the product and cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDelId(null)}
                className="flex-1 rounded-xl border py-2.5 text-sm font-semibold hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button onClick={() => confirmDelete(delId)}
                className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-bold text-white hover:bg-red-700 transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
