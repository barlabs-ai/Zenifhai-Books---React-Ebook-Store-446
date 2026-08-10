import { initialBooks } from '../data/mockDatabase';

// Initialize mock DB
const initDB = () => {
  if (!localStorage.getItem('zen_books')) {
    localStorage.setItem('zen_books', JSON.stringify(initialBooks));
  }
  if (!localStorage.getItem('zen_orders')) {
    localStorage.setItem('zen_orders', JSON.stringify([]));
  }
  if (!localStorage.getItem('zen_tokens')) {
    localStorage.setItem('zen_tokens', JSON.stringify([]));
  }
};
initDB();

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  getBooks: async (filters = {}) => {
    await delay(300);
    let books = JSON.parse(localStorage.getItem('zen_books'));
    if (filters.category) books = books.filter(b => b.category === filters.category);
    if (filters.search) {
      const q = filters.search.toLowerCase();
      books = books.filter(b => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q));
    }
    if (filters.featured) books = books.filter(b => b.is_featured);
    if (filters.bestseller) books = books.filter(b => b.is_bestseller);
    return books;
  },

  getBookById: async (id) => {
    await delay(200);
    const books = JSON.parse(localStorage.getItem('zen_books'));
    return books.find(b => b.id === id);
  },

  // Simulate Stripe Checkout and Webhook processing
  checkout: async (cartItems, customerEmail) => {
    await delay(1500); // Simulate network
    const orders = JSON.parse(localStorage.getItem('zen_orders'));
    const tokens = JSON.parse(localStorage.getItem('zen_tokens'));
    
    const orderId = `ord_${Math.random().toString(36).substr(2, 9)}`;
    const newTokens = [];
    const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    cartItems.forEach(item => {
      for(let i=0; i<item.quantity; i++) {
        const tokenStr = `tok_${Math.random().toString(36).substr(2, 9)}`;
        const tokenObj = {
          token: tokenStr,
          orderId,
          bookId: item.id,
          bookTitle: item.title,
          downloadCount: 0,
          maxDownloads: item.download_limit || 3,
          expiresAt: new Date(Date.now() + (item.download_expiry_days || 7) * 24 * 60 * 60 * 1000).toISOString()
        };
        tokens.push(tokenObj);
        newTokens.push(tokenObj);
      }
    });

    const newOrder = {
      id: orderId,
      email: customerEmail,
      items: cartItems,
      total: totalAmount,
      date: new Date().toISOString(),
      status: 'paid'
    };
    
    orders.push(newOrder);
    localStorage.setItem('zen_orders', JSON.stringify(orders));
    localStorage.setItem('zen_tokens', JSON.stringify(tokens));

    return { success: true, orderId, tokens: newTokens };
  },

  validateDownloadToken: async (tokenStr) => {
    await delay(500);
    const tokens = JSON.parse(localStorage.getItem('zen_tokens'));
    const tokenIndex = tokens.findIndex(t => t.token === tokenStr);
    
    if (tokenIndex === -1) return { valid: false, error: "Invalid token" };
    
    const token = tokens[tokenIndex];
    if (new Date() > new Date(token.expiresAt)) return { valid: false, error: "Token expired" };
    if (token.downloadCount >= token.maxDownloads) return { valid: false, error: "Download limit reached" };
    
    // Simulate successful download, increment count
    tokens[tokenIndex].downloadCount += 1;
    localStorage.setItem('zen_tokens', JSON.stringify(tokens));
    
    const book = await api.getBookById(token.bookId);
    return { valid: true, book, remaining: token.maxDownloads - tokens[tokenIndex].downloadCount };
  },

  getAdminStats: async () => {
    await delay(300);
    const orders = JSON.parse(localStorage.getItem('zen_orders'));
    const books = JSON.parse(localStorage.getItem('zen_books'));
    
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    return {
      totalRevenue: totalRevenue / 100,
      totalOrders: orders.length,
      totalBooks: books.length
    };
  }
};