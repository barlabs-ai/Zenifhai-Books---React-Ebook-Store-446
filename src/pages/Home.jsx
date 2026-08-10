import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../services/api';
import { BookCard } from '../components/books/BookCard';
import { Button } from '../components/ui/Button';
import SafeIcon from '../common/SafeIcon';
import { FiArrowRight } from 'react-icons/fi';

export const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [bestsellers, setBestsellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const [feat, best] = await Promise.all([
        api.getBooks({ featured: true }),
        api.getBooks({ bestseller: true })
      ]);
      setFeatured(feat);
      setBestsellers(best);
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* Hero Section */}
      <section className="relative bg-[hsl(var(--muted))] pt-16 pb-24 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6"
            >
              Expand your mind.<br/>
              <span className="text-[hsl(var(--primary))]">One page at a time.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="text-lg text-[hsl(var(--muted-foreground))] mb-8"
            >
              Discover premium digital books from top authors. Instant delivery, lifetime access.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Button as={Link} to="/catalog" size="lg" className="gap-2">
                Browse Catalog <SafeIcon icon={FiArrowRight} />
              </Button>
            </motion.div>
          </div>
        </div>
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[600px] h-[600px] bg-[hsl(var(--primary))]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[400px] h-[400px] bg-[hsl(var(--accent))]/10 rounded-full blur-3xl" />
      </section>

      {/* Featured Section */}
      <section className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">Featured Reads</h2>
            <p className="text-[hsl(var(--muted-foreground))]">Handpicked titles you can't miss.</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {featured.slice(0, 4).map(book => <BookCard key={book.id} book={book} />)}
        </div>
      </section>

      {/* Bestsellers Section */}
      <section className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">Bestsellers</h2>
            <p className="text-[hsl(var(--muted-foreground))]">What everyone is reading right now.</p>
          </div>
          <Link to="/catalog?filter=bestsellers" className="text-[hsl(var(--primary))] hover:underline flex items-center gap-1 font-medium">
            View all <SafeIcon icon={FiArrowRight} />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {bestsellers.slice(0, 4).map(book => <BookCard key={book.id} book={book} />)}
        </div>
      </section>
    </div>
  );
};