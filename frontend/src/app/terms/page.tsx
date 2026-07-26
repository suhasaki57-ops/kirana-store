import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 container max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms of Service</h1>
        <div className="bg-white rounded-xl p-6 border shadow-sm space-y-4 text-sm text-gray-700 leading-relaxed">
          <p>Welcome to Kirana Store. By using our website and services, you agree to comply with these terms.</p>
          <h2 className="text-lg font-bold text-gray-800">1. Account Terms</h2>
          <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.</p>
          <h2 className="text-lg font-bold text-gray-800">2. Pricing & Availability</h2>
          <p>All prices are listed in INR (₹). We reserve the right to modify prices and product availability without prior notice.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
