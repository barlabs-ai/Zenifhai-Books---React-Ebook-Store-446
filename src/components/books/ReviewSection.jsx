import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { StarRating } from './StarRating';
import SafeIcon from '../../common/SafeIcon';
import { FiMessageSquare, FiUser } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';

export const ReviewSection = ({ bookId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ rating: 5, title: '', body: '' });

  useEffect(() => {
    api.getReviews(bookId).then(data => {
      setReviews(data);
      setLoading(false);
    });
  }, [bookId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const newReview = await api.submitReview({ ...form, book_id: bookId });
      setReviews([newReview, ...reviews]);
      setForm({ rating: 5, title: '', body: '' });
    } catch (err) {
      console.error(err);
    }
    setSubmitting(false);
  };

  return (
    <div className="mt-16 border-t border-[hsl(var(--border))] pt-12">
      <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
        <SafeIcon icon={FiMessageSquare} />
        Customer Reviews
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Review Form */}
        <div className="md:col-span-1">
          <div className="bg-[hsl(var(--card))] p-6 rounded-xl border border-[hsl(var(--border))] sticky top-24">
            <h3 className="font-bold mb-4">Write a Review</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Rating</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setForm({ ...form, rating: s })}
                      className={`text-2xl ${s <= form.rating ? 'text-[hsl(var(--accent))]' : 'text-gray-300'}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <Input
                placeholder="Review Title"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                required
              />
              <textarea
                className="w-full h-32 p-3 rounded-md border border-[hsl(var(--border))] bg-transparent text-sm"
                placeholder="Share your thoughts about this book..."
                value={form.body}
                onChange={e => setForm({ ...form, body: e.target.value })}
                required
              />
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Post Review'}
              </Button>
            </form>
          </div>
        </div>

        {/* Review List */}
        <div className="md:col-span-2 space-y-6">
          {loading ? (
            <p>Loading reviews...</p>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12 bg-[hsl(var(--muted))/20] rounded-xl border border-dashed border-[hsl(var(--border))]">
              <p className="text-[hsl(var(--muted-foreground))]">No reviews yet. Be the first to review!</p>
            </div>
          ) : (
            reviews.map(review => (
              <div key={review.id} className="bg-[hsl(var(--card))] p-6 rounded-xl border border-[hsl(var(--border))] shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[hsl(var(--muted))] flex items-center justify-center">
                      <SafeIcon icon={FiUser} className="text-[hsl(var(--muted-foreground))]" />
                    </div>
                    <div>
                      <h4 className="font-bold leading-none">{review.title}</h4>
                      <div className="mt-1">
                        <StarRating rating={review.rating} />
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-[hsl(var(--muted-foreground))]">
                    {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-[hsl(var(--muted-foreground))] leading-relaxed italic">
                  "{review.body}"
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};