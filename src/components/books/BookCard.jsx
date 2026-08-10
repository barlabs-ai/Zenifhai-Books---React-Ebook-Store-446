import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { StarRating } from './StarRating';
import { Badge } from '../ui/Badge';
import { useCart } from '../../context/CartContext';
import { Button } from '../ui/Button';
import SafeIcon from '../../common/SafeIcon';
import { FiShoppingCart, FiImage } from 'react-icons/fi';

export const BookCard = ({ book }) => {
  const { addToCart } = useCart();

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="group relative flex flex-col bg-[hsl(var(--card))] rounded-xl overflow-hidden border border-[hsl(var(--border))] shadow-sm hover:shadow-md transition-all h-full"
    >
      <Link to={`/book/${book.id}`} className="block relative aspect-[2/3] overflow-hidden bg-[hsl(var(--muted))]">
        {book.cover_image_url ? (
          <img 
            src={book.cover_image_url} 
            alt={book.title} 
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        
        {/* Fallback Image */}
        <div className={`absolute inset-0 flex-col items-center justify-center text-[hsl(var(--muted-foreground))] ${book.cover_image_url ? 'hidden' : 'flex'}`}>
          <SafeIcon icon={FiImage} className="w-12 h-12 mb-2 opacity-50" />
          <span className="text-xs font-medium px-4 text-center">{book.title}</span>
        </div>

        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {book.is_bestseller && <Badge variant="accent">Bestseller</Badge>}
          {book.is_featured && <Badge variant="default">Featured</Badge>}
        </div>
      </Link>
      
      <div className="p-4 flex flex-col flex-grow">
        <div className="text-xs text-[hsl(var(--muted-foreground))] mb-1">{book.category || 'Uncategorized'}</div>
        <Link to={`/book/${book.id}`} className="block">
          <h3 className="font-bold text-lg leading-tight mb-1 line-clamp-1 group-hover:text-[hsl(var(--primary))] transition-colors" title={book.title}>
            {book.title || 'Untitled'}
          </h3>
        </Link>
        <p className="text-sm text-[hsl(var(--muted-foreground))] mb-2 line-clamp-1">{book.author || 'Unknown Author'}</p>
        
        <div className="mt-auto pt-2 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-bold text-lg">${((book.price || 0) / 100).toFixed(2)}</span>
            <StarRating rating={book.rating || 5} />
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="rounded-full w-10 h-10 p-0 bg-[hsl(var(--primary))/10] text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))] hover:text-white"
            onClick={(e) => {
              e.preventDefault();
              addToCart(book);
            }}
            aria-label="Add to cart"
          >
            <SafeIcon icon={FiShoppingCart} className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};