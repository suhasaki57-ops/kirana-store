'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingCart, Star, Check } from 'lucide-react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addItem } from '@/store/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '@/store/slices/wishlistSlice';
import { RootState } from '@/store';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    slug: string;
    price: number;
    comparePrice?: number;
    images: Array<{ url: string; alt?: string }>;
    averageRating: number;
    numReviews: number;
    stock: number;
  };
}

function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 0,
  }).format(amount);
}

export function ProductCard({ product }: ProductCardProps) {
  const dispatch = useDispatch();
  const [added, setAdded] = useState(false);

  const wishlistIds = useSelector((s: RootState) => s.wishlist.productIds);
  const isWishlisted = wishlistIds.includes(product._id);

  const initialImage = product.images[0]?.url || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400';
  const [imgSrc, setImgSrc] = useState(initialImage);

  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock === 0) return;

    dispatch(addItem({
      id:           product._id,
      name:         product.name,
      price:        product.price,
      comparePrice: product.comparePrice,
      image:        imgSrc,
      slug:         product.slug,
    }));

    setAdded(true);
    toast.success(`${product.name.split(' ').slice(0, 3).join(' ')} added to cart!`, {
      icon: '🛒',
      style: { fontWeight: '600' },
    });
    setTimeout(() => setAdded(false), 2000);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isWishlisted) {
      dispatch(removeFromWishlist(product._id));
      toast('Removed from wishlist', { icon: '💔' });
    } else {
      dispatch(addToWishlist(product._id));
      toast.success('Added to wishlist!', { icon: '❤️' });
    }
  };

  return (
    <div className="group relative rounded-xl border bg-white p-3 shadow-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
      {/* Discount badge */}
      {discount > 0 && (
        <div className="absolute right-2 top-2 z-10 rounded-full bg-green-600 px-2 py-0.5 text-[10px] font-bold text-white shadow">
          {discount}% OFF
        </div>
      )}

      <Link href={`/products/${product.slug}`} className="block">
        {/* Product image */}
        <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-50">
          <Image
            src={imgSrc}
            alt={product.name}
            fill
            unoptimized={imgSrc.startsWith('data:') || imgSrc.startsWith('blob:')}
            onError={() => setImgSrc('https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400')}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        <div className="mt-3 px-1">
          {/* Name */}
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-gray-800 group-hover:text-green-700 transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="mt-1.5 flex items-center gap-1">
            <div className="flex items-center gap-0.5">
              {[1,2,3,4,5].map(i => (
                <Star key={i}
                  className={`h-3 w-3 ${i <= Math.round(product.averageRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200 fill-gray-200'}`}
                />
              ))}
            </div>
            <span className="text-xs font-medium text-gray-600">{product.averageRating}</span>
            <span className="text-xs text-gray-400">({product.numReviews})</span>
          </div>

          {/* Price */}
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-base font-bold text-green-700">{formatINR(product.price)}</span>
            {product.comparePrice && (
              <span className="text-xs text-gray-400 line-through">{formatINR(product.comparePrice)}</span>
            )}
          </div>

          {/* Stock */}
          {product.stock <= 10 && product.stock > 0 && (
            <p className="mt-1 text-xs font-medium text-orange-500">Only {product.stock} left!</p>
          )}
          {product.stock === 0 && (
            <p className="mt-1 text-xs font-bold text-red-500">Out of stock</p>
          )}
        </div>
      </Link>

      {/* Action buttons */}
      <div className="mt-3 flex gap-2 px-1">
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold text-white transition-all duration-200 active:scale-95
            ${added
              ? 'bg-green-700 scale-95'
              : product.stock === 0
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 hover:shadow-md'
            }`}
        >
          {added ? (
            <><Check className="h-3.5 w-3.5" /> Added!</>
          ) : (
            <><ShoppingCart className="h-3.5 w-3.5" /> Add to Cart</>
          )}
        </button>
        <button
          onClick={handleWishlist}
          className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-all duration-200 active:scale-95
            ${isWishlisted ? 'border-red-300 bg-red-50 text-red-500' : 'hover:border-red-300 hover:bg-red-50 hover:text-red-400'}`}
        >
          <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
        </button>
      </div>
    </div>
  );
}
