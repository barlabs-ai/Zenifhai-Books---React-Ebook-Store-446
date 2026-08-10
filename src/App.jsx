import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { Catalog } from './pages/Catalog';
import { BookDetail } from './pages/BookDetail';
import { Checkout } from './pages/Checkout';
import { Download } from './pages/Download';
import { AdminDashboard } from './pages/AdminDashboard';
import '@questlabs/react-sdk/dist/style.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="catalog" element={<Catalog />} />
        <Route path="book/:id" element={<BookDetail />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="download/:token" element={<Download />} />
        <Route path="admin" element={<AdminDashboard />} />
      </Route>
    </Routes>
  );
}

export default App;