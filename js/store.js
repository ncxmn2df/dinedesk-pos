// ==========================================
// DineDesk Centralized State Management
// ==========================================

import { mockMenuItems, mockTables, mockCustomers, mockOrders, mockStaff, mockInventory, mockNotifications } from './data/mockData.js';

class Store {
  constructor() {
    this._state = {
      auth: { isAuthenticated: false, user: null },
      menuItems: [...mockMenuItems],
      tables: [...mockTables],
      customers: [...mockCustomers],
      orders: [...mockOrders],
      staff: [...mockStaff],
      inventory: [...mockInventory],
      notifications: [...mockNotifications],
      cart: { items: [], orderType: 'Dine In', customerId: null, tableId: null, discount: 0 },
      currentBillingOrder: null,
      settings: {
        restaurantName: 'DineDesk Restaurant',
        address: '123 MG Road, Bengaluru, Karnataka 560001',
        phone: '+91 98765 43210',
        email: 'info@dinedesk.com',
        gstNumber: '29AABCD1234E1Z5',
        taxRate: 0.05,
        currency: 'INR'
      }
    };
    this._listeners = new Map();
    this._idCounter = 2000;
  }

  get state() { return this._state; }

  _nextId(prefix = 'ORD') {
    this._idCounter++;
    return `${prefix}-${this._idCounter}`;
  }

  subscribe(key, callback) {
    if (!this._listeners.has(key)) this._listeners.set(key, new Set());
    this._listeners.get(key).add(callback);
    return () => this._listeners.get(key)?.delete(callback);
  }

  _notify(key) {
    this._listeners.get(key)?.forEach(cb => cb(this._state[key]));
    this._listeners.get('*')?.forEach(cb => cb(this._state));
  }

  // ---- Auth ----
  login(email, password) {
    if (email === 'admin@dinedesk.com' && password === 'admin123') {
      this._state.auth = {
        isAuthenticated: true,
        user: { name: 'Rajesh Kumar', email, role: 'Admin', avatar: null }
      };
      this._notify('auth');
      return true;
    }
    return false;
  }

  logout() {
    this._state.auth = { isAuthenticated: false, user: null };
    this._notify('auth');
  }

  // ---- Cart (POS) ----
  addToCart(menuItem) {
    const cart = this._state.cart;
    const existing = cart.items.find(i => i.id === menuItem.id);
    if (existing) {
      existing.quantity++;
    } else {
      cart.items.push({ ...menuItem, quantity: 1 });
    }
    this._notify('cart');
  }

  updateCartItemQty(itemId, qty) {
    const cart = this._state.cart;
    if (qty <= 0) {
      cart.items = cart.items.filter(i => i.id !== itemId);
    } else {
      const item = cart.items.find(i => i.id === itemId);
      if (item) item.quantity = qty;
    }
    this._notify('cart');
  }

  removeFromCart(itemId) {
    this._state.cart.items = this._state.cart.items.filter(i => i.id !== itemId);
    this._notify('cart');
  }

  setCartOrderType(type) {
    this._state.cart.orderType = type;
    this._notify('cart');
  }

  setCartCustomer(customerId) {
    this._state.cart.customerId = customerId;
    this._notify('cart');
  }

  setCartTable(tableId) {
    this._state.cart.tableId = tableId;
    this._notify('cart');
  }

  setCartDiscount(amount) {
    this._state.cart.discount = parseFloat(amount) || 0;
    this._notify('cart');
  }

  clearCart() {
    this._state.cart = { items: [], orderType: 'Dine In', customerId: null, tableId: null, discount: 0 };
    this._notify('cart');
  }

  // ---- Orders ----
  createOrderFromCart() {
    const cart = this._state.cart;
    if (cart.items.length === 0) return null;

    const { calculateOrder } = window._orderCalc || {};
    const calc = calculateOrder ? calculateOrder(cart.items, cart.discount) : { subtotal: 0, discountAmount: 0, tax: 0, grandTotal: 0, itemCount: 0 };

    const order = {
      id: this._nextId('ORD'),
      items: cart.items.map(i => ({ ...i })),
      orderType: cart.orderType,
      customerId: cart.customerId,
      tableId: cart.tableId,
      status: 'Pending',
      paymentStatus: 'Unpaid',
      paymentMethod: null,
      subtotal: calc.subtotal,
      discount: calc.discountAmount,
      tax: calc.tax,
      total: calc.grandTotal,
      itemCount: calc.itemCount,
      notes: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this._state.orders.unshift(order);

    // Update table status if Dine In
    if (cart.orderType === 'Dine In' && cart.tableId) {
      const table = this._state.tables.find(t => t.id === cart.tableId);
      if (table) {
        table.status = 'Occupied';
        table.currentOrderId = order.id;
        table.occupiedSince = order.createdAt;
        this._notify('tables');
      }
    }

    // Update customer
    if (cart.customerId) {
      const customer = this._state.customers.find(c => c.id === cart.customerId);
      if (customer) {
        customer.orderCount++;
        customer.totalSpend += calc.grandTotal;
        customer.lastVisit = order.createdAt;
        this._notify('customers');
      }
    }

    this._state.currentBillingOrder = order;
    this.clearCart();
    this._notify('orders');
    this._notify('currentBillingOrder');

    // Add notification
    this.addNotification({
      type: 'new_order',
      title: 'New Order',
      message: `Order ${order.id} received — ${order.itemCount} items, ${order.orderType}`,
      orderId: order.id
    });

    return order;
  }

  updateOrderStatus(orderId, status) {
    const order = this._state.orders.find(o => o.id === orderId);
    if (!order) return;
    order.status = status;
    order.updatedAt = new Date().toISOString();

    if (status === 'Completed') {
      // Free up table
      if (order.tableId) {
        const table = this._state.tables.find(t => t.id === order.tableId);
        if (table && table.currentOrderId === orderId) {
          table.status = 'Available';
          table.currentOrderId = null;
          table.occupiedSince = null;
          this._notify('tables');
        }
      }
    }
    this._notify('orders');
  }

  completePayment(orderId, paymentMethod) {
    const order = this._state.orders.find(o => o.id === orderId);
    if (!order) return;
    order.paymentStatus = 'Paid';
    order.paymentMethod = paymentMethod;
    order.status = 'Completed';
    order.updatedAt = new Date().toISOString();

    // Free up table
    if (order.tableId) {
      const table = this._state.tables.find(t => t.id === order.tableId);
      if (table && table.currentOrderId === orderId) {
        table.status = 'Available';
        table.currentOrderId = null;
        table.occupiedSince = null;
        this._notify('tables');
      }
    }

    this.addNotification({
      type: 'payment',
      title: 'Payment Received',
      message: `₹${order.total.toLocaleString('en-IN')} received for Order ${order.id} via ${paymentMethod}`,
      orderId: order.id
    });

    this._notify('orders');
  }

  // ---- Tables ----
  updateTableStatus(tableId, status) {
    const table = this._state.tables.find(t => t.id === tableId);
    if (!table) return;
    table.status = status;
    if (status === 'Available') {
      table.currentOrderId = null;
      table.occupiedSince = null;
    }
    this._notify('tables');
  }

  // ---- Menu ----
  toggleMenuItemAvailability(itemId) {
    const item = this._state.menuItems.find(i => i.id === itemId);
    if (item) {
      item.available = !item.available;
      this._notify('menuItems');
    }
  }

  addMenuItem(item) {
    item.id = this._nextId('ITEM');
    this._state.menuItems.push(item);
    this._notify('menuItems');
  }

  updateMenuItem(itemId, updates) {
    const item = this._state.menuItems.find(i => i.id === itemId);
    if (item) Object.assign(item, updates);
    this._notify('menuItems');
  }

  deleteMenuItem(itemId) {
    this._state.menuItems = this._state.menuItems.filter(i => i.id !== itemId);
    this._notify('menuItems');
  }

  // ---- Customers ----
  addCustomer(customer) {
    customer.id = this._nextId('CUST');
    customer.orderCount = 0;
    customer.totalSpend = 0;
    customer.loyaltyPoints = 0;
    customer.lastVisit = new Date().toISOString();
    this._state.customers.push(customer);
    this._notify('customers');
  }

  // ---- Inventory ----
  updateInventoryStock(itemId, newStock) {
    const item = this._state.inventory.find(i => i.id === itemId);
    if (!item) return;
    item.currentStock = newStock;
    if (newStock <= 0) item.status = 'Out of Stock';
    else if (newStock <= item.reorderLevel) item.status = 'Low Stock';
    else item.status = 'In Stock';
    this._notify('inventory');
  }

  // ---- Notifications ----
  addNotification(notification) {
    this._state.notifications.unshift({
      id: this._nextId('NOTIF'),
      ...notification,
      read: false,
      createdAt: new Date().toISOString()
    });
    this._notify('notifications');
  }

  markNotificationRead(id) {
    const n = this._state.notifications.find(n => n.id === id);
    if (n) n.read = true;
    this._notify('notifications');
  }

  markAllNotificationsRead() {
    this._state.notifications.forEach(n => n.read = true);
    this._notify('notifications');
  }

  // ---- Dashboard Metrics ----
  getDashboardMetrics() {
    const today = new Date().toISOString().split('T')[0];
    const todaysOrders = this._state.orders.filter(o => o.createdAt.startsWith(today));
    const completedOrders = todaysOrders.filter(o => o.paymentStatus === 'Paid');
    const revenue = completedOrders.reduce((sum, o) => sum + o.total, 0);
    const activeTables = this._state.tables.filter(t => t.status === 'Occupied').length;
    const totalTables = this._state.tables.length;
    const uniqueCustomers = new Set(todaysOrders.filter(o => o.customerId).map(o => o.customerId)).size;

    return {
      revenue: revenue || 42580,
      orderCount: todaysOrders.length || 156,
      customerCount: uniqueCustomers || 124,
      activeTables,
      totalTables
    };
  }
}

export const store = new Store();
