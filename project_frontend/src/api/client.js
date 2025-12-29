// src/api/client.js
// This file simulates a backend connection. 

const DUMMY_PRODUCTS = [
  {
    id: "rbst-001",
    name: "Rabuste Dark Roast",
    price: { sellingPrice: 399 },
    image: "https://placehold.co/600x400/1a1a1a/FFF?text=Dark+Roast",
    description: "Bold and intense coffee with smoky notes. Perfect for those who love a strong kick to start their day."
  },
  {
    id: "rbst-002",
    name: "Rabuste Gold Blend",
    price: { sellingPrice: 449 },
    image: "https://placehold.co/600x400/1a1a1a/FFF?text=Gold+Blend",
    description: "Smooth, balanced profile with hints of caramel and vanilla. A sophisticated choice for the afternoon."
  },
  {
    id: "rbst-003",
    name: "Rabuste Premium",
    price: { sellingPrice: 699 },
    image: "https://placehold.co/600x400/1a1a1a/FFF?text=Premium",
    description: "Our finest selection for true connoisseurs. Hand-picked beans processed with meticulous care."
  }
];

// Workshop Data matching Admin Panel
const DUMMY_WORKSHOPS = [
  {
    id: "ws-001",
    title: "Introduction to Robusta Brewing",
    date: "2025-01-15",
    time: "10:00 AM - 12:00 PM",
    price: "Free Entry",
    status: "CANCELLED",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=800",
    description: "Learn the fundamentals of brewing the perfect cup of Robusta. We will cover grinding, water temperature, and timing."
  },
  {
    id: "ws-002",
    title: "Art & Coffee: Creative Session",
    date: "2025-01-20",
    time: "4:00 PM - 6:00 PM",
    price: "Free Entry",
    status: "ACTIVE",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=800",
    description: "A relaxed evening of painting and coffee tasting. Materials provided. Open to all skill levels."
  },
  {
    id: "ws-003",
    title: "Advanced Espresso Techniques",
    date: "2025-01-25",
    time: "2:00 PM - 5:00 PM",
    price: "₹ 499",
    status: "ACTIVE",
    image: "https://images.unsplash.com/photo-1511537632536-b7a4896840a4?auto=format&fit=crop&q=80&w=800",
    description: "Deep dive into espresso extraction variables. For baristas and serious home brewers."
  }
];

export const apiClient = {
  // Simulate fetching products
  getProducts: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(DUMMY_PRODUCTS);
      }, 500); 
    });
  },

  // Simulate fetching a single product
  getProduct: async (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const product = DUMMY_PRODUCTS.find((p) => p.id === id);
        if (product) {
          resolve(product);
        } else {
          reject(new Error("Product not found"));
        }
      }, 300);
    });
  },

  // Simulate sending an order
  placeOrder: async (orderDetails) => {
    return new Promise((resolve) => {
      console.log("Sending order to backend:", orderDetails);
      setTimeout(() => {
        resolve({ success: true, orderId: "ORD-" + Date.now() });
      }, 1500); 
    });
  },

  // Fetch All Workshops
  getWorkshops: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(DUMMY_WORKSHOPS);
      }, 500); 
    });
  },

  // NEW: Fetch a single workshop by ID
  getWorkshop: async (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const workshop = DUMMY_WORKSHOPS.find((w) => w.id === id);
        if (workshop) {
          resolve(workshop);
        } else {
          reject(new Error("Workshop not found"));
        }
      }, 300);
    });
  },
  
  // NEW: Simulate registering for a workshop
  registerForWorkshop: async (data) => {
    return new Promise((resolve) => {
      console.log("Workshop Registration:", data);
      setTimeout(() => {
        resolve({ success: true, ticketId: "TKT-" + Date.now() });
      }, 1500);
    });
  }
};