/**
 * Products API — all product reads/writes go through the backend.
 * This ensures admin changes are visible on ALL devices (mobile, desktop, etc.)
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
  try {
    const query = new URLSearchParams();
    if (params?.search)    query.set('search',   params.search);
    if (params?.category)  query.set('category', params.category);
    if (params?.minPrice)  query.set('minPrice', String(params.minPrice));
    if (params?.maxPrice)  query.set('maxPrice', String(params.maxPrice));
    if (params?.sort)      query.set('sort',     params.sort);
    if (params?.page)      query.set('page',     String(params.page));
    if (params?.limit)     query.set('limit',    String(params.limit ?? 50));

    const res = await axios.get(`${API}/products?${query.toString()}`);
    return {
      products: res.data.data || [],
      total: res.data.pagination?.totalItems || 0,
    };
  } catch {
    return { products: [], total: 0 };
  }
}

/** Fetch featured products for homepage */
export async function fetchFeaturedProducts(): Promise<ApiProduct[]> {
  try {
    const res = await axios.get(`${API}/products?featured=true&limit=8`);
    return res.data.data || [];
  } catch {
    return [];
  }
}

/** Normalize an API product to the shape ProductCard expects */
export function normalizeProduct(p: ApiProduct) {
  const categoryName =
    typeof p.category === 'object' ? p.category.name : (p.category as string);

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
