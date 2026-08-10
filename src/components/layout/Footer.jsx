import React from 'react';
import { Link } from 'react-router-dom';
import SafeIcon from '../../common/SafeIcon';
import { FiBookOpen, FiTwitter, FiGithub, FiMail } from 'react-icons/fi';

export const Footer = () => {
  return (
    <footer className="border-t border-[hsl(var(--border))] bg-[hsl(var(--muted))/30] mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold text-[hsl(var(--primary))] mb-4">
              <SafeIcon icon={FiBookOpen} className="w-6 h-6" />
              <span>Zenifhai Books</span>
            </Link>
            <p className="text-[hsl(var(--muted-foreground))] max-w-sm">
              Discover, download, and dive into the world's best digital books. Premium quality, instant delivery.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-[hsl(var(--muted-foreground))]">
              <li><Link to="/catalog" className="hover:text-[hsl(var(--primary))]">All Books</Link></li>
              <li><Link to="/catalog?category=Fiction" className="hover:text-[hsl(var(--primary))]">Fiction</Link></li>
              <li><Link to="/catalog?category=Non-Fiction" className="hover:text-[hsl(var(--primary))]">Non-Fiction</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Connect</h4>
            <div className="flex gap-4">
              <a href="#" className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))]"><SafeIcon icon={FiTwitter} className="w-5 h-5" /></a>
              <a href="#" className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))]"><SafeIcon icon={FiGithub} className="w-5 h-5" /></a>
              <a href="#" className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))]"><SafeIcon icon={FiMail} className="w-5 h-5" /></a>
            </div>
          </div>
        </div>
        <div className="border-t border-[hsl(var(--border))] mt-8 pt-8 text-center text-sm text-[hsl(var(--muted-foreground))]">
          © {new Date().getFullYear()} Zenifhai Books. Built for demonstration.
        </div>
      </div>
    </footer>
  );
};