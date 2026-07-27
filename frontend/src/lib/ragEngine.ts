export interface RAGDocument {
  id: string;
  title: string;
  category: 'product' | 'store_info' | 'policy' | 'coupon' | 'custom_knowledge';
  content: string;
  url?: string;
  tags?: string[];
  createdAt?: string;
}

// Built-in store catalog & policy index
export const STORE_RAG_DATABASE: RAGDocument[] = [
  // Products
  {
    id: 'prod-1',
    title: 'India Gate Basmati Rice 5kg',
    category: 'product',
    content: 'India Gate Basmati Rice 5kg — Premium long grain basmati rice. Aged for extra flavour. Price: ₹499 (MRP: ₹580, 14% OFF). Stock: 200 in stock. Rating: 4.7★ (540 reviews). Link: /products/india-gate-basmati-rice-5kg',
    url: '/products/india-gate-basmati-rice-5kg',
    tags: ['rice', 'basmati', 'grains', 'pulses', 'staples', 'india gate', 'chawal']
  },
  {
    id: 'prod-2',
    title: 'Aashirvaad Whole Wheat Atta 10kg',
    category: 'product',
    content: 'Aashirvaad Whole Wheat Atta 10kg — Chakki fresh atta made from 100% whole wheat. Price: ₹380 (MRP: ₹420, 10% OFF). Stock: 150 in stock. Rating: 4.6★ (820 reviews). Link: /products/aashirvaad-whole-wheat-atta-10kg',
    url: '/products/aashirvaad-whole-wheat-atta-10kg',
    tags: ['atta', 'wheat', 'flour', 'grains', 'aashirvaad', 'roti', 'gehu']
  },
  {
    id: 'prod-3',
    title: 'Toor Dal (Arhar) 1kg',
    category: 'product',
    content: 'Toor Dal (Arhar) 1kg — Unpolished high protein yellow toor dal. Price: ₹145 (MRP: ₹165, 12% OFF). Stock: 300 in stock. Rating: 4.4★. Link: /products/toor-dal-arhar-1kg',
    url: '/products/toor-dal-arhar-1kg',
    tags: ['dal', 'toor dal', 'arhar', 'pulses', 'tuvar']
  },
  {
    id: 'prod-4',
    title: 'Sugar (Chini) 1kg - Refined',
    category: 'product',
    content: 'Sugar (Chini) 1kg - Refined white crystal sugar. Price: ₹52 (MRP: ₹60). Stock: 500 in stock. Rating: 4.3★. Link: /products/sugar-chini-1kg-refined',
    url: '/products/sugar-chini-1kg-refined',
    tags: ['sugar', 'chini', 'sweetener', 'meetha']
  },
  {
    id: 'prod-5',
    title: 'Tata Salt Iodised 1kg',
    category: 'product',
    content: 'Tata Salt Iodised 1kg — Desh ka Namak, vacuum evaporated iodised salt. Price: ₹28 (MRP: ₹32). Stock: 800 in stock. Rating: 4.8★. Link: /products/tata-salt-iodised-1kg',
    url: '/products/tata-salt-iodised-1kg',
    tags: ['salt', 'namak', 'tata salt', 'iodised']
  },
  {
    id: 'prod-6',
    title: 'MDH Chana Masala 100g',
    category: 'product',
    content: 'MDH Chana Masala 100g — Blend of authentic spices for tasty chickpea curry. Price: ₹55 (MRP: ₹65). Stock: 400. Rating: 4.6★. Link: /products/mdh-chana-masala-100g',
    url: '/products/mdh-chana-masala-100g',
    tags: ['spices', 'masala', 'mdh', 'chana masala', 'chole']
  },
  {
    id: 'prod-7',
    title: 'Everest Turmeric Powder 200g',
    category: 'product',
    content: 'Everest Turmeric Powder (Haldi) 200g — Pure aromatic haldi powder. Price: ₹48 (MRP: ₹58). Stock: 350. Rating: 4.5★. Link: /products/everest-turmeric-haldi-powder-200g',
    url: '/products/everest-turmeric-haldi-powder-200g',
    tags: ['turmeric', 'haldi', 'everest', 'spices']
  },
  {
    id: 'prod-8',
    title: 'Fortune Sunflower Oil 1 Litre',
    category: 'product',
    content: 'Fortune Sunflower Oil 1L — Light and healthy refined sunflower oil. Price: ₹142 (MRP: ₹168). Stock: 250. Rating: 4.4★. Link: /products/fortune-sunflower-oil-1-litre',
    url: '/products/fortune-sunflower-oil-1-litre',
    tags: ['oil', 'cooking oil', 'sunflower oil', 'fortune', 'tel']
  },
  {
    id: 'prod-9',
    title: 'Amul Pure Ghee 500ml',
    category: 'product',
    content: 'Amul Pure Ghee 500ml — Rich granular pure cow milk ghee. Price: ₹295 (MRP: ₹340). Stock: 180. Rating: 4.8★. Link: /products/amul-pure-ghee-500ml',
    url: '/products/amul-pure-ghee-500ml',
    tags: ['ghee', 'amul', 'pure ghee', 'dairy', 'cow ghee']
  },
  {
    id: 'prod-10',
    title: 'Surf Excel Easy Wash 1kg',
    category: 'product',
    content: 'Surf Excel Easy Wash Detergent 1kg — Removes tough stains in 1 wash. Price: ₹138 (MRP: ₹160). Stock: 300. Rating: 4.6★. Link: /products/surf-excel-easy-wash-detergent-1kg',
    url: '/products/surf-excel-easy-wash-detergent-1kg',
    tags: ['detergent', 'surf excel', 'cleaning', 'laundry', 'surf']
  },
  {
    id: 'prod-11',
    title: 'Vim Dishwash Bar (Pack of 3)',
    category: 'product',
    content: 'Vim Dishwash Bar 200g (Pack of 3) — Lemon power degreasing dishwash bar. Price: ₹75 (MRP: ₹90). Stock: 400. Rating: 4.4★. Link: /products/vim-dishwash-bar-200g-pack-of-3',
    url: '/products/vim-dishwash-bar-200g-pack-of-3',
    tags: ['vim', 'dishwash', 'cleaning', 'bartan']
  },
  {
    id: 'prod-12',
    title: 'Lifebuoy Total Soap (Pack of 4)',
    category: 'product',
    content: 'Lifebuoy Total Soap 100g (Pack of 4) — Antibacterial germ protection soap. Price: ₹96 (MRP: ₹112). Stock: 500. Rating: 4.5★. Link: /products/lifebuoy-total-soap-100g-pack-of-4',
    url: '/products/lifebuoy-total-soap-100g-pack-of-4',
    tags: ['soap', 'lifebuoy', 'personal care', 'hygiene', 'bath']
  },
  {
    id: 'prod-13',
    title: 'Colgate Strong Teeth 200g',
    category: 'product',
    content: 'Colgate Strong Teeth Toothpaste 200g — Calcium boost toothpaste. Price: ₹118 (MRP: ₹135). Stock: 350. Rating: 4.6★. Link: /products/colgate-strong-teeth-toothpaste-200g',
    url: '/products/colgate-strong-teeth-toothpaste-200g',
    tags: ['toothpaste', 'colgate', 'dental care', 'paste']
  },
  {
    id: 'prod-14',
    title: 'Tata Chai Premium Tea 500g',
    category: 'product',
    content: 'Tata Chai Premium Tea 500g — Rich flavour Assam tea leaves. Price: ₹235 (MRP: ₹270). Stock: 280. Rating: 4.7★. Link: /products/tata-chai-premium-tea-500g',
    url: '/products/tata-chai-premium-tea-500g',
    tags: ['tea', 'chai', 'tata tea', 'beverages', 'patti']
  },
  {
    id: 'prod-15',
    title: 'Parle-G Glucose Biscuits 1kg',
    category: 'product',
    content: 'Parle-G Original Glucose Biscuits 1kg — India\'s favourite tea biscuit. Price: ₹85 (MRP: ₹100). Stock: 600. Rating: 4.8★. Link: /products/parle-g-original-glucose-biscuits-1kg',
    url: '/products/parle-g-original-glucose-biscuits-1kg',
    tags: ['biscuits', 'parle-g', 'snacks', 'biscuit']
  },

  // Coupons
  {
    id: 'coup-1',
    title: 'Discount Coupons & Offers',
    category: 'coupon',
    content: 'Active Kirana Store Promo Codes:\n1. KIRANA10: Get 10% OFF on all grocery orders above ₹200.\n2. NAYA100: Get flat ₹100 OFF on your first order above ₹999.\n3. FREESHIP: Free shipping on orders over ₹400.',
    tags: ['coupon', 'discount', 'code', 'offer', 'kirana10', 'naya100', 'promo', 'freeship']
  },

  // Store Policies & Shipping
  {
    id: 'policy-1',
    title: 'Delivery & Shipping Charges',
    category: 'policy',
    content: 'Kirana Store Shipping Policy: FREE Delivery on all orders above ₹500! Orders below ₹500 incur a flat ₹40 delivery fee. Standard delivery takes 24–48 hours across all major pin codes in India.',
    tags: ['delivery', 'shipping', 'free delivery', 'charge', 'cost', 'speed', 'time', 'pincode']
  },
  {
    id: 'policy-2',
    title: 'Returns & Refund Policy',
    category: 'policy',
    content: 'Kirana Store Return Policy: 7-day easy returns for unopened or damaged items. Instant replacement or store credit / bank refund within 48 hours.',
    tags: ['returns', 'refund', 'policy', 'exchange', 'damage', 'replacement']
  },
  {
    id: 'store-1',
    title: 'Store Information & Contact Details',
    category: 'store_info',
    content: 'Kirana Store is India\'s trusted online daily grocery destination. Customer Support Email: support@kiranastore.com, Phone/WhatsApp: +91 98765 43210. Operating Hours: 8:00 AM - 10:00 PM (Mon-Sun).',
    tags: ['store', 'contact', 'hours', 'timing', 'phone', 'email', 'whatsapp', 'help', 'address']
  }
];

// Load custom admin knowledge items from localStorage if available
export function getCustomKnowledge(): RAGDocument[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('kirana_custom_knowledge');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// Save custom admin knowledge item
export function saveCustomKnowledgeItem(
  title: string,
  content: string,
  category: 'custom_knowledge' | 'product' | 'policy' | 'coupon' | 'store_info' = 'custom_knowledge',
  url?: string
): RAGDocument {
  const current = getCustomKnowledge();
  const newItem: RAGDocument = {
    id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    title: title.trim(),
    content: content.trim(),
    category,
    url: url?.trim() || undefined,
    tags: title.toLowerCase().split(/\s+/),
    createdAt: new Date().toISOString()
  };
  const updated = [newItem, ...current];
  if (typeof window !== 'undefined') {
    localStorage.setItem('kirana_custom_knowledge', JSON.stringify(updated));
  }
  return newItem;
}

// Delete custom admin knowledge item
export function deleteCustomKnowledgeItem(id: string): void {
  if (typeof window === 'undefined') return;
  const current = getCustomKnowledge();
  const updated = current.filter(item => item.id !== id);
  localStorage.setItem('kirana_custom_knowledge', JSON.stringify(updated));
}

// Clear all custom admin knowledge items
export function clearCustomKnowledge(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('kirana_custom_knowledge');
}

// Retrieve relevant RAG context for a user query
export function retrieveRAGContext(query: string, limit: number = 5): string {
  const customDocs = getCustomKnowledge();
  const allDocs = [...STORE_RAG_DATABASE, ...customDocs];

  const qTokens = query.toLowerCase().split(/\s+/).filter(t => t.length > 1);

  if (qTokens.length === 0) {
    return STORE_RAG_DATABASE.slice(0, 3).map(d => `[${d.title}]: ${d.content}`).join('\n\n');
  }

  const scored = allDocs.map(doc => {
    let score = 0;
    const textToMatch = `${doc.title} ${doc.content} ${(doc.tags || []).join(' ')}`.toLowerCase();

    for (const token of qTokens) {
      if (textToMatch.includes(token)) score += 3;
      if (doc.title.toLowerCase().includes(token)) score += 6;
      if ((doc.tags || []).some(tag => tag.toLowerCase().includes(token))) score += 4;
    }
    return { doc, score };
  });

  scored.sort((a, b) => b.score - a.score);

  const topDocs = scored.filter(item => item.score > 0).slice(0, limit).map(item => item.doc);

  if (topDocs.length === 0) {
    // Return top general product/policy docs if no exact token matches
    return STORE_RAG_DATABASE.slice(0, 4).map(d => `[${d.title}]: ${d.content}`).join('\n\n');
  }

  return topDocs.map(d => `[${d.title}]: ${d.content}`).join('\n\n');
}
