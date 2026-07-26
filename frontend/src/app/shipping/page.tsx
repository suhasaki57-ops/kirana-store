import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function ShippingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 container max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Shipping & Delivery Policy</h1>
        <div className="bg-white rounded-xl p-6 border shadow-sm space-y-4 text-sm text-gray-700 leading-relaxed">
          <p>We take pride in fast and reliable delivery of fresh groceries directly to your doorstep.</p>
          <h2 className="text-lg font-bold text-gray-800">1. Delivery Timelines</h2>
          <p>Standard delivery takes between 2 to 4 hours. Express delivery options (under 60 minutes) are available for selected pin codes.</p>
          <h2 className="text-lg font-bold text-gray-800">2. Delivery Charges</h2>
          <p>Orders above ₹500 get FREE delivery. Orders under ₹500 incur a small nominal delivery fee of ₹30.</p>
          <h2 className="text-lg font-bold text-gray-800">3. Contactless Delivery</h2>
          <p>We support 100% safe contactless delivery for online paid orders upon request.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
