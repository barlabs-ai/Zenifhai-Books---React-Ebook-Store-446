import { getRows, updateRow, ensureTab, appendRow } from '../lib/googleSheets';

const SETTINGS_HEADERS = ['config_key', 'config_value'];

// Default mapping based on your prompt
const DEFAULT_MAPPING = {
  id: 'ID',
  title: 'Name',
  author: 'Author', // Assuming you have an author column, otherwise it can be left blank
  description: 'Short description',
  price: 'Regular price',
  category: 'Categories',
  tags: 'Tags',
  cover_image_url: 'Images',
  full_pdf_url: 'Download 1 URL',
  is_featured: 'Is Featured',
  is_bestseller: 'Is Bestseller'
};

let settingsCache = null;

export const settingsService = {
  getMapping: async () => {
    if (settingsCache) return settingsCache;
    
    await ensureTab('Settings', SETTINGS_HEADERS);
    const rows = await getRows('Settings!A2:B');
    
    const mapping = { ...DEFAULT_MAPPING };
    rows.forEach(row => {
      if (row[0] && row[1]) {
        mapping[row[0]] = row[1];
      }
    });
    
    settingsCache = mapping;
    return mapping;
  },

  updateMapping: async (newMapping) => {
    await ensureTab('Settings', SETTINGS_HEADERS);
    const rows = await getRows('Settings!A:B');
    
    for (const [key, value] of Object.entries(newMapping)) {
      const rowIndex = rows.findIndex(r => r[0] === key);
      if (rowIndex >= 0) {
        // Update existing (rowIndex is 0-based array, so +1 for sheet row)
        await updateRow(`Settings!A${rowIndex + 1}:B${rowIndex + 1}`, [key, value]);
      } else {
        // Append new
        await appendRow('Settings!A:B', [key, value]);
      }
    }
    
    settingsCache = newMapping;
    return newMapping;
  },
  
  clearCache: () => {
    settingsCache = null;
  }
};