'use client';
import { useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { UploadCloud, X, ArrowLeft, Save, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

const schema = z.object({
  name:        z.string().min(3, 'Product name is required'),
  category:    z.string().min(1, 'Please select a category'),
  description: z.string().min(10, 'Description required'),
  price:       z.coerce.number().min(1, 'Selling price required'),
  mrp:         z.coerce.number().min(1, 'MRP required'),
  stock:       z.coerce.number().min(0),
  sku:         z.string().min(2, 'SKU required'),
  brand:       z.string().optional(),
  tags:        z.string().optional(),
  status:      z.enum(['active','inactive']),
  featured:    z.boolean().optional(),
});
type FormData = z.infer<typeof schema>;

const CATEGORIES = ['Grains & Pulses','Spices & Masala','Oils & Ghee','Cleaning & Home','Personal Care','Snacks & Beverages'];

const SAMPLE_PRODUCTS: Record<string, FormData & { existingImage: string }> = {
  '1': { name:'India Gate Basmati Rice 5kg',      category:'Grains & Pulses',    description:'Premium long grain basmati rice. Aged for extra flavour. Perfect for biryani, pulao and everyday meals.', price:499, mrp:580, stock:200, sku:'RICE-001', brand:'India Gate', tags:'rice,basmati,grains', status:'active',   featured:true,  existingImage:'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300' },
  '2': { name:'Aashirvaad Whole Wheat Atta 10kg', category:'Grains & Pulses',    description:'Chakki fresh atta made from 100% whole wheat. Rich in fibre, ideal for soft rotis.',               price:380, mrp:420, stock:150, sku:'ATTA-001', brand:'Aashirvaad', tags:'atta,wheat,flour', status:'active',   featured:true,  existingImage:'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300' },
  '7': { name:'Surf Excel Easy Wash 1kg',          category:'Cleaning & Home',    description:'Surf Excel removes tough stains in just one wash. Works in hand wash and machine wash.',              price:138, mrp:160, stock:300, sku:'SURF-001', brand:'Surf Excel', tags:'detergent,washing', status:'active',   featured:false, existingImage:'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=300' },
  '8': { name:'Tata Chai Premium Tea 500g',        category:'Snacks & Beverages', description:'Tata Tea Premium — strong, flavourful and refreshing. Made from finest Assam tea leaves.',          price:235, mrp:270, stock:280, sku:'TEA-001',  brand:'Tata Tea',   tags:'tea,chai,assam',  status:'inactive', featured:true,  existingImage:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300' },
};

interface ImagePreview { file: File; preview: string; }

export default function EditProductPage() {
  const router   = useRouter();
  const params   = useParams();
  const id       = Array.isArray(params.id) ? params.id[0] : (params.id ?? '1');
  const sample   = SAMPLE_PRODUCTS[id] ?? SAMPLE_PRODUCTS['1'];

  const fileRef  = useRef<HTMLInputElement>(null);
  const [newImages,  setNewImages]  = useState<ImagePreview[]>([]);
  const [keepExisting, setKeepExisting] = useState(true);
  const [dragging, setDragging]     = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting }, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { ...sample },
  });

  const addFiles = (files: FileList | null) => {
    if (!files) return;
    setNewImages(p => [...p, ...Array.from(files).map(f => ({ file: f, preview: URL.createObjectURL(f) }))]);
  };

  const removeNew = (idx: number) => {
    URL.revokeObjectURL(newImages[idx].preview);
    setNewImages(p => p.filter((_, i) => i !== idx));
  };

  const onSubmit = async (data: FormData) => {
    await new Promise(r => setTimeout(r, 800));
    toast.success(`Product "${data.name}" updated successfully!`);
    router.push('/admin/products');
  };

  const sellingPrice = watch('price');
  const mrpPrice     = watch('mrp');
  const discount = sellingPrice && mrpPrice && mrpPrice > sellingPrice
    ? Math.round(((mrpPrice - sellingPrice) / mrpPrice) * 100)
    : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <Link href="/admin/products"
          className="flex h-9 w-9 items-center justify-center rounded-lg border hover:bg-gray-50">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Edit Product</h1>
          <p className="text-sm text-muted-foreground">Editing: {sample.name}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {/* Left – main info */}
          <div className="lg:col-span-2 space-y-5">
            {/* Basic Info */}
            <div className="rounded-xl border bg-white p-5 shadow-sm space-y-4">
              <h3 className="font-semibold text-gray-800">Basic Information</h3>
              <div>
                <label className="text-sm font-medium">Product Name *</label>
                <input {...register('name')}
                  className="mt-1 w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500" />
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Category *</label>
                  <select {...register('category')}
                    className="mt-1 w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Brand</label>
                  <input {...register('brand')}
                    className="mt-1 w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Description *</label>
                <textarea {...register('description')} rows={4}
                  className="mt-1 w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500 resize-none" />
                {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>}
              </div>
              <div>
                <label className="text-sm font-medium">Tags (comma separated)</label>
                <input {...register('tags')}
                  className="mt-1 w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500" />
              </div>
            </div>

            {/* Pricing */}
            <div className="rounded-xl border bg-white p-5 shadow-sm space-y-4">
              <h3 className="font-semibold text-gray-800">Pricing (in ₹ INR)</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">Selling Price (₹) *</label>
                  <input type="number" {...register('price')}
                    className="mt-1 w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500" />
                  {errors.price && <p className="mt-1 text-xs text-red-500">{errors.price.message}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium">MRP (₹) *</label>
                  <input type="number" {...register('mrp')}
                    className="mt-1 w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500" />
                  {errors.mrp && <p className="mt-1 text-xs text-red-500">{errors.mrp.message}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium">Discount</label>
                  <div className="mt-1 flex h-10 items-center justify-center rounded-lg border bg-gray-50 font-bold text-green-700">
                    {discount > 0 ? `${discount}% OFF` : '—'}
                  </div>
                </div>
              </div>
            </div>

            {/* Inventory */}
            <div className="rounded-xl border bg-white p-5 shadow-sm space-y-4">
              <h3 className="font-semibold text-gray-800">Inventory</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">SKU *</label>
                  <input {...register('sku')}
                    className="mt-1 w-full rounded-lg border px-3 py-2.5 text-sm uppercase outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div>
                  <label className="text-sm font-medium">Stock Quantity *</label>
                  <input type="number" {...register('stock')}
                    className="mt-1 w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Right – images + settings */}
          <div className="space-y-5">
            {/* Image Management */}
            <div className="rounded-xl border bg-white p-5 shadow-sm space-y-3">
              <h3 className="font-semibold text-gray-800">Product Images</h3>

              {/* Existing image */}
              {keepExisting && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Current Image</p>
                  <div className="relative inline-block">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={sample.existingImage} alt="" className="h-24 w-24 rounded-lg object-cover border" />
                    <button type="button" onClick={() => setKeepExisting(false)}
                      className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-white hover:bg-red-700">
                      <X className="h-3 w-3" />
                    </button>
                    <span className="absolute bottom-1 left-1 rounded bg-green-600 px-1 text-[9px] font-bold text-white">Main</span>
                  </div>
                </div>
              )}

              {/* Upload zone */}
              <div
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={e => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files); }}
                onClick={() => fileRef.current?.click()}
                className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-4 text-center transition-colors
                  ${dragging ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-green-400 hover:bg-green-50/50'}`}
              >
                <UploadCloud className="h-7 w-7 text-gray-400" />
                <p className="text-xs font-semibold text-gray-600">Add more images</p>
                <p className="text-[11px] text-muted-foreground">Drag & drop or click</p>
                <input ref={fileRef} type="file" accept="image/*" multiple className="hidden"
                  onChange={e => addFiles(e.target.files)} />
              </div>

              {/* New image previews */}
              {newImages.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">New Images ({newImages.length})</p>
                  <div className="grid grid-cols-3 gap-2">
                    {newImages.map((img, idx) => (
                      <div key={idx} className="relative rounded-lg overflow-hidden border aspect-square bg-gray-50">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img.preview} alt="" className="h-full w-full object-cover" />
                        <button type="button" onClick={() => removeNew(idx)}
                          className="absolute right-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-white hover:bg-red-700">
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    <button type="button" onClick={() => fileRef.current?.click()}
                      className="flex aspect-square items-center justify-center rounded-lg border-2 border-dashed border-gray-300 hover:border-green-400 hover:bg-green-50 transition-colors">
                      <Plus className="h-5 w-5 text-gray-400" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Settings */}
            <div className="rounded-xl border bg-white p-5 shadow-sm space-y-4">
              <h3 className="font-semibold text-gray-800">Settings</h3>
              <div>
                <label className="text-sm font-medium">Status *</label>
                <select {...register('status')}
                  className="mt-1 w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <label className="flex cursor-pointer items-center gap-3">
                <input type="checkbox" {...register('featured')} className="h-4 w-4 rounded accent-green-600" />
                <div>
                  <p className="text-sm font-medium">Featured Product</p>
                  <p className="text-xs text-muted-foreground">Show on homepage</p>
                </div>
              </label>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <button type="submit" disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 py-3 text-sm font-bold text-white hover:bg-green-700 disabled:opacity-60 transition-colors">
                {isSubmitting ? (
                  <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> Saving...</>
                ) : (
                  <><Save className="h-4 w-4" /> Update Product</>
                )}
              </button>
              <Link href="/admin/products"
                className="flex w-full items-center justify-center rounded-xl border py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors">
                Cancel
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
