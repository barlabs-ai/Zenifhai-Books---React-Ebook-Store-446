import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { categories } from '../data/mockDatabase';
import { BookCard } from '../components/books/BookCard';
import { Button } from '../components/ui/Button';

export const Catalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentCategory = searchParams.get('category') || 'All';
  const searchQuery = searchParams.get('q') || '';

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      const filters = {};
      if (currentCategory !== 'All') filters.category = currentCategory;
      if (searchQuery) filters.search = searchQuery;
      
      const data = await api.getBooks(filters);
      setBooks(data);
      setLoading(false);
    };
    fetchBooks();
  }, [currentCategory, searchQuery]);

  const handleCategoryClick = (cat) => {
    if (cat === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
      {/* Sidebar Filters */}
      <aside className="w-full md:w-64 flex-shrink-0">
        <div className="sticky top-24">
          <h3 className="font-bold text-lg mb-4">Categories</h3>
          <div className="flex flex-col gap-2">
            {['All', ...categories].map(cat => (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className={`text-left px-3 py-2 rounded-md text-sm transition-colors ${
                  currentCategory === cat 
                    ? 'bg-[hsl(var(--primary))] text-white font-medium' 
                    : 'hover:bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">
            {searchQuery ? `Search results for "${searchQuery}"` : `${currentCategory} Books`}
          </h1>
          <p className="text-[hsl(var(--muted-foreground))]">Showing {books.length} results</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-[hsl(var(--muted))] animate-pulse aspect-[2/3] rounded-xl" />
            ))}
          </div>
        ) : books.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {books.map(book => <BookCard key={book.id} book={book} />)}
          </div>
        ) : (
          <div className="text-center py-20 bg-[hsl(var(--muted))/30] rounded-xl border border-[hsl(var(--border))]">
            <h3 className="text-xl font-bold mb-2">No books found</h3>
            <p className="text-[hsl(var(--muted-foreground))] mb-4">Try adjusting your filters or search query.</p>
            <Button onClick={() => setSearchParams({})}>Clear Filters</Button>
          </div>
        )}
      </div>
    </div>
  );
};