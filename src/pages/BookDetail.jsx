import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import { StarRating } from '../components/books/StarRating';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import SafeIcon from '../common/SafeIcon';
import { FiShoppingCart, FiBookOpen, FiCheck } from 'react-icons/fi';

export const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getBookById(id).then(data => {
      setBook(data);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
  if (!book) return <div className="h-screen flex items-center justify-center">Book not found</div>;

  const handleBuyNow = () => {
    addToCart(book);
    navigate('/checkout');
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Cover Image */}
        <div className="w-full md:w-1/3 max-w-sm mx-auto md:mx-0">
          <div className="rounded-xl overflow-hidden shadow-2xl border border-[hsl(var(--border))] sticky top-24">
            <img src={book.cover_image_url} alt={book.title} className="w-full h-auto object-cover" />
          </div>
        </div>

        {/* Book Info */}
        <div className="flex-1">
          <div className="flex flex-col gap-4 mb-8">
            <div className="flex items-center gap-2">
              <Badge variant="outline">{book.category}</Badge>
              {book.is_bestseller && <Badge variant="accent">Bestseller</Badge>}
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">{book.title}</h1>
            <p className="text-xl text-[hsl(var(--muted-foreground))]">by {book.author}</p>
            <div className="flex items-center gap-4">
              <StarRating rating={book.rating} count={book.review_count} />
              <span className="text-[hsl(var(--muted-foreground))]">|</span>
              <span className="font-medium">{book.page_count} pages</span>
            </div>
          </div>

          <div className="text-3xl font-bold mb-8">${(book.price / 100).toFixed(2)}</div>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Button size="lg" className="flex-1 gap-2" onClick={() => addToCart(book)}>
              <SafeIcon icon={FiShoppingCart} /> Add to Cart
            </Button>
            <Button size="lg" variant="accent" className="flex-1 gap-2" onClick={handleBuyNow}>
              Buy Now
            </Button>
          </div>

          <div className="prose dark:prose-invert max-w-none mb-12">
            <h3 className="text-xl font-bold mb-4">Description</h3>
            <p className="text-[hsl(var(--muted-foreground))] leading-relaxed">{book.long_description}</p>
          </div>

          <div className="bg-[hsl(var(--muted))/30] rounded-xl p-6 border border-[hsl(var(--border))]">
            <h3 className="font-bold mb-4">Book Details</h3>
            <div className="grid grid-cols-2 gap-y-4 text-sm">
              <div><span className="text-[hsl(var(--muted-foreground))]">Language:</span> {book.language}</div>
              <div><span className="text-[hsl(var(--muted-foreground))]">Published:</span> {book.publication_date}</div>
              <div><span className="text-[hsl(var(--muted-foreground))]">ISBN:</span> {book.isbn}</div>
              <div><span className="text-[hsl(var(--muted-foreground))]">Format:</span> PDF (DRM-Free)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};