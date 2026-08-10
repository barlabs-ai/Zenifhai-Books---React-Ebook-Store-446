import { bookService } from './bookService';
import { orderService } from './orderService';
import { reviewService } from './reviewService';
import { tokenService } from './tokenService';
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

  // Stripe Checkout Flow
  createCheckoutSession: async (cart, email) => {
    // In a real app, this would be a call to your backend /api/checkout
    // For this simulation, we'll store the intent and redirect to a success page
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Simulate session creation delay
    await new Promise(r => setTimeout(r, 1000));
    
    // Store temporary checkout data to be picked up on success page
    const sessionData = {
      email,
      cart,
      total,
      timestamp: Date.now()
    };
    localStorage.setItem('pending_checkout', JSON.stringify(sessionData));
    
    // Normally: const stripe = await stripePromise; await stripe.redirectToCheckout({ sessionId });
    // Here: Redirect to our internal success route which handles the "webhook" logic
    return { success: true, url: '#/checkout/success' };
  },

  // Finalize order after successful payment
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

  getAdminStats: async () => {
    const [books, orders] = await Promise.all([
      bookService.getAllBooks(),
      orderService.getAllOrders()
    ]);
    
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    
    return {
      totalRevenue: totalRevenue / 100,
      totalOrders: orders.length,
      totalBooks: books.length,
      recentOrders: orders.slice().reverse().slice(0, 10)
    };
  }
};