# Hybrid Hotel Marketplace, Food Ordering, Venue Booking, Procurement & Centralized Delivery Platform

A scalable, secure, and production-ready multi-hotel hybrid marketplace where:
1. **The Platform Owner** operates their own chain of hotels and restaurant branches with central menu management, branch overrides, and consolidated reporting.
2. **Independent Third-Party Hotels** register and sell through the same customer-facing marketplace with custom pricing, operating hours, and platform commissions.
3. **Customers** order food from any participating outlet and book grand hotel venues/ballrooms with double-booking prevention.
4. **Every Hotel** independently manages its daily procurement directly from preferred suppliers with private negotiated prices.
5. **All Customer Food Deliveries** are fulfilled by a centralized delivery partner fleet managed by the platform with smart dispatch algorithms.

---

## 🌟 Key Architectural Pillars

### 1. Hybrid Hotel Marketplace
- **Type 1: Platform-Owned Chains** (e.g., *Royal Heritage Hospitality Group*): Zero marketplace commission, multi-branch chain hierarchy (Bandra West, Powai), parent organization consolidated ledgers.
- **Type 2: Independent Third-Party Partners** (e.g., *Spice Symphony & Grills*, *Grand Deccan Palace*): Configurable commission plans (e.g., 15% marketplace fee), independent menu/hours.
- Unified customer discovery app showing both types side-by-side with distinct verification tags.

### 2. Direct Hotel Supply Procurement
- **Non-Mandatory Direct Procurement**: Hotels are **never** forced to purchase through a centralized platform vendor.
- **Private Negotiated Rates**: Each hotel connection maintains contract pricing that is isolated via Supabase Row-Level Security (RLS).
- **Physical Goods Receipt Dock**: Supports partial delivery tracking, damaged goods logging, shortages, and delivery challan verification.

### 3. Centralized Delivery Fleet Grid
- Unified fleet serving all hotels (platform-owned and third-party). Hotels cannot deploy their own couriers.
- **Smart Dispatch Engine**: Automated ranking based on Haversine distance, driver availability, and workload.
- **Two-Sided OTP Verification**: Pickup OTP (verified at hotel kitchen) and Delivery OTP (verified with customer).
- Real-time GPS location sharing and admin manual override.

### 4. Venue & Occasion Banqueting
- Grand ballrooms, lawns, and banquet halls with min/max guest capacities.
- **Double-Booking Prevention**: Database-level unique constraints (`venue_id, booking_date, slot_type`).
- Itemized quotation generator with 18% hospitality GST and milestone advance payments (30% to lock slot).

---

## 💻 Tech Stack

- **Frontend**: Next.js App Router, React 18, TypeScript, Tailwind CSS, Lucide Icons, Framer Motion
- **Backend**: Next.js Server Actions, Route Handlers, Supabase PostgreSQL, Supabase Auth, Realtime
- **Payments**: Razorpay (INR Indian currency, GST-ready invoices, Webhooks)
- **Timezone**: `Asia/Kolkata` (IST)

---

## 🚀 Getting Started

### 1. Clone & Install Dependencies
```bash
git clone <your-repo-url>
cd "Hotel and Food ordering platform"
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

### 3. Apply Database Migrations & Seed Data
Execute the SQL migrations in your Supabase SQL Editor:
1. `supabase/migrations/00001_initial_schema.sql` (Creates all 54 relational tables, RLS policies, and indexes)
2. `supabase/seed.sql` (Populates Mumbai-based hotels, branches, menus, suppliers, and couriers)

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📱 The 5 Core Interfaces & Direct URLs

| Interface | URL Path | Description |
| :--- | :--- | :--- |
| **1. Customer Marketplace** | `/` | Food discovery, restaurant menus, cart, checkout, and live order tracking. |
| **2. Venue Booking** | `/venues` | Banquet discovery, capacity filters, instant quotation generator. |
| **3. Hotel Operations (KDS)** | `/hotel/dashboard` | Branch switcher, Kitchen Display System (KDS), direct supply POs. |
| **4. Central Delivery App** | `/delivery` | Mobile-first driver cockpit, Online toggle, GPS tracking, OTP handoff. |
| **5. Platform Super Admin** | `/admin` | Hotel approvals, commission configurations, manual fleet reassignments. |
| **6. Supplier Portal** | `/supplier` | Optional portal for wholesale suppliers to review POs and dispatch goods. |

---

## 🔒 Security & Multi-Tenancy

- **Strict Tenant Isolation**: Negotiated supplier rates and PO records are isolated using PostgreSQL Row-Level Security.
- **Idempotent Payments**: Webhook verification using HMAC SHA256 signatures.
- **Snapshot Integrity**: Order items and PO items preserve immutable price snapshots.

---

## 🚢 Production Deployment (Vercel)

1. Push your repository to GitHub.
2. Import the project into Vercel.
3. Configure the environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`).
4. Click **Deploy**.
