// ==========================================
// DineDesk Constants & Enums
// ==========================================

export const ORDER_STATUS = {
  PENDING: 'Pending',
  PREPARING: 'Preparing',
  READY: 'Ready',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled'
};

export const PAYMENT_STATUS = {
  UNPAID: 'Unpaid',
  PAID: 'Paid',
  REFUNDED: 'Refunded'
};

export const TABLE_STATUS = {
  AVAILABLE: 'Available',
  OCCUPIED: 'Occupied',
  RESERVED: 'Reserved'
};

export const ORDER_TYPE = {
  DINE_IN: 'Dine In',
  TAKEAWAY: 'Takeaway',
  DELIVERY: 'Delivery'
};

export const PAYMENT_METHOD = {
  CASH: 'Cash',
  CARD: 'Card',
  UPI: 'UPI'
};

export const STAFF_ROLE = {
  ADMIN: 'Admin',
  MANAGER: 'Manager',
  CASHIER: 'Cashier',
  WAITER: 'Waiter',
  CHEF: 'Chef'
};

export const INVENTORY_STATUS = {
  IN_STOCK: 'In Stock',
  LOW_STOCK: 'Low Stock',
  OUT_OF_STOCK: 'Out of Stock'
};

export const CATEGORIES = [
  { id: 'all', name: 'All Items', emoji: '🍽️' },
  { id: 'pizza', name: 'Pizza', emoji: '🍕' },
  { id: 'burgers', name: 'Burgers', emoji: '🍔' },
  { id: 'snacks', name: 'Snacks', emoji: '🍟' },
  { id: 'drinks', name: 'Drinks', emoji: '🥤' },
  { id: 'pasta', name: 'Pasta', emoji: '🍝' },
  { id: 'desserts', name: 'Desserts', emoji: '🍨' },
  { id: 'salads', name: 'Salads', emoji: '🥗' },
  { id: 'indian', name: 'Indian', emoji: '🍛' },
  { id: 'chinese', name: 'Chinese', emoji: '🥡' }
];

export const TAX_RATE = 0.05; // 5% GST

export const NOTIFICATION_TYPES = {
  NEW_ORDER: 'new_order',
  LOW_INVENTORY: 'low_inventory',
  PAYMENT: 'payment',
  TABLE_RESERVATION: 'table_reservation',
  KITCHEN_DELAY: 'kitchen_delay',
  STAFF_EVENT: 'staff_event'
};
