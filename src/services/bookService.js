import { getRows, ensureTab } from '../lib/googleSheets';

const BOOK_HEADERS = [
  'id', 'title', 'author', 'description', 'long_description', 'price', 
  'category', 'tags', 'cover_image_url', 'preview_pdf_url', 'full_pdf_url', 
  'rating', 'review_count', 'isbn', 'page_count', 'language', 
  'publication_date', 'is_featured', 'is_bestseller', 'download_limit', 
  'download_expiry_days'
];

const TABS = ['Ebooks-Set1', 'Ebooks-Set2', 'Ebooks-Set3'];

let cache = { data: null, timestamp: 0 };
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const bookService = {
  getAllBooks: async () => {
    if (cache.data && (Date.now() - cache.timestamp < CACHE_DURATION)) {
      return cache.data;
    }

    const allBooks = [];
    for (const tab of TABS) {
      try {
        await ensureTab(tab, BOOK_HEADERS);
        const rows = await getRows(`${tab}!A2:Z`);
        const mapped = rows.map(row => {
          const book = {};
          BOOK_HEADERS.forEach((header, i) => {
            let val = row[i];
            if (['price', 'rating', 'review_count', 'page_count', 'download_limit', 'download_expiry_days'].includes(header)) {
              val = Number(val) || 0;
            }
            if (['is_featured', 'is_bestseller'].includes(header)) {
              val = val === 'TRUE' || val === 'true' || val === true;
            }
            if (header === 'tags' && val) {
              val = val.split(',').map(t => t.trim());
            }
            book[header] = val;
          });
          return book;
        });
        allBooks.push(...mapped);
      } catch (err) {
        console.warn(`Failed to fetch from ${tab}:`, err);
      }
    }

    cache = { data: allBooks, timestamp: Date.now() };
    return allBooks;
  },

  getBookById: async (id) => {
    const books = await bookService.getAllBooks();
    return books.find(b => b.id === id);
  }
};