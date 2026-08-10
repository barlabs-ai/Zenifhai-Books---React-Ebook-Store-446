import { getRows, ensureTab } from '../lib/googleSheets';
import { settingsService } from './settingsService';

const TABS = ['Ebooks-Set1', 'Ebooks-Set2', 'Ebooks-Set3'];

let cache = { data: null, timestamp: 0 };
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const bookService = {
  getHeaders: async () => {
    // Fetch headers from the first tab to populate the mapping UI
    try {
      const rows = await getRows(`${TABS[0]}!A1:ZZ1`);
      return rows[0] || [];
    } catch (e) {
      return [];
    }
  },

  getAllBooks: async (forceRefresh = false) => {
    if (!forceRefresh && cache.data && (Date.now() - cache.timestamp < CACHE_DURATION)) {
      return cache.data;
    }

    const mapping = await settingsService.getMapping();
    const allBooks = [];

    for (const tab of TABS) {
      try {
        const rows = await getRows(`${tab}!A1:ZZ`);
        if (!rows || rows.length < 2) continue;

        const headers = rows[0];
        const dataRows = rows.slice(1);

        // Find column indexes based on mapping
        const colIndexes = {};
        Object.keys(mapping).forEach(appKey => {
          const sheetHeaderName = mapping[appKey];
          colIndexes[appKey] = headers.findIndex(h => h?.trim().toLowerCase() === sheetHeaderName?.trim().toLowerCase());
        });

        const mapped = dataRows.map((row, index) => {
          const book = {
            id: colIndexes.id >= 0 && row[colIndexes.id] ? row[colIndexes.id] : `${tab}-${index}`,
          };

          // Basic text fields
          ['title', 'author', 'description', 'category', 'cover_image_url', 'full_pdf_url'].forEach(key => {
            book[key] = colIndexes[key] >= 0 ? row[colIndexes[key]] : '';
          });

          // Price (handle possible $ signs or empty values, convert to cents)
          if (colIndexes.price >= 0) {
            let p = row[colIndexes.price] || '0';
            p = p.replace(/[^0-9.]/g, ''); // Remove $ or text
            book.price = Math.round(parseFloat(p || 0) * 100);
          } else {
            book.price = 0;
          }

          // Tags
          if (colIndexes.tags >= 0 && row[colIndexes.tags]) {
            book.tags = row[colIndexes.tags].split(',').map(t => t.trim());
          } else {
            book.tags = [];
          }

          // Booleans (Featured / Bestseller)
          // Support explicit columns OR tag-based fallbacks
          const checkBool = (key, tagKeyword) => {
            if (colIndexes[key] >= 0) {
              const val = String(row[colIndexes[key]]).toLowerCase();
              return val === 'true' || val === '1' || val === 'yes';
            }
            return book.tags.some(t => t.toLowerCase() === tagKeyword);
          };

          book.is_featured = checkBool('is_featured', 'featured');
          book.is_bestseller = checkBool('is_bestseller', 'bestseller');

          // Hardcode some defaults for UI if missing
          book.rating = 5; 
          book.review_count = Math.floor(Math.random() * 50) + 10;
          book.page_count = 120;
          book.language = 'English';

          return book;
        });

        // Filter out empty rows (where title is blank)
        allBooks.push(...mapped.filter(b => b.title));
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
  },

  clearCache: () => {
    cache.data = null;
  }
};