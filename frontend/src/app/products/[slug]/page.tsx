'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Star, ShoppingCart, Heart, Plus, Minus, ArrowLeft, CheckCircle,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

const productData: Record<string, {
  id: string;
  name: string;
  slug: string;
  price: number;
  mrp: number;
  rating: number;
  reviewCount: number;
  stock: number;
  brand: string;
  category: string;
  image: string;
  description: string;
  specs: Record<string, string>;
}> = {
  'basmati-rice-5kg': {
    id: '1',
    name: 'Basmati Rice 5kg',
    slug: 'basmati-rice-5kg',
    price: 399,
    mrp: 499,
    rating: 4.5,
    reviewCount: 312,
    stock: 45,
    brand: 'India Gate',
    category: 'Grains & Pulses',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format',
    description:
      'Premium aged Basmati rice with long grains and a delicate aroma. Ideal for biryani, pulao, and everyday meals. Each grain cooks perfectly separate for a fluffy texture. Sourced from the fertile fields of Punjab and Haryana.',
    specs: {
      Weight: '5 kg',
      Brand: 'India Gate',
      Type: 'Basmati Rice',
      'Grain Length': 'Extra Long',
      'Country of Origin': 'India',
      'Shelf Life': '24 months',
      Packaging: 'Sealed Bag',
    },
  },
  'toor-dal-1kg': {
    id: '2',
    name: 'Toor Dal 1kg',
    slug: 'toor-dal-1kg',
    price: 129,
    mrp: 160,
    rating: 4.3,
    reviewCount: 198,
    stock: 60,
    brand: 'Tata Sampann',
    category: 'Grains & Pulses',
    image: 'https://images.unsplash.com/photo-1585564318861-8fbf37600c22?w=600&auto=format',
    description:
      'High-quality Toor Dal (Split Pigeon Peas) that cooks quickly and is rich in protein and fibre. Perfect for everyday dal tadka and sambhar. Carefully cleaned and processed to retain natural nutrients.',
    specs: {
      Weight: '1 kg',
      Brand: 'Tata Sampann',
      Type: 'Toor Dal',
      Protein: '22g per 100g',
      'Country of Origin': 'India',
      'Shelf Life': '12 months',
      Packaging: 'Zip-lock Pouch',
    },
  },
  'sunflower-oil-1l': {
    id: '3',
    name: 'Sunflower Oil 1 Litre',
    slug: 'sunflower-oil-1l',
    price: 149,
    mrp: 185,
    rating: 4.2,
    reviewCount: 245,
    stock: 80,
    brand: 'Saffola',
    category: 'Oils & Ghee',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format',
    description:
      'Saffola Sunflower Oil is light, with a mild flavour and high smoke point, making it ideal for deep frying, sautéing and everyday cooking. Rich in Vitamin E and low in saturated fats.',
    specs: {
      Volume: '1 Litre',
      Brand: 'Saffola',
      Type: 'Refined Sunflower Oil',
      'Smoke Point': '232°C',
      'Country of Origin': 'India',
      'Shelf Life': '18 months',
      Packaging: 'PET Bottle',
    },
  },
};

const defaultProduct = {
  id: '99',
  name: 'Premium Grocery Product',
  slug: 'default',
  price: 199,
  mrp: 249,
  rating: 4.0,
  reviewCount: 87,
  stock: 20,
  brand: 'Generic',
  category: 'Grocery',
  image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format',
  description: 'High-quality grocery product sourced directly from trusted suppliers. Best for daily kitchen use.',
  specs: {
    Weight: 'Standard',
    Brand: 'Generic',
    'Country of Origin': 'India',
    'Shelf Life': '12 months',
  },
};

export default function ProductDetailPage() {
  const params = useParams();
  const slug = typeof params.slug === 'string' ? params.slug : '';
  const product = productData[slug] ?? { ...defaultProduct, name: slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()), slug };

  const [quantity, setQuantity] = useState(1);
  const [inWishlist, setInWishlist] = useState(false);

  const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);
  const inStock = product.stock > 0;

  const handleAddToCart = () => {
    toast.success(`${product.name} added to cart`);
  };

  const handleWishlist = () => {
    setInWishlist((prev) => !prev);
    toast.success(inWishlist ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1">
        <div className="container max-w-6xl mx-auto px-4 py-6">
          {/* Back link */}
          <Link href="/products" className="inline-flex items-center gap-1 text-sm text-green-700 hover:underline mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Products
          </Link>

          {/* Breadcrumb */}
          <nav className="flex items-center gap-1 text-xs text-muted-foreground mb-6">
            <Link href="/" className="hover:text-green-700">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-green-700">Products</Link>
            <span>/</span>
            <span className="text-gray-700">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Image */}
            <div className="relative aspect-square rounded-xl overflow-hidden bg-white border shadow-sm">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                unoptimized
              />
              {discount > 0 && (
                <div className="absolute top-3 right-3 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {discount}% OFF
                </div>
              )}
            </div>

            {/* Details */}
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-xs text-green-700 font-medium uppercase tracking-wide">{product.category}</p>
                <h1 className="text-2xl font-bold text-gray-900 mt-1">{product.name}</h1>
                <p className="text-sm text-muted-foreground mt-1">Brand: <span className="font-medium text-gray-700">{product.brand}</span></p>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5">{renderStars(product.rating)}</div>
                <span className="text-sm font-semibold">{product.rating}</span>
                <span className="text-sm text-muted-foreground">({product.reviewCount} reviews)</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-green-700">{formatPrice(product.price)}</span>
                {discount > 0 && (
                  <>
                    <span className="text-lg text-muted-foreground line-through">{formatPrice(product.mrp)}</span>
                    <span className="text-sm font-semibold text-green-600">{discount}% off</span>
                  </>
                )}
              </div>

              {/* Stock */}
              <div className="flex items-center gap-2">
                {inStock ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-700">
                      In Stock {product.stock <= 10 && `(Only ${product.stock} left)`}
                    </span>
                  </>
                ) : (
                  <span className="inline-block rounded-full bg-red-100 text-red-700 text-xs font-semibold px-3 py-1">
                    Out of Stock
                  </span>
                )}
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">Qty:</span>
                <div className="flex items-center border rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-2 hover:bg-gray-100 transition-colors"
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-10 text-center text-sm font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    className="p-2 hover:bg-gray-100 transition-colors"
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={!inStock}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-5 py-3 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50 transition-colors"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Add to Cart
                </button>
                <button
                  onClick={handleWishlist}
                  className={`inline-flex items-center justify-center rounded-lg border px-4 py-3 transition-colors ${inWishlist ? 'bg-red-50 border-red-300 text-red-600' : 'hover:bg-gray-50'}`}
                >
                  <Heart className={`h-5 w-5 ${inWishlist ? 'fill-red-500 text-red-500' : ''}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mt-10 bg-white rounded-xl border p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-3">Product Description</h2>
            <p className="text-sm text-gray-700 leading-relaxed">{product.description}</p>
          </div>

          {/* Specifications */}
          <div className="mt-6 bg-white rounded-xl border p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-4">Specifications</h2>
            <table className="w-full text-sm">
              <tbody>
                {Object.entries(product.specs).map(([key, value], i) => (
                  <tr key={key} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="py-2 px-4 font-medium text-gray-600 w-1/3">{key}</td>
                    <td className="py-2 px-4 text-gray-800">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
