// ==========================================
// DineDesk Mock Data — Indian Restaurant
// ==========================================

// ---- Menu Items (Real Dish Photography) ----
export const mockMenuItems = [
  // Indian
  { id: 'ITEM-101', name: 'Butter Chicken', price: 320, category: 'indian', isVeg: false, image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80', emoji: '🍛', prepTime: 20, available: true, description: 'Tender chicken simmered in rich creamy tomato butter gravy with aromatic spices' },
  { id: 'ITEM-102', name: 'Paneer Tikka', price: 260, category: 'indian', isVeg: true, image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=600&q=80', emoji: '🧀', prepTime: 15, available: true, description: 'Charcoal-grilled cottage cheese cubes marinated in spiced yogurt and herbs' },
  { id: 'ITEM-103', name: 'Chicken Biryani', price: 280, category: 'indian', isVeg: false, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80', emoji: '🍚', prepTime: 25, available: true, description: 'Fragrant aged basmati rice cooked on dum with marinated chicken and saffron' },
  { id: 'ITEM-104', name: 'Dal Makhani', price: 220, category: 'indian', isVeg: true, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80', emoji: '🥘', prepTime: 20, available: true, description: 'Slow-cooked whole black lentils simmered overnight with butter and fresh cream' },
  { id: 'ITEM-105', name: 'Butter Naan', price: 45, category: 'indian', isVeg: true, image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=600&q=80', emoji: '🫓', prepTime: 5, available: true, description: 'Traditional clay-tandoor blistered leavened flatbread brushed with melted butter' },
  { id: 'ITEM-106', name: 'Garlic Naan', price: 60, category: 'indian', isVeg: true, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80', emoji: '🧄', prepTime: 5, available: true, description: 'Tandoor flatbread infused with roasted minced garlic, coriander, and butter' },
  { id: 'ITEM-107', name: 'Tandoori Chicken', price: 340, category: 'indian', isVeg: false, image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=600&q=80', emoji: '🍗', prepTime: 25, available: true, description: 'Half chicken marinated in Kashmiri red chili and yogurt, roasted in tandoor' },

  // Pizza
  { id: 'ITEM-201', name: 'Margherita Pizza', price: 249, category: 'pizza', isVeg: true, image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=600&q=80', emoji: '🍕', prepTime: 18, available: true, description: 'San Marzano tomato sauce, fresh mozzarella cheese, and basil on hand-stretched crust' },
  { id: 'ITEM-202', name: 'Farmhouse Pizza', price: 299, category: 'pizza', isVeg: true, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80', emoji: '🍕', prepTime: 20, available: true, description: 'Loaded with bell peppers, red onions, mushrooms, black olives, and sweet corn' },
  { id: 'ITEM-203', name: 'Pepperoni Pizza', price: 349, category: 'pizza', isVeg: false, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=600&q=80', emoji: '🍕', prepTime: 18, available: true, description: 'Artisanal sliced pepperoni layered over melted mozzarella and spiced marinara' },

  // Burgers
  { id: 'ITEM-301', name: 'Veg Burger', price: 149, category: 'burgers', isVeg: true, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80', emoji: '🍔', prepTime: 10, available: true, description: 'Crisp seasoned vegetable patty with lettuce, tomatoes, and house mayo on toasted brioche' },
  { id: 'ITEM-302', name: 'Chicken Burger', price: 189, category: 'burgers', isVeg: false, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80', emoji: '🍔', prepTime: 12, available: true, description: 'Juicy spiced grilled chicken breast fillet with cheddar cheese and smoked paprika dressing' },
  { id: 'ITEM-303', name: 'Double Cheese Burger', price: 229, category: 'burgers', isVeg: false, image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=600&q=80', emoji: '🍔', prepTime: 14, available: true, description: 'Double flame-grilled patties, double aged cheddar, caramelized onions, and house pickle' },

  // Snacks
  { id: 'ITEM-401', name: 'Masala Fries', price: 129, category: 'snacks', isVeg: true, image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80', emoji: '🍟', prepTime: 8, available: true, description: 'Golden crispy skin-on potato fries dusted with peri-peri chaat masala spice blend' },
  { id: 'ITEM-402', name: 'Chicken Wings', price: 249, category: 'snacks', isVeg: false, image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=600&q=80', emoji: '🍗', prepTime: 15, available: true, description: 'Crispy fried chicken wings tossed in tangy spicy barbecue glaze with ranch dip' },
  { id: 'ITEM-403', name: 'Paneer Tikka Bites', price: 199, category: 'snacks', isVeg: true, image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&q=80', emoji: '🧀', prepTime: 12, available: true, description: 'Bite-sized roasted cottage cheese cubes skewered with mint chutney drizzle' },
  { id: 'ITEM-404', name: 'Samosa (2 pcs)', price: 80, category: 'snacks', isVeg: true, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80', emoji: '🥟', prepTime: 5, available: true, description: 'Flaky golden pastry cones filled with spicy potato, green peas, and tamarind chutney' },

  // Drinks
  { id: 'ITEM-501', name: 'Cold Coffee', price: 149, category: 'drinks', isVeg: true, image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=600&q=80', emoji: '☕', prepTime: 5, available: true, description: 'Blended espresso with chilled creamy milk, chocolate drizzle, and vanilla ice cream scoop' },
  { id: 'ITEM-502', name: 'Mango Lassi', price: 129, category: 'drinks', isVeg: true, image: 'https://images.unsplash.com/photo-1570696516188-ade861b84a49?auto=format&fit=crop&w=600&q=80', emoji: '🥭', prepTime: 5, available: true, description: 'Thick Alphonso mango puree blended with chilled artisan yogurt and cardamom' },
  { id: 'ITEM-503', name: 'Fresh Lime Soda', price: 89, category: 'drinks', isVeg: true, image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80', emoji: '🍋', prepTime: 3, available: true, description: 'Sparkling club soda with freshly squeezed lime juice, mint leaves, and rock salt' },
  { id: 'ITEM-504', name: 'Masala Chai', price: 49, category: 'drinks', isVeg: true, image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80', emoji: '🫖', prepTime: 5, available: true, description: 'Authentic Indian Assam tea brewed with crushed ginger, green cardamom, and fresh milk' },

  // Pasta
  { id: 'ITEM-601', name: 'Pasta Alfredo', price: 249, category: 'pasta', isVeg: true, image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=600&q=80', emoji: '🍝', prepTime: 15, available: true, description: 'Fettuccine pasta in rich creamy garlic butter parmesan sauce with sautéed mushrooms' },
  { id: 'ITEM-602', name: 'Penne Arrabbiata', price: 229, category: 'pasta', isVeg: true, image: 'https://images.unsplash.com/photo-1621996346565-e3d5d628169e?auto=format&fit=crop&w=600&q=80', emoji: '🍝', prepTime: 15, available: true, description: 'Al dente penne in fiery plum tomato sauce, garlic, red chili flakes, and extra virgin olive oil' },

  // Desserts
  { id: 'ITEM-701', name: 'Gulab Jamun', price: 99, category: 'desserts', isVeg: true, image: 'https://images.unsplash.com/photo-1605197586548-932f91dfeb83?auto=format&fit=crop&w=600&q=80', emoji: '🍩', prepTime: 5, available: true, description: 'Warm khoya dumplings soaked in rose and saffron sugar syrup, garnished with pistachios' },
  { id: 'ITEM-702', name: 'Chocolate Brownie', price: 159, category: 'desserts', isVeg: true, image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80', emoji: '🍫', prepTime: 5, available: true, description: 'Warm Belgian dark chocolate walnut brownie served with vanilla bean ice cream' },
  { id: 'ITEM-703', name: 'Ras Malai', price: 129, category: 'desserts', isVeg: true, image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80', emoji: '🍮', prepTime: 5, available: true, description: 'Delicate cottage cheese discs steeped in condensed saffron milk and almond slivers' },

  // Salads
  { id: 'ITEM-801', name: 'Caesar Salad', price: 199, category: 'salads', isVeg: true, image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&w=600&q=80', emoji: '🥗', prepTime: 8, available: true, description: 'Crispy romaine lettuce, herb croutons, and shaved parmesan tossed in creamy Caesar dressing' },
  { id: 'ITEM-802', name: 'Greek Salad', price: 179, category: 'salads', isVeg: true, image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80', emoji: '🥗', prepTime: 8, available: true, description: 'Fresh cucumbers, tomatoes, bell peppers, Kalamata olives, and Greek feta in oregano vinaigrette' },

  // Chinese
  { id: 'ITEM-901', name: 'Veg Manchurian', price: 189, category: 'chinese', isVeg: true, image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=600&q=80', emoji: '🥡', prepTime: 15, available: true, description: 'Golden fried vegetable dumplings simmered in savory garlic, soy, and spring onion gravy' },
  { id: 'ITEM-902', name: 'Chicken Fried Rice', price: 219, category: 'chinese', isVeg: false, image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=600&q=80', emoji: '🍚', prepTime: 12, available: true, description: 'Wok-tossed long-grain rice with diced chicken, scrambled eggs, and seasonal vegetables' },
  { id: 'ITEM-903', name: 'Hakka Noodles', price: 179, category: 'chinese', isVeg: true, image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80', emoji: '🍜', prepTime: 12, available: true, description: 'Wok-tossed noodles with crunchy julienne vegetables, white pepper, and light soy sauce' },
];

// ---- Tables ----
export const mockTables = [
  { id: 'TBL-1', number: 'T1', capacity: 2, floor: 'Ground', status: 'Available', currentOrderId: null, occupiedSince: null },
  { id: 'TBL-2', number: 'T2', capacity: 2, floor: 'Ground', status: 'Occupied', currentOrderId: 'ORD-1001', occupiedSince: new Date(Date.now() - 45 * 60000).toISOString() },
  { id: 'TBL-3', number: 'T3', capacity: 4, floor: 'Ground', status: 'Available', currentOrderId: null, occupiedSince: null },
  { id: 'TBL-4', number: 'T4', capacity: 4, floor: 'Ground', status: 'Occupied', currentOrderId: 'ORD-1002', occupiedSince: new Date(Date.now() - 30 * 60000).toISOString() },
  { id: 'TBL-5', number: 'T5', capacity: 6, floor: 'Ground', status: 'Reserved', currentOrderId: null, occupiedSince: null },
  { id: 'TBL-6', number: 'T6', capacity: 4, floor: 'Ground', status: 'Available', currentOrderId: null, occupiedSince: null },
  { id: 'TBL-7', number: 'T7', capacity: 2, floor: 'Ground', status: 'Available', currentOrderId: null, occupiedSince: null },
  { id: 'TBL-8', number: 'T8', capacity: 8, floor: 'Ground', status: 'Occupied', currentOrderId: 'ORD-1003', occupiedSince: new Date(Date.now() - 60 * 60000).toISOString() },
  { id: 'TBL-9', number: 'T9', capacity: 4, floor: 'First', status: 'Available', currentOrderId: null, occupiedSince: null },
  { id: 'TBL-10', number: 'T10', capacity: 4, floor: 'First', status: 'Occupied', currentOrderId: 'ORD-1004', occupiedSince: new Date(Date.now() - 20 * 60000).toISOString() },
  { id: 'TBL-11', number: 'T11', capacity: 6, floor: 'First', status: 'Available', currentOrderId: null, occupiedSince: null },
  { id: 'TBL-12', number: 'T12', capacity: 2, floor: 'First', status: 'Reserved', currentOrderId: null, occupiedSince: null },
  { id: 'TBL-13', number: 'T13', capacity: 4, floor: 'First', status: 'Available', currentOrderId: null, occupiedSince: null },
  { id: 'TBL-14', number: 'T14', capacity: 8, floor: 'First', status: 'Occupied', currentOrderId: 'ORD-1005', occupiedSince: new Date(Date.now() - 15 * 60000).toISOString() },
  { id: 'TBL-15', number: 'T15', capacity: 2, floor: 'Terrace', status: 'Available', currentOrderId: null, occupiedSince: null },
  { id: 'TBL-16', number: 'T16', capacity: 4, floor: 'Terrace', status: 'Available', currentOrderId: null, occupiedSince: null },
  { id: 'TBL-17', number: 'T17', capacity: 6, floor: 'Terrace', status: 'Occupied', currentOrderId: 'ORD-1006', occupiedSince: new Date(Date.now() - 50 * 60000).toISOString() },
  { id: 'TBL-18', number: 'T18', capacity: 4, floor: 'Terrace', status: 'Available', currentOrderId: null, occupiedSince: null },
  { id: 'TBL-19', number: 'T19', capacity: 2, floor: 'Terrace', status: 'Reserved', currentOrderId: null, occupiedSince: null },
  { id: 'TBL-20', number: 'T20', capacity: 10, floor: 'Terrace', status: 'Available', currentOrderId: null, occupiedSince: null },
  { id: 'TBL-21', number: 'T21', capacity: 4, floor: 'Ground', status: 'Available', currentOrderId: null, occupiedSince: null },
  { id: 'TBL-22', number: 'T22', capacity: 2, floor: 'Ground', status: 'Occupied', currentOrderId: 'ORD-1007', occupiedSince: new Date(Date.now() - 35 * 60000).toISOString() },
  { id: 'TBL-23', number: 'T23', capacity: 6, floor: 'First', status: 'Available', currentOrderId: null, occupiedSince: null },
  { id: 'TBL-24', number: 'T24', capacity: 4, floor: 'First', status: 'Occupied', currentOrderId: 'ORD-1008', occupiedSince: new Date(Date.now() - 25 * 60000).toISOString() },
  { id: 'TBL-25', number: 'T25', capacity: 8, floor: 'Terrace', status: 'Available', currentOrderId: null, occupiedSince: null },
];

// ---- Customers ----
export const mockCustomers = [
  { id: 'CUST-1', name: 'Jay Sharma', phone: '+91 98765 43210', email: 'jay.sharma@email.com', orderCount: 24, totalSpend: 12450, loyaltyPoints: 1245, lastVisit: new Date(Date.now() - 2 * 86400000).toISOString(), preferredOrderType: 'Dine In', notes: 'Prefers corner table' },
  { id: 'CUST-2', name: 'Ananya Mehta', phone: '+91 87654 32109', email: 'ananya.m@email.com', orderCount: 18, totalSpend: 8920, loyaltyPoints: 892, lastVisit: new Date(Date.now() - 1 * 86400000).toISOString(), preferredOrderType: 'Dine In', notes: 'Vegetarian' },
  { id: 'CUST-3', name: 'Rahul Kapoor', phone: '+91 76543 21098', email: 'rahul.k@email.com', orderCount: 12, totalSpend: 6780, loyaltyPoints: 678, lastVisit: new Date(Date.now() - 3 * 86400000).toISOString(), preferredOrderType: 'Takeaway', notes: '' },
  { id: 'CUST-4', name: 'Priya Verma', phone: '+91 65432 10987', email: 'priya.v@email.com', orderCount: 31, totalSpend: 15600, loyaltyPoints: 1560, lastVisit: new Date(Date.now() - 0.5 * 86400000).toISOString(), preferredOrderType: 'Dine In', notes: 'VIP customer' },
  { id: 'CUST-5', name: 'Arjun Reddy', phone: '+91 54321 09876', email: 'arjun.r@email.com', orderCount: 8, totalSpend: 3450, loyaltyPoints: 345, lastVisit: new Date(Date.now() - 5 * 86400000).toISOString(), preferredOrderType: 'Delivery', notes: '' },
  { id: 'CUST-6', name: 'Sneha Patel', phone: '+91 43210 98765', email: 'sneha.p@email.com', orderCount: 15, totalSpend: 7890, loyaltyPoints: 789, lastVisit: new Date(Date.now() - 1 * 86400000).toISOString(), preferredOrderType: 'Dine In', notes: 'Allergic to nuts' },
  { id: 'CUST-7', name: 'Vikram Singh', phone: '+91 32109 87654', email: 'vikram.s@email.com', orderCount: 22, totalSpend: 11200, loyaltyPoints: 1120, lastVisit: new Date(Date.now() - 2 * 86400000).toISOString(), preferredOrderType: 'Takeaway', notes: '' },
  { id: 'CUST-8', name: 'Deepika Nair', phone: '+91 21098 76543', email: 'deepika.n@email.com', orderCount: 6, totalSpend: 2890, loyaltyPoints: 289, lastVisit: new Date(Date.now() - 7 * 86400000).toISOString(), preferredOrderType: 'Dine In', notes: '' },
  { id: 'CUST-9', name: 'Aditya Joshi', phone: '+91 10987 65432', email: 'aditya.j@email.com', orderCount: 19, totalSpend: 9450, loyaltyPoints: 945, lastVisit: new Date(Date.now() - 0.2 * 86400000).toISOString(), preferredOrderType: 'Dine In', notes: 'Birthday on Oct 15' },
  { id: 'CUST-10', name: 'Kavita Desai', phone: '+91 99887 76655', email: 'kavita.d@email.com', orderCount: 10, totalSpend: 5200, loyaltyPoints: 520, lastVisit: new Date(Date.now() - 4 * 86400000).toISOString(), preferredOrderType: 'Delivery', notes: '' },
];

// ---- Pre-seeded Orders ----
const now = Date.now();
export const mockOrders = [
  { id: 'ORD-1001', items: [{ ...mockMenuItems[0], quantity: 2 }, { ...mockMenuItems[4], quantity: 4 }], orderType: 'Dine In', customerId: 'CUST-1', tableId: 'TBL-2', status: 'Preparing', paymentStatus: 'Unpaid', paymentMethod: null, subtotal: 820, discount: 0, tax: 41, total: 861, itemCount: 6, notes: '', createdAt: new Date(now - 45 * 60000).toISOString(), updatedAt: new Date(now - 30 * 60000).toISOString() },
  { id: 'ORD-1002', items: [{ ...mockMenuItems[7], quantity: 1 }, { ...mockMenuItems[17], quantity: 2 }], orderType: 'Dine In', customerId: 'CUST-2', tableId: 'TBL-4', status: 'Pending', paymentStatus: 'Unpaid', paymentMethod: null, subtotal: 547, discount: 0, tax: 27.35, total: 574.35, itemCount: 3, notes: 'Extra cheese on pizza', createdAt: new Date(now - 30 * 60000).toISOString(), updatedAt: new Date(now - 30 * 60000).toISOString() },
  { id: 'ORD-1003', items: [{ ...mockMenuItems[2], quantity: 3 }, { ...mockMenuItems[3], quantity: 1 }, { ...mockMenuItems[5], quantity: 3 }], orderType: 'Dine In', customerId: 'CUST-4', tableId: 'TBL-8', status: 'Ready', paymentStatus: 'Unpaid', paymentMethod: null, subtotal: 1240, discount: 50, tax: 59.5, total: 1249.5, itemCount: 7, notes: '', createdAt: new Date(now - 60 * 60000).toISOString(), updatedAt: new Date(now - 10 * 60000).toISOString() },
  { id: 'ORD-1004', items: [{ ...mockMenuItems[10], quantity: 2 }, { ...mockMenuItems[13], quantity: 1 }], orderType: 'Dine In', customerId: 'CUST-3', tableId: 'TBL-10', status: 'Preparing', paymentStatus: 'Unpaid', paymentMethod: null, subtotal: 427, discount: 0, tax: 21.35, total: 448.35, itemCount: 3, notes: '', createdAt: new Date(now - 20 * 60000).toISOString(), updatedAt: new Date(now - 15 * 60000).toISOString() },
  { id: 'ORD-1005', items: [{ ...mockMenuItems[6], quantity: 1 }, { ...mockMenuItems[1], quantity: 1 }, { ...mockMenuItems[4], quantity: 2 }], orderType: 'Dine In', customerId: 'CUST-6', tableId: 'TBL-14', status: 'Pending', paymentStatus: 'Unpaid', paymentMethod: null, subtotal: 690, discount: 0, tax: 34.5, total: 724.5, itemCount: 4, notes: 'No spice in paneer tikka', createdAt: new Date(now - 15 * 60000).toISOString(), updatedAt: new Date(now - 15 * 60000).toISOString() },
  { id: 'ORD-1006', items: [{ ...mockMenuItems[8], quantity: 2 }, { ...mockMenuItems[21], quantity: 1 }], orderType: 'Dine In', customerId: 'CUST-7', tableId: 'TBL-17', status: 'Preparing', paymentStatus: 'Unpaid', paymentMethod: null, subtotal: 847, discount: 0, tax: 42.35, total: 889.35, itemCount: 3, notes: '', createdAt: new Date(now - 50 * 60000).toISOString(), updatedAt: new Date(now - 40 * 60000).toISOString() },
  { id: 'ORD-1007', items: [{ ...mockMenuItems[17], quantity: 1 }, { ...mockMenuItems[18], quantity: 1 }], orderType: 'Dine In', customerId: 'CUST-9', tableId: 'TBL-22', status: 'Pending', paymentStatus: 'Unpaid', paymentMethod: null, subtotal: 278, discount: 0, tax: 13.9, total: 291.9, itemCount: 2, notes: '', createdAt: new Date(now - 35 * 60000).toISOString(), updatedAt: new Date(now - 35 * 60000).toISOString() },
  { id: 'ORD-1008', items: [{ ...mockMenuItems[28], quantity: 2 }, { ...mockMenuItems[29], quantity: 1 }, { ...mockMenuItems[19], quantity: 2 }], orderType: 'Dine In', customerId: 'CUST-8', tableId: 'TBL-24', status: 'Preparing', paymentStatus: 'Unpaid', paymentMethod: null, subtotal: 735, discount: 0, tax: 36.75, total: 771.75, itemCount: 5, notes: '', createdAt: new Date(now - 25 * 60000).toISOString(), updatedAt: new Date(now - 20 * 60000).toISOString() },
  // Completed orders for dashboard metrics
  { id: 'ORD-1009', items: [{ ...mockMenuItems[0], quantity: 1 }], orderType: 'Takeaway', customerId: 'CUST-5', tableId: null, status: 'Completed', paymentStatus: 'Paid', paymentMethod: 'UPI', subtotal: 320, discount: 0, tax: 16, total: 336, itemCount: 1, notes: '', createdAt: new Date(now - 3 * 3600000).toISOString(), updatedAt: new Date(now - 2.5 * 3600000).toISOString() },
  { id: 'ORD-1010', items: [{ ...mockMenuItems[7], quantity: 2 }, { ...mockMenuItems[17], quantity: 2 }], orderType: 'Delivery', customerId: 'CUST-10', tableId: null, status: 'Completed', paymentStatus: 'Paid', paymentMethod: 'Card', subtotal: 796, discount: 50, tax: 37.3, total: 783.3, itemCount: 4, notes: '', createdAt: new Date(now - 5 * 3600000).toISOString(), updatedAt: new Date(now - 4.5 * 3600000).toISOString() },
];

// ---- Staff ----
export const mockStaff = [
  { id: 'STF-1', name: 'Rajesh Kumar', role: 'Admin', phone: '+91 98765 43210', email: 'rajesh@dinedesk.com', shift: 'Full Day', status: 'Active', lastLogin: new Date(now - 0.1 * 3600000).toISOString() },
  { id: 'STF-2', name: 'Meera Nair', role: 'Manager', phone: '+91 87654 32109', email: 'meera@dinedesk.com', shift: 'Morning', status: 'Active', lastLogin: new Date(now - 1 * 3600000).toISOString() },
  { id: 'STF-3', name: 'Amit Patel', role: 'Chef', phone: '+91 76543 21098', email: 'amit@dinedesk.com', shift: 'Morning', status: 'Active', lastLogin: new Date(now - 2 * 3600000).toISOString() },
  { id: 'STF-4', name: 'Sunita Rao', role: 'Chef', phone: '+91 65432 10987', email: 'sunita@dinedesk.com', shift: 'Evening', status: 'Active', lastLogin: new Date(now - 8 * 3600000).toISOString() },
  { id: 'STF-5', name: 'Ravi Shankar', role: 'Waiter', phone: '+91 54321 09876', email: 'ravi@dinedesk.com', shift: 'Morning', status: 'Active', lastLogin: new Date(now - 0.5 * 3600000).toISOString() },
  { id: 'STF-6', name: 'Preethi Menon', role: 'Waiter', phone: '+91 43210 98765', email: 'preethi@dinedesk.com', shift: 'Evening', status: 'Active', lastLogin: new Date(now - 10 * 3600000).toISOString() },
  { id: 'STF-7', name: 'Karthik Iyer', role: 'Cashier', phone: '+91 32109 87654', email: 'karthik@dinedesk.com', shift: 'Morning', status: 'Active', lastLogin: new Date(now - 0.3 * 3600000).toISOString() },
  { id: 'STF-8', name: 'Divya Pillai', role: 'Cashier', phone: '+91 21098 76543', email: 'divya@dinedesk.com', shift: 'Evening', status: 'Inactive', lastLogin: new Date(now - 48 * 3600000).toISOString() },
  { id: 'STF-9', name: 'Suresh Babu', role: 'Waiter', phone: '+91 10987 65432', email: 'suresh@dinedesk.com', shift: 'Morning', status: 'Active', lastLogin: new Date(now - 1 * 3600000).toISOString() },
  { id: 'STF-10', name: 'Lakshmi Devi', role: 'Chef', phone: '+91 99887 76655', email: 'lakshmi@dinedesk.com', shift: 'Full Day', status: 'Active', lastLogin: new Date(now - 3 * 3600000).toISOString() },
];

// ---- Inventory ----
export const mockInventory = [
  { id: 'INV-1', name: 'Chicken Breast', category: 'Meat', currentStock: 25, unit: 'kg', reorderLevel: 10, supplier: 'Fresh Farms', status: 'In Stock' },
  { id: 'INV-2', name: 'Paneer', category: 'Dairy', currentStock: 8, unit: 'kg', reorderLevel: 5, supplier: 'Amul Dairy', status: 'In Stock' },
  { id: 'INV-3', name: 'Basmati Rice', category: 'Grains', currentStock: 50, unit: 'kg', reorderLevel: 20, supplier: 'India Gate', status: 'In Stock' },
  { id: 'INV-4', name: 'Mozzarella Cheese', category: 'Dairy', currentStock: 3, unit: 'kg', reorderLevel: 5, supplier: 'Go Cheese', status: 'Low Stock' },
  { id: 'INV-5', name: 'Pizza Dough Base', category: 'Bakery', currentStock: 30, unit: 'pcs', reorderLevel: 15, supplier: 'Baker Street', status: 'In Stock' },
  { id: 'INV-6', name: 'Burger Buns', category: 'Bakery', currentStock: 2, unit: 'packs', reorderLevel: 5, supplier: 'Baker Street', status: 'Low Stock' },
  { id: 'INV-7', name: 'Tomato Sauce', category: 'Sauces', currentStock: 12, unit: 'liters', reorderLevel: 5, supplier: 'Kissan Foods', status: 'In Stock' },
  { id: 'INV-8', name: 'French Fries (Frozen)', category: 'Frozen', currentStock: 0, unit: 'kg', reorderLevel: 10, supplier: 'McCain Foods', status: 'Out of Stock' },
  { id: 'INV-9', name: 'Cooking Oil', category: 'Essentials', currentStock: 20, unit: 'liters', reorderLevel: 10, supplier: 'Fortune', status: 'In Stock' },
  { id: 'INV-10', name: 'Onions', category: 'Vegetables', currentStock: 30, unit: 'kg', reorderLevel: 15, supplier: 'Local Market', status: 'In Stock' },
  { id: 'INV-11', name: 'Garlic', category: 'Vegetables', currentStock: 5, unit: 'kg', reorderLevel: 3, supplier: 'Local Market', status: 'In Stock' },
  { id: 'INV-12', name: 'Ginger', category: 'Vegetables', currentStock: 4, unit: 'kg', reorderLevel: 3, supplier: 'Local Market', status: 'In Stock' },
  { id: 'INV-13', name: 'Black Lentils (Urad Dal)', category: 'Grains', currentStock: 15, unit: 'kg', reorderLevel: 5, supplier: 'Tata Sampann', status: 'In Stock' },
  { id: 'INV-14', name: 'Fresh Cream', category: 'Dairy', currentStock: 4, unit: 'liters', reorderLevel: 5, supplier: 'Amul Dairy', status: 'Low Stock' },
  { id: 'INV-15', name: 'Soda Water', category: 'Beverages', currentStock: 48, unit: 'bottles', reorderLevel: 20, supplier: 'Kinley', status: 'In Stock' },
  { id: 'INV-16', name: 'Coffee Beans', category: 'Beverages', currentStock: 3, unit: 'kg', reorderLevel: 2, supplier: 'Blue Tokai', status: 'In Stock' },
  { id: 'INV-17', name: 'Pasta Penne', category: 'Grains', currentStock: 10, unit: 'kg', reorderLevel: 5, supplier: 'Barilla', status: 'In Stock' },
  { id: 'INV-18', name: 'Noodles (Hakka)', category: 'Grains', currentStock: 8, unit: 'kg', reorderLevel: 5, supplier: 'Ching\'s', status: 'In Stock' },
];

// ---- Notifications ----
export const mockNotifications = [
  { id: 'NOTIF-1', type: 'new_order', title: 'New Order', message: 'Order ORD-1005 received — 4 items, Dine In', read: false, createdAt: new Date(now - 15 * 60000).toISOString() },
  { id: 'NOTIF-2', type: 'low_inventory', title: 'Low Stock Alert', message: 'Mozzarella Cheese is running low (3 kg remaining)', read: false, createdAt: new Date(now - 30 * 60000).toISOString() },
  { id: 'NOTIF-3', type: 'payment', title: 'Payment Received', message: '₹336 received for Order ORD-1009 via UPI', read: false, createdAt: new Date(now - 2.5 * 3600000).toISOString() },
  { id: 'NOTIF-4', type: 'table_reservation', title: 'Table Reserved', message: 'Table T5 reserved for 7:00 PM — Priya Verma', read: true, createdAt: new Date(now - 4 * 3600000).toISOString() },
  { id: 'NOTIF-5', type: 'kitchen_delay', title: 'Kitchen Delay', message: 'Order ORD-1001 has been preparing for over 30 minutes', read: false, createdAt: new Date(now - 10 * 60000).toISOString() },
  { id: 'NOTIF-6', type: 'low_inventory', title: 'Out of Stock', message: 'French Fries (Frozen) is out of stock', read: true, createdAt: new Date(now - 6 * 3600000).toISOString() },
  { id: 'NOTIF-7', type: 'staff_event', title: 'Staff Login', message: 'Karthik Iyer clocked in for Morning shift', read: true, createdAt: new Date(now - 5 * 3600000).toISOString() },
  { id: 'NOTIF-8', type: 'payment', title: 'Payment Received', message: '₹783.30 received for Order ORD-1010 via Card', read: true, createdAt: new Date(now - 4.5 * 3600000).toISOString() },
];

// ---- Chart Data (for dashboard) ----
export const revenueChartData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  revenue: [32500, 28900, 35200, 41800, 38600, 52400, 42580],
  orders: [120, 105, 135, 148, 142, 178, 156]
};

export const popularItemsData = [
  { name: 'Butter Chicken', orders: 48 },
  { name: 'Chicken Biryani', orders: 42 },
  { name: 'Margherita Pizza', orders: 38 },
  { name: 'Paneer Tikka', orders: 35 },
  { name: 'Cold Coffee', orders: 32 },
  { name: 'Masala Fries', orders: 28 },
];

export const orderTypeData = {
  labels: ['Dine In', 'Takeaway', 'Delivery'],
  values: [65, 22, 13]
};

export const hourlyRevenueData = {
  labels: ['10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM', '5PM', '6PM', '7PM', '8PM', '9PM', '10PM'],
  values: [1200, 2800, 5600, 7200, 4800, 2200, 1800, 3200, 5400, 8200, 7600, 4800, 2100]
};
