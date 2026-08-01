'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { addItem } from '@/store/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '@/store/slices/wishlistSlice';
import {
  Star, ShoppingCart, Heart, Plus, Minus, ArrowLeft, CheckCircle,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

export interface ProductDetail {
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
  images: Array<{ url: string; alt?: string }>;
  description: string;
  specs: Record<string, string>;
}

const STATIC_CATALOG: ProductDetail[] = [
  {
    id: '1',
    name: 'India Gate Basmati Rice 5kg',
    slug: 'india-gate-basmati-rice-5kg',
    price: 499,
    mrp: 580,
    rating: 4.7,
    reviewCount: 540,
    stock: 200,
    brand: 'India Gate',
    category: 'Grains & Pulses',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format',
    images: [{ url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format' }],
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
  {
    id: '2',
    name: 'Aashirvaad Whole Wheat Atta 10kg',
    slug: 'aashirvaad-whole-wheat-atta-10kg',
    price: 380,
    mrp: 420,
    rating: 4.6,
    reviewCount: 820,
    stock: 150,
    brand: 'Aashirvaad',
    category: 'Grains & Pulses',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format',
    images: [{ url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format' }],
    description:
      'Chakki fresh atta made from 100% whole wheat grains. Rich in fibre and natural nutrients, ensuring soft, fluffy rotis every time. Sourced directly from Indian farmers.',
    specs: {
      Weight: '10 kg',
      Brand: 'Aashirvaad',
      Type: 'Whole Wheat Atta',
      'Country of Origin': 'India',
      'Shelf Life': '9 months',
      Packaging: 'Sealed Bag',
    },
  },
  {
    id: '3',
    name: 'Toor Dal (Arhar) 1kg',
    slug: 'toor-dal-arhar-1kg',
    price: 145,
    mrp: 165,
    rating: 4.4,
    reviewCount: 310,
    stock: 300,
    brand: 'Tata Sampann',
    category: 'Grains & Pulses',
    image: 'https://images.unsplash.com/photo-1585564318861-8fbf37600c22?w=600&auto=format',
    images: [{ url: 'https://images.unsplash.com/photo-1585564318861-8fbf37600c22?w=600&auto=format' }],
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
  {
    id: '4',
    name: 'Sugar (Chini) 1kg - Refined',
    slug: 'sugar-chini-1kg-refined',
    price: 52,
    mrp: 60,
    rating: 4.3,
    reviewCount: 215,
    stock: 500,
    brand: 'Madhur',
    category: 'Grains & Pulses',
    image: 'https://images.unsplash.com/photo-1559561853-08451507cbe7?w=600&auto=format',
    images: [{ url: 'https://images.unsplash.com/photo-1559561853-08451507cbe7?w=600&auto=format' }],
    description:
      'Pure, sparkling white refined sugar crystals. Hygienically packed and free from impurities. Essential for tea, coffee, sweets, and everyday baking.',
    specs: {
      Weight: '1 kg',
      Brand: 'Madhur',
      Type: 'Refined Sugar',
      'Country of Origin': 'India',
      'Shelf Life': '24 months',
      Packaging: 'Sealed Pouch',
    },
  },
  {
    id: '5',
    name: 'Tata Salt Iodised 1kg',
    slug: 'tata-salt-iodised-1kg',
    price: 28,
    mrp: 32,
    rating: 4.8,
    reviewCount: 1020,
    stock: 800,
    brand: 'Tata',
    category: 'Grains & Pulses',
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600&auto=format',
    images: [{ url: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600&auto=format' }],
    description:
      "India's trusted vacuum evaporated iodised salt. Provides requisite iodine for healthy mental development. Ensures optimal taste in all daily cooking.",
    specs: {
      Weight: '1 kg',
      Brand: 'Tata',
      Type: 'Vacuum Evaporated Salt',
      'Iodine Content': '15 ppm min',
      'Country of Origin': 'India',
      'Shelf Life': '24 months',
      Packaging: 'Moisture-proof Pouch',
    },
  },
  {
    id: '6',
    name: 'MDH Chana Masala 100g',
    slug: 'mdh-chana-masala-100g',
    price: 55,
    mrp: 65,
    rating: 4.6,
    reviewCount: 680,
    stock: 400,
    brand: 'MDH',
    category: 'Spices & Masala',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&auto=format',
    images: [{ url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&auto=format' }],
    description:
      'Authentic MDH spice blend formulated specifically for rich, aromatic chickpea curry (Chole/Chana Masala). Made from premium sun-dried spices.',
    specs: {
      Weight: '100 g',
      Brand: 'MDH',
      Type: 'Spice Mix',
      'Country of Origin': 'India',
      'Shelf Life': '12 months',
      Packaging: 'Box Pack',
    },
  },
  {
    id: '7',
    name: 'Everest Turmeric Powder 200g',
    slug: 'everest-turmeric-haldi-powder-200g',
    price: 48,
    mrp: 58,
    rating: 4.5,
    reviewCount: 445,
    stock: 350,
    brand: 'Everest',
    category: 'Spices & Masala',
    image: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=600&auto=format',
    images: [{ url: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=600&auto=format' }],
    description:
      'Pure ground turmeric (Haldi) with rich natural golden color and high curcumin content. Adds rich color, distinct aroma, and health benefits to food.',
    specs: {
      Weight: '200 g',
      Brand: 'Everest',
      Type: 'Pure Turmeric Powder',
      'Country of Origin': 'India',
      'Shelf Life': '12 months',
      Packaging: 'Sealed Pack',
    },
  },
  {
    id: '8',
    name: 'Fortune Sunflower Oil 1 Litre',
    slug: 'fortune-sunflower-oil-1-litre',
    price: 142,
    mrp: 168,
    rating: 4.4,
    reviewCount: 320,
    stock: 250,
    brand: 'Fortune',
    category: 'Oils & Ghee',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format',
    images: [{ url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format' }],
    description:
      'Fortune Sunflower Oil is light, with a mild flavour and high smoke point, making it ideal for deep frying, sautéing and everyday cooking. Rich in Vitamin E and low in saturated fats.',
    specs: {
      Volume: '1 Litre',
      Brand: 'Fortune',
      Type: 'Refined Sunflower Oil',
      'Smoke Point': '232°C',
      'Country of Origin': 'India',
      'Shelf Life': '12 months',
      Packaging: 'PET Bottle / Pouch',
    },
  },
  {
    id: '9',
    name: 'Amul Pure Ghee 500ml',
    slug: 'amul-pure-ghee-500ml',
    price: 295,
    mrp: 340,
    rating: 4.8,
    reviewCount: 910,
    stock: 180,
    brand: 'Amul',
    category: 'Oils & Ghee',
    image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=600&auto=format',
    images: [{ url: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=600&auto=format' }],
    description:
      'Made from pure milk fat, Amul Ghee delivers rich aroma and granular texture. Essential for sweet dishes, dal tadka, parathas, and traditional Indian recipes.',
    specs: {
      Volume: '500 ml',
      Brand: 'Amul',
      Type: 'Pure Milk Ghee',
      'Fat Content': '99.7%',
      'Country of Origin': 'India',
      'Shelf Life': '12 months',
      Packaging: 'Carton/Pouch',
    },
  },
  {
    id: '10',
    name: 'Surf Excel Easy Wash 1kg',
    slug: 'surf-excel-easy-wash-detergent-1kg',
    price: 138,
    mrp: 160,
    rating: 4.6,
    reviewCount: 750,
    stock: 300,
    brand: 'Surf Excel',
    category: 'Cleaning & Home',
    image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=600&auto=format',
    images: [{ url: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=600&auto=format' }],
    description:
      'Surf Excel Easy Wash detergent powder dissolves quickly in water and removes tough stains like mud, ink, and oil effortlessly without damaging fabric.',
    specs: {
      Weight: '1 kg',
      Brand: 'Surf Excel',
      Type: 'Detergent Powder',
      'Country of Origin': 'India',
      'Shelf Life': '24 months',
      Packaging: 'Poly Bag',
    },
  },
  {
    id: '11',
    name: 'Vim Dishwash Bar (Pack of 3)',
    slug: 'vim-dishwash-bar-200g-pack-of-3',
    price: 75,
    mrp: 90,
    rating: 4.4,
    reviewCount: 560,
    stock: 400,
    brand: 'Vim',
    category: 'Cleaning & Home',
    image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&auto=format',
    images: [{ url: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&auto=format' }],
    description:
      'Vim Dishwash Bar with power of 100 lemons. Effectively removes tough grease from utensils leaving them sparkling clean and fresh smelling.',
    specs: {
      Weight: '600 g (3 x 200g)',
      Brand: 'Vim',
      Type: 'Dishwash Bar',
      'Country of Origin': 'India',
      'Shelf Life': '24 months',
    },
  },
  {
    id: '12',
    name: 'Phenyl Floor Cleaner 1L',
    slug: 'phenyl-floor-cleaner-1-litre',
    price: 89,
    mrp: 110,
    rating: 4.3,
    reviewCount: 290,
    stock: 200,
    brand: 'Lizol',
    category: 'Cleaning & Home',
    image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=600&auto=format',
    images: [{ url: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=600&auto=format' }],
    description:
      'Disinfectant floor cleaner kills 99.9% of germs while removing tough stains and leaving a long-lasting pleasant fragrance.',
    specs: {
      Volume: '1 Litre',
      Brand: 'Lizol',
      Type: 'Liquid Disinfectant',
      'Country of Origin': 'India',
      'Shelf Life': '24 months',
    },
  },
  {
    id: '13',
    name: 'Lifebuoy Total Soap (Pack of 4)',
    slug: 'lifebuoy-total-soap-100g-pack-of-4',
    price: 96,
    mrp: 112,
    rating: 4.5,
    reviewCount: 880,
    stock: 500,
    brand: 'Lifebuoy',
    category: 'Personal Care',
    image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&auto=format',
    images: [{ url: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&auto=format' }],
    description:
      'Lifebuoy Total 10 Antibacterial Soap provides 100% stronger germ protection. Formula enriched with Activ Silver for complete skin protection.',
    specs: {
      Weight: '400 g (4 x 100g)',
      Brand: 'Lifebuoy',
      Type: 'Bathing Soap',
      'Country of Origin': 'India',
      'Shelf Life': '36 months',
    },
  },
  {
    id: '14',
    name: 'Colgate Strong Teeth 200g',
    slug: 'colgate-strong-teeth-toothpaste-200g',
    price: 118,
    mrp: 135,
    rating: 4.6,
    reviewCount: 1100,
    stock: 350,
    brand: 'Colgate',
    category: 'Personal Care',
    image: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=600&auto=format',
    images: [{ url: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=600&auto=format' }],
    description:
      'Colgate Strong Teeth toothpaste with Amino Power technology adds natural calcium to teeth, making them 2X stronger and protected against cavities.',
    specs: {
      Weight: '200 g',
      Brand: 'Colgate',
      Type: 'Toothpaste',
      'Country of Origin': 'India',
      'Shelf Life': '24 months',
    },
  },
  {
    id: '15',
    name: 'Tata Chai Premium Tea 500g',
    slug: 'tata-chai-premium-tea-500g',
    price: 235,
    mrp: 270,
    rating: 4.7,
    reviewCount: 720,
    stock: 280,
    brand: 'Tata Tea',
    category: 'Snacks & Beverages',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format',
    images: [{ url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format' }],
    description:
      'Tata Tea Premium blend of big and small tea leaves from Assam. Delivers rich aroma, strong taste, and deep color in every cup of chai.',
    specs: {
      Weight: '500 g',
      Brand: 'Tata Tea',
      Type: 'Black Tea',
      'Country of Origin': 'India',
      'Shelf Life': '12 months',
    },
  },
  {
    id: '16',
    name: 'Parle-G Glucose Biscuits 1kg',
    slug: 'parle-g-original-glucose-biscuits-1kg',
    price: 85,
    mrp: 100,
    rating: 4.8,
    reviewCount: 1540,
    stock: 600,
    brand: 'Parle',
    category: 'Snacks & Beverages',
    image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&auto=format',
    images: [{ url: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&auto=format' }],
    description:
      "India's favorite biscuit packed with goodness of wheat and milk. Crispy, delicious energy snack perfect with morning and evening tea.",
    specs: {
      Weight: '1 kg',
      Brand: 'Parle',
      Type: 'Glucose Biscuits',
      'Country of Origin': 'India',
      'Shelf Life': '9 months',
    },
  },
];

function generateSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default function ProductDetailPage() {
  const dispatch = useDispatch();
  const params = useParams();
  const rawParam = Array.isArray(params.slug) ? params.slug[0] : (params.slug || '');
  const slugParam = decodeURIComponent(rawParam);

  const { products: storeProducts } = useSelector((s: RootState) => s.productsAdmin);
  const wishlistIds = useSelector((s: RootState) => s.wishlist.productIds);

  const product = useMemo<ProductDetail>(() => {
    // 1. Gather store / localStorage products
    let adminList: any[] = storeProducts;
    if (typeof window !== 'undefined' && (!adminList || adminList.length === 0)) {
      try {
        const stored = localStorage.getItem('kirana_admin_products');
        if (stored) adminList = JSON.parse(stored);
      } catch {}
    }

    const normSlug = slugParam.toLowerCase();

    // Try matching in Admin / Redux Store list first
    if (adminList && adminList.length > 0) {
      const foundAdmin = adminList.find((p: any) => {
        const pId = String(p.id || p._id || '').toLowerCase();
        const pSlug = String(p.slug || generateSlug(p.name || '')).toLowerCase();
        const pNameSlug = generateSlug(p.name || '');
        return pId === normSlug || pSlug === normSlug || pNameSlug === normSlug || normSlug.includes(pNameSlug) || pNameSlug.includes(normSlug);
      });

      if (foundAdmin) {
        const imgUrl = foundAdmin.image || (foundAdmin.images && foundAdmin.images[0]?.url) || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format';
        return {
          id: String(foundAdmin.id || foundAdmin._id),
          name: foundAdmin.name,
          slug: foundAdmin.slug || generateSlug(foundAdmin.name),
          price: Number(foundAdmin.price),
          mrp: Number(foundAdmin.mrp || foundAdmin.comparePrice || Math.round(foundAdmin.price * 1.15)),
          rating: Number(foundAdmin.rating || foundAdmin.averageRating || 4.5),
          reviewCount: Number(foundAdmin.reviewCount || foundAdmin.numReviews || 64),
          stock: Number(foundAdmin.stock ?? 100),
          brand: foundAdmin.brand || foundAdmin.name.split(' ')[0] || 'Kirana',
          category: foundAdmin.category || 'Grocery',
          image: imgUrl,
          images: foundAdmin.images && foundAdmin.images.length > 0 ? foundAdmin.images : [{ url: imgUrl }],
          description: foundAdmin.description || `High-quality ${foundAdmin.name} sourced directly from verified suppliers. Best for daily kitchen and home usage.`,
          specs: {
            Brand: foundAdmin.brand || foundAdmin.name.split(' ')[0] || 'Kirana',
            Category: foundAdmin.category || 'Grocery',
            'Country of Origin': 'India',
            'Shelf Life': '12 months',
            Packaging: 'Sealed Pack',
          },
        };
      }
    }

    // 2. Try matching in Static Catalog
    const foundStatic = STATIC_CATALOG.find((p) => {
      const pId = p.id.toLowerCase();
      const pSlug = p.slug.toLowerCase();
      const pNameSlug = generateSlug(p.name);
      return pId === normSlug || pSlug === normSlug || pNameSlug === normSlug || normSlug.includes(pNameSlug) || pNameSlug.includes(normSlug);
    });

    if (foundStatic) {
      return foundStatic;
    }

    // 3. Fallback: Generate dynamic product details using the slug string
    const titleName = slugParam
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());

    return {
      id: slugParam || '99',
      name: titleName || 'Premium Grocery Product',
      slug: slugParam,
      price: 199,
      mrp: 249,
      rating: 4.5,
      reviewCount: 48,
      stock: 50,
      brand: titleName.split(' ')[0] || 'Kirana',
      category: 'Grocery & Staples',
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format',
      images: [{ url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format' }],
      description: `High-quality ${titleName || 'grocery product'} sourced directly from trusted local suppliers. Essential item for your daily kitchen needs.`,
      specs: {
        Brand: titleName.split(' ')[0] || 'Kirana',
        Category: 'Grocery & Staples',
        'Country of Origin': 'India',
        'Shelf Life': '12 months',
        Packaging: 'Sealed Pack',
      },
    };
  }, [slugParam, storeProducts]);

  const [quantity, setQuantity] = useState(1);
  const isWishlisted = wishlistIds.includes(product.id);

  const discount = Math.max(0, Math.round(((product.mrp - product.price) / product.mrp) * 100));
  const inStock = product.stock > 0;

  const handleAddToCart = () => {
    if (!inStock) return;
    for (let i = 0; i < quantity; i++) {
      dispatch(addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        comparePrice: product.mrp,
        image: product.image,
        slug: product.slug,
      }));
    }
    toast.success(`${quantity} x ${product.name} added to cart!`, { icon: '🛒' });
  };

  const handleWishlist = () => {
    if (isWishlisted) {
      dispatch(removeFromWishlist(product.id));
      toast('Removed from wishlist', { icon: '💔' });
    } else {
      dispatch(addToWishlist(product.id));
      toast.success('Added to wishlist!', { icon: '❤️' });
    }
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
            <span className="text-gray-700 font-medium">{product.name}</span>
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
                <div className="absolute top-3 right-3 bg-green-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
                  {discount}% OFF
                </div>
              )}
            </div>

            {/* Details */}
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-xs text-green-700 font-bold uppercase tracking-wide">{product.category}</p>
                <h1 className="text-2xl font-bold text-gray-900 mt-1">{product.name}</h1>
                <p className="text-sm text-muted-foreground mt-1">Brand: <span className="font-semibold text-gray-800">{product.brand}</span></p>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5">{renderStars(product.rating)}</div>
                <span className="text-sm font-bold">{product.rating}</span>
                <span className="text-sm text-muted-foreground">({product.reviewCount} reviews)</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-green-700">{formatPrice(product.price)}</span>
                {discount > 0 && (
                  <>
                    <span className="text-lg text-muted-foreground line-through">{formatPrice(product.mrp)}</span>
                    <span className="text-sm font-bold text-green-600">{discount}% off</span>
                  </>
                )}
              </div>

              {/* Stock */}
              <div className="flex items-center gap-2">
                {inStock ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-semibold text-green-700">
                      In Stock {product.stock <= 20 && `(Only ${product.stock} left)`}
                    </span>
                  </>
                ) : (
                  <span className="inline-block rounded-full bg-red-100 text-red-700 text-xs font-bold px-3 py-1">
                    Out of Stock
                  </span>
                )}
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">Qty:</span>
                <div className="flex items-center border rounded-lg overflow-hidden bg-white shadow-sm">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-2 hover:bg-gray-100 transition-colors"
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-10 text-center text-sm font-bold">{quantity}</span>
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
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-bold text-white hover:bg-green-700 disabled:opacity-50 transition-colors shadow-sm active:scale-98"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Add to Cart
                </button>
                <button
                  onClick={handleWishlist}
                  className={`inline-flex items-center justify-center rounded-xl border px-4 py-3 transition-colors ${isWishlisted ? 'bg-red-50 border-red-300 text-red-600' : 'hover:bg-gray-50'}`}
                >
                  <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mt-10 bg-white rounded-xl border p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-3">Product Description</h2>
            <p className="text-sm text-gray-700 leading-relaxed">{product.description}</p>
          </div>

          {/* Specifications */}
          <div className="mt-6 bg-white rounded-xl border p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Specifications</h2>
            <table className="w-full text-sm">
              <tbody>
                {Object.entries(product.specs).map(([key, value], i) => (
                  <tr key={key} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="py-2.5 px-4 font-semibold text-gray-600 w-1/3 border-b border-gray-100">{key}</td>
                    <td className="py-2.5 px-4 text-gray-800 border-b border-gray-100">{value}</td>
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

