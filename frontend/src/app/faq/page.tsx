import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function FAQPage() {
  const faqs = [
    { q: 'What are your delivery hours?', a: 'We deliver daily from 7:00 AM to 9:00 PM in your local area.' },
    { q: 'Is there a minimum order value for free delivery?', a: 'Yes! Orders over ₹500 qualify for free standard delivery.' },
    { q: 'What payment methods do you accept?', a: 'We accept Cash on Delivery (COD), UPI (Google Pay, PhonePe, Paytm), and major Credit/Debit cards.' },
    { q: 'How can I track my order?', a: 'You can track your live order status in the "My Orders" section of your account.' },
    { q: 'What is your return policy?', a: 'If any item is damaged or missing, we offer instant replacement or refund within 24 hours of delivery.' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 container max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">Frequently Asked Questions</h1>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white rounded-xl p-5 border shadow-sm">
              <h3 className="font-bold text-gray-800 text-base">{faq.q}</h3>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
