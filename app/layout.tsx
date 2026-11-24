import type { Metadata } from 'next';
import './globals.css';
import { PlatformProvider } from '../lib/context/platform-context';
import { TopBar } from '../components/navigation/top-bar';

export const metadata: Metadata = {
  title: 'Hybrid Hotel Marketplace, Food Ordering & Centralized Delivery Platform',
  description: 'Multi-hotel marketplace supporting platform-owned chains, third-party hotels, venue bookings, direct procurement, and centralized delivery network.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased">
        <PlatformProvider>
          <TopBar />
          <main className="flex-1 pb-16">
            {children}
          </main>
          <footer className="bg-slate-900 text-slate-400 py-10 border-t border-slate-800 text-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center gap-2 text-white font-bold text-lg mb-3">
                  <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center text-white">H</div>
                  <span>Hotel & Delivery Platform</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  India&apos;s first hybrid hospitality marketplace combining platform-operated chains, independent hotel partners, direct procurement, and a unified delivery fleet.
                </p>
              </div>

              <div>
                <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Marketplace</h4>
                <ul className="space-y-2 text-xs">
                  <li><span className="text-slate-300">Food Discovery (Bandra, Juhu, Powai)</span></li>
                  <li><span className="text-slate-300">Platform-Owned Luxury Outlets</span></li>
                  <li><span className="text-slate-300">Verified 3rd-Party Restaurants</span></li>
                  <li><span className="text-slate-300">Wedding & Event Banquets</span></li>
                </ul>
              </div>

              <div>
                <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Hotel Business Modules</h4>
                <ul className="space-y-2 text-xs">
                  <li><span className="text-slate-300">Direct Supplier Procurement</span></li>
                  <li><span className="text-slate-300">Multi-Branch Menu Overrides</span></li>
                  <li><span className="text-slate-300">Venue Quotation Engine</span></li>
                  <li><span className="text-slate-300">Automated Central Dispatch</span></li>
                </ul>
              </div>

              <div>
                <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Compliance & Tech</h4>
                <ul className="space-y-2 text-xs">
                  <li><span className="text-emerald-400 font-medium">GST Invoicing & FSSAI Compliant</span></li>
                  <li><span className="text-slate-300">Razorpay Test Gateway (INR)</span></li>
                  <li><span className="text-slate-300">Supabase Multi-Tenant RLS</span></li>
                  <li><span className="text-slate-300">Central Fleet Dispatch Engine</span></li>
                </ul>
              </div>
            </div>
            <div className="max-w-7xl mx-auto px-4 mt-8 pt-6 border-t border-slate-800 text-center text-xs text-slate-500">
              © {new Date().getFullYear()} Hybrid Hotel Marketplace Platform. Operating under Asia/Kolkata timezone.
            </div>
          </footer>
        </PlatformProvider>
      </body>
    </html>
  );
}
