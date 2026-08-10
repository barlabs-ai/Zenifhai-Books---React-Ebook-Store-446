import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { StarRating } from './StarRating';
import { Badge } from '../ui/Badge';
import { useCart } from '../../context/CartContext';
import { Button } from '../ui/Button';
import SafeIcon from '../../common/SafeIcon';
import { FiShoppingCart } from 'react-icons/fi';

export const BookCard = ({ book }) => {
  const { addToCart } = useCart();

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="group relative flex flex-col bg-[hsl(var(--card))] rounded-xl overflow-hidden border border-[hsl(var(--border))] shadow-sm hover:shadow-md transition-all"
    >
      <Link to={`/book/${book.id}`} className="block relative aspect-[2/3] overflow-hidden">
        <img 
          src={book.cover_image_url} 
          alt={book.title} 
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {book.is_bestseller && <Badge variant="accent">Bestseller</Badge>}
          {book.is_featured && <Badge variant="default">Featured</Badge>}
        </div>
      </Link>
      
      <div className="p-4 flex flex-col flex-grow">
        <div className="text-xs text-[hsl(var(--muted-foreground))] mb-1">{book.category}</div>
        <Link to={`/book/${book.id}`} className="block">
          <h3 className="font-bold text-lg leading-tight mb-1 line-clamp-1 group-hover:text-[hsl(var(--primary))] transition-colors">{book.title}</h3>
        </Link>
        <p className="text-sm text-[hsl(var(--muted-foreground))] mb-2">{book.author}</p>
        
        <div className="mt-auto pt-2 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-bold text-lg">${(book.price / 100).toFixed(2)}</span>
            <StarRating rating={book.rating} />
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="rounded-full w-10 h-10 p-0"
            onClick={(e) => { e.preventDefault(); addToCart(book); }}
            aria-label="Add to cart"
          >
            <SafeIcon icon={FiShoppingCart} className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};