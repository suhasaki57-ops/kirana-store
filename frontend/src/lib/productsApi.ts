/**
 * Products API — all product reads/writes go through the backend.
 * Local additions (from Redux/localStorage) are merged so new admin products
 * show up instantly on all customer/user pages.
 */
import axios from 'axios';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export interface ApiProduct {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice?: number;
  category: { _id: string; name: string; slug: string } | string;
  images: Array<{ url: string; publicId: string; isDefault: boolean }>;
  stock: number;
  sku: string;
  brand?: string;
  tags: string[];
  isActive: boolean;
  isFeatured: boolean;
  averageRating: number;
  numReviews: number;
  specifications?: Array<{ name: string; value: string }>;
}

const getLocalAdminProducts = (): ApiProduct[] => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem('kirana_admin_products');
    if (!stored) return [];
    const list = JSON.parse(stored);
    if (!Array.isArray(list)) return [];
    return list.map((lp: any) => ({
      _id: String(lp.id || lp._id || `local-${Date.now()}`),
      name: lp.name || 'Product',
      slug: lp.slug || (lp.name ? lp.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : ''),
      description: lp.description || '',
      price: Number(lp.price || 0),
      comparePrice: Number(lp.mrp || lp.comparePrice || 0),
      category: lp.category || 'Grocery',
      images: Array.isArray(lp.images) && lp.images.length > 0
        ? lp.images
        : [{ url: lp.image || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400', publicId: 'local', isDefault: true }],
      stock: Number(lp.stock ?? 50),
      sku: lp.sku || '',
      brand: lp.brand || '',
      tags: Array.isArray(lp.tags) ? lp.tags : (typeof lp.tags === 'string' ? lp.tags.split(',') : []),
      isActive: lp.status ? lp.status === 'active' : true,
      isFeatured: lp.featured ?? false,
      averageRating: 4.5,
      numReviews: 10,
    }));
  } catch {
    return [];
  }
};

/** Fetch all active products — used on customer pages */
export async function fetchProducts(params?: {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  page?: number;
  limit?: number;
}): Promise<{ products: ApiProduct[]; total: number }> {
  let apiProducts: ApiProduct[] = [];
  try {
    const query = new URLSearchParams();
    if (params?.search)    query.set('search',   params.search);
    if (params?.category)  query.set('category', params.category);
    if (params?.minPrice)  query.set('minPrice', String(params.minPrice));
    if (params?.maxPrice)  query.set('maxPrice', String(params.maxPrice));
    if (params?.sort)      query.set('sort',     params.sort);
    if (params?.page)      query.set('page',     String(params.page));
    if (params?.limit)     query.set('limit',    String(params.limit ?? 100));

    const res = await axios.get(`${API}/products?${query.toString()}`);
    apiProducts = res.data.data || [];
  } catch {
    apiProducts = [];
  }

  // Merge locally added admin products
  const localProducts = getLocalAdminProducts();
  const apiIds = new Set(apiProducts.map(p => String(p._id)));
  const localOnly = localProducts.filter(lp => lp && !apiIds.has(String(lp._id)));

  const combined = [...localOnly, ...apiProducts];
  return {
    products: combined,
    total: combined.length,
  };
}

/** Fetch featured products for homepage */
export async function fetchFeaturedProducts(): Promise<ApiProduct[]> {
  const { products } = await fetchProducts({ limit: 100 });
  const featured = products.filter(p => p.isFeatured || p.isActive);
  return featured.length > 0 ? featured : products;
}

/** Normalize an API product to the shape ProductCard expects */
export function normalizeProduct(p: ApiProduct) {
  const categoryName =
    typeof p.category === 'object' ? p.category?.name || 'Grocery' : (p.category as string || 'Grocery');

  return {
    _id: p._id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    comparePrice: p.comparePrice,
    category: categoryName,
    images: p.images?.length
      ? p.images.map(i => ({ url: i.url }))
      : [{ url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400' }],
    averageRating: p.averageRating ?? 4.5,
    numReviews: p.numReviews ?? 50,
    stock: p.stock ?? 50,
    description: p.description,
    brand: p.brand,
    featured: p.isFeatured,
  };
}
