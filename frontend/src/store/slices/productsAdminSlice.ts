import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AdminProduct {
  id: string; name: string; category: string; price: number; mrp: number;
  stock: number; sku: string; brand: string; tags: string; description: string;
  status: 'active'|'inactive'; featured: boolean; image: string;
}

const SEED: AdminProduct[] = [
  { id:'1', name:'India Gate Basmati Rice 5kg',       category:'Grains & Pulses',    price:499, mrp:580, stock:200, sku:'RICE-001', brand:'India Gate',  tags:'rice,basmati', description:'Premium basmati rice.',         status:'active',   featured:true,  image:'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=80' },
  { id:'2', name:'Aashirvaad Whole Wheat Atta 10kg',  category:'Grains & Pulses',    price:380, mrp:420, stock:150, sku:'ATTA-001', brand:'Aashirvaad', tags:'atta,wheat',    description:'Chakki fresh atta.',             status:'active',   featured:true,  image:'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=80' },
  { id:'3', name:'Toor Dal (Arhar) 1kg',              category:'Grains & Pulses',    price:145, mrp:165, stock:300, sku:'DAL-001',  brand:'Swad',        tags:'dal,toor',      description:'Premium toor dal.',             status:'active',   featured:false, image:'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=80' },
  { id:'4', name:'MDH Chana Masala 100g',             category:'Spices & Masala',    price:55,  mrp:65,  stock:400, sku:'MDH-001',  brand:'MDH',         tags:'masala,spice',  description:'Authentic MDH chana masala.',   status:'active',   featured:true,  image:'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=80' },
  { id:'5', name:'Fortune Sunflower Oil 1L',          category:'Oils & Ghee',        price:142, mrp:168, stock:250, sku:'OIL-001',  brand:'Fortune',     tags:'oil,sunflower', description:'Light sunflower oil.',          status:'active',   featured:false, image:'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=80' },
  { id:'6', name:'Amul Pure Ghee 500ml',              category:'Oils & Ghee',        price:295, mrp:340, stock:180, sku:'GHEE-001', brand:'Amul',        tags:'ghee,cow',      description:'Pure Amul cow ghee.',           status:'active',   featured:true,  image:'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=80' },
  { id:'7', name:'Surf Excel Easy Wash 1kg',          category:'Cleaning & Home',    price:138, mrp:160, stock:300, sku:'SURF-001', brand:'Surf Excel',  tags:'detergent',     description:'Stain removing detergent.',     status:'active',   featured:false, image:'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=80' },
  { id:'8', name:'Tata Chai Premium Tea 500g',        category:'Snacks & Beverages', price:235, mrp:270, stock:280, sku:'TEA-001',  brand:'Tata Tea',    tags:'tea,chai',      description:'Assam premium tea leaves.',     status:'active',   featured:true,  image:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=80' },
];

const loadProducts = (): AdminProduct[] => {
  if (typeof window === 'undefined') return SEED;
  try {
    const s = localStorage.getItem('kirana_admin_products');
    return s ? JSON.parse(s) : SEED;
  } catch { return SEED; }
};

const save = (p: AdminProduct[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('kirana_admin_products', JSON.stringify(p));
};

const productsAdminSlice = createSlice({
  name: 'productsAdmin',
  initialState: { products: loadProducts() },
  reducers: {
    addProduct: (state, action: PayloadAction<Omit<AdminProduct, 'id'>>) => {
      const p: AdminProduct = { ...action.payload, id: Date.now().toString() };
      state.products.unshift(p);
      save(state.products);
    },
    updateProduct: (state, action: PayloadAction<AdminProduct>) => {
      const idx = state.products.findIndex(p => p.id === action.payload.id);
      if (idx !== -1) { state.products[idx] = action.payload; save(state.products); }
    },
    deleteProduct: (state, action: PayloadAction<string>) => {
      state.products = state.products.filter(p => p.id !== action.payload);
      save(state.products);
    },
    toggleStatus: (state, action: PayloadAction<string>) => {
      const p = state.products.find(p => p.id === action.payload);
      if (p) { p.status = p.status === 'active' ? 'inactive' : 'active'; save(state.products); }
    },
  },
});

export const { addProduct, updateProduct, deleteProduct, toggleStatus } = productsAdminSlice.actions;
export default productsAdminSlice.reducer;
