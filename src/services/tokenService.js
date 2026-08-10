import { appendRow, ensureTab, getRows, updateRow, findRowIndexById } from '../lib/googleSheets';

const TOKEN_HEADERS = ['id', 'order_id', 'book_id', 'book_title', 'download_count', 'max_downloads', 'expires_at', 'full_pdf_url', 'created_at'];

export const tokenService = {
  generateTokens: async (orderId, items) => {
    await ensureTab('DownloadTokens', TOKEN_HEADERS);
    const tokens = [];
    for (const item of items) {
      for (let i = 0; i < item.quantity; i++) {
        const id = crypto.randomUUID();
        const expiresAt = new Date(Date.now() + (item.download_expiry_days || 7) * 24 * 60 * 60 * 1000).toISOString();
        const row = [
          id,
          orderId,
          item.id,
          item.title,
          0,
          item.download_limit || 3,
          expiresAt,
          item.full_pdf_url || '',
          new Date().toISOString()
        ];
        await appendRow('DownloadTokens!A:Z', row);
        tokens.push({ id, bookTitle: item.title });
      }
    }
    return tokens;
  },

  validateToken: async (tokenId) => {
    await ensureTab('DownloadTokens', TOKEN_HEADERS);
    const rows = await getRows('DownloadTokens!A2:I');
    const row = rows.find(r => r[0] === tokenId);
    
    if (!row) return { valid: false, error: 'Invalid token' };
    
    const token = {
      id: row[0],
      order_id: row[1],
      book_id: row[2],
      book_title: row[3],
      download_count: Number(row[4]),
      max_downloads: Number(row[5]),
      expires_at: row[6],
      full_pdf_url: row[7]
    };

    if (new Date() > new Date(token.expires_at)) return { valid: false, error: 'Token expired' };
    if (token.download_count >= token.max_downloads) return { valid: false, error: 'Download limit reached' };

    // Increment count
    const rowIndex = await findRowIndexById('DownloadTokens', tokenId);
    const updatedRow = [...row];
    updatedRow[4] = token.download_count + 1;
    await updateRow(`DownloadTokens!A${rowIndex}:I${rowIndex}`, updatedRow);

    return { valid: true, token };
  }
};