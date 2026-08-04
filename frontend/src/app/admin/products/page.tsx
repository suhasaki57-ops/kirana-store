'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { deleteProduct, toggleStatus } from '@/store/slices/productsAdminSlice';
import { formatPrice } from '@/lib/utils';
import { Search, PlusCircle, Pencil, Trash2, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchProducts, normalizeProduct, type ApiProduct } from '@/lib/productsApi';
import api from '@/lib/api';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export default function AdminProductsPage() {
  const dispatch = useDispatch();
  // Local Redux products (for products added in this session before page refresh)
  const localProducts = useSelector((s: RootState) => s.productsAdmin?.products || []);

  const [apiProducts, setApiProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState('');
  const [delId, setDelId]             = useState<string | null>(null);
  const [delLoading, setDelLoading]   = useState(false);

  // Fetch products from backend so we see real, persisted data
  const loadProducts = () => {
    setLoading(true);
    fetchProducts({ limit: 200, all: true })
      .then((res) => {
        setApiProducts(res?.products || []);
        setLoading(false);
      })
      .catch(() => {
        setApiProducts([]);
        setLoading(false);
      });
  };

  useEffect(() => { loadProducts(); }, []);

  // Merge: API products (persisted) + local-only products added this session
  const normalizedApi = (apiProducts || []).map(normalizeProduct);
  const localIds = new Set(normalizedApi.map(p => p._id));
  const localOnly = (localProducts || [])
    .filter(lp => lp && !localIds.has(lp.id) && !localIds.has(String(lp.id)))
    .map(lp => ({
      _id: lp.id, name: lp.name || 'Untitled Product', slug: '',
      price: lp.price || 0, comparePrice: lp.mrp || lp.price || 0,
      category: lp.category || 'General',
      images: [{ url: lp.image || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=80' }],
      averageRating: 4.5, numReviews: 0,
      stock: lp.stock ?? 0, description: lp.description || '',
      brand: lp.brand || '', featured: lp.featured || false,
      status: lp.status || 'active', sku: lp.sku || '',
    }));
  const allProducts = [...normalizedApi, ...localOnly];

  const filtered = allProducts.filter(p =>
    (p.name || '').toLowerCase().includes(search.toLowerCase()) ||
    String(p.category || '').toLowerCase().includes(search.toLowerCase())
  );

  const confirmDelete = async (id: string) => {
    setDelLoading(true);
    const targetIdStr = String(id).toLowerCase();

    try {
      // 1. Delete from backend API
      await api.delete(`/products/${id}`).catch(() => {});
      await fetch(`${API}/products/${id}`, { method: 'DELETE' }).catch(() => {});

      // 2. Track deleted ID in localStorage (strictly by ID, NOT by name!)
      if (typeof window !== 'undefined') {
        try {
          const s = localStorage.getItem('kirana_admin_deleted_ids');
          const deletedArr: string[] = s ? JSON.parse(s) : [];
          if (!deletedArr.includes(targetIdStr)) deletedArr.push(targetIdStr);
          // Keep only valid IDs (no spaces)
          const cleaned = deletedArr.filter(x => typeof x === 'string' && !x.includes(' '));
          localStorage.setItem('kirana_admin_deleted_ids', JSON.stringify(cleaned));

          // Remove from kirana_admin_products array in localStorage
          const storedProds = localStorage.getItem('kirana_admin_products');
          if (storedProds) {
            const list = JSON.parse(storedProds);
            const filteredList = list.filter((p: any) => {
              const pid = String(p.id || p._id || '').toLowerCase();
              return pid !== targetIdStr;
            });
            localStorage.setItem('kirana_admin_products', JSON.stringify(filteredList));
          }
        } catch {}
      }

      // 3. Remove from Redux state
      dispatch(deleteProduct(id));

      setApiProducts(p => p.filter(prod => String(prod._id).toLowerCase() !== targetIdStr));
      toast.success('Product deleted successfully');
    } catch {
      dispatch(deleteProduct(id));
      setApiProducts(p => p.filter(prod => String(prod._id).toLowerCase() !== targetIdStr));
      toast.success('Product removed');
    } finally {
      setDelLoading(false);
      setDelId(null);
      loadProducts();
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-sm text-muted-foreground">{allProducts.length} total products</p>
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
          <span className="font-bold text-green-700">{allProducts.filter(p => (p as any).status === 'active' || (p as any).isActive !== false).length}</span>
          <span className="text-muted-foreground">Active</span>
          <span className="mx-2 text-gray-200">|</span>
          <span className="font-bold text-red-600">{allProducts.filter(p => (p as any).status === 'inactive' || (p as any).isActive === false).length}</span>
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
            {loading ? (
              <tr><td colSpan={7} className="py-12 text-center text-muted-foreground">Loading products...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={7} className="py-12 text-center text-muted-foreground">No products found</td></tr>
            ) : filtered.map(p => (
              <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-11 w-11 overflow-hidden rounded-lg border bg-gray-100 shrink-0">
                      <Image
                        src={p.images?.[0]?.url || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=80'}
                        alt={p.name} fill sizes="44px" unoptimized className="object-cover" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm leading-snug line-clamp-1">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{(p as any).sku || p._id.slice(-6)}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-gray-600">{String(p.category)}</td>
                <td className="px-4 py-3 font-bold text-green-700">{formatPrice(p.price)}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground line-through">{formatPrice(p.comparePrice || p.price)}</td>
                <td className="px-4 py-3">
                  <span className={`font-semibold ${p.stock < 20 ? 'text-red-600' : 'text-gray-700'}`}>{p.stock}</span>
                  {p.stock < 20 && <span className="ml-1 text-[10px] text-red-500">Low</span>}
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold bg-green-100 text-green-700">active</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <Link href={`/products/${p.slug || p._id}`}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border hover:bg-gray-50">
                      <Eye className="h-3.5 w-3.5 text-gray-500" />
                    </Link>
                    <Link href={`/admin/products/edit/${p._id}`}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-blue-200 hover:bg-blue-50">
                      <Pencil className="h-3.5 w-3.5 text-blue-600" />
                    </Link>
                    <button onClick={() => setDelId(p._id)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 hover:bg-red-50">
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
              This will permanently delete the product from the store and cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDelId(null)} disabled={delLoading}
                className="flex-1 rounded-xl border py-2.5 text-sm font-semibold hover:bg-gray-50 disabled:opacity-50">
                Cancel
              </button>
              <button onClick={() => confirmDelete(delId)} disabled={delLoading}
                className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-60 flex items-center justify-center gap-2">
                {delLoading ? (
                  <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> Deleting...</>
                ) : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
