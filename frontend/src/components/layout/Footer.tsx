import Link from 'next/link';
import { Facebook, Instagram, Mail, Phone } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-gray-50">
      <div className="container py-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🛒</span>
              <h3 className="text-base font-bold text-green-700">Kirana Store</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Your trusted online kirana store. Quality grocery products
              delivered fresh at the best prices in India.
            </p>
            <div className="mt-4 flex gap-3">
              <a href="#" className="text-muted-foreground hover:text-green-700 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-green-700 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="mailto:support@kiranastore.com"
                className="text-muted-foreground hover:text-green-700 transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="mb-3 font-semibold">Shop</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/products" className="hover:text-green-700">All Products</Link></li>
              <li><Link href="/categories" className="hover:text-green-700">Categories</Link></li>
              <li><Link href="/deals" className="hover:text-green-700">Today's Deals</Link></li>
              <li><Link href="/products?featured=true" className="hover:text-green-700">Featured Items</Link></li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="mb-3 font-semibold">Account</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/profile" className="hover:text-green-700">My Profile</Link></li>
              <li><Link href="/orders" className="hover:text-green-700">My Orders</Link></li>
              <li><Link href="/wishlist" className="hover:text-green-700">Wishlist</Link></li>
              <li><Link href="/cart" className="hover:text-green-700">Cart</Link></li>
              <li><Link href="/login" className="hover:text-green-700">Login / Register</Link></li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="mb-3 font-semibold">Help & Info</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/contact" className="hover:text-green-700">Contact Us</Link></li>
              <li><Link href="/faq" className="hover:text-green-700">FAQ</Link></li>
              <li><Link href="/shipping" className="hover:text-green-700">Shipping Policy</Link></li>
              <li><Link href="/returns" className="hover:text-green-700">Return Policy</Link></li>
              <li><Link href="/privacy" className="hover:text-green-700">Privacy Policy</Link></li>
            </ul>
            <div className="mt-4 space-y-1 text-sm text-muted-foreground">
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-green-600" />
                +91 98765 43210
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-green-600" />
                support@kiranastore.com
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 border-t pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Kirana Store. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-green-700">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-green-700">Terms of Service</Link>
            <Link href="/returns" className="hover:text-green-700">Returns</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
