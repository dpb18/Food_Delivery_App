// ====================================================================
// MOCK DATA STORE - DAY 1 & 2 SCHEMA ALIGNED
// Serves as the high-fidelity contract for Customer, Admin, and Delivery views
// ====================================================================

export const CATEGORIES = [
  { id: 1, name: 'All', icon: '🍽️' },
  { id: 2, name: 'Burgers', icon: '🍔' },
  { id: 3, name: 'Pizza', icon: '🍕' },
  { id: 4, name: 'Biryani & Bowls', icon: '🍲' },
  { id: 5, name: 'Asian & Sushi', icon: '🥢' },
  { id: 6, name: 'Desserts', icon: '🍰' },
  { id: 7, name: 'Beverages', icon: '🧋' }
];

export const RESTAURANTS = [
  {
    id: 1,
    name: 'The Burger Foundry',
    tagline: 'Artisanal Brioche Buns & Smashed Patties',
    description: 'Specializing in flame-grilled smash burgers, loaded truffle fries, and thick handcrafted milkshakes.',
    category: 'Burgers',
    rating: 4.8,
    reviewsCount: 1420,
    deliveryTimeMins: 25,
    deliveryFee: 30.00,
    minOrder: 150,
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&auto=format&fit=crop&q=80',
    address: '84, 12th Main Road, Indiranagar, Bengaluru',
    lat: 12.9719,
    lng: 77.6412,
    isActive: true,
    tags: ['Best Seller', 'Gourmet Buns', 'Truffle Glaze']
  },
  {
    id: 2,
    name: 'Artisan Woodfire Pizzeria',
    tagline: 'Authentic Neapolitan Sourdough Crust',
    description: 'Slow-fermented sourdough pizza baked at 900°F with imported San Marzano tomatoes and fior di latte mozzarella.',
    category: 'Pizza',
    rating: 4.9,
    reviewsCount: 2310,
    deliveryTimeMins: 35,
    deliveryFee: 40.00,
    minOrder: 250,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80',
    address: '102, 100ft Road, Koramangala 4th Block, Bengaluru',
    lat: 12.9352,
    lng: 77.6245,
    isActive: true,
    tags: ['Woodfired', 'Top Rated', 'Authentic Italian']
  },
  {
    id: 3,
    name: 'Nawabi Dum Biryani House',
    tagline: 'Aromatic Hyderabadi Dum Recipes',
    description: 'Slow-cooked in sealed clay pots with fragrant basmati, saffron, and tender marinated cuts.',
    category: 'Biryani & Bowls',
    rating: 4.7,
    reviewsCount: 3100,
    deliveryTimeMins: 30,
    deliveryFee: 35.00,
    minOrder: 200,
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80',
    address: '55, 5th Cross, HSR Layout Sector 3, Bengaluru',
    lat: 12.9121,
    lng: 77.6446,
    isActive: true,
    tags: ['Rich Spice', 'Pure Royal', 'Family Packs']
  },
  {
    id: 4,
    name: 'Tokyo Blossom Ramen & Sushi',
    tagline: 'Rich Tonkotsu Broth & Hand-rolled Maki',
    description: '24-hour simmered broth, springy handcrafted noodles, fresh sashimi, and crispy tempura rolls.',
    category: 'Asian & Sushi',
    rating: 4.9,
    reviewsCount: 980,
    deliveryTimeMins: 40,
    deliveryFee: 45.00,
    minOrder: 300,
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&auto=format&fit=crop&q=80',
    address: '22, Lavelle Road, Shanthala Nagar, Bengaluru',
    lat: 12.9716,
    lng: 77.5946,
    isActive: true,
    tags: ['Chef Special', 'Japanese', 'Fresh Daily']
  },
  {
    id: 5,
    name: 'Sweet Haven Patisserie',
    tagline: 'Parisian Macarons, Cheesecakes & Tarts',
    description: 'French baking perfection with silky Belgian chocolate cakes, cheesecakes, and fruit galettes.',
    category: 'Desserts',
    rating: 4.8,
    reviewsCount: 1640,
    deliveryTimeMins: 20,
    deliveryFee: 25.00,
    minOrder: 100,
    image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=800&auto=format&fit=crop&q=80',
    address: '15, Church Street, Ashok Nagar, Bengaluru',
    lat: 12.9754,
    lng: 77.6050,
    isActive: true,
    tags: ['Fresh Bakes', 'Eggless Options', 'Sweet Tooth']
  },
  {
    id: 6,
    name: 'Brew & Boba Lounge',
    tagline: 'Cold Brews, Matcha & Popping Boba Teas',
    description: 'Single-origin espresso roasts, creamy brown sugar milk teas, and fruit refresher coolers.',
    category: 'Beverages',
    rating: 4.6,
    reviewsCount: 820,
    deliveryTimeMins: 15,
    deliveryFee: 20.00,
    minOrder: 100,
    // Working, vibrant cafe interior image
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80',
    address: '89, Brigade Road, Bengaluru',
    lat: 12.9698,
    lng: 77.6083,
    isActive: true,
    tags: ['Instant Pick', 'Cold Refreshers', 'Vegan Friendly']
  }
];

export const MENU_ITEMS = [
  // The Burger Foundry (Restaurant 1)
  {
    id: 101,
    restaurantId: 1,
    categoryId: 2,
    name: 'Double Truffle Smash Burger',
    description: 'Two smashed tender patties with aged cheddar, caramelized onions, and black truffle garlic aioli on toasted brioche.',
    price: 349,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
    isVeg: false,
    isAvailable: true,
    popular: true,
    nutrition: {
      calories: 680,
      protein: 38,
      carbs: 48,
      fat: 36,
      fiber: 4,
      allergens: 'Gluten, Dairy, Eggs',
      aiSummary: 'Rich in muscle-building protein from double patties. Moderate carbs from brioche bun with healthy savory fats from black truffle aioli.'
    }
  },
  {
    id: 102,
    restaurantId: 1,
    categoryId: 2,
    name: 'Crispy Paneer Volcano Burger',
    description: 'Spiced panko-crusted cottage cheese steak with chipotle slaw, jalapenos, and melted gouda cheese.',
    price: 289,
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600&auto=format&fit=crop&q=80',
    isVeg: true,
    isAvailable: true,
    popular: true,
    nutrition: {
      calories: 590,
      protein: 26,
      carbs: 52,
      fat: 32,
      fiber: 6,
      allergens: 'Dairy, Gluten',
      aiSummary: 'High vegetarian protein source from fresh cottage cheese. Panko crust provides crisp texture with calcium-rich dairy benefits.'
    }
  },
  {
    id: 103,
    restaurantId: 1,
    categoryId: 2,
    name: 'Cajun Seasoned Waffle Fries',
    description: 'Criss-cross crispy golden potato waffles dusted with house cajun spices and served with herb mayo.',
    price: 169,
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&auto=format&fit=crop&q=80',
    isVeg: true,
    isAvailable: true,
    popular: false,
    nutrition: {
      calories: 340,
      protein: 5,
      carbs: 46,
      fat: 16,
      fiber: 5,
      allergens: 'None',
      aiSummary: 'Potassium-packed potato side. Baked-crisp technique reduces heavy saturated oil while preserving crunch and bold cajun spice.'
    }
  },
  {
    id: 104,
    restaurantId: 1,
    categoryId: 7,
    name: 'Salted Caramel Thickshake',
    description: 'Creamy Madagascar vanilla bean gelato blended with slow-cooked sea salt caramel and pretzel crumble.',
    price: 199,
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&auto=format&fit=crop&q=80',
    isVeg: true,
    isAvailable: true,
    popular: true,
    nutrition: {
      calories: 440,
      protein: 10,
      carbs: 64,
      fat: 18,
      fiber: 1,
      allergens: 'Dairy',
      aiSummary: 'Indulgent dessert beverage containing organic whole milk and vanilla bean extract. High energy sweetness ideal for celebrations.'
    }
  },

  // Artisan Woodfire Pizzeria (Restaurant 2)
  {
    id: 201,
    restaurantId: 2,
    categoryId: 3,
    name: 'Margherita Burrata Speciale',
    description: 'San Marzano tomato sauce, fresh creamy burrata ball, basil oil, and extra virgin olive oil drizzle.',
    price: 499,
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=600&auto=format&fit=crop&q=80',
    isVeg: true,
    isAvailable: true,
    popular: true,
    nutrition: {
      calories: 720,
      protein: 30,
      carbs: 76,
      fat: 34,
      fiber: 5,
      allergens: 'Dairy, Gluten',
      aiSummary: 'Authentic 48-hour fermented sourdough crust offers improved gut digestibility. Lycopene-rich Italian tomato sauce paired with fresh calcium burrata.'
    }
  },
  {
    id: 202,
    restaurantId: 2,
    categoryId: 3,
    name: 'Diavola Spicy Pepperoni',
    description: 'Napoli crust with smoked mozzarella, hot pepperoni crisps, crushed red pepper flakes, and honey drizzle.',
    price: 579,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&auto=format&fit=crop&q=80',
    isVeg: false,
    isAvailable: true,
    popular: true,
    nutrition: {
      calories: 780,
      protein: 36,
      carbs: 72,
      fat: 39,
      fiber: 4,
      allergens: 'Dairy, Gluten',
      aiSummary: 'Flavor-dense pizza loaded with cured protein and metabolism-boosting capsaicin chili flakes.'
    }
  },
  {
    id: 203,
    restaurantId: 2,
    categoryId: 3,
    name: 'Wild Forest Truffle Funghi',
    description: 'Creamy white sauce base, roasted shiitake & cremini mushrooms, thyme, and white truffle oil essence.',
    price: 529,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80',
    isVeg: true,
    isAvailable: true,
    popular: false,
    nutrition: {
      calories: 610,
      protein: 22,
      carbs: 68,
      fat: 28,
      fiber: 6,
      allergens: 'Dairy, Gluten',
      aiSummary: 'Mushrooms provide immune-supporting beta-glucans, vitamin D, and rich umami without heavy animal fats.'
    }
  },

  // Nawabi Dum Biryani House (Restaurant 3)
  {
    id: 301,
    restaurantId: 3,
    categoryId: 4,
    name: 'Hyderabadi Dum Chicken Biryani',
    description: 'Long grain aged basmati rice cooked in layers with tender spiced chicken, served with mirchi ka salan & raita.',
    price: 389,
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80',
    isVeg: false,
    isAvailable: true,
    popular: true,
    nutrition: {
      calories: 750,
      protein: 44,
      carbs: 85,
      fat: 26,
      fiber: 5,
      allergens: 'Dairy (Ghee/Raita)',
      aiSummary: 'High-protein complete meal. Marinated chicken delivers lean essential amino acids, while saffron and whole spices aid digestive enzyme secretion.'
    }
  },
  {
    id: 302,
    restaurantId: 3,
    categoryId: 4,
    name: 'Royal Shahi Paneer Dum Biryani',
    description: 'Fresh malai paneer cubes slow-dum infused with fragrant saffron strands and golden fried brown onions.',
    price: 329,
    image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=600&auto=format&fit=crop&q=80',
    isVeg: true,
    isAvailable: true,
    popular: true,
    nutrition: {
      calories: 690,
      protein: 28,
      carbs: 88,
      fat: 25,
      fiber: 6,
      allergens: 'Dairy',
      aiSummary: 'Balanced vegetarian macronutrient distribution with sustained energy release from complex basmati grains and paneer fats.'
    }
  },

  // Tokyo Blossom (Restaurant 4)
  {
    id: 401,
    restaurantId: 4,
    categoryId: 5,
    name: 'Smoked Tonkotsu Chashu Ramen',
    description: 'Rich 16-hr pork bone broth with springy noodles, soft-boiled ajitsuke tamago egg, nori, and scallions.',
    price: 499,
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&auto=format&fit=crop&q=80',
    isVeg: false,
    isAvailable: true,
    popular: true,
    nutrition: {
      calories: 680,
      protein: 36,
      carbs: 64,
      fat: 32,
      fiber: 4,
      allergens: 'Soy, Gluten, Eggs',
      aiSummary: 'Bone broth provides natural collagen and joint-nourishing amino acids. Soft-boiled egg provides choline and lutein.'
    }
  },
  {
    id: 402,
    restaurantId: 4,
    categoryId: 5,
    name: 'Crispy Avocado Tempura Maki (8 pcs)',
    description: 'Crisp tempura nori roll stuffed with creamy hass avocado, cucumber strips, spicy mayo, and toasted sesame.',
    price: 399,
    image: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=600&auto=format&fit=crop&q=80',
    isVeg: true,
    isAvailable: true,
    popular: true,
    nutrition: {
      calories: 420,
      protein: 8,
      carbs: 56,
      fat: 18,
      fiber: 7,
      allergens: 'Soy, Sesame',
      aiSummary: 'Loaded with heart-healthy monounsaturated fats from avocado and iodine from nutrient-rich marine nori seaweed.'
    }
  },

  // Sweet Haven Patisserie (Restaurant 5)
  {
    id: 501,
    restaurantId: 5,
    categoryId: 6,
    name: 'Belgian Dark Chocolate Ganache Cake',
    description: '70% Belgian chocolate fudge layered between moist sponge and dusted with French Valrhona cocoa.',
    price: 249,
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80',
    isVeg: true,
    isAvailable: true,
    popular: true,
    nutrition: {
      calories: 480,
      protein: 7,
      carbs: 54,
      fat: 26,
      fiber: 5,
      allergens: 'Dairy, Gluten',
      aiSummary: 'Rich in dark cocoa flavonoids and antioxidants known to support cardiovascular blood flow and cognitive mood elevation.'
    }
  },
  {
    id: 502,
    restaurantId: 5,
    categoryId: 6,
    name: 'New York Baked Blueberry Cheesecake',
    description: 'Classic dense Philadelphia cream cheese cake on a buttery graham cracker crust with wild blueberry compote.',
    price: 279,
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600&auto=format&fit=crop&q=80',
    isVeg: false,
    isAvailable: true,
    popular: true,
    nutrition: {
      calories: 510,
      protein: 9,
      carbs: 58,
      fat: 28,
      fiber: 2,
      allergens: 'Dairy, Eggs, Gluten',
      aiSummary: 'Cream cheese provides protein and calcium, paired with anthocyanin antioxidant compounds from wild blueberries.'
    }
  },

  // Brew & Boba Lounge (Restaurant 6)
  {
    id: 601,
    restaurantId: 6,
    categoryId: 7,
    name: 'Brown Sugar Tiger Boba Milk',
    description: 'Warm, chewy brown sugar tapioca pearls with chilled whole milk and caramelized tiger syrup stripes.',
    price: 219,
    // Working, gorgeous Boba milk tea image
    image: 'https://images.unsplash.com/photo-1558857567-c2c31e9a2d8e?w=800&auto=format&fit=crop&q=80',
    isVeg: true,
    isAvailable: true,
    popular: true,
    nutrition: {
      calories: 380,
      protein: 8,
      carbs: 68,
      fat: 10,
      fiber: 1,
      allergens: 'Dairy',
      aiSummary: 'Fast-digesting carbohydrate fuel with chewy slow-simmered tapioca cassava pearls and calcium-fortified whole dairy.'
    }
  },
  {
    id: 602,
    restaurantId: 6,
    categoryId: 7,
    name: 'Vietnamese Iced Cold Brew',
    description: 'Slow-dripped robusta blend over ice sweetened with creamy condensed milk.',
    price: 189,
    image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=600&auto=format&fit=crop&q=80',
    isVeg: true,
    isAvailable: true,
    popular: false,
    nutrition: {
      calories: 160,
      protein: 4,
      carbs: 22,
      fat: 6,
      fiber: 0,
      allergens: 'Dairy',
      aiSummary: 'Caffeine and chlorogenic acid antioxidants boost metabolic alertness and mental focus.'
    }
  }
];

// Registered Users aligned with Database Schema
export const INITIAL_USERS = [
  {
    id: 1,
    fullName: 'Dhiraj Sharma',
    email: 'dhiraj@example.com',
    phone: '+91 98765 43210',
    password: 'customer123',
    role: 'ROLE_CUSTOMER',
    addresses: [
      {
        id: 1,
        label: 'Home',
        streetAddress: 'Apartment 402, Green Vista Enclave, Indiranagar',
        city: 'Bengaluru',
        state: 'Karnataka',
        postalCode: '560038',
        lat: 12.9784,
        lng: 77.6408,
        isDefault: true
      }
    ]
  },
  {
    id: 2,
    fullName: 'Admin Operations',
    email: 'admin@feasthub.com',
    phone: '+91 99999 88888',
    password: 'admin123',
    role: 'ROLE_ADMIN'
  },
  {
    id: 3,
    fullName: 'Vikram Singh',
    email: 'vikram@feasthub.com',
    phone: '+91 98111 22334',
    password: 'rider123',
    role: 'ROLE_DELIVERY_PARTNER',
    vehicleType: 'BIKE',
    vehicleNumber: 'KA 03 EZ 9821'
  }
];

export const CURRENT_USER = INITIAL_USERS[0];

export const DELIVERY_PARTNER = {
  id: 1,
  userId: 3,
  fullName: 'Vikram Singh',
  phone: '+91 98111 22334',
  vehicleType: 'BIKE',
  vehicleNumber: 'KA 03 EZ 9821',
  status: 'ONLINE',
  currentLat: 12.9680,
  currentLng: 77.6350,
  totalEarnings: 1450.00,
  completedDeliveries: 18
};

export const INITIAL_ORDERS = [
  {
    id: 84920,
    customerId: 1,
    customerEmail: 'dhiraj@feasthub.com',
    customerName: 'Dhiraj Sharma',
    customerPhone: '+91 98765 43210',
    restaurantId: 1,
    restaurantName: 'The Burger Foundry',
    restaurantAddress: '84, 12th Main Road, Indiranagar, Bengaluru',
    restaurantLat: 12.9719,
    restaurantLng: 77.6412,
    deliveryAddress: {
      label: 'Home',
      streetAddress: 'Apartment 402, Green Vista Enclave, Indiranagar',
      city: 'Bengaluru',
      lat: 12.9784,
      lng: 77.6408
    },
    items: [
      { id: 101, name: 'Double Truffle Smash Burger', quantity: 2, unitPrice: 349, subtotal: 698, isVeg: false },
      { id: 103, name: 'Cajun Seasoned Waffle Fries', quantity: 1, unitPrice: 169, subtotal: 169, isVeg: true },
      { id: 104, name: 'Salted Caramel Thickshake', quantity: 1, unitPrice: 199, subtotal: 199, isVeg: true }
    ],
    subtotal: 1066.00,
    deliveryFee: 30.00,
    taxAmount: 53.30,
    totalAmount: 1149.30,
    status: 'OUT_FOR_DELIVERY',
    deliveryOtp: '7421',
    otpVerified: false,
    deliveryPartnerId: 1,
    deliveryPartnerName: 'Vikram Singh',
    deliveryPartnerPhone: '+91 98111 22334',
    deliveryPartnerVehicle: 'Yamaha FZ (KA 03 EZ 9821)',
    paymentMethod: 'UPI',
    paymentStatus: 'PAID',
    createdAt: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
    estimatedDeliveryTime: '12 mins'
  }
];
