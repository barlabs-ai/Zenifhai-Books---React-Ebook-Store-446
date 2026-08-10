import { bookService } from './bookService';
import { orderService } from './orderService';
import { reviewService } from './reviewService';
import { tokenService } from './tokenService';
import { settingsService } from './settingsService';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export const api = {
  getBooks: async (filters = {}) => {
    let books = await bookService.getAllBooks();
    
    if (filters.category && filters.category !== 'All') {
      books = books.filter(b => b.category === filters.category);
    }
    
    if (filters.search) {
      const q = filters.search.toLowerCase();
      books = books.filter(b => 
        b.title?.toLowerCase().includes(q) || 
        b.author?.toLowerCase().includes(q)
      );
    }
    
    if (filters.featured) books = books.filter(b => b.is_featured);
    if (filters.bestseller) books = books.filter(b => b.is_bestseller);
    
    return books;
  },

  getBookById: (id) => bookService.getBookById(id),
  getReviews: (bookId) => reviewService.getReviewsByBookId(bookId),
  submitReview: (review) => reviewService.addReview(review),

  createCheckoutSession: async (cart, email) => {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    await new Promise(r => setTimeout(r, 1000));
    
    const sessionData = { email, cart, total, timestamp: Date.now() };
    localStorage.setItem('pending_checkout', JSON.stringify(sessionData));
    
    return { success: true, url: '#/checkout/success' };
  },

  finalizeOrder: async () => {
    const data = JSON.parse(localStorage.getItem('pending_checkout'));
    if (!data) return null;

    const order = await orderService.createOrder({
      email: data.email,
      total: data.total,
      items: data.cart
    });

    const tokens = await tokenService.generateTokens(order.id, data.cart);
    localStorage.removeItem('pending_checkout');
    
    return { order, tokens };
  },

  validateDownloadToken: (token) => tokenService.validateToken(token),

  // Admin and Settings
  getAdminStats: async () => {
    const [books, orders] = await Promise.all([
      bookService.getAllBooks(true), // Force refresh for admin
      orderService.getAllOrders()
    ]);
    
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    
    return {
      totalRevenue: totalRevenue / 100,
      totalOrders: orders.length,
      totalBooks: books.length,
      recentOrders: orders.slice().reverse().slice(0, 10)
    };
  },

  getSheetHeaders: () => bookService.getHeaders(),
  getColumnMapping: () => settingsService.getMapping(),
  updateColumnMapping: async (mapping) => {
    await settingsService.updateMapping(mapping);
    bookService.clearCache(); // Force books to reload with new mapping
    return true;
  }
};