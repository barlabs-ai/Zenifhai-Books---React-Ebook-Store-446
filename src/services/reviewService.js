import { appendRow, ensureTab, getRows } from '../lib/googleSheets';

const REVIEW_HEADERS = ['id', 'book_id', 'rating', 'title', 'body', 'created_at'];

export const reviewService = {
  addReview: async (review) => {
    await ensureTab('Reviews', REVIEW_HEADERS);
    const id = crypto.randomUUID();
    const row = [
      id,
      review.book_id,
      review.rating,
      review.title,
      review.body,
      new Date().toISOString()
    ];
    await appendRow('Reviews!A:Z', row);
    return { ...review, id };
  },

  getReviewsByBookId: async (bookId) => {
    await ensureTab('Reviews', REVIEW_HEADERS);
    const rows = await getRows('Reviews!A2:Z');
    return rows
      .filter(row => row[1] === bookId)
      .map(row => ({
        id: row[0],
        book_id: row[1],
        rating: Number(row[2]),
        title: row[3],
        body: row[4],
        created_at: row[5]
      }))
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }
};