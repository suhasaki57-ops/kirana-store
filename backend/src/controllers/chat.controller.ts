import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';

const GEMINI_API_KEY =
  process.env.GEMINI_API_KEY ||
  process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
  'AQ.Ab8RN6KDuWLVA6Q-TODF1GWcniIKtj-M8HvROL2p-rXR3t2lug';

// Store catalog knowledge base for RAG
const STORE_KNOWLEDGE = `
[Product] India Gate Basmati Rice 5kg | Price: ₹499 (MRP ₹580) | Stock: 200 | Category: Grains & Pulses | Link: [View Product](/products/india-gate-basmati-rice-5kg)
[Product] Aashirvaad Whole Wheat Atta 10kg | Price: ₹380 (MRP ₹420) | Stock: 150 | Category: Grains & Pulses | Link: [View Product](/products/aashirvaad-whole-wheat-atta-10kg)
[Product] Toor Dal (Arhar) 1kg | Price: ₹145 (MRP ₹165) | Stock: 300 | Category: Grains & Pulses | Link: [View Product](/products/toor-dal-arhar-1kg)
[Product] Sugar (Chini) 1kg Refined | Price: ₹52 (MRP ₹60) | Stock: 500 | Category: Grains & Pulses | Link: [View Product](/products/sugar-chini-1kg-refined)
[Product] Tata Salt Iodised 1kg | Price: ₹28 (MRP ₹32) | Stock: 800 | Category: Grains & Pulses | Link: [View Product](/products/tata-salt-iodised-1kg)
[Product] MDH Chana Masala 100g | Price: ₹55 (MRP ₹65) | Stock: 400 | Category: Spices & Masala | Link: [View Product](/products/mdh-chana-masala-100g)
[Product] Everest Turmeric Haldi Powder 200g | Price: ₹48 (MRP ₹58) | Stock: 350 | Category: Spices & Masala | Link: [View Product](/products/everest-turmeric-haldi-powder-200g)
[Product] Fortune Sunflower Oil 1 Litre | Price: ₹142 (MRP ₹168) | Stock: 250 | Category: Oils & Ghee | Link: [View Product](/products/fortune-sunflower-oil-1-litre)
[Product] Amul Pure Ghee 500ml | Price: ₹295 (MRP ₹340) | Stock: 180 | Category: Oils & Ghee | Link: [View Product](/products/amul-pure-ghee-500ml)
[Product] Surf Excel Easy Wash 1kg | Price: ₹138 (MRP ₹160) | Stock: 300 | Category: Cleaning & Home | Link: [View Product](/products/surf-excel-easy-wash-detergent-1kg)
[Product] Vim Dishwash Bar Pack of 3 | Price: ₹75 (MRP ₹90) | Stock: 400 | Category: Cleaning & Home | Link: [View Product](/products/vim-dishwash-bar-200g-pack-of-3)
[Product] Lifebuoy Total Soap Pack of 4 | Price: ₹96 (MRP ₹112) | Stock: 500 | Category: Personal Care | Link: [View Product](/products/lifebuoy-total-soap-100g-pack-of-4)
[Product] Colgate Strong Teeth 200g | Price: ₹118 (MRP ₹135) | Stock: 350 | Category: Personal Care | Link: [View Product](/products/colgate-strong-teeth-toothpaste-200g)
[Product] Tata Chai Premium Tea 500g | Price: ₹235 (MRP ₹270) | Stock: 280 | Category: Snacks & Beverages | Link: [View Product](/products/tata-chai-premium-tea-500g)
[Product] Parle-G Glucose Biscuits 1kg | Price: ₹85 (MRP ₹100) | Stock: 600 | Category: Snacks & Beverages | Link: [View Product](/products/parle-g-original-glucose-biscuits-1kg)

[Coupon] KIRANA10: 10% OFF on orders above ₹200.
[Coupon] SAVE50: ₹50 OFF on orders above ₹500.
[Coupon] NAYA100: ₹100 OFF on first order above ₹999.

[Policy] Delivery: FREE delivery on orders above ₹500 (Flat ₹40 for orders under ₹500). Express 24-48 hrs delivery.
[Policy] Returns: 7-day easy returns for unopened grocery items.
[Support] Email: support@kiranastore.com | Phone: +91 98765 43210 (8 AM - 10 PM)
`;

function retrieveContext(query: string): string {
  const terms = query.toLowerCase().split(/\s+/).filter(t => t.length > 2);
  if (terms.length === 0) return STORE_KNOWLEDGE;

  const lines = STORE_KNOWLEDGE.trim().split('\n');
  const scored = lines.map(line => {
    let score = 0;
    const lowerLine = line.toLowerCase();
    for (const term of terms) {
      if (lowerLine.includes(term)) score += 1;
    }
    return { line, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const topMatches = scored.filter(s => s.score > 0).map(s => s.line);
  return topMatches.length > 0 ? topMatches.join('\n') : lines.slice(0, 8).join('\n');
}

function generateFallbackReply(query: string, context: string): string {
  const q = query.toLowerCase();

  if (q.includes('coupon') || q.includes('discount') || q.includes('offer') || q.includes('code') || q.includes('promo')) {
    return "🎁 **Active Kirana Store Offers:**\n\n• **KIRANA10**: Get **10% OFF** on all orders above ₹200.\n• **SAVE50**: Get **₹50 OFF** on orders above ₹500.\n• **NAYA100**: Get **₹100 OFF** on your first order above ₹999.\n\nApply these promo codes at checkout!";
  }
  if (q.includes('delivery') || q.includes('shipping') || q.includes('charge') || q.includes('free')) {
    return "🚚 **Delivery Information:**\n\n• **FREE Delivery** on orders above **₹500**!\n• Flat **₹40** delivery fee for orders below ₹500.\n• Express delivery within **24–48 hours** across India.";
  }
  if (q.includes('return') || q.includes('refund') || q.includes('exchange')) {
    return "🔄 **Returns & Refund Policy:**\n\n• **7-Day Easy Returns** for unopened or damaged grocery items.\n• Instant replacement or direct store credit / bank refund within 48 hours.";
  }
  if (q.includes('contact') || q.includes('phone') || q.includes('email') || q.includes('support')) {
    return "📞 **Kirana Store Contact Info:**\n\n• **Email**: support@kiranastore.com\n• **Phone**: +91 98765 43210\n• **Hours**: 8:00 AM – 10:00 PM (Monday – Sunday)";
  }

  const contextLines = context.split('\n').filter(l => l.trim().length > 0);
  const primaryMatch = contextLines[0] || 'Store Catalog & Information';

  return `🤖 **Kirana AI Assistant:**\n\nHere is information from our store catalog:\n\n${primaryMatch}\n\nHow else can I assist you with your grocery shopping today?`;
}

export const chatHandler = asyncHandler(async (req: Request, res: Response) => {
  const { message } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ success: false, message: 'Message text is required' });
  }

  const ragContext = retrieveContext(message);

  const systemPrompt = `You are "Kirana AI Assistant", the official friendly e-commerce AI shopping assistant for Kirana Store (India's leading online grocery shop).

RAG KNOWLEDGE BASE CONTEXT:
${ragContext}

INSTRUCTIONS:
1. Provide concise, helpful, and polite answers using ₹ (INR) for prices.
2. Mention product name, price in ₹, stock status, and internal markdown link [View Product](/products/slug) if relevant.
3. Keep formatting clean with bullet points and bold text.`;

  const geminiEndpoints = [
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
  ];

  const contents = [
    {
      role: 'user',
      parts: [{ text: `${systemPrompt}\n\nUser Query: ${message}` }],
    },
  ];

  for (const endpoint of geminiEndpoints) {
    try {
      const apiRes = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents }),
      });

      if (apiRes.ok) {
        const data: any = await apiRes.json();
        const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (candidateText && candidateText.trim().length > 0) {
          return ApiResponse.success(res, 'Reply generated', {
            reply: candidateText.trim(),
            contextUsed: ragContext,
            source: 'gemini-api',
          });
        }
      }
    } catch (err) {
      console.warn(`Gemini endpoint ${endpoint} failed, trying fallback endpoint...`);
    }
  }

  return ApiResponse.success(res, 'Reply generated', {
    reply: generateFallbackReply(message, ragContext),
    contextUsed: ragContext,
    source: 'rag-engine-fallback',
  });
});
