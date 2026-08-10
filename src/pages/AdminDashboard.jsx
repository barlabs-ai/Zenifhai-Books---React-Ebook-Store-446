import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Badge } from '../components/ui/Badge';
import SafeIcon from '../common/SafeIcon';
import { FiTrendingUp, FiPackage, FiDollarSign, FiRefreshCw } from 'react-icons/fi';
import { format } from 'date-fns';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    const data = await api.getAdminStats();
    setStats(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) return (
    <div className="h-screen flex items-center justify-center gap-2">
      <SafeIcon icon={FiRefreshCw} className="animate-spin" />
      Loading real-time data...
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Management Portal</h1>
        <button 
          onClick={fetchStats}
          className="p-2 hover:bg-[hsl(var(--muted))] rounded-full transition-colors"
          title="Refresh Data"
        >
          <SafeIcon icon={FiRefreshCw} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-[hsl(var(--card))] p-8 rounded-2xl border border-[hsl(var(--border))] shadow-sm">
          <div className="flex items-center gap-4 text-[hsl(var(--primary))] mb-4">
            <div className="p-3 bg-[hsl(var(--primary))/10] rounded-xl">
              <SafeIcon icon={FiDollarSign} className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-medium text-[hsl(var(--muted-foreground))]">Total Revenue</h3>
              <p className="text-3xl font-bold">${stats.totalRevenue.toFixed(2)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-[hsl(var(--card))] p-8 rounded-2xl border border-[hsl(var(--border))] shadow-sm">
          <div className="flex items-center gap-4 text-[hsl(var(--accent))] mb-4">
            <div className="p-3 bg-[hsl(var(--accent))/10] rounded-xl">
              <SafeIcon icon={FiPackage} className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-medium text-[hsl(var(--muted-foreground))]">Total Orders</h3>
              <p className="text-3xl font-bold">{stats.totalOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-[hsl(var(--card))] p-8 rounded-2xl border border-[hsl(var(--border))] shadow-sm">
          <div className="flex items-center gap-4 text-green-500 mb-4">
            <div className="p-3 bg-green-500/10 rounded-xl">
              <SafeIcon icon={FiTrendingUp} className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-medium text-[hsl(var(--muted-foreground))]">Books in Catalog</h3>
              <p className="text-3xl font-bold">{stats.totalBooks}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div>
        <h2 className="text-xl font-bold mb-6">Recent Transactions (from Google Sheets)</h2>
        <div className="bg-[hsl(var(--card))] rounded-2xl border border-[hsl(var(--border))] overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[hsl(var(--muted))/50] border-b border-[hsl(var(--border))]">
                <tr>
                  <th className="p-5 font-bold">Order ID</th>
                  <th className="p-5 font-bold">Customer Email</th>
                  <th className="p-5 font-bold">Order Date</th>
                  <th className="p-5 font-bold">Items</th>
                  <th className="p-5 font-bold">Amount</th>
                  <th className="p-5 font-bold">Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.length === 0 ? (
                  <tr><td colSpan="6" className="p-12 text-center text-[hsl(var(--muted-foreground))] italic">No orders recorded in the spreadsheet yet.</td></tr>
                ) : (
                  stats.recentOrders.map(order => (
                    <tr key={order.id} className="border-b border-[hsl(var(--border))] last:border-0 hover:bg-[hsl(var(--muted))/20] transition-colors">
                      <td className="p-5 font-mono text-xs text-[hsl(var(--primary))]">{order.id.split('-')[0]}...</td>
                      <td className="p-5 font-medium">{order.email}</td>
                      <td className="p-5 text-[hsl(var(--muted-foreground))]">
                        {format(new Date(order.created_at), 'MMM dd, yyyy HH:mm')}
                      </td>
                      <td className="p-5">
                        <span className="text-xs px-2 py-1 bg-[hsl(var(--muted))] rounded">
                          {order.items.length} {order.items.length === 1 ? 'book' : 'books'}
                        </span>
                      </td>
                      <td className="p-5 font-bold">${(order.total / 100).toFixed(2)}</td>
                      <td className="p-5">
                        <Badge variant="default" className="bg-green-500/10 text-green-500 border-green-500/20">
                          COMPLETED
                        </Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};