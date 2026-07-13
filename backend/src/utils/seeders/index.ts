import 'dotenv/config';
import connectDB from '../../config/database';
import User from '../../models/User.model';
import Product from '../../models/Product.model';
import Category from '../../models/Category.model';
import Coupon from '../../models/Coupon.model';
import Banner from '../../models/Banner.model';
import logger from '../logger';
import { UserRole, CouponType } from '../../types';
import mongoose from 'mongoose';

const seedData = async () => {
  try {
    await connectDB();
    logger.info('🌱 Seeding started...');

    await Promise.all([
      User.deleteMany({}),
      Product.deleteMany({}),
      Category.deleteMany({}),
      Coupon.deleteMany({}),
      Banner.deleteMany({}),
    ]);
    logger.info('✅ Cleared existing data');

    // ── Users ────────────────────────────────────────────────────────────────
    const admin = await User.create({
      name: 'Admin',
      email: process.env.ADMIN_EMAIL || 'admin@kiranastore.com',
      password: process.env.ADMIN_PASSWORD || 'Admin@123456',
      role: UserRole.ADMIN,
      isEmailVerified: true,
    });

    await User.create({
      name: 'Ramesh Kumar',
      email: 'user@test.com',
      password: 'User@123456',
      role: UserRole.USER,
      isEmailVerified: true,
    });

    logger.info(`✅ Users created (admin: ${admin.email})`);

    // ── Kirana Categories ────────────────────────────────────────────────────
    const grains    = await Category.create({ name: 'Grains & Pulses',   slug: 'grains-pulses',   description: 'Rice, wheat, dal, atta and more', isActive: true, order: 1 });
    const spices    = await Category.create({ name: 'Spices & Masala',   slug: 'spices-masala',   description: 'All Indian spices and masalas',    isActive: true, order: 2 });
    const oils      = await Category.create({ name: 'Oils & Ghee',       slug: 'oils-ghee',       description: 'Cooking oils, ghee and vanaspati', isActive: true, order: 3 });
    const cleaning  = await Category.create({ name: 'Cleaning & Home',   slug: 'cleaning-home',   description: 'Detergents, soaps and cleaners',   isActive: true, order: 4 });
    const personal  = await Category.create({ name: 'Personal Care',     slug: 'personal-care',   description: 'Soaps, shampoo and hygiene items', isActive: true, order: 5 });
    const snacks    = await Category.create({ name: 'Snacks & Beverages',slug: 'snacks-beverages','description': 'Biscuits, tea, coffee and drinks', isActive: true, order: 6 });

    logger.info('✅ 6 kirana categories created');

    // ── Products (all prices in INR ₹) ──────────────────────────────────────
    const productDefs = [
      // Grains & Pulses
      {
        name: 'India Gate Basmati Rice 5kg',
        slug: 'india-gate-basmati-rice-5kg',
        description: 'Premium long grain basmati rice. Aged for extra flavour. Perfect for biryani, pulao and everyday meals.',
        price: 499, comparePrice: 580,
        category: grains._id,
        images: [{ url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600', publicId: 'rice-1', isDefault: true }],
        stock: 200, sku: 'GRN-RICE-001', brand: 'India Gate',
        tags: ['rice', 'basmati', 'grains', 'kirana'],
        isActive: true, isFeatured: true,
        specifications: [{ name: 'Weight', value: '5 kg' }, { name: 'Type', value: 'Basmati' }, { name: 'Shelf Life', value: '12 months' }],
        averageRating: 4.7, numReviews: 540,
      },
      {
        name: 'Aashirvaad Whole Wheat Atta 10kg',
        slug: 'aashirvaad-whole-wheat-atta-10kg',
        description: 'Chakki fresh atta made from 100% whole wheat. Rich in fibre, ideal for soft rotis and chapattis daily.',
        price: 380, comparePrice: 420,
        category: grains._id,
        images: [{ url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600', publicId: 'atta-1', isDefault: true }],
        stock: 150, sku: 'GRN-ATTA-001', brand: 'Aashirvaad',
        tags: ['atta', 'wheat', 'flour', 'grains'],
        isActive: true, isFeatured: true,
        specifications: [{ name: 'Weight', value: '10 kg' }, { name: 'Type', value: 'Whole Wheat' }, { name: 'Shelf Life', value: '6 months' }],
        averageRating: 4.6, numReviews: 820,
      },
      {
        name: 'Toor Dal (Arhar) 1kg',
        slug: 'toor-dal-arhar-1kg',
        description: 'Premium quality toor dal (arhar dal). Protein-rich, easy to cook. A staple in every Indian kitchen.',
        price: 145, comparePrice: 165,
        category: grains._id,
        images: [{ url: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600', publicId: 'dal-1', isDefault: true }],
        stock: 300, sku: 'GRN-DAL-001', brand: 'Swad',
        tags: ['dal', 'toor dal', 'pulses', 'protein'],
        isActive: true, isFeatured: false,
        specifications: [{ name: 'Weight', value: '1 kg' }, { name: 'Type', value: 'Toor/Arhar' }, { name: 'Shelf Life', value: '12 months' }],
        averageRating: 4.4, numReviews: 310,
      },
      {
        name: 'Sugar (Chini) 1kg - Refined',
        slug: 'sugar-chini-1kg-refined',
        description: 'Pure white refined sugar. Fine grain, free flowing. Used for tea, sweets, cooking and baking every day.',
        price: 52, comparePrice: 60,
        category: grains._id,
        images: [{ url: 'https://images.unsplash.com/photo-1559561853-08451507cbe7?w=600', publicId: 'sugar-1', isDefault: true }],
        stock: 500, sku: 'GRN-SUGR-001', brand: 'Uttam',
        tags: ['sugar', 'chini', 'sweetener', 'kirana'],
        isActive: true, isFeatured: true,
        specifications: [{ name: 'Weight', value: '1 kg' }, { name: 'Type', value: 'Refined White' }, { name: 'Shelf Life', value: '24 months' }],
        averageRating: 4.3, numReviews: 215,
      },
      {
        name: 'Tata Salt Iodised 1kg',
        slug: 'tata-salt-iodised-1kg',
        description: 'Tata Salt with iodine. Crystal clear, vacuum evaporated. The most trusted salt brand in India since decades.',
        price: 28, comparePrice: 32,
        category: grains._id,
        images: [{ url: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600', publicId: 'salt-1', isDefault: true }],
        stock: 800, sku: 'GRN-SALT-001', brand: 'Tata',
        tags: ['salt', 'namak', 'iodised', 'tata'],
        isActive: true, isFeatured: false,
        specifications: [{ name: 'Weight', value: '1 kg' }, { name: 'Type', value: 'Iodised' }, { name: 'Shelf Life', value: '36 months' }],
        averageRating: 4.8, numReviews: 1020,
      },
      // Spices & Masala
      {
        name: 'MDH Chana Masala 100g',
        slug: 'mdh-chana-masala-100g',
        description: 'Authentic MDH chana masala blend. A perfect mix of spices to make restaurant-style chhole at home easily.',
        price: 55, comparePrice: 65,
        category: spices._id,
        images: [{ url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600', publicId: 'masala-1', isDefault: true }],
        stock: 400, sku: 'SPC-CHNM-001', brand: 'MDH',
        tags: ['masala', 'spices', 'mdh', 'chana masala'],
        isActive: true, isFeatured: true,
        specifications: [{ name: 'Weight', value: '100 g' }, { name: 'Type', value: 'Blended Masala' }, { name: 'Shelf Life', value: '18 months' }],
        averageRating: 4.6, numReviews: 680,
      },
      {
        name: 'Everest Turmeric (Haldi) Powder 200g',
        slug: 'everest-turmeric-haldi-powder-200g',
        description: 'Pure haldi powder with natural colour and aroma. Free from artificial additives. Essential spice for every dish.',
        price: 48, comparePrice: 58,
        category: spices._id,
        images: [{ url: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=600', publicId: 'haldi-1', isDefault: true }],
        stock: 350, sku: 'SPC-HALD-001', brand: 'Everest',
        tags: ['haldi', 'turmeric', 'spices', 'everest'],
        isActive: true, isFeatured: false,
        specifications: [{ name: 'Weight', value: '200 g' }, { name: 'Type', value: 'Ground Turmeric' }, { name: 'Shelf Life', value: '18 months' }],
        averageRating: 4.5, numReviews: 445,
      },
      // Oils & Ghee
      {
        name: 'Fortune Sunflower Oil 1 Litre',
        slug: 'fortune-sunflower-oil-1-litre',
        description: 'Light and healthy sunflower oil with natural Vitamin E. Low in saturated fat. Ideal for all cooking methods.',
        price: 142, comparePrice: 168,
        category: oils._id,
        images: [{ url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600', publicId: 'oil-1', isDefault: true }],
        stock: 250, sku: 'OIL-SUN-001', brand: 'Fortune',
        tags: ['oil', 'sunflower oil', 'cooking oil', 'fortune'],
        isActive: true, isFeatured: false,
        specifications: [{ name: 'Volume', value: '1 Litre' }, { name: 'Type', value: 'Sunflower' }, { name: 'Shelf Life', value: '12 months' }],
        averageRating: 4.4, numReviews: 320,
      },
      {
        name: 'Amul Pure Ghee 500ml',
        slug: 'amul-pure-ghee-500ml',
        description: 'Amul pure cow ghee made from fresh cream. Rich aroma, golden colour. Adds authentic flavour to all Indian food.',
        price: 295, comparePrice: 340,
        category: oils._id,
        images: [{ url: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=600', publicId: 'ghee-1', isDefault: true }],
        stock: 180, sku: 'OIL-GHEE-001', brand: 'Amul',
        tags: ['ghee', 'amul', 'desi ghee', 'cow ghee'],
        isActive: true, isFeatured: true,
        specifications: [{ name: 'Volume', value: '500 ml' }, { name: 'Type', value: 'Cow Ghee' }, { name: 'Shelf Life', value: '12 months' }],
        averageRating: 4.8, numReviews: 910,
      },
      // Cleaning & Home
      {
        name: 'Surf Excel Easy Wash Detergent 1kg',
        slug: 'surf-excel-easy-wash-detergent-1kg',
        description: 'Surf Excel removes tough stains in just one wash. Works in both hand wash and machine wash. Leaves clothes fresh.',
        price: 138, comparePrice: 160,
        category: cleaning._id,
        images: [{ url: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=600', publicId: 'detergent-1', isDefault: true }],
        stock: 300, sku: 'CLN-DTGNT-001', brand: 'Surf Excel',
        tags: ['detergent', 'surf excel', 'washing powder', 'clothes'],
        isActive: true, isFeatured: true,
        specifications: [{ name: 'Weight', value: '1 kg' }, { name: 'Type', value: 'Washing Powder' }, { name: 'Use', value: 'Hand & Machine Wash' }],
        averageRating: 4.6, numReviews: 750,
      },
      {
        name: 'Vim Dishwash Bar 200g (Pack of 3)',
        slug: 'vim-dishwash-bar-200g-pack-of-3',
        description: 'Vim dishwash bar removes grease and stains effectively. Lemon fragrance. Safe on hands, tough on grease.',
        price: 75, comparePrice: 90,
        category: cleaning._id,
        images: [{ url: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600', publicId: 'vim-1', isDefault: true }],
        stock: 400, sku: 'CLN-VIM-001', brand: 'Vim',
        tags: ['vim', 'dishwash', 'utensil cleaner', 'cleaning'],
        isActive: true, isFeatured: false,
        specifications: [{ name: 'Weight', value: '200g x 3' }, { name: 'Fragrance', value: 'Lemon' }, { name: 'Type', value: 'Dishwash Bar' }],
        averageRating: 4.4, numReviews: 560,
      },
      {
        name: 'Phenyl Floor Cleaner 1 Litre',
        slug: 'phenyl-floor-cleaner-1-litre',
        description: 'Powerful phenyl floor cleaner. Kills 99.9% germs. Leaves floors sparkling clean with a fresh pine fragrance.',
        price: 89, comparePrice: 110,
        category: cleaning._id,
        images: [{ url: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=600', publicId: 'phenyl-1', isDefault: true }],
        stock: 200, sku: 'CLN-PHNL-001', brand: 'Lizol',
        tags: ['phenyl', 'floor cleaner', 'lizol', 'disinfectant'],
        isActive: true, isFeatured: false,
        specifications: [{ name: 'Volume', value: '1 Litre' }, { name: 'Fragrance', value: 'Pine' }, { name: 'Kills Germs', value: '99.9%' }],
        averageRating: 4.3, numReviews: 290,
      },
      // Personal Care
      {
        name: 'Lifebuoy Total Soap 100g (Pack of 4)',
        slug: 'lifebuoy-total-soap-100g-pack-of-4',
        description: 'Lifebuoy Total germ protection soap. Fights 10 illness-causing germs. Keeps your family healthy and protected.',
        price: 96, comparePrice: 112,
        category: personal._id,
        images: [{ url: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600', publicId: 'soap-1', isDefault: true }],
        stock: 500, sku: 'PRS-SOAP-001', brand: 'Lifebuoy',
        tags: ['soap', 'lifebuoy', 'bathing bar', 'germ protection'],
        isActive: true, isFeatured: true,
        specifications: [{ name: 'Weight', value: '100g x 4' }, { name: 'Type', value: 'Antibacterial' }, { name: 'Fragrance', value: 'Active Fresh' }],
        averageRating: 4.5, numReviews: 880,
      },
      {
        name: 'Colgate Strong Teeth Toothpaste 200g',
        slug: 'colgate-strong-teeth-toothpaste-200g',
        description: 'Colgate Strong Teeth with Calcium Boost. Provides superior protection against cavities and keeps teeth strong.',
        price: 118, comparePrice: 135,
        category: personal._id,
        images: [{ url: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=600', publicId: 'toothpaste-1', isDefault: true }],
        stock: 350, sku: 'PRS-TPST-001', brand: 'Colgate',
        tags: ['toothpaste', 'colgate', 'dental care', 'oral hygiene'],
        isActive: true, isFeatured: false,
        specifications: [{ name: 'Weight', value: '200 g' }, { name: 'Benefit', value: 'Cavity Protection' }, { name: 'Flavour', value: 'Mint' }],
        averageRating: 4.6, numReviews: 1100,
      },
      // Snacks & Beverages
      {
        name: 'Tata Chai Premium Tea 500g',
        slug: 'tata-chai-premium-tea-500g',
        description: 'Tata Tea Premium — strong, flavourful and refreshing. Made from finest Assam tea leaves. Perfect cup every time.',
        price: 235, comparePrice: 270,
        category: snacks._id,
        images: [{ url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600', publicId: 'tea-1', isDefault: true }],
        stock: 280, sku: 'SNK-TEA-001', brand: 'Tata Tea',
        tags: ['tea', 'chai', 'tata tea', 'assam', 'beverages'],
        isActive: true, isFeatured: true,
        specifications: [{ name: 'Weight', value: '500 g' }, { name: 'Type', value: 'Assam Blend' }, { name: 'Shelf Life', value: '24 months' }],
        averageRating: 4.7, numReviews: 720,
      },
      {
        name: 'Parle-G Original Glucose Biscuits 1kg',
        slug: 'parle-g-original-glucose-biscuits-1kg',
        description: 'The iconic Parle-G biscuits — light, crispy and delicious. India\'s most loved biscuit for all ages since 1939.',
        price: 85, comparePrice: 100,
        category: snacks._id,
        images: [{ url: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600', publicId: 'biscuit-1', isDefault: true }],
        stock: 600, sku: 'SNK-BSCT-001', brand: 'Parle-G',
        tags: ['biscuits', 'parle-g', 'glucose biscuits', 'snacks'],
        isActive: true, isFeatured: true,
        specifications: [{ name: 'Weight', value: '1 kg' }, { name: 'Type', value: 'Glucose Biscuits' }, { name: 'Shelf Life', value: '6 months' }],
        averageRating: 4.8, numReviews: 1540,
      },
    ];

    for (const p of productDefs) {
      await Product.create(p);
    }
    logger.info(`✅ ${productDefs.length} kirana products created`);

    // ── Coupons (amounts in INR) ─────────────────────────────────────────────
    await Coupon.create({
      code: 'KIRANA10',
      description: '10% off on all grocery orders',
      type: CouponType.PERCENTAGE,
      value: 10,
      minOrderAmount: 200,
      maxDiscount: 100,
      usageLimit: 500,
      isActive: true,
    });

    await Coupon.create({
      code: 'SAVE50',
      description: '₹50 off on orders above ₹500',
      type: CouponType.FIXED,
      value: 50,
      minOrderAmount: 500,
      usageLimit: 200,
      isActive: true,
    });

    await Coupon.create({
      code: 'NAYA100',
      description: '₹100 off for first order above ₹999',
      type: CouponType.FIXED,
      value: 100,
      minOrderAmount: 999,
      usageLimit: 300,
      isActive: true,
    });

    logger.info('✅ 3 coupons created (KIRANA10, SAVE50, NAYA100)');

    // ── Banners ──────────────────────────────────────────────────────────────
    await Banner.create({
      title: 'रोज़ की ज़रूरत, सबसे सस्ती कीमत!',
      subtitle: 'Fresh grocery delivered to your doorstep — Trusted Kirana Store',
      image: { url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200', publicId: 'banner-1' },
      link: '/products',
      buttonText: 'Shop Now',
      position: 0,
      isActive: true,
    });

    await Banner.create({
      title: 'Daily Essentials — Best Prices',
      subtitle: 'Sugar, Salt, Dal, Atta, Oil — everything under one roof',
      image: { url: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?w=1200', publicId: 'banner-2' },
      link: '/categories/grains-pulses',
      buttonText: 'Order Now',
      position: 1,
      isActive: true,
    });

    logger.info('✅ 2 banners created');

    await mongoose.disconnect();

    logger.info('');
    logger.info('╔═══════════════════════════════════════════════════╗');
    logger.info('║      🎉 KIRANA STORE SEEDING COMPLETED!           ║');
    logger.info('╠═══════════════════════════════════════════════════╣');
    logger.info('║  👤 Admin:  admin@kiranastore.com                 ║');
    logger.info('║  🔑 Pass:   Admin@123456                          ║');
    logger.info('╠═══════════════════════════════════════════════════╣');
    logger.info('║  👤 User:   user@test.com                         ║');
    logger.info('║  🔑 Pass:   User@123456                           ║');
    logger.info('╠═══════════════════════════════════════════════════╣');
    logger.info('║  🎫 Coupons: KIRANA10 | SAVE50 | NAYA100          ║');
    logger.info('║  📦 Products: 16  |  📂 Categories: 6             ║');
    logger.info('╚═══════════════════════════════════════════════════╝');
    logger.info('');

    process.exit(0);
  } catch (error) {
    logger.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
