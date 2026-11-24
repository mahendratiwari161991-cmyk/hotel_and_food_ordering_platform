-- ============================================================================
-- SEED DATA: HYBRID HOTEL PLATFORM (MUMBAI, INDIA)
-- Platform-Owned Hotels, 3rd-Party Hotels, Menu, Direct Suppliers & Fleets
-- ============================================================================

-- 1. Commission Plans
INSERT INTO commission_plans (id, name, food_commission_percent, venue_commission_percent, fixed_fee_per_order, description)
VALUES 
('11111111-1111-1111-1111-111111111111', 'Standard Third-Party Plan', 15.00, 10.00, 5.00, 'Marketplace partner standard tier'),
('22222222-2222-2222-2222-222222222222', 'Platform Owned Zero Commission', 0.00, 0.00, 0.00, 'Platform-owned hotels operate at zero platform commission');

-- 2. Organizations
-- (A) Platform-Owned Hotel Group
INSERT INTO organizations (id, name, slug, ownership_type, organization_status, commission_plan_id, primary_email, primary_phone, legal_business_name, gstin, banner_url, logo_url)
VALUES (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'Royal Heritage Hospitality Group',
    'royal-heritage',
    'platform_owned',
    'active',
    '22222222-2222-2222-2222-222222222222',
    'contact@royalheritagehotels.in',
    '+919820011223',
    'Royal Heritage Ventures India Pvt Ltd',
    '27AABCR1234F1Z5',
    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=200&q=80'
);

-- (B) Third-Party Hotel 1
INSERT INTO organizations (id, name, slug, ownership_type, organization_status, commission_plan_id, primary_email, primary_phone, legal_business_name, gstin, banner_url, logo_url)
VALUES (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'Spice Symphony & Grills',
    'spice-symphony',
    'third_party',
    'active',
    '11111111-1111-1111-1111-111111111111',
    'hello@spicesymphony.com',
    '+919820044556',
    'Symphony Gourmet Foods LLP',
    '27AAECS9876Q1Z2',
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=200&q=80'
);

-- (C) Third-Party Hotel 2
INSERT INTO organizations (id, name, slug, ownership_type, organization_status, commission_plan_id, primary_email, primary_phone, legal_business_name, gstin, banner_url, logo_url)
VALUES (
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    'Grand Deccan Palace & Banquets',
    'grand-deccan',
    'third_party',
    'active',
    '11111111-1111-1111-1111-111111111111',
    'events@granddeccan.in',
    '+919820077889',
    'Deccan Heritage Resorts LLP',
    '27AAGCD3344P1Z8',
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=200&q=80'
);

-- 3. Hotel Branches
-- Platform-Owned Branch 1 (Bandra West)
INSERT INTO hotel_branches (id, organization_id, branch_name, slug, address_line, city, state, pincode, latitude, longitude, contact_phone, contact_email, fssai_license_number, gstin, is_open, approval_status, average_preparation_time_mins)
VALUES (
    'a1111111-1111-1111-1111-111111111111',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'Royal Heritage - Bandra Flagship',
    'bandra-flagship',
    'Plot 45, Hill Road, Near Mehboob Studio, Bandra West',
    'Mumbai',
    'Maharashtra',
    '400050',
    19.0544,
    72.8276,
    '+919820011224',
    'bandra@royalheritagehotels.in',
    '11518001000452',
    '27AABCR1234F1Z5',
    true,
    'approved',
    25
);

-- Platform-Owned Branch 2 (Powai Galleria)
INSERT INTO hotel_branches (id, organization_id, branch_name, slug, address_line, city, state, pincode, latitude, longitude, contact_phone, contact_email, fssai_license_number, gstin, is_open, approval_status, average_preparation_time_mins)
VALUES (
    'a2222222-2222-2222-2222-222222222222',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'Royal Heritage - Powai Elite',
    'powai-elite',
    'Central Avenue, Hiranandani Gardens, Powai',
    'Mumbai',
    'Maharashtra',
    '400076',
    19.1197,
    72.9051,
    '+919820011225',
    'powai@royalheritagehotels.in',
    '11518001000453',
    '27AABCR1234F1Z5',
    true,
    'approved',
    30
);

-- Third-Party Branch 1 (Spice Symphony - Andheri East)
INSERT INTO hotel_branches (id, organization_id, branch_name, slug, address_line, city, state, pincode, latitude, longitude, contact_phone, contact_email, fssai_license_number, gstin, is_open, approval_status, average_preparation_time_mins)
VALUES (
    'b1111111-1111-1111-1111-111111111111',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'Spice Symphony - Chakala',
    'andheri-chakala',
    'Solitaire Corporate Park, Andheri-Kurla Road, Chakala, Andheri East',
    'Mumbai',
    'Maharashtra',
    '400093',
    19.1136,
    72.8697,
    '+919820044557',
    'andheri@spicesymphony.com',
    '11519002000881',
    '27AAECS9876Q1Z2',
    true,
    'approved',
    20
);

-- Third-Party Branch 2 (Grand Deccan Palace - Juhu)
INSERT INTO hotel_branches (id, organization_id, branch_name, slug, address_line, city, state, pincode, latitude, longitude, contact_phone, contact_email, fssai_license_number, gstin, is_open, approval_status, average_preparation_time_mins)
VALUES (
    'c1111111-1111-1111-1111-111111111111',
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    'Grand Deccan Palace - Juhu Beach',
    'juhu-beach',
    'Juhu Tara Road, Near Juhu Beach',
    'Mumbai',
    'Maharashtra',
    '400049',
    19.0988,
    72.8264,
    '+919820077880',
    'juhu@granddeccan.in',
    '11520003000994',
    '27AAGCD3344P1Z8',
    true,
    'approved',
    35
);

-- 4. User Profiles & Actors
INSERT INTO profiles (id, full_name, email, phone, system_role, avatar_url)
VALUES 
('10000000-0000-0000-0000-000000000001', 'Arjun Mehta (Platform Admin)', 'admin@hotelplatform.in', '+919900011111', 'platform_admin', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'),
('10000000-0000-0000-0000-000000000002', 'Vikramaditya Singhania', 'singhania@royalheritagehotels.in', '+919900022222', 'hotel_owner', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'),
('10000000-0000-0000-0000-000000000003', 'Chef Sanjeev Kapur (Bandra Branch)', 'chef.bandra@royalheritagehotels.in', '+919900033333', 'branch_manager', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80'),
('10000000-0000-0000-0000-000000000004', 'Karan Johar (Spice Symphony Owner)', 'karan@spicesymphony.com', '+919900044444', 'hotel_owner', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80'),
('10000000-0000-0000-0000-000000000005', 'Rajesh Sharma (Customer)', 'rajesh.sharma@gmail.com', '+919819012345', 'customer', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'),
('10000000-0000-0000-0000-000000000006', 'Ramesh Yadav (Delivery Partner)', 'ramesh.delivery@gmail.com', '+919833098765', 'delivery_partner', 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80'),
('10000000-0000-0000-0000-000000000007', 'Santosh Patil (FreshFarms Supplier)', 'sales@freshfarmsdairy.in', '+919821055555', 'supplier_user', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80');

-- 5. Customer Addresses
INSERT INTO customer_addresses (id, customer_id, label, address_line1, address_line2, landmark, city, state, pincode, latitude, longitude, is_default)
VALUES (
    'd1111111-1111-1111-1111-111111111111',
    '10000000-0000-0000-0000-000000000005',
    'Home',
    'Flat 802, Sea Pearl Towers, Carter Road',
    'Near Otters Club, Bandra West',
    'Carter Road Promenade',
    'Mumbai',
    'Maharashtra',
    '400050',
    19.0620,
    72.8235,
    true
);

-- 6. Delivery Fleet Partners
INSERT INTO delivery_partners (id, user_id, full_name, phone, vehicle_type, vehicle_number, driving_license_no, status, rating, total_completed_trips)
VALUES (
    'e1111111-1111-1111-1111-111111111111',
    '10000000-0000-0000-0000-000000000006',
    'Ramesh Yadav',
    '+919833098765',
    'bike',
    'MH-02-EE-4589',
    'MH0220190048123',
    'active',
    4.88,
    342
);

INSERT INTO delivery_partner_availability (id, delivery_partner_id, is_online, current_latitude, current_longitude, current_active_orders, last_ping_at)
VALUES (
    uuid_generate_v4(),
    'e1111111-1111-1111-1111-111111111111',
    true,
    19.0560,
    72.8290,
    0,
    NOW()
);

-- 7. Food Categories
INSERT INTO food_categories (id, organization_id, name, slug, icon_url, sort_order)
VALUES 
('f1111111-1111-1111-1111-111111111111', NULL, 'Biryani & Kebabs', 'biryani-kebabs', '🍛', 1),
('f2222222-2222-2222-2222-222222222222', NULL, 'North Indian Curries', 'north-indian', '🥘', 2),
('f3333333-3333-3333-3333-333333333333', NULL, 'Mughlai & Tandoor', 'mughlai-tandoor', '🍢', 3),
('f4444444-4444-4444-4444-444444444444', NULL, 'Artisan Breads & Rotis', 'artisan-breads', '🫓', 4),
('f5555555-5555-5555-5555-555555555555', NULL, 'Desserts & Sweets', 'desserts-sweets', '🍧', 5);

-- 8. Menu Items for Platform-Owned Hotel (Royal Heritage)
INSERT INTO menu_items (id, organization_id, category_id, name, slug, description, food_type, base_price, image_url, is_available, preparation_time_mins)
VALUES 
(
    'm1111111-1111-1111-1111-111111111111',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'f1111111-1111-1111-1111-111111111111',
    'Royal Awadhi Dum Biryani (Mutton)',
    'royal-awadhi-dum-biryani-mutton',
    'Slow-cooked succulent tender goat pieces marinated overnight in hand-ground spices and saffron basmati rice.',
    'non_veg',
    520.00,
    'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
    true,
    30
),
(
    'm2222222-2222-2222-2222-222222222222',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'f2222222-2222-2222-2222-222222222222',
    'Heritage Dal Makhani Bukhara',
    'heritage-dal-makhani-bukhara',
    'Black lentils simmered for 24 hours on slow charcoal with churned butter and Kashmiri chili cream.',
    'veg',
    380.00,
    'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
    true,
    20
),
(
    'm3333333-3333-3333-3333-333333333333',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'f2222222-2222-2222-2222-222222222222',
    'Paneer Lababdar',
    'paneer-lababdar',
    'Cottage cheese cubes tossed in rich onion-tomato gravy with grated paneer and kasuri methi.',
    'veg',
    410.00,
    'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
    true,
    20
),
(
    'm4444444-4444-4444-4444-444444444444',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'f4444444-4444-4444-4444-444444444444',
    'Garlic Butter Naan (2 pcs)',
    'garlic-butter-naan',
    'Clay oven baked leavened bread brushed with melted butter and fresh roasted minced garlic.',
    'veg',
    110.00,
    'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
    true,
    10
);

-- Menu items for Third-Party Hotel (Spice Symphony)
INSERT INTO menu_items (id, organization_id, category_id, name, slug, description, food_type, base_price, image_url, is_available, preparation_time_mins)
VALUES 
(
    'm5555555-5555-5555-5555-555555555555',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'f3333333-3333-3333-3333-333333333333',
    'Tandoori Murgh (Half/Full)',
    'tandoori-murgh',
    'Charcoal charred tender chicken marinated in spiced hung yogurt, mustard oil, and deggi mirch.',
    'non_veg',
    340.00,
    'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&q=80',
    true,
    25
),
(
    'm6666666-6666-6666-6666-666666666666',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'f1111111-1111-1111-1111-111111111111',
    'Hyderabadi Subz Dum Biryani',
    'hyderabadi-subz-dum-biryani',
    'Assorted garden vegetables, fried brown onions, mint, and long-grain basmati cooked on sealed steam.',
    'veg',
    320.00,
    'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
    true,
    20
);

-- 9. Variants and Add-ons
INSERT INTO menu_variants (id, menu_item_id, name, price_differential)
VALUES 
(uuid_generate_v4(), 'm5555555-5555-5555-5555-555555555555', 'Half (4 Pcs)', 0.00),
(uuid_generate_v4(), 'm5555555-5555-5555-5555-555555555555', 'Full (8 Pcs)', 260.00),
(uuid_generate_v4(), 'm1111111-1111-1111-1111-111111111111', 'Regular (Serves 1-2)', 0.00),
(uuid_generate_v4(), 'm1111111-1111-1111-1111-111111111111', 'Family Jumbo Pack (Serves 3-4)', 450.00);

INSERT INTO menu_addons (id, menu_item_id, name, price, is_optional)
VALUES 
(uuid_generate_v4(), 'm1111111-1111-1111-1111-111111111111', 'Extra Burani Garlic Raita', 45.00, true),
(uuid_generate_v4(), 'm1111111-1111-1111-1111-111111111111', 'Salalan Mirch Gravy', 40.00, true),
(uuid_generate_v4(), 'm2222222-2222-2222-2222-222222222222', 'Extra Amul White Butter Dollop', 30.00, true);

-- 10. Venues for Occasions & Event Bookings
INSERT INTO venues (id, branch_id, name, venue_type, capacity_min, capacity_max, base_rent_per_slot, photos, description, amenities, is_active)
VALUES 
(
    'v1111111-1111-1111-1111-111111111111',
    'a1111111-1111-1111-1111-111111111111', -- Royal Heritage Bandra
    'The Grand Sheesh Mahal Ballroom',
    'banquet_hall',
    80,
    450,
    65000.00,
    ARRAY['https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1000&q=80', 'https://images.unsplash.com/photo-1545232979-fbf68fe9f1f8?auto=format&fit=crop&w=1000&q=80'],
    'Ultra-luxury air-conditioned chandelier banquet hall perfect for wedding receptions, sangeet and milestone corporate galas.',
    ARRAY['Central AC', 'State of the art JBL Acoustics', '2 Bride/Groom Green Rooms', 'Valet Parking for 120 cars', 'Dedicated Generator Backup'],
    true
),
(
    'v2222222-2222-2222-2222-222222222222',
    'c1111111-1111-1111-1111-111111111111', -- Grand Deccan Juhu
    'Arabian Breeze Poolside Lawn',
    'lawn',
    100,
    700,
    95000.00,
    ARRAY['https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1000&q=80'],
    'Open-air landscaped lawn overlooking the Arabian sea, ideal for starlight sundowner weddings and cocktail evenings.',
    ARRAY['Ocean View', 'Infinity Pool Backdrop', 'Live Gazebo Counters', 'Valet Parking'],
    true
);

INSERT INTO event_packages (id, venue_id, package_name, veg_plate_price, non_veg_plate_price, included_services)
VALUES 
(
    uuid_generate_v4(),
    'v1111111-1111-1111-1111-111111111111',
    'Royal Imperial Spread',
    950.00,
    1250.00,
    '{"starters": 6, "mains": 8, "desserts": 4, "welcome_drinks": true, "live_pasta_counter": true}'::jsonb
),
(
    uuid_generate_v4(),
    'v2222222-2222-2222-2222-222222222222',
    'Coastal Breeze Gala Package',
    1100.00,
    1450.00,
    '{"starters": 8, "mains": 10, "desserts": 5, "welcome_mocktails": true, "barbecue_live_grill": true}'::jsonb
);

-- 11. Direct Hotel Suppliers & Isolated Procurement Agreements
INSERT INTO suppliers (id, company_name, trade_name, contact_name, email, phone, gstin, address, city, state, pincode, payment_terms_days)
VALUES 
(
    's1111111-1111-1111-1111-111111111111',
    'FreshFarms Dairy & Poultry Distributors',
    'FreshFarms Wholesale',
    'Santosh Patil',
    'orders@freshfarmsdairy.in',
    '+919821055555',
    '27AAFCD1122K1Z9',
    'Gala 14, APMC Market 2, Vashi',
    'Navi Mumbai',
    'Maharashtra',
    '400703',
    30
),
(
    's2222222-2222-2222-2222-222222222222',
    'Sahyadri Agro Organics',
    'Sahyadri Spices & Grains',
    'Mahesh Deshmukh',
    'supply@sahyadriagro.in',
    '+919821066666',
    '27AAGCS3322L1Z4',
    'Shop 204, Dana Bandar, Masjid Bunder',
    'Mumbai',
    'Maharashtra',
    '400009',
    21
);

-- Supplier Products in General Catalogue
INSERT INTO supplier_products (id, supplier_id, product_name, sku, category, unit_of_measure, standard_price)
VALUES 
('sp111111-1111-1111-1111-111111111111', 's1111111-1111-1111-1111-111111111111', 'Malai Paneer Premium Block', 'FF-PAN-01', 'Dairy', 'kg', 360.00),
('sp222222-2222-2222-2222-222222222222', 's1111111-1111-1111-1111-111111111111', 'Farm Fresh Spring Chicken (Curry Cut)', 'FF-CHK-02', 'Poultry', 'kg', 220.00),
('sp333333-3333-3333-3333-333333333333', 's1111111-1111-1111-1111-111111111111', 'Pure Desi Cow Ghee (Tin 15kg)', 'FF-GHE-03', 'Dairy', 'tin', 9500.00),
('sp444444-4444-4444-4444-444444444444', 's2222222-2222-2222-2222-222222222222', 'Royal Aged Daawat Basmati Rice (50kg Bag)', 'SA-RIC-01', 'Grains', 'bag', 4200.00);

-- Hotel Supplier Connection: Royal Heritage Bandra connected to FreshFarms
INSERT INTO hotel_supplier_connections (id, organization_id, branch_id, supplier_id, custom_supplier_code, status, credit_limit, credit_period_days)
VALUES (
    'hsc11111-1111-1111-1111-111111111111',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', -- Royal Heritage
    'a1111111-1111-1111-1111-111111111111', -- Bandra
    's1111111-1111-1111-1111-111111111111', -- FreshFarms
    'SUP-FF-001',
    'active',
    300000.00,
    30
);

-- NEGOTIATED PRICES (Private to Royal Heritage Hotel):
-- Note standard price for paneer was 360, Royal Heritage negotiated 325!
INSERT INTO hotel_supplier_products (id, hotel_supplier_connection_id, supplier_product_id, custom_item_name, negotiated_unit_price, tax_rate_percent, min_order_qty)
VALUES 
(
    uuid_generate_v4(),
    'hsc11111-1111-1111-1111-111111111111',
    'sp111111-1111-1111-1111-111111111111',
    'Malai Paneer Grade A',
    325.00, -- Negotiated discount
    5.00,
    10.00
),
(
    uuid_generate_v4(),
    'hsc11111-1111-1111-1111-111111111111',
    'sp222222-2222-2222-2222-222222222222',
    'Chicken Curry Cut Fresh',
    195.00, -- Negotiated discount from 220
    5.00,
    20.00
);

-- Sample Purchase Order for Royal Heritage Bandra
INSERT INTO purchase_orders (id, po_number, organization_id, branch_id, hotel_supplier_connection_id, expected_delivery_date, subtotal, tax_total, total_amount, status, created_by_user_id)
VALUES (
    'po111111-1111-1111-1111-111111111111',
    'PO-202611-0089',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'a1111111-1111-1111-1111-111111111111',
    'hsc11111-1111-1111-1111-111111111111',
    CURRENT_DATE + INTERVAL '1 day',
    10400.00,
    520.00,
    10920.00,
    'acknowledged',
    '10000000-0000-0000-0000-000000000003'
);

-- 12. Sample Live Order in the Marketplace
INSERT INTO orders (
    id,
    order_number,
    customer_id,
    organization_id,
    branch_id,
    delivery_address_id,
    delivery_address_snapshot,
    order_status,
    payment_status,
    payment_method,
    subtotal,
    tax_amount,
    packaging_fee,
    delivery_fee,
    discount_amount,
    total_amount,
    delivery_otp,
    pickup_otp,
    estimated_prep_mins
) VALUES (
    'ord11111-1111-1111-1111-111111111111',
    'ORD-202611-1042',
    '10000000-0000-0000-0000-000000000005', -- Rajesh Sharma
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', -- Royal Heritage
    'a1111111-1111-1111-1111-111111111111', -- Bandra Flagship
    'd1111111-1111-1111-1111-111111111111',
    '{"address": "Flat 802, Sea Pearl Towers, Carter Road, Bandra West, Mumbai 400050", "phone": "+919819012345", "name": "Rajesh Sharma"}'::jsonb,
    'on_the_way',
    'paid',
    'razorpay',
    1010.00,
    50.50,
    30.00,
    40.00,
    50.00,
    1080.50,
    '7842',
    '3190',
    25
);

INSERT INTO order_items (id, order_id, menu_item_id, item_name_snapshot, unit_price_snapshot, quantity, variant_snapshot, addons_snapshot, subtotal)
VALUES 
(
    uuid_generate_v4(),
    'ord11111-1111-1111-1111-111111111111',
    'm1111111-1111-1111-1111-111111111111',
    'Royal Awadhi Dum Biryani (Mutton)',
    520.00,
    1,
    '{"name": "Regular (Serves 1-2)"}'::jsonb,
    '{"name": "Extra Burani Garlic Raita", "price": 45}'::jsonb,
    565.00
),
(
    uuid_generate_v4(),
    'ord11111-1111-1111-1111-111111111111',
    'm2222222-2222-2222-2222-222222222222',
    'Heritage Dal Makhani Bukhara',
    380.00,
    1,
    NULL,
    '{"name": "Extra Amul White Butter Dollop", "price": 30}'::jsonb,
    410.00
),
(
    uuid_generate_v4(),
    'ord11111-1111-1111-1111-111111111111',
    'm4444444-4444-4444-4444-444444444444',
    'Garlic Butter Naan (2 pcs)',
    110.00,
    1,
    NULL,
    NULL,
    110.00
);

-- Delivery Assignment for Order ORD-202611-1042
INSERT INTO delivery_assignments (
    id,
    order_id,
    hotel_branch_id,
    delivery_partner_id,
    status,
    estimated_pickup_km,
    estimated_drop_km,
    estimated_payout,
    assigned_at,
    accepted_at,
    picked_up_at
) VALUES (
    'da111111-1111-1111-1111-111111111111',
    'ord11111-1111-1111-1111-111111111111',
    'a1111111-1111-1111-1111-111111111111',
    'e1111111-1111-1111-1111-111111111111',
    'picked_up',
    1.2,
    2.4,
    65.00,
    NOW() - INTERVAL '25 minutes',
    NOW() - INTERVAL '24 minutes',
    NOW() - INTERVAL '10 minutes'
);
