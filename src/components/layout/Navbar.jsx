import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import SafeIcon from '../../common/SafeIcon';
import { FiShoppingCart, FiSun, FiMoon, FiSearch, FiBookOpen } from 'react-icons/fi';
import { Input } from '../ui/Input';

export const Navbar = () => {
  const { cartCount, setIsCartOpen } = useCart();
  const { theme, toggleTheme } = useTheme();
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/catalog?q=${encodeURIComponent(search)}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[hsl(var(--border))] bg-[hsl(var(--background))]/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-[hsl(var(--primary))]">
          <SafeIcon icon={FiBookOpen} className="w-6 h-6" />
          <span className="hidden sm:inline-block">Zenifhai Books</span>
        </Link>

        <form onSubmit={handleSearch} className="flex-1 max-w-md relative">
          <Input 
            type="search" 
            placeholder="Search books, authors..." 
            className="pl-10 rounded-full bg-[hsl(var(--muted))]/50 border-transparent focus:border-[hsl(var(--primary))]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--muted-foreground))]" />
        </form>

        <nav className="flex items-center gap-4">
          <Link to="/catalog" className="text-sm font-medium hover:text-[hsl(var(--primary))] hidden md:block">Catalog</Link>
          <Link to="/admin" className="text-sm font-medium hover:text-[hsl(var(--primary))] hidden md:block">Admin</Link>
          
          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-[hsl(var(--muted))] transition-colors">
            <SafeIcon icon={theme === 'dark' ? FiSun : FiMoon} className="w-5 h-5" />
          </button>
          
          <button onClick={() => setIsCartOpen(true)} className="p-2 rounded-full hover:bg-[hsl(var(--muted))] transition-colors relative">
            <SafeIcon icon={FiShoppingCart} className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-[hsl(var(--accent))] text-white text-[10px] font-bold rounded-full flex items-center justify-center transform translate-x-1 -translate-y-1">
                {cartCount}
              </span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
};