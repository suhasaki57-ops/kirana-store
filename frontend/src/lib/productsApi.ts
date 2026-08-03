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

const DEFAULT_SEED: ApiProduct[] = [
  { _id:'1', name:'India Gate Basmati Rice 5kg',       category:'Grains & Pulses',    price:499, comparePrice:580, stock:200, sku:'RICE-001', brand:'India Gate',  tags:['rice','basmati'], description:'Premium basmati rice.',         isActive:true, isFeatured:true,  slug:'india-gate-basmati-rice-5kg',       images:[{url:'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400', publicId:'1', isDefault:true}], averageRating:4.7, numReviews:540 },
  { _id:'2', name:'Aashirvaad Whole Wheat Atta 10kg',  category:'Grains & Pulses',    price:380, comparePrice:420, stock:150, sku:'ATTA-001', brand:'Aashirvaad', tags:['atta','wheat'],    description:'Chakki fresh atta.',             isActive:true, isFeatured:true,  slug:'aashirvaad-whole-wheat-atta-10kg',  images:[{url:'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400', publicId:'2', isDefault:true}], averageRating:4.6, numReviews:820 },
  { _id:'3', name:'Toor Dal (Arhar) 1kg',              category:'Grains & Pulses',    price:145, comparePrice:165, stock:300, sku:'DAL-001',  brand:'Swad',        tags:['dal','toor'],      description:'Premium toor dal.',             isActive:true, isFeatured:false, slug:'toor-dal-arhar-1kg',              images:[{url:'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400', publicId:'3', isDefault:true}], averageRating:4.4, numReviews:310 },
  { _id:'4', name:'MDH Chana Masala 100g',             category:'Spices & Masala',    price:55,  comparePrice:65,  stock:400, sku:'MDH-001',  brand:'MDH',         tags:['masala','spice'],  description:'Authentic MDH chana masala.',   isActive:true, isFeatured:true,  slug:'mdh-chana-masala-100g',             images:[{url:'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400', publicId:'4', isDefault:true}], averageRating:4.6, numReviews:680 },
  { _id:'5', name:'Fortune Sunflower Oil 1L',          category:'Oils & Ghee',        price:142, comparePrice:168, stock:250, sku:'OIL-001',  brand:'Fortune',     tags:['oil','sunflower'], description:'Light sunflower oil.',          isActive:true, isFeatured:false, slug:'fortune-sunflower-oil-1l',          images:[{url:'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400', publicId:'5', isDefault:true}], averageRating:4.4, numReviews:320 },
  { _id:'6', name:'Amul Pure Ghee 500ml',              category:'Oils & Ghee',        price:295, comparePrice:340, stock:180, sku:'GHEE-001', brand:'Amul',        tags:['ghee','cow'],      description:'Pure Amul cow ghee.',           isActive:true, isFeatured:true,  slug:'amul-pure-ghee-500ml',              images:[{url:'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400', publicId:'6', isDefault:true}], averageRating:4.8, numReviews:910 },
  { _id:'7', name:'Surf Excel Easy Wash 1kg',          category:'Cleaning & Home',    price:138, comparePrice:160, stock:300, sku:'SURF-001', brand:'Surf Excel',  tags:['detergent'],     description:'Stain removing detergent.',     isActive:true, isFeatured:false, slug:'surf-excel-easy-wash-1kg',          images:[{url:'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400', publicId:'7', isDefault:true}], averageRating:4.6, numReviews:750 },
  { _id:'8', name:'Tata Chai Premium Tea 500g',        category:'Snacks & Beverages', price:235, comparePrice:270, stock:280, sku:'TEA-001',  brand:'Tata Tea',    tags:['tea','chai'],      description:'Assam premium tea leaves.',     isActive:true, isFeatured:true,  slug:'tata-chai-premium-tea-500g',        images:[{url:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', publicId:'8', isDefault:true}], averageRating:4.7, numReviews:720 },
];

const getDeletedIds = (): Set<string> => {
  if (typeof window === 'undefined') return new Set();
  try {
    const s = localStorage.getItem('kirana_admin_deleted_ids');
    if (!s) return new Set();
    const arr = JSON.parse(s);
    return new Set(Array.isArray(arr) ? arr.map(x => String(x).toLowerCase()) : []);
  } catch {
    return new Set();
  }
};

const getLocalAdminProducts = (): ApiProduct[] => {
  const deletedIds = getDeletedIds();
  if (typeof window === 'undefined') {
    return DEFAULT_SEED.filter(p => !deletedIds.has(String(p._id).toLowerCase()));
  }
  try {
    const stored = localStorage.getItem('kirana_admin_products');
    let list: any[] = [];
    if (stored !== null) {
      list = JSON.parse(stored);
    } else {
      list = DEFAULT_SEED;
    }
    if (!Array.isArray(list)) list = [];

    return list
      .filter((lp: any) => {
        const id = String(lp.id || lp._id || '').toLowerCase();
        const name = String(lp.name || '').toLowerCase();
        if (deletedIds.has(id)) return false;
        if (deletedIds.has(name)) return false;
        return true;
      })
      .map((lp: any) => ({
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
    return DEFAULT_SEED.filter(p => !deletedIds.has(String(p._id).toLowerCase()));
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

  const deletedIds = getDeletedIds();

  // Filter API products against deletedIds
  apiProducts = apiProducts.filter(p => {
    const id = String(p._id).toLowerCase();
    const name = String(p.name || '').toLowerCase();
    return !deletedIds.has(id) && !deletedIds.has(name);
  });

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
