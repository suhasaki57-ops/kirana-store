'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { UploadCloud, X, ImageIcon, ArrowLeft, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { addProduct } from '@/store/slices/productsAdminSlice';

const schema = z.object({
  name:        z.string().min(3, 'Product name is required'),
  category:    z.string().min(1, 'Please select a category'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price:       z.coerce.number().min(1, 'Selling price is required'),
  mrp:         z.coerce.number().min(1, 'MRP is required'),
  stock:       z.coerce.number().min(0, 'Stock cannot be negative'),
  sku:         z.string().min(2, 'SKU is required'),
  brand:       z.string().optional(),
  tags:        z.string().optional(),
  status:      z.enum(['active', 'inactive']),
  featured:    z.boolean().optional(),
});

type FormData = z.infer<typeof schema>;

const CATEGORIES = [
  'Grains & Pulses', 'Spices & Masala', 'Oils & Ghee',
  'Cleaning & Home', 'Personal Care', 'Snacks & Beverages',
];

interface ImagePreview { file: File; preview: string; }

export default function AddProductPage() {
  const router   = useRouter();
  const dispatch = useDispatch();
  const fileRef  = useRef<HTMLInputElement>(null);
  const [images,   setImages]   = useState<ImagePreview[]>([]);
  const [dragging, setDragging] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting }, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { status: 'active', featured: false },
  });

  const addFiles = (files: FileList | null) => {
    if (!files) return;
    setImages(p => [
      ...p,
      ...Array.from(files).map(f => ({ file: f, preview: URL.createObjectURL(f) })),
    ]);
  };

  const removeImage = (idx: number) => {
    URL.revokeObjectURL(images[idx].preview);
    setImages(p => p.filter((_, i) => i !== idx));
  };

  const onSubmit = async (data: FormData) => {
    await new Promise(r => setTimeout(r, 400));

    // Save to Redux + localStorage so it appears in the products list immediately
    dispatch(addProduct({
      name:        data.name,
      category:    data.category,
      price:       data.price,
      mrp:         data.mrp,
      stock:       data.stock,
      sku:         data.sku.toUpperCase(),
      brand:       data.brand || '',
      tags:        data.tags || '',
      description: data.description,
      status:      data.status,
      featured:    data.featured ?? false,
      image:       images[0]?.preview ||
        'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=80',
    }));

    toast.success(`"${data.name}" added to the store!`, { icon: '✅' });
    router.push('/admin/products');
  };

  const sellingPrice = watch('price');
  const mrpPrice     = watch('mrp');
  const discount =
    sellingPrice && mrpPrice && mrpPrice > sellingPrice
      ? Math.round(((mrpPrice - sellingPrice) / mrpPrice) * 100)
      : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Page header */}
      <div className="flex items-center gap-3">
        <Link href="/admin/products"
          className="flex h-9 w-9 items-center justify-center rounded-lg border hover:bg-gray-50 transition-colors">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Add New Product</h1>
          <p className="text-sm text-muted-foreground">Fill in the details to add a new grocery product</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">

          {/* ── Left – main info ────────────────────── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Basic Info */}
            <div className="rounded-xl border bg-white p-5 shadow-sm space-y-4">
              <h3 className="font-semibold text-gray-800">Basic Information</h3>
              <div>
                <label className="text-sm font-medium">Product Name *</label>
                <input {...register('name')} placeholder="e.g. Amul Pure Ghee 500ml"
                  className="mt-1 w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500" />
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Category *</label>
                  <select {...register('category')}
                    className="mt-1 w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500">
                    <option value="">Select category</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category.message}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium">Brand</label>
                  <input {...register('brand')} placeholder="e.g. Amul, MDH, Tata"
                    className="mt-1 w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Description *</label>
                <textarea {...register('description')} rows={4}
                  placeholder="Describe the product — ingredients, usage, benefits..."
                  className="mt-1 w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500 resize-none" />
                {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>}
              </div>
              <div>
                <label className="text-sm font-medium">Tags (comma separated)</label>
                <input {...register('tags')} placeholder="rice, basmati, grains"
                  className="mt-1 w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500" />
              </div>
            </div>

            {/* Pricing */}
            <div className="rounded-xl border bg-white p-5 shadow-sm space-y-4">
              <h3 className="font-semibold text-gray-800">Pricing (in ₹ INR)</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">Selling Price (₹) *</label>
                  <input type="number" {...register('price')} placeholder="499"
                    className="mt-1 w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500" />
                  {errors.price && <p className="mt-1 text-xs text-red-500">{errors.price.message}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium">MRP (₹) *</label>
                  <input type="number" {...register('mrp')} placeholder="580"
                    className="mt-1 w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500" />
                  {errors.mrp && <p className="mt-1 text-xs text-red-500">{errors.mrp.message}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium">Discount</label>
                  <div className={`mt-1 flex h-10 items-center justify-center rounded-lg border font-bold transition-colors
                    ${discount > 0 ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-400'}`}>
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
                  <input {...register('sku')} placeholder="RICE-001"
                    className="mt-1 w-full rounded-lg border px-3 py-2.5 text-sm uppercase outline-none focus:ring-2 focus:ring-green-500" />
                  {errors.sku && <p className="mt-1 text-xs text-red-500">{errors.sku.message}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium">Stock Quantity *</label>
                  <input type="number" {...register('stock')} placeholder="100"
                    className="mt-1 w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500" />
                  {errors.stock && <p className="mt-1 text-xs text-red-500">{errors.stock.message}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* ── Right – images + settings ────────────── */}
          <div className="space-y-5">

            {/* Image Upload */}
            <div className="rounded-xl border bg-white p-5 shadow-sm space-y-3">
              <h3 className="font-semibold text-gray-800">Product Images</h3>

              <div
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={e => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files); }}
                onClick={() => fileRef.current?.click()}
                className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-6 text-center transition-colors
                  ${dragging ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-green-400 hover:bg-green-50/50'}`}
              >
                <UploadCloud className={`h-8 w-8 ${dragging ? 'text-green-600' : 'text-gray-400'}`} />
                <p className="text-xs font-semibold text-gray-600">Drag &amp; drop images here</p>
                <p className="text-xs text-muted-foreground">or click to browse</p>
                <span className="rounded-md bg-green-600 px-3 py-1 text-xs font-semibold text-white">
                  Choose Files
                </span>
                <input ref={fileRef} type="file" accept="image/*" multiple className="hidden"
                  onChange={e => addFiles(e.target.files)} />
              </div>

              {images.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative rounded-lg overflow-hidden border aspect-square bg-gray-50">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img.preview} alt="" className="h-full w-full object-cover" />
                      <button type="button"
                        onClick={e => { e.stopPropagation(); removeImage(idx); }}
                        className="absolute right-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-white hover:bg-red-700">
                        <X className="h-3 w-3" />
                      </button>
                      {idx === 0 && (
                        <span className="absolute bottom-0.5 left-0.5 rounded bg-green-600 px-1 text-[9px] font-bold text-white">Main</span>
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={() => fileRef.current?.click()}
                    className="flex aspect-square items-center justify-center rounded-lg border-2 border-dashed border-gray-300 hover:border-green-400 hover:bg-green-50 transition-colors">
                    <Plus className="h-5 w-5 text-gray-400" />
                  </button>
                </div>
              )}

              {images.length === 0 && (
                <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-xs text-muted-foreground">
                  <ImageIcon className="h-4 w-4" /> No images selected yet
                </div>
              )}
            </div>

            {/* Status & Settings */}
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

            {/* Submit */}
            <div className="space-y-2">
              <button type="submit" disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 py-3 text-sm font-bold text-white hover:bg-green-700 disabled:opacity-60 transition-all active:scale-95">
                {isSubmitting ? (
                  <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> Adding Product...</>
                ) : (
                  <><Plus className="h-4 w-4" /> Add Product to Store</>
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
