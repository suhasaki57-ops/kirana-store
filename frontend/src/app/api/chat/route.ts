import { NextResponse } from 'next/server';
import { retrieveRAGContext } from '@/lib/ragEngine';

const GEMINI_API_KEY =
  process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
  process.env.GEMINI_API_KEY ||
  'AQ.Ab8RN6KDuWLVA6Q-TODF1GWcniIKtj-M8HvROL2p-rXR3t2lug';

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message text is required' }, { status: 400 });
    }

    // Retrieve RAG Context matching user message
    const ragContext = retrieveRAGContext(message, 5);

    // Build system prompt for Gemini
    const systemPrompt = `You are "Kirana AI Assistant", the official friendly e-commerce AI shopping assistant for Kirana Store (India's leading online grocery shop).

Your Goal: Help shoppers find grocery products (rice, dal, sugar, salt, oil, ghee, soaps, tea, biscuits, spices), answer questions about delivery charges, returns, deals, promo codes (like KIRANA10 and NAYA100), and store details.

RAG KNOWLEDGE BASE CONTEXT:
${ragContext}

INSTRUCTIONS:
1. Provide concise, helpful, and polite answers using ₹ (INR) for prices.
2. When recommending products from the context, mention the product name, price in ₹, stock status, and provide the internal link markdown [View Product](/products/slug) if present.
3. If asked about coupons, mention KIRANA10 (10% off above ₹200) and NAYA100 (₹100 off first order).
4. If asked about delivery, mention FREE delivery on orders above ₹500 (flat ₹40 below ₹500).
5. You support English, Hindi, and Hinglish.
6. Keep formatting clean with bullet points and bold text.`;

    // Try calling Gemini API REST endpoints (v1beta / v1)
    const geminiEndpoints = [
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`
    ];

    const contents = [
      {
        role: 'user',
        parts: [{ text: `${systemPrompt}\n\nUser Query: ${message}` }]
      }
    ];

    for (const endpoint of geminiEndpoints) {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents }),
        });

        if (response.ok) {
          const data = await response.json();
          const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (candidateText && candidateText.trim().length > 0) {
            return NextResponse.json({
              reply: candidateText.trim(),
              contextUsed: ragContext,
              source: 'gemini-api'
            });
          }
        }
      } catch (err) {
        console.warn(`Gemini endpoint ${endpoint} failed, trying fallback endpoint...`, err);
      }
    }

    // Smart Fallback RAG generator if API endpoints are unavailable or rate-limited
    return NextResponse.json({
      reply: generateFallbackRAGReply(message, ragContext),
      contextUsed: ragContext,
      source: 'rag-engine-fallback'
    });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json({
      reply: "I'm Kirana AI Assistant! How can I help you with your grocery shopping today?",
    });
  }
}

// Intelligent fallback RAG response generator
function generateFallbackRAGReply(query: string, context: string): string {
  const q = query.toLowerCase();

  if (q.includes('coupon') || q.includes('discount') || q.includes('offer') || q.includes('code') || q.includes('promo')) {
    return "🎁 **Active Kirana Store Offers:**\n\n• **KIRANA10**: Get **10% OFF** on all orders above ₹200.\n• **NAYA100**: Get **₹100 OFF** on your first order above ₹999.\n• **FREESHIP**: Free shipping on orders over ₹400.\n\nApply these promo codes at checkout!";
  }

  if (q.includes('delivery') || q.includes('shipping') || q.includes('charge') || q.includes('free') || q.includes('speed')) {
    return "🚚 **Delivery Information:**\n\n• **FREE Delivery** on orders above **₹500**!\n• Flat **₹40** delivery fee for orders below ₹500.\n• Express delivery within **24–48 hours** across India.";
  }

  if (q.includes('return') || q.includes('refund') || q.includes('exchange')) {
    return "🔄 **Returns & Refund Policy:**\n\n• **7-Day Easy Returns** for unopened or damaged grocery items.\n• Instant replacement or direct store credit / bank refund within 48 hours.";
  }

  if (q.includes('contact') || q.includes('phone') || q.includes('email') || q.includes('support') || q.includes('hour') || q.includes('time')) {
    return "📞 **Kirana Store Contact Info:**\n\n• **Email**: support@kiranastore.com\n• **Phone / WhatsApp**: +91 98765 43210\n• **Operating Hours**: 8:00 AM – 10:00 PM (Monday – Sunday)";
  }

  if (q.includes('rice') || q.includes('basmati') || q.includes('chawal')) {
    return "🌾 **India Gate Basmati Rice 5kg**\n• Price: **₹499** (MRP ₹580, 14% OFF)\n• Premium long grain basmati rice, aged for extra flavour.\n• Stock: In stock (200 available)\n• [View Product Details](/products/india-gate-basmati-rice-5kg)";
  }

  if (q.includes('atta') || q.includes('wheat') || q.includes('gehu') || q.includes('flour')) {
    return "🌾 **Aashirvaad Whole Wheat Atta 10kg**\n• Price: **₹380** (MRP ₹420, 10% OFF)\n• 100% Chakki fresh whole wheat flour for soft rotis.\n• Stock: In stock (150 available)\n• [View Product Details](/products/aashirvaad-whole-wheat-atta-10kg)";
  }

  if (q.includes('ghee') || q.includes('amul')) {
    return "🫙 **Amul Pure Ghee 500ml**\n• Price: **₹295** (MRP ₹340)\n• Rich granular pure cow milk ghee.\n• Stock: In stock (180 available)\n• [View Product Details](/products/amul-pure-ghee-500ml)";
  }

  if (q.includes('dal') || q.includes('toor') || q.includes('arhar')) {
    return "🫘 **Toor Dal (Arhar) 1kg**\n• Price: **₹145** (MRP ₹165, 12% OFF)\n• Unpolished high protein yellow toor dal.\n• Stock: In stock (300 available)\n• [View Product Details](/products/toor-dal-arhar-1kg)";
  }

  if (q.includes('oil') || q.includes('fortune') || q.includes('tel')) {
    return "🌻 **Fortune Sunflower Oil 1 Litre**\n• Price: **₹142** (MRP ₹168)\n• Light and healthy refined sunflower oil.\n• Stock: In stock (250 available)\n• [View Product Details](/products/fortune-sunflower-oil-1-litre)";
  }

  // Extract snippet from context if matched
  const contextLines = context.split('\n\n');
  const primaryMatch = contextLines[0] || 'Store Catalog & Information';

  return `🤖 **Kirana AI Assistant:**\n\nHere is information from our store knowledge base:\n\n${primaryMatch}\n\nHow else can I assist you with your grocery shopping today?`;
}
