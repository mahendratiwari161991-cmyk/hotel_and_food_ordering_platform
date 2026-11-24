import { 
  Organization, 
  HotelBranch, 
  MenuItem, 
  Order, 
  DeliveryPartner, 
  DeliveryAssignment, 
  Venue, 
  BookingEnquiry, 
  BookingQuotation, 
  VenueBooking, 
  Supplier, 
  PurchaseOrder, 
  PurchaseReceipt,
  HotelSupplierConnection,
  HotelSupplierProduct,
  CommissionPlan
} from '../types';

export class PlatformStore {
  private static instance: PlatformStore;

  organizations: Organization[] = [
    {
      id: 'org-platform-1',
      name: 'Royal Heritage Hospitality Group',
      slug: 'royal-heritage',
      ownership_type: 'platform_owned',
      organization_status: 'active',
      primary_email: 'contact@royalheritagehotels.in',
      primary_phone: '+919820011223',
      legal_business_name: 'Royal Heritage Ventures India Pvt Ltd',
      gstin: '27AABCR1234F1Z5',
      banner_url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
      logo_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=200&q=80',
      created_at: new Date().toISOString(),
    },
    {
      id: 'org-partner-1',
      name: 'Spice Symphony & Grills',
      slug: 'spice-symphony',
      ownership_type: 'third_party',
      organization_status: 'active',
      primary_email: 'hello@spicesymphony.com',
      primary_phone: '+919820044556',
      legal_business_name: 'Symphony Gourmet Foods LLP',
      gstin: '27AAECS9876Q1Z2',
      banner_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
      logo_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=200&q=80',
      created_at: new Date().toISOString(),
    },
    {
      id: 'org-partner-2',
      name: 'Grand Deccan Palace & Banquets',
      slug: 'grand-deccan',
      ownership_type: 'third_party',
      organization_status: 'active',
      primary_email: 'events@granddeccan.in',
      primary_phone: '+919820077889',
      legal_business_name: 'Deccan Heritage Resorts LLP',
      gstin: '27AAGCD3344P1Z8',
      banner_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
      logo_url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=200&q=80',
      created_at: new Date().toISOString(),
    }
  ];

  branches: HotelBranch[] = [
    {
      id: 'branch-rh-bandra',
      organization_id: 'org-platform-1',
      branch_name: 'Royal Heritage - Bandra Flagship',
      slug: 'bandra-flagship',
      address_line: 'Plot 45, Hill Road, Near Mehboob Studio, Bandra West',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400050',
      latitude: 19.0544,
      longitude: 72.8276,
      contact_phone: '+919820011224',
      contact_email: 'bandra@royalheritagehotels.in',
      fssai_license_number: '11518001000452',
      gstin: '27AABCR1234F1Z5',
      is_open: true,
      approval_status: 'approved',
      average_preparation_time_mins: 25,
      packaging_fee_base: 25.00,
    },
    {
      id: 'branch-rh-powai',
      organization_id: 'org-platform-1',
      branch_name: 'Royal Heritage - Powai Elite',
      slug: 'powai-elite',
      address_line: 'Central Avenue, Hiranandani Gardens, Powai',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400076',
      latitude: 19.1197,
      longitude: 72.9051,
      contact_phone: '+919820011225',
      contact_email: 'powai@royalheritagehotels.in',
      fssai_license_number: '11518001000453',
      gstin: '27AABCR1234F1Z5',
      is_open: true,
      approval_status: 'approved',
      average_preparation_time_mins: 30,
      packaging_fee_base: 25.00,
    },
    {
      id: 'branch-spice-andheri',
      organization_id: 'org-partner-1',
      branch_name: 'Spice Symphony - Chakala',
      slug: 'andheri-chakala',
      address_line: 'Solitaire Corporate Park, Chakala, Andheri East',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400093',
      latitude: 19.1136,
      longitude: 72.8697,
      contact_phone: '+919820044557',
      contact_email: 'andheri@spicesymphony.com',
      fssai_license_number: '11519002000881',
      gstin: '27AAECS9876Q1Z2',
      is_open: true,
      approval_status: 'approved',
      average_preparation_time_mins: 20,
      packaging_fee_base: 20.00,
    },
    {
      id: 'branch-deccan-juhu',
      organization_id: 'org-partner-2',
      branch_name: 'Grand Deccan Palace - Juhu Beach',
      slug: 'juhu-beach',
      address_line: 'Juhu Tara Road, Near Juhu Beach',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400049',
      latitude: 19.0988,
      longitude: 72.8264,
      contact_phone: '+919820077880',
      contact_email: 'juhu@granddeccan.in',
      fssai_license_number: '11520003000994',
      gstin: '27AAGCD3344P1Z8',
      is_open: true,
      approval_status: 'approved',
      average_preparation_time_mins: 35,
      packaging_fee_base: 30.00,
    }
  ];

  menuItems: MenuItem[] = [
    {
      id: 'item-1',
      organization_id: 'org-platform-1',
      name: 'Royal Awadhi Dum Biryani (Mutton)',
      slug: 'royal-awadhi-dum-biryani-mutton',
      description: 'Slow-cooked succulent tender goat pieces marinated overnight in hand-ground spices and saffron basmati rice.',
      food_type: 'non_veg',
      base_price: 520,
      image_url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
      is_available: true,
      preparation_time_mins: 30,
      variants: [
        { id: 'v1', menu_item_id: 'item-1', name: 'Regular (Serves 1-2)', price_differential: 0 },
        { id: 'v2', menu_item_id: 'item-1', name: 'Family Pack (Serves 3-4)', price_differential: 450 }
      ],
      addons: [
        { id: 'a1', menu_item_id: 'item-1', name: 'Extra Burani Garlic Raita', price: 45, is_optional: true },
        { id: 'a2', menu_item_id: 'item-1', name: 'Salalan Mirch Gravy', price: 40, is_optional: true }
      ]
    },
    {
      id: 'item-2',
      organization_id: 'org-platform-1',
      name: 'Heritage Dal Makhani Bukhara',
      slug: 'heritage-dal-makhani-bukhara',
      description: 'Black lentils simmered for 24 hours on slow charcoal with churned butter and Kashmiri chili cream.',
      food_type: 'veg',
      base_price: 380,
      image_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
      is_available: true,
      preparation_time_mins: 20,
      addons: [
        { id: 'a3', menu_item_id: 'item-2', name: 'Extra Amul White Butter Dollop', price: 30, is_optional: true }
      ]
    },
    {
      id: 'item-3',
      organization_id: 'org-platform-1',
      name: 'Paneer Lababdar',
      slug: 'paneer-lababdar',
      description: 'Cottage cheese cubes tossed in rich onion-tomato gravy with grated paneer and kasuri methi.',
      food_type: 'veg',
      base_price: 410,
      image_url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
      is_available: true,
      preparation_time_mins: 20
    },
    {
      id: 'item-4',
      organization_id: 'org-platform-1',
      name: 'Garlic Butter Naan (2 pcs)',
      slug: 'garlic-butter-naan',
      description: 'Clay oven baked leavened bread brushed with melted butter and fresh roasted minced garlic.',
      food_type: 'veg',
      base_price: 110,
      image_url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
      is_available: true,
      preparation_time_mins: 10
    },
    {
      id: 'item-5',
      organization_id: 'org-partner-1',
      name: 'Tandoori Murgh Bhatti Style',
      slug: 'tandoori-murgh',
      description: 'Charcoal charred tender chicken marinated in spiced hung yogurt, mustard oil, and deggi mirch.',
      food_type: 'non_veg',
      base_price: 340,
      image_url: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&q=80',
      is_available: true,
      preparation_time_mins: 25,
      variants: [
        { id: 'v3', menu_item_id: 'item-5', name: 'Half (4 Pcs)', price_differential: 0 },
        { id: 'v4', menu_item_id: 'item-5', name: 'Full (8 Pcs)', price_differential: 260 }
      ]
    },
    {
      id: 'item-6',
      organization_id: 'org-partner-1',
      name: 'Hyderabadi Subz Dum Biryani',
      slug: 'hyderabadi-subz-dum-biryani',
      description: 'Assorted garden vegetables, fried brown onions, mint, and long-grain basmati cooked on sealed steam.',
      food_type: 'veg',
      base_price: 320,
      image_url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
      is_available: true,
      preparation_time_mins: 20
    },
    {
      id: 'item-7',
      organization_id: 'org-partner-2',
      name: 'Deccan Coastal Prawn Curry',
      slug: 'deccan-coastal-prawn-curry',
      description: 'Fresh tiger prawns simmered in kokum-infused spicy coconut milk curry with curry leaves.',
      food_type: 'non_veg',
      base_price: 580,
      image_url: 'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=600&q=80',
      is_available: true,
      preparation_time_mins: 25
    }
  ];

  deliveryPartners: DeliveryPartner[] = [
    {
      id: 'dp-1',
      user_id: 'user-dp-1',
      full_name: 'Ramesh Yadav',
      phone: '+919833098765',
      vehicle_type: 'bike',
      vehicle_number: 'MH-02-EE-4589',
      driving_license_no: 'MH0220190048123',
      status: 'active',
      rating: 4.88,
      total_completed_trips: 342,
      current_latitude: 19.0560,
      current_longitude: 72.8290,
      is_online: true,
    },
    {
      id: 'dp-2',
      user_id: 'user-dp-2',
      full_name: 'Sachin Kadam',
      phone: '+919833098766',
      vehicle_type: 'electric_vehicle',
      vehicle_number: 'MH-03-EV-1102',
      driving_license_no: 'MH0320210088991',
      status: 'active',
      rating: 4.92,
      total_completed_trips: 410,
      current_latitude: 19.1150,
      current_longitude: 72.8710,
      is_online: true,
    },
    {
      id: 'dp-3',
      user_id: 'user-dp-3',
      full_name: 'Altaf Khan',
      phone: '+919833098767',
      vehicle_type: 'scooter',
      vehicle_number: 'MH-02-BX-7744',
      driving_license_no: 'MH0220180011234',
      status: 'active',
      rating: 4.75,
      total_completed_trips: 215,
      current_latitude: 19.0995,
      current_longitude: 72.8270,
      is_online: true,
    }
  ];

  orders: Order[] = [
    {
      id: 'ord-1042',
      order_number: 'ORD-202611-1042',
      customer_id: 'cust-1',
      organization_id: 'org-platform-1',
      branch_id: 'branch-rh-bandra',
      delivery_address_snapshot: {
        name: 'Rajesh Sharma',
        phone: '+919819012345',
        address: 'Flat 802, Sea Pearl Towers, Carter Road, Bandra West, Mumbai 400050'
      },
      order_status: 'on_the_way',
      payment_status: 'paid',
      payment_method: 'razorpay',
      subtotal: 1010,
      tax_amount: 50.50,
      packaging_fee: 30,
      delivery_fee: 40,
      discount_amount: 50,
      total_amount: 1080.50,
      platform_commission_amount: 0, // 0 for platform owned
      delivery_otp: '7842',
      pickup_otp: '3190',
      estimated_prep_mins: 25,
      created_at: new Date(Date.now() - 35 * 60000).toISOString(),
      items: [
        {
          id: 'oi-1',
          order_id: 'ord-1042',
          menu_item_id: 'item-1',
          item_name_snapshot: 'Royal Awadhi Dum Biryani (Mutton)',
          unit_price_snapshot: 520,
          quantity: 1,
          variant_snapshot: { name: 'Regular (Serves 1-2)' },
          addons_snapshot: [{ name: 'Extra Burani Garlic Raita', price: 45 }],
          subtotal: 565
        },
        {
          id: 'oi-2',
          order_id: 'ord-1042',
          menu_item_id: 'item-2',
          item_name_snapshot: 'Heritage Dal Makhani Bukhara',
          unit_price_snapshot: 380,
          quantity: 1,
          addons_snapshot: [{ name: 'Extra Amul White Butter Dollop', price: 30 }],
          subtotal: 410
        }
      ],
      delivery_assignment: {
        id: 'da-1',
        order_id: 'ord-1042',
        hotel_branch_id: 'branch-rh-bandra',
        delivery_partner_id: 'dp-1',
        status: 'picked_up',
        estimated_pickup_km: 1.2,
        estimated_drop_km: 2.4,
        estimated_payout: 65,
        assigned_at: new Date(Date.now() - 25 * 60000).toISOString(),
        accepted_at: new Date(Date.now() - 24 * 60000).toISOString(),
        picked_up_at: new Date(Date.now() - 10 * 60000).toISOString()
      }
    }
  ];

  venues: Venue[] = [
    {
      id: 'venue-1',
      branch_id: 'branch-rh-bandra',
      name: 'The Grand Sheesh Mahal Ballroom',
      venue_type: 'banquet_hall',
      capacity_min: 80,
      capacity_max: 450,
      base_rent_per_slot: 65000,
      photos: [
        'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1545232979-fbf68fe9f1f8?auto=format&fit=crop&w=1000&q=80'
      ],
      description: 'Ultra-luxury air-conditioned chandelier banquet hall perfect for wedding receptions, sangeet and milestone corporate galas.',
      amenities: ['Central AC', 'State of the art JBL Acoustics', '2 Bride/Groom Green Rooms', 'Valet Parking for 120 cars', 'Dedicated Generator Backup'],
      is_active: true
    },
    {
      id: 'venue-2',
      branch_id: 'branch-deccan-juhu',
      name: 'Arabian Breeze Poolside Lawn',
      venue_type: 'lawn',
      capacity_min: 100,
      capacity_max: 700,
      base_rent_per_slot: 95000,
      photos: [
        'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1000&q=80'
      ],
      description: 'Open-air landscaped lawn overlooking the Arabian sea, ideal for starlight sundowner weddings and cocktail evenings.',
      amenities: ['Ocean View', 'Infinity Pool Backdrop', 'Live Gazebo Counters', 'Valet Parking'],
      is_active: true
    }
  ];

  bookingEnquiries: BookingEnquiry[] = [
    {
      id: 'enq-101',
      enquiry_number: 'ENQ-202611-044',
      customer_id: 'cust-1',
      branch_id: 'branch-rh-bandra',
      venue_id: 'venue-1',
      event_type: 'Wedding Sangeet',
      guest_count: 250,
      target_date: '2026-12-15',
      slot_type: 'evening',
      food_preference: 'both',
      special_requirements: 'Require live chaat counter and floral entrance arch.',
      status: 'quoted',
      created_at: new Date(Date.now() - 48 * 3600000).toISOString()
    }
  ];

  bookingQuotations: BookingQuotation[] = [
    {
      id: 'quote-101',
      enquiry_id: 'enq-101',
      venue_id: 'venue-1',
      rent_amount: 65000,
      food_package_amount: 287500, // 250 guests * 1150
      decoration_amount: 45000,
      taxes_amount: 71550, // 18% GST
      advance_percentage_required: 30,
      advance_amount: 140715,
      total_amount: 469050,
      terms_and_conditions: '30% advance on booking confirmation. Balance payable 48 hours before the event date.',
      valid_until: '2026-11-30T23:59:59Z',
      status: 'sent'
    }
  ];

  venueBookings: VenueBooking[] = [];

  suppliers: Supplier[] = [
    {
      id: 'sup-1',
      company_name: 'FreshFarms Dairy & Poultry Distributors',
      trade_name: 'FreshFarms Wholesale',
      contact_name: 'Santosh Patil',
      email: 'orders@freshfarmsdairy.in',
      phone: '+919821055555',
      gstin: '27AAFCD1122K1Z9',
      address: 'Gala 14, APMC Market 2, Vashi',
      city: 'Navi Mumbai',
      state: 'Maharashtra',
      pincode: '400703',
      payment_terms_days: 30,
      is_active: true
    },
    {
      id: 'sup-2',
      company_name: 'Sahyadri Agro Organics',
      trade_name: 'Sahyadri Spices & Grains',
      contact_name: 'Mahesh Deshmukh',
      email: 'supply@sahyadriagro.in',
      phone: '+919821066666',
      gstin: '27AAGCS3322L1Z4',
      address: 'Shop 204, Dana Bandar, Masjid Bunder',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400009',
      payment_terms_days: 21,
      is_active: true
    }
  ];

  supplierConnections: HotelSupplierConnection[] = [
    {
      id: 'conn-1',
      organization_id: 'org-platform-1',
      branch_id: 'branch-rh-bandra',
      supplier_id: 'sup-1',
      custom_supplier_code: 'SUP-FF-001',
      status: 'active',
      credit_limit: 300000,
      credit_period_days: 30
    }
  ];

  hotelSupplierProducts: HotelSupplierProduct[] = [
    {
      id: 'hsp-1',
      hotel_supplier_connection_id: 'conn-1',
      supplier_product_id: 'sp-1',
      custom_item_name: 'Malai Paneer Grade A',
      negotiated_unit_price: 325, // negotiated from 360
      tax_rate_percent: 5,
      min_order_qty: 10,
      supplier_product: {
        id: 'sp-1',
        supplier_id: 'sup-1',
        product_name: 'Malai Paneer Premium Block',
        category: 'Dairy',
        unit_of_measure: 'kg',
        standard_price: 360,
        is_available: true
      }
    },
    {
      id: 'hsp-2',
      hotel_supplier_connection_id: 'conn-1',
      supplier_product_id: 'sp-2',
      custom_item_name: 'Chicken Curry Cut Fresh',
      negotiated_unit_price: 195, // negotiated from 220
      tax_rate_percent: 5,
      min_order_qty: 20,
      supplier_product: {
        id: 'sp-2',
        supplier_id: 'sup-1',
        product_name: 'Farm Fresh Spring Chicken (Curry Cut)',
        category: 'Poultry',
        unit_of_measure: 'kg',
        standard_price: 220,
        is_available: true
      }
    }
  ];

  purchaseOrders: PurchaseOrder[] = [
    {
      id: 'po-101',
      po_number: 'PO-202611-0089',
      organization_id: 'org-platform-1',
      branch_id: 'branch-rh-bandra',
      hotel_supplier_connection_id: 'conn-1',
      expected_delivery_date: '2026-11-26',
      subtotal: 10400,
      tax_total: 520,
      total_amount: 10920,
      status: 'acknowledged',
      supplier_notes: 'Please pack in insulated boxes.',
      created_at: new Date(Date.now() - 24 * 3600000).toISOString(),
      items: [
        {
          id: 'poi-1',
          purchase_order_id: 'po-101',
          hotel_supplier_product_id: 'hsp-1',
          item_name_snapshot: 'Malai Paneer Grade A',
          unit_snapshot: 'kg',
          ordered_quantity: 20,
          received_quantity: 0,
          negotiated_price_snapshot: 325,
          line_total: 6500
        },
        {
          id: 'poi-2',
          purchase_order_id: 'po-101',
          hotel_supplier_product_id: 'hsp-2',
          item_name_snapshot: 'Chicken Curry Cut Fresh',
          unit_snapshot: 'kg',
          ordered_quantity: 20,
          received_quantity: 0,
          negotiated_price_snapshot: 195,
          line_total: 3900
        }
      ]
    }
  ];

  purchaseReceipts: PurchaseReceipt[] = [];

  commissionPlans: CommissionPlan[] = [
    {
      id: 'cp-standard',
      name: 'Standard Third-Party Plan',
      food_commission_percent: 15.00,
      venue_commission_percent: 10.00,
      fixed_fee_per_order: 5.00,
      description: 'Applied to independent 3rd party hotels'
    },
    {
      id: 'cp-zero',
      name: 'Platform Owned Zero Commission',
      food_commission_percent: 0.00,
      venue_commission_percent: 0.00,
      fixed_fee_per_order: 0.00,
      description: 'Applied to platform-owned hotels'
    }
  ];

  public static getInstance(): PlatformStore {
    if (!PlatformStore.instance) {
      PlatformStore.instance = new PlatformStore();
    }
    return PlatformStore.instance;
  }
}

export const platformStore = PlatformStore.getInstance();
