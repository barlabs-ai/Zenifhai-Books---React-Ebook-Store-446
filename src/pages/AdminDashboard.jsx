import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Badge } from '../components/ui/Badge';
import SafeIcon from '../common/SafeIcon';
import { FiTrendingUp, FiPackage, FiUsers, FiDollarSign } from 'react-icons/fi';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.getAdminStats().then(setStats);
    setOrders(JSON.parse(localStorage.getItem('zen_orders') || '[]'));
  }, []);

  if (!stats) return <div className="p-8">Loading dashboard...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-[hsl(var(--card))] p-6 rounded-xl border border-[hsl(var(--border))] shadow-sm">
          <div className="flex items-center gap-4 text-[hsl(var(--primary))] mb-2">
            <SafeIcon icon={FiDollarSign} className="w-6 h-6" />
            <h3 className="font-medium text-[hsl(var(--muted-foreground))]">Total Revenue</h3>
          </div>
          <p className="text-3xl font-bold">${stats.totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-[hsl(var(--card))] p-6 rounded-xl border border-[hsl(var(--border))] shadow-sm">
          <div className="flex items-center gap-4 text-[hsl(var(--accent))] mb-2">
            <SafeIcon icon={FiPackage} className="w-6 h-6" />
            <h3 className="font-medium text-[hsl(var(--muted-foreground))]">Total Orders</h3>
          </div>
          <p className="text-3xl font-bold">{stats.totalOrders}</p>
        </div>
        <div className="bg-[hsl(var(--card))] p-6 rounded-xl border border-[hsl(var(--border))] shadow-sm">
          <div className="flex items-center gap-4 text-green-500 mb-2">
            <SafeIcon icon={FiTrendingUp} className="w-6 h-6" />
            <h3 className="font-medium text-[hsl(var(--muted-foreground))]">Books Catalog</h3>
          </div>
          <p className="text-3xl font-bold">{stats.totalBooks}</p>
        </div>
      </div>

      {/* Recent Orders */}
      <div>
        <h2 className="text-xl font-bold mb-4">Recent Orders (Simulated DB)</h2>
        <div className="bg-[hsl(var(--card))] rounded-xl border border-[hsl(var(--border))] overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-[hsl(var(--muted))/50] border-b border-[hsl(var(--border))]">
              <tr>
                <th className="p-4 font-medium">Order ID</th>
                <th className="p-4 font-medium">Customer</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Amount</th>
                <th className="p-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr><td colSpan="5" className="p-8 text-center text-[hsl(var(--muted-foreground))]">No orders yet.</td></tr>
              ) : (
                orders.slice().reverse().map(order => (
                  <tr key={order.id} className="border-b border-[hsl(var(--border))] last:border-0 hover:bg-[hsl(var(--muted))/20]">
                    <td className="p-4 font-mono text-xs">{order.id}</td>
                    <td className="p-4">{order.email}</td>
                    <td className="p-4">{new Date(order.date).toLocaleDateString()}</td>
                    <td className="p-4 font-medium">${(order.total / 100).toFixed(2)}</td>
                    <td className="p-4"><Badge variant="default" className="bg-green-500 text-white">Paid</Badge></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};