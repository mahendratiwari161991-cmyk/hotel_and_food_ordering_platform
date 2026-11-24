export type OwnershipType = 'platform_owned' | 'third_party';
export type OrganizationStatus = 'pending_approval' | 'active' | 'suspended' | 'rejected';
export type SystemRole = 
  | 'platform_admin' 
  | 'hotel_owner' 
  | 'branch_manager' 
  | 'kitchen_staff' 
  | 'delivery_partner' 
  | 'supplier_user' 
  | 'customer';

export type FoodType = 'veg' | 'non_veg' | 'egg' | 'vegan';

export type OrderStatus = 
  | 'placed' 
  | 'accepted' 
  | 'preparing' 
  | 'ready_for_pickup' 
  | 'assigned' 
  | 'picked_up' 
  | 'on_the_way' 
  | 'delivered' 
  | 'cancelled';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded' | 'cod_pending';
export type PaymentMethod = 'razorpay' | 'cod' | 'upi';

export type AssignmentStatus = 
  | 'pending_acceptance' 
  | 'accepted' 
  | 'rejected' 
  | 'arrived_hotel' 
  | 'picked_up' 
  | 'arrived_customer' 
  | 'delivered' 
  | 'cancelled';

export type VenueType = 'banquet_hall' | 'lawn' | 'rooftop' | 'poolside' | 'conference_room';
export type SlotType = 'morning' | 'evening' | 'full_day';
export type BookingStatus = 'enquiry' | 'quotation_sent' | 'confirmed' | 'completed' | 'cancelled';

export type POStatus = 
  | 'draft' 
  | 'sent_to_supplier' 
  | 'acknowledged' 
  | 'dispatched' 
  | 'partially_received' 
  | 'received_complete' 
  | 'cancelled';

export interface Organization {
  id: string;
  name: string;
  slug: string;
  ownership_type: OwnershipType;
  organization_status: OrganizationStatus;
  commission_plan_id?: string;
  primary_email: string;
  primary_phone: string;
  legal_business_name: string;
  gstin?: string;
  banner_url?: string;
  logo_url?: string;
  created_at: string;
}

export interface HotelBranch {
  id: string;
  organization_id: string;
  branch_name: string;
  slug: string;
  address_line: string;
  city: string;
  state: string;
  pincode: string;
  latitude: number;
  longitude: number;
  contact_phone: string;
  contact_email?: string;
  fssai_license_number?: string;
  gstin?: string;
  is_open: boolean;
  approval_status: string;
  average_preparation_time_mins: number;
  packaging_fee_base: number;
  organization?: Organization;
}

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  system_role: SystemRole;
  avatar_url?: string;
}

export interface MenuItem {
  id: string;
  organization_id: string;
  category_id?: string;
  name: string;
  slug: string;
  description: string;
  food_type: FoodType;
  base_price: number;
  image_url: string;
  is_available: boolean;
  preparation_time_mins: number;
  variants?: MenuVariant[];
  addons?: MenuAddon[];
}

export interface MenuVariant {
  id: string;
  menu_item_id: string;
  name: string;
  price_differential: number;
}

export interface MenuAddon {
  id: string;
  menu_item_id: string;
  name: string;
  price: number;
  is_optional: boolean;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  selectedVariant?: MenuVariant;
  selectedAddons?: MenuAddon[];
  subtotal: number;
}

export interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id: string;
  item_name_snapshot: string;
  unit_price_snapshot: number;
  quantity: number;
  variant_snapshot?: any;
  addons_snapshot?: any;
  subtotal: number;
}

export interface Order {
  id: string;
  order_number: string;
  customer_id: string;
  organization_id: string;
  branch_id: string;
  delivery_address_id?: string;
  delivery_address_snapshot: {
    name?: string;
    phone?: string;
    address: string;
  };
  order_status: OrderStatus;
  cancellation_reason?: string;
  payment_status: PaymentStatus;
  payment_method: PaymentMethod;
  cooking_instructions?: string;
  subtotal: number;
  tax_amount: number;
  packaging_fee: number;
  delivery_fee: number;
  discount_amount: number;
  total_amount: number;
  platform_commission_amount: number;
  delivery_otp: string;
  pickup_otp: string;
  estimated_prep_mins: number;
  created_at: string;
  items?: OrderItem[];
  branch?: HotelBranch;
  organization?: Organization;
  delivery_assignment?: DeliveryAssignment;
}

export interface DeliveryPartner {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  vehicle_type: 'bike' | 'scooter' | 'electric_vehicle' | 'cycle';
  vehicle_number: string;
  driving_license_no: string;
  status: 'active' | 'offline' | 'busy';
  rating: number;
  total_completed_trips: number;
  current_latitude?: number;
  current_longitude?: number;
  is_online?: boolean;
}

export interface DeliveryAssignment {
  id: string;
  order_id: string;
  hotel_branch_id: string;
  delivery_partner_id?: string;
  status: AssignmentStatus;
  estimated_pickup_km?: number;
  estimated_drop_km?: number;
  estimated_payout: number;
  assigned_at: string;
  accepted_at?: string;
  picked_up_at?: string;
  delivered_at?: string;
  partner?: DeliveryPartner;
}

export interface Venue {
  id: string;
  branch_id: string;
  name: string;
  venue_type: VenueType;
  capacity_min: number;
  capacity_max: number;
  base_rent_per_slot: number;
  photos: string[];
  description: string;
  amenities: string[];
  is_active: boolean;
  branch?: HotelBranch;
}

export interface EventPackage {
  id: string;
  venue_id: string;
  package_name: string;
  veg_plate_price: number;
  non_veg_plate_price?: number;
  included_services: any;
}

export interface VenueBooking {
  id: string;
  booking_number: string;
  quotation_id?: string;
  customer_id: string;
  branch_id: string;
  venue_id: string;
  booking_date: string;
  slot_type: SlotType;
  guest_count: number;
  total_amount: number;
  advance_paid: number;
  balance_due: number;
  status: BookingStatus;
  venue?: Venue;
  customer?: Profile;
}

export interface BookingEnquiry {
  id: string;
  enquiry_number: string;
  customer_id: string;
  branch_id: string;
  venue_id: string;
  event_type: string;
  guest_count: number;
  target_date: string;
  slot_type: SlotType;
  food_preference: string;
  special_requirements?: string;
  status: 'submitted' | 'quoted' | 'accepted' | 'declined';
  created_at: string;
  venue?: Venue;
}

export interface BookingQuotation {
  id: string;
  enquiry_id: string;
  venue_id: string;
  rent_amount: number;
  food_package_amount: number;
  decoration_amount: number;
  taxes_amount: number;
  advance_percentage_required: number;
  advance_amount: number;
  total_amount: number;
  terms_and_conditions: string;
  valid_until: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
}

export interface Supplier {
  id: string;
  company_name: string;
  trade_name?: string;
  contact_name: string;
  email?: string;
  phone: string;
  gstin?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  payment_terms_days: number;
  is_active: boolean;
}

export interface SupplierProduct {
  id: string;
  supplier_id: string;
  product_name: string;
  sku?: string;
  category: string;
  unit_of_measure: string;
  standard_price: number;
  is_available: boolean;
}

export interface HotelSupplierConnection {
  id: string;
  organization_id: string;
  branch_id?: string;
  supplier_id: string;
  custom_supplier_code?: string;
  status: 'active' | 'inactive';
  credit_limit: number;
  credit_period_days: number;
  supplier?: Supplier;
}

export interface HotelSupplierProduct {
  id: string;
  hotel_supplier_connection_id: string;
  supplier_product_id: string;
  custom_item_name?: string;
  negotiated_unit_price: number;
  tax_rate_percent: number;
  min_order_qty: number;
  supplier_product?: SupplierProduct;
}

export interface PurchaseOrder {
  id: string;
  po_number: string;
  organization_id: string;
  branch_id?: string;
  hotel_supplier_connection_id: string;
  expected_delivery_date?: string;
  subtotal: number;
  tax_total: number;
  total_amount: number;
  status: POStatus;
  supplier_notes?: string;
  created_at: string;
  supplier?: Supplier;
  items?: PurchaseOrderItem[];
}

export interface PurchaseOrderItem {
  id: string;
  purchase_order_id: string;
  hotel_supplier_product_id: string;
  item_name_snapshot: string;
  unit_snapshot: string;
  ordered_quantity: number;
  received_quantity: number;
  negotiated_price_snapshot: number;
  line_total: number;
}

export interface PurchaseReceipt {
  id: string;
  purchase_order_id: string;
  receipt_number: string;
  delivery_challan_no?: string;
  received_at: string;
  notes?: string;
  items?: {
    item_name: string;
    accepted_quantity: number;
    rejected_quantity: number;
    rejection_reason?: string;
  }[];
}

export interface CommissionPlan {
  id: string;
  name: string;
  food_commission_percent: number;
  venue_commission_percent: number;
  fixed_fee_per_order: number;
  description: string;
}
