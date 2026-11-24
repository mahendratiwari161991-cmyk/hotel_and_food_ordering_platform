-- ============================================================================
-- HYBRID HOTEL MARKETPLACE, FOOD ORDERING, VENUE BOOKING, PROCUREMENT & DELIVERY
-- COMPREHENSIVE PRODUCTION POSTGRESQL SCHEMA (54 TABLES + RLS + TRIGGERS)
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Clean drop if recreating
-- ----------------------------------------------------------------------------
-- 1. PLATFORM CONFIGURATION & COMMISSION PLANS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS commission_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    food_commission_percent NUMERIC(5,2) DEFAULT 15.00,
    venue_commission_percent NUMERIC(5,2) DEFAULT 10.00,
    fixed_fee_per_order NUMERIC(8,2) DEFAULT 0.00,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 2. ORGANIZATIONS & HOTEL BRANCHES
-- ----------------------------------------------------------------------------
CREATE TYPE hotel_ownership_type AS ENUM ('platform_owned', 'third_party');
CREATE TYPE organization_status AS ENUM ('pending_approval', 'active', 'suspended', 'rejected');

CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    ownership_type hotel_ownership_type NOT NULL DEFAULT 'third_party',
    organization_status organization_status NOT NULL DEFAULT 'pending_approval',
    commission_plan_id UUID REFERENCES commission_plans(id) ON DELETE SET NULL,
    primary_email VARCHAR(255),
    primary_phone VARCHAR(20),
    legal_business_name VARCHAR(255),
    gstin VARCHAR(15),
    pan_number VARCHAR(10),
    bank_account_number VARCHAR(50),
    bank_ifsc VARCHAR(20),
    bank_name VARCHAR(100),
    banner_url TEXT,
    logo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS hotel_branches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    branch_name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    address_line TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL DEFAULT 'Maharashtra',
    pincode VARCHAR(10) NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    contact_phone VARCHAR(20) NOT NULL,
    contact_email VARCHAR(255),
    fssai_license_number VARCHAR(50),
    gstin VARCHAR(15),
    operating_hours JSONB DEFAULT '{"open": "09:00", "close": "23:00", "days": ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]}'::jsonb,
    is_open BOOLEAN DEFAULT true,
    approval_status VARCHAR(50) DEFAULT 'approved',
    average_preparation_time_mins INT DEFAULT 30,
    packaging_fee_base NUMERIC(8,2) DEFAULT 20.00,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_org_branch_slug UNIQUE (organization_id, slug)
);

-- ----------------------------------------------------------------------------
-- 3. PROFILES, STAFF & PERMISSIONS
-- ----------------------------------------------------------------------------
CREATE TYPE system_role AS ENUM (
    'platform_admin',
    'hotel_owner',
    'branch_manager',
    'kitchen_staff',
    'delivery_partner',
    'supplier_user',
    'customer'
);

CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE, -- references auth.users(id) in Supabase
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20) UNIQUE,
    system_role system_role NOT NULL DEFAULT 'customer',
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS hotel_staff (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES hotel_branches(id) ON DELETE CASCADE, -- NULL means organization-wide staff
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL DEFAULT 'branch_manager',
    permissions JSONB DEFAULT '{"can_manage_orders": true, "can_manage_menu": true, "can_procure": true, "can_manage_venues": true}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_staff_assignment UNIQUE (organization_id, branch_id, user_id)
);

CREATE TABLE IF NOT EXISTS hotel_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES hotel_branches(id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL, -- 'fssai', 'gst', 'pan', 'cancelled_cheque'
    storage_path TEXT NOT NULL,
    verification_status VARCHAR(50) DEFAULT 'verified',
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS customer_addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    label VARCHAR(50) DEFAULT 'Home', -- 'Home', 'Work', 'Other'
    address_line1 TEXT NOT NULL,
    address_line2 TEXT,
    landmark TEXT,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 4. CENTRALIZED DELIVERY FLEET
-- ----------------------------------------------------------------------------
CREATE TYPE delivery_vehicle_type AS ENUM ('bike', 'scooter', 'electric_vehicle', 'cycle');
CREATE TYPE delivery_partner_status AS ENUM ('pending_verification', 'active', 'offline', 'busy', 'suspended');

CREATE TABLE IF NOT EXISTS delivery_partners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    vehicle_type delivery_vehicle_type NOT NULL DEFAULT 'bike',
    vehicle_number VARCHAR(50) NOT NULL,
    driving_license_no VARCHAR(50),
    identity_doc_url TEXT,
    bank_account_no VARCHAR(50),
    bank_ifsc VARCHAR(20),
    status delivery_partner_status NOT NULL DEFAULT 'active',
    rating NUMERIC(3,2) DEFAULT 5.00,
    total_completed_trips INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS delivery_partner_availability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    delivery_partner_id UUID UNIQUE NOT NULL REFERENCES delivery_partners(id) ON DELETE CASCADE,
    is_online BOOLEAN DEFAULT false,
    current_latitude DOUBLE PRECISION,
    current_longitude DOUBLE PRECISION,
    current_active_orders INT DEFAULT 0,
    last_ping_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS delivery_locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    delivery_partner_id UUID NOT NULL REFERENCES delivery_partners(id) ON DELETE CASCADE,
    order_id UUID,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    heading DOUBLE PRECISION,
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS delivery_partner_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    delivery_partner_id UUID NOT NULL REFERENCES delivery_partners(id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL,
    file_url TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'approved',
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS delivery_earnings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    delivery_partner_id UUID NOT NULL REFERENCES delivery_partners(id) ON DELETE CASCADE,
    order_id UUID,
    base_pay NUMERIC(8,2) DEFAULT 35.00,
    distance_pay NUMERIC(8,2) DEFAULT 15.00,
    surge_pay NUMERIC(8,2) DEFAULT 0.00,
    tip_amount NUMERIC(8,2) DEFAULT 0.00,
    total_earned NUMERIC(8,2) NOT NULL,
    settlement_status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS delivery_incentives (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    delivery_partner_id UUID NOT NULL REFERENCES delivery_partners(id) ON DELETE CASCADE,
    target_trips INT NOT NULL,
    bonus_amount NUMERIC(8,2) NOT NULL,
    valid_date DATE DEFAULT CURRENT_DATE,
    achieved BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS delivery_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assignment_id UUID,
    status VARCHAR(50) NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 5. FOOD CATALOGUE, MENU, AND PRICING
-- ----------------------------------------------------------------------------
CREATE TYPE food_type AS ENUM ('veg', 'non_veg', 'egg', 'vegan');

CREATE TABLE IF NOT EXISTS food_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE, -- NULL means universal marketplace category
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    icon_url TEXT,
    sort_order INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS menu_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    category_id UUID REFERENCES food_categories(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    description TEXT,
    food_type food_type NOT NULL DEFAULT 'veg',
    base_price NUMERIC(10,2) NOT NULL,
    image_url TEXT,
    is_available BOOLEAN DEFAULT true,
    preparation_time_mins INT DEFAULT 20,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS menu_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    menu_item_id UUID NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL, -- 'Regular', 'Large', 'Half', 'Full'
    price_differential NUMERIC(10,2) DEFAULT 0.00
);

CREATE TABLE IF NOT EXISTS menu_addons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    menu_item_id UUID NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL, -- 'Extra Cheese', 'Extra Raita', 'Dip'
    price NUMERIC(10,2) NOT NULL DEFAULT 20.00,
    is_optional BOOLEAN DEFAULT true
);

-- Branch pricing overrides (enables chain-wide menu with local branch prices/stock)
CREATE TABLE IF NOT EXISTS branch_menu_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    branch_id UUID NOT NULL REFERENCES hotel_branches(id) ON DELETE CASCADE,
    menu_item_id UUID NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
    custom_price NUMERIC(10,2), -- overrides base_price if not null
    is_available BOOLEAN DEFAULT true,
    daily_stock_limit INT,
    CONSTRAINT unique_branch_menu_item UNIQUE (branch_id, menu_item_id)
);

-- ----------------------------------------------------------------------------
-- 6. ORDERS, CHECKOUT & REALTIME TRACKING
-- ----------------------------------------------------------------------------
CREATE TYPE order_status AS ENUM (
    'placed',
    'accepted',
    'preparing',
    'ready_for_pickup',
    'assigned',
    'picked_up',
    'on_the_way',
    'delivered',
    'cancelled'
);

CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded', 'cod_pending');
CREATE TYPE payment_method AS ENUM ('razorpay', 'cod', 'upi');

CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
    branch_id UUID NOT NULL REFERENCES hotel_branches(id) ON DELETE RESTRICT,
    delivery_address_id UUID REFERENCES customer_addresses(id),
    delivery_address_snapshot JSONB NOT NULL,
    order_status order_status NOT NULL DEFAULT 'placed',
    payment_status payment_status NOT NULL DEFAULT 'pending',
    payment_method payment_method NOT NULL DEFAULT 'razorpay',
    cancellation_reason TEXT,
    cooking_instructions TEXT,
    subtotal NUMERIC(10,2) NOT NULL,
    tax_amount NUMERIC(10,2) NOT NULL DEFAULT 0.00, -- GST (5% in India)
    packaging_fee NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    delivery_fee NUMERIC(10,2) NOT NULL DEFAULT 40.00,
    discount_amount NUMERIC(10,2) DEFAULT 0.00,
    total_amount NUMERIC(10,2) NOT NULL,
    platform_commission_amount NUMERIC(10,2) DEFAULT 0.00,
    delivery_otp VARCHAR(6) NOT NULL,
    pickup_otp VARCHAR(6) NOT NULL,
    estimated_prep_mins INT DEFAULT 25,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    menu_item_id UUID NOT NULL REFERENCES menu_items(id),
    item_name_snapshot VARCHAR(255) NOT NULL,
    unit_price_snapshot NUMERIC(10,2) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    variant_snapshot JSONB,
    addons_snapshot JSONB,
    subtotal NUMERIC(10,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS order_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    from_status order_status,
    to_status order_status NOT NULL,
    changed_by_user_id UUID REFERENCES profiles(id),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 7. CENTRALIZED DELIVERY ASSIGNMENTS
-- ----------------------------------------------------------------------------
CREATE TYPE assignment_status AS ENUM (
    'pending_acceptance',
    'accepted',
    'rejected',
    'arrived_hotel',
    'picked_up',
    'arrived_customer',
    'delivered',
    'cancelled'
);

CREATE TABLE IF NOT EXISTS delivery_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    hotel_branch_id UUID NOT NULL REFERENCES hotel_branches(id) ON DELETE RESTRICT,
    delivery_partner_id UUID REFERENCES delivery_partners(id) ON DELETE SET NULL,
    status assignment_status NOT NULL DEFAULT 'pending_acceptance',
    estimated_pickup_km NUMERIC(5,2),
    estimated_drop_km NUMERIC(5,2),
    estimated_payout NUMERIC(8,2) DEFAULT 50.00,
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    accepted_at TIMESTAMPTZ,
    picked_up_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ
);

-- ----------------------------------------------------------------------------
-- 8. PAYMENTS, REFUNDS, COUPONS & REVIEWS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    venue_booking_id UUID, -- linked to venue bookings
    customer_id UUID NOT NULL REFERENCES profiles(id),
    amount NUMERIC(10,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    gateway VARCHAR(50) DEFAULT 'razorpay',
    razorpay_order_id VARCHAR(100),
    razorpay_payment_id VARCHAR(100),
    razorpay_signature VARCHAR(255),
    status VARCHAR(50) DEFAULT 'success',
    idempotency_key VARCHAR(100) UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS refunds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payment_id UUID REFERENCES payments(id) ON DELETE CASCADE,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    amount NUMERIC(10,2) NOT NULL,
    reason TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'processed',
    razorpay_refund_id VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_type VARCHAR(20) DEFAULT 'percentage', -- 'percentage', 'flat'
    discount_value NUMERIC(10,2) NOT NULL,
    min_order_value NUMERIC(10,2) DEFAULT 0.00,
    max_discount NUMERIC(10,2) DEFAULT 100.00,
    applicable_organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    valid_until TIMESTAMPTZ,
    usage_limit INT DEFAULT 1000,
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID UNIQUE NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    branch_id UUID NOT NULL REFERENCES hotel_branches(id) ON DELETE CASCADE,
    delivery_partner_id UUID REFERENCES delivery_partners(id) ON DELETE SET NULL,
    food_rating INT CHECK (food_rating >= 1 AND food_rating <= 5),
    delivery_rating INT CHECK (delivery_rating >= 1 AND delivery_rating <= 5),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 9. VENUES & OCCASION/EVENT BOOKINGS
-- ----------------------------------------------------------------------------
CREATE TYPE venue_type AS ENUM ('banquet_hall', 'lawn', 'rooftop', 'poolside', 'conference_room');
CREATE TYPE slot_type AS ENUM ('morning', 'evening', 'full_day');
CREATE TYPE booking_status AS ENUM ('enquiry', 'quotation_sent', 'confirmed', 'completed', 'cancelled');

CREATE TABLE IF NOT EXISTS venues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    branch_id UUID NOT NULL REFERENCES hotel_branches(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    venue_type venue_type NOT NULL DEFAULT 'banquet_hall',
    capacity_min INT NOT NULL DEFAULT 50,
    capacity_max INT NOT NULL DEFAULT 500,
    base_rent_per_slot NUMERIC(10,2) NOT NULL DEFAULT 25000.00,
    photos TEXT[] DEFAULT '{}',
    description TEXT,
    amenities TEXT[] DEFAULT '{"AC","Stage","Sound System","Valet Parking","Green Room"}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS venue_time_slots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
    slot_type slot_type NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    slot_rent_multiplier NUMERIC(3,2) DEFAULT 1.00
);

CREATE TABLE IF NOT EXISTS event_packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
    package_name VARCHAR(150) NOT NULL, -- 'Silver Veg Delight', 'Royal Gold Buffet'
    veg_plate_price NUMERIC(10,2) NOT NULL DEFAULT 650.00,
    non_veg_plate_price NUMERIC(10,2) DEFAULT 850.00,
    included_services JSONB DEFAULT '{"decor": "Basic Floral", "welcome_drinks": true}'::jsonb
);

CREATE TABLE IF NOT EXISTS booking_enquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    enquiry_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    branch_id UUID NOT NULL REFERENCES hotel_branches(id) ON DELETE RESTRICT,
    venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE RESTRICT,
    event_type VARCHAR(100) NOT NULL, -- 'Wedding', 'Birthday', 'Corporate'
    guest_count INT NOT NULL,
    target_date DATE NOT NULL,
    slot_type slot_type NOT NULL,
    food_preference VARCHAR(50) DEFAULT 'both',
    special_requirements TEXT,
    status VARCHAR(50) DEFAULT 'submitted', -- 'submitted', 'quoted', 'accepted', 'declined'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS booking_quotations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    enquiry_id UUID NOT NULL REFERENCES booking_enquiries(id) ON DELETE CASCADE,
    venue_id UUID NOT NULL REFERENCES venues(id),
    rent_amount NUMERIC(10,2) NOT NULL,
    food_package_amount NUMERIC(10,2) NOT NULL,
    decoration_amount NUMERIC(10,2) DEFAULT 0.00,
    taxes_amount NUMERIC(10,2) NOT NULL DEFAULT 0.00, -- GST 18% on venue hire
    advance_percentage_required NUMERIC(5,2) DEFAULT 30.00,
    advance_amount NUMERIC(10,2) NOT NULL,
    total_amount NUMERIC(10,2) NOT NULL,
    terms_and_conditions TEXT,
    valid_until TIMESTAMPTZ NOT NULL,
    status VARCHAR(50) DEFAULT 'sent', -- 'draft', 'sent', 'accepted', 'rejected'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS venue_bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_number VARCHAR(50) UNIQUE NOT NULL,
    quotation_id UUID REFERENCES booking_quotations(id),
    customer_id UUID NOT NULL REFERENCES profiles(id),
    branch_id UUID NOT NULL REFERENCES hotel_branches(id),
    venue_id UUID NOT NULL REFERENCES venues(id),
    booking_date DATE NOT NULL,
    slot_type slot_type NOT NULL,
    guest_count INT NOT NULL,
    total_amount NUMERIC(10,2) NOT NULL,
    advance_paid NUMERIC(10,2) NOT NULL,
    balance_due NUMERIC(10,2) NOT NULL,
    status booking_status NOT NULL DEFAULT 'confirmed',
    cancellation_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    -- Enforce strict double booking prevention constraint at DB level
    CONSTRAINT unique_venue_slot_booking UNIQUE (venue_id, booking_date, slot_type)
);

CREATE TABLE IF NOT EXISTS venue_availability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
    slot_date DATE NOT NULL,
    slot_type slot_type NOT NULL,
    is_locked BOOLEAN DEFAULT false,
    booking_id UUID REFERENCES venue_bookings(id) ON DELETE SET NULL,
    CONSTRAINT unique_venue_availability UNIQUE (venue_id, slot_date, slot_type)
);

CREATE TABLE IF NOT EXISTS booking_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES venue_bookings(id) ON DELETE CASCADE,
    payment_stage VARCHAR(50) NOT NULL, -- 'advance', 'final_balance'
    amount NUMERIC(10,2) NOT NULL,
    payment_id UUID REFERENCES payments(id),
    status VARCHAR(50) DEFAULT 'paid',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 10. DIRECT HOTEL PROCUREMENT & SUPPLIER MANAGEMENT
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name VARCHAR(255) NOT NULL,
    trade_name VARCHAR(255),
    contact_name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20) NOT NULL,
    gstin VARCHAR(15),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100) DEFAULT 'Maharashtra',
    pincode VARCHAR(10),
    payment_terms_days INT DEFAULT 30,
    bank_account_no VARCHAR(50),
    bank_ifsc VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS supplier_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    supplier_id UUID NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'admin',
    CONSTRAINT unique_supplier_user UNIQUE (supplier_id, user_id)
);

-- Private link between a hotel organization/branch and its independent supplier
CREATE TABLE IF NOT EXISTS hotel_supplier_connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES hotel_branches(id) ON DELETE CASCADE, -- NULL means organization-wide
    supplier_id UUID NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
    custom_supplier_code VARCHAR(50),
    status VARCHAR(50) DEFAULT 'active',
    credit_limit NUMERIC(12,2) DEFAULT 200000.00,
    credit_period_days INT DEFAULT 30,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_hotel_supplier_conn UNIQUE (organization_id, branch_id, supplier_id)
);

-- General Supplier Catalogue
CREATE TABLE IF NOT EXISTS supplier_products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    supplier_id UUID NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
    product_name VARCHAR(255) NOT NULL,
    sku VARCHAR(100),
    category VARCHAR(100) NOT NULL, -- 'Dairy', 'Vegetables', 'Meat', 'Grains', 'Packaging'
    unit_of_measure VARCHAR(50) NOT NULL DEFAULT 'kg', -- 'kg', 'litre', 'box', 'piece'
    standard_price NUMERIC(10,2) NOT NULL,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- HOTEL-SPECIFIC PRIVATE NEGOTIATED PRICES (Strictly isolated per hotel)
CREATE TABLE IF NOT EXISTS hotel_supplier_products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hotel_supplier_connection_id UUID NOT NULL REFERENCES hotel_supplier_connections(id) ON DELETE CASCADE,
    supplier_product_id UUID NOT NULL REFERENCES supplier_products(id) ON DELETE CASCADE,
    custom_item_name VARCHAR(255),
    negotiated_unit_price NUMERIC(10,2) NOT NULL,
    tax_rate_percent NUMERIC(5,2) DEFAULT 5.00,
    min_order_qty NUMERIC(10,2) DEFAULT 1.00,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_hotel_supplier_product UNIQUE (hotel_supplier_connection_id, supplier_product_id)
);

CREATE TYPE po_status AS ENUM (
    'draft',
    'sent_to_supplier',
    'acknowledged',
    'dispatched',
    'partially_received',
    'received_complete',
    'cancelled'
);

CREATE TABLE IF NOT EXISTS purchase_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    po_number VARCHAR(50) UNIQUE NOT NULL,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
    branch_id UUID REFERENCES hotel_branches(id) ON DELETE RESTRICT,
    hotel_supplier_connection_id UUID NOT NULL REFERENCES hotel_supplier_connections(id) ON DELETE RESTRICT,
    expected_delivery_date DATE,
    subtotal NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    tax_total NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    total_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    status po_status NOT NULL DEFAULT 'draft',
    supplier_notes TEXT,
    created_by_user_id UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS purchase_order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    purchase_order_id UUID NOT NULL REFERENCES purchase_orders(id) ON DELETE CASCADE,
    hotel_supplier_product_id UUID NOT NULL REFERENCES hotel_supplier_products(id),
    item_name_snapshot VARCHAR(255) NOT NULL,
    unit_snapshot VARCHAR(50) NOT NULL,
    ordered_quantity NUMERIC(10,2) NOT NULL,
    received_quantity NUMERIC(10,2) DEFAULT 0.00,
    negotiated_price_snapshot NUMERIC(10,2) NOT NULL,
    line_total NUMERIC(12,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS purchase_order_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    purchase_order_id UUID NOT NULL REFERENCES purchase_orders(id) ON DELETE CASCADE,
    from_status po_status,
    to_status po_status NOT NULL,
    updated_by UUID REFERENCES profiles(id),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Support for Partial Deliveries & Physical Receipts
CREATE TABLE IF NOT EXISTS purchase_receipts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    purchase_order_id UUID NOT NULL REFERENCES purchase_orders(id) ON DELETE CASCADE,
    receipt_number VARCHAR(50) UNIQUE NOT NULL,
    delivery_challan_no VARCHAR(100),
    received_at TIMESTAMPTZ DEFAULT NOW(),
    received_by_user_id UUID REFERENCES profiles(id),
    notes TEXT
);

CREATE TABLE IF NOT EXISTS purchase_receipt_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    purchase_receipt_id UUID NOT NULL REFERENCES purchase_receipts(id) ON DELETE CASCADE,
    purchase_order_item_id UUID NOT NULL REFERENCES purchase_order_items(id) ON DELETE CASCADE,
    accepted_quantity NUMERIC(10,2) NOT NULL,
    rejected_quantity NUMERIC(10,2) DEFAULT 0.00,
    rejection_reason VARCHAR(100) -- 'damaged', 'expired', 'shortage', 'wrong_grade'
);

CREATE TABLE IF NOT EXISTS supplier_invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    purchase_order_id UUID NOT NULL REFERENCES purchase_orders(id) ON DELETE CASCADE,
    supplier_id UUID NOT NULL REFERENCES suppliers(id) ON DELETE RESTRICT,
    invoice_number VARCHAR(100) NOT NULL,
    invoice_date DATE NOT NULL,
    invoice_amount NUMERIC(12,2) NOT NULL,
    file_storage_path TEXT,
    approval_status VARCHAR(50) DEFAULT 'verified',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS supplier_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    supplier_invoice_id UUID REFERENCES supplier_invoices(id) ON DELETE SET NULL,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
    amount_paid NUMERIC(12,2) NOT NULL,
    payment_date DATE NOT NULL,
    payment_mode VARCHAR(50) DEFAULT 'neft', -- 'neft', 'rtgs', 'cheque', 'upi'
    reference_number VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS purchase_returns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    purchase_order_id UUID NOT NULL REFERENCES purchase_orders(id) ON DELETE CASCADE,
    supplier_id UUID NOT NULL REFERENCES suppliers(id) ON DELETE RESTRICT,
    reason TEXT NOT NULL,
    amount NUMERIC(12,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 11. PLATFORM SETTINGS, SETTLEMENTS & AUDITING
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS platform_settings (
    key VARCHAR(100) PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'order_update',
    is_read BOOLEAN DEFAULT false,
    action_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS support_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_number VARCHAR(50) UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES profiles(id),
    subject VARCHAR(255) NOT NULL,
    category VARCHAR(100) DEFAULT 'order_issue',
    priority VARCHAR(50) DEFAULT 'medium',
    status VARCHAR(50) DEFAULT 'open',
    assigned_to UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id VARCHAR(100) NOT NULL,
    metadata JSONB,
    ip_address VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS organization_invitations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'branch_manager',
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    status VARCHAR(50) DEFAULT 'pending'
);

CREATE TABLE IF NOT EXISTS settlement_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    cycle_start DATE NOT NULL,
    cycle_end DATE NOT NULL,
    gross_sales NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    platform_commission NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    taxes_collected NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    net_payable NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    status VARCHAR(50) DEFAULT 'processed',
    payout_ref VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- INDEXES FOR PERFORMANCE & SEARCH
-- ----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_branches_org ON hotel_branches(organization_id);
CREATE INDEX IF NOT EXISTS idx_branches_location ON hotel_branches(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_branch ON orders(branch_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(order_status);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_delivery_assignments_order ON delivery_assignments(order_id);
CREATE INDEX IF NOT EXISTS idx_delivery_partner_avail ON delivery_partner_availability(is_online);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_org ON purchase_orders(organization_id);
CREATE INDEX IF NOT EXISTS idx_hotel_supp_prod_conn ON hotel_supplier_products(hotel_supplier_connection_id);
CREATE INDEX IF NOT EXISTS idx_venue_bookings_date ON venue_bookings(booking_date, venue_id);

-- ----------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ----------------------------------------------------------------------------
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE hotel_branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE hotel_supplier_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_assignments ENABLE ROW LEVEL SECURITY;

-- 1. Public read for active hotels & branches
CREATE POLICY "Public can view active organizations" ON organizations
    FOR SELECT USING (organization_status = 'active');

CREATE POLICY "Public can view approved branches" ON hotel_branches
    FOR SELECT USING (approval_status = 'approved');

-- 2. Orders isolation
CREATE POLICY "Customers can view their own orders" ON orders
    FOR SELECT USING (auth.uid() = customer_id);

-- 3. Strict Procurement Privacy (Never expose hotel negotiated prices or POs)
CREATE POLICY "Hotels can only see their own purchase orders" ON purchase_orders
    FOR ALL USING (
        organization_id IN (
            SELECT organization_id FROM hotel_staff WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Hotels can only see their own negotiated supplier products" ON hotel_supplier_products
    FOR ALL USING (
        hotel_supplier_connection_id IN (
            SELECT id FROM hotel_supplier_connections WHERE organization_id IN (
                SELECT organization_id FROM hotel_staff WHERE user_id = auth.uid()
            )
        )
    );
