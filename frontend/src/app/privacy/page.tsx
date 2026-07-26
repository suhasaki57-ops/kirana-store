import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 container max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
        <div className="bg-white rounded-xl p-6 border shadow-sm space-y-4 text-sm text-gray-700 leading-relaxed">
          <p>We respect your privacy and are committed to protecting your personal data.</p>
          <h2 className="text-lg font-bold text-gray-800">1. Information We Collect</h2>
          <p>We collect your name, phone number, address, and email solely to process and fulfill your grocery orders.</p>
          <h2 className="text-lg font-bold text-gray-800">2. Data Security</h2>
          <p>Your payment information is processed through secure, PCI-compliant payment gateways. We never store your full payment card credentials.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
