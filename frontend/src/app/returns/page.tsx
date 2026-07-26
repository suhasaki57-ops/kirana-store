import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function ReturnsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 container max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Return & Refund Policy</h1>
        <div className="bg-white rounded-xl p-6 border shadow-sm space-y-4 text-sm text-gray-700 leading-relaxed">
          <p>Customer satisfaction is our top priority. If you are not completely satisfied with your purchase, we are here to help.</p>
          <h2 className="text-lg font-bold text-gray-800">1. Returns at Delivery</h2>
          <p>You can inspect items at the time of delivery and return any damaged or incorrect products on the spot with the delivery agent.</p>
          <h2 className="text-lg font-bold text-gray-800">2. 24-Hour Return Window</h2>
          <p>For packaged grocery goods, you may request a return within 24 hours of receiving the order.</p>
          <h2 className="text-lg font-bold text-gray-800">3. Instant Refunds</h2>
          <p>Refunds for returned items are processed back to your original payment method or wallet within 24–48 hours.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
