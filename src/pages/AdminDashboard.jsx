import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import SafeIcon from '../common/SafeIcon';
import { FiTrendingUp, FiPackage, FiDollarSign, FiRefreshCw, FiSettings, FiDatabase } from 'react-icons/fi';
import { format } from 'date-fns';

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'mapping'
  const [stats, setStats] = useState(null);
  const [headers, setHeaders] = useState([]);
  const [mapping, setMapping] = useState({});
  const [loading, setLoading] = useState(true);
  const [savingMapping, setSavingMapping] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsData, sheetHeaders, currentMapping] = await Promise.all([
        api.getAdminStats(),
        api.getSheetHeaders(),
        api.getColumnMapping()
      ]);
      setStats(statsData);
      setHeaders(sheetHeaders.filter(h => h)); // Remove empty columns
      setMapping(currentMapping);
    } catch (err) {
      console.error("Error fetching admin data:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveMapping = async () => {
    setSavingMapping(true);
    await api.updateColumnMapping(mapping);
    await fetchData(); // Refresh stats with new mapping
    setSavingMapping(false);
    alert('Mapping saved successfully! The app will now use these columns.');
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center gap-2">
      <SafeIcon icon={FiRefreshCw} className="animate-spin" />
      Loading admin data...
    </div>
  );

  const MAPPING_FIELDS = [
    { key: 'id', label: 'Unique ID / SKU', desc: 'Optional. Unique identifier.' },
    { key: 'title', label: 'Book Title / Name', desc: 'Required. The name of the book.' },
    { key: 'author', label: 'Author', desc: 'Optional. Writer of the book.' },
    { key: 'description', label: 'Description', desc: 'Main text shown on the detail page.' },
    { key: 'price', label: 'Price', desc: 'Sales or Regular Price (e.g., $10.99 or 10.99).' },
    { key: 'category', label: 'Category', desc: 'Used for sidebar filtering.' },
    { key: 'tags', label: 'Tags', desc: 'Comma separated tags (e.g., fiction, featured).' },
    { key: 'cover_image_url', label: 'Cover Image URL', desc: 'Link to the book cover image.' },
    { key: 'full_pdf_url', label: 'Download URL (PDF)', desc: 'The actual file given after purchase.' },
    { key: 'is_featured', label: 'Is Featured?', desc: 'TRUE/FALSE column (or use "featured" in tags).' },
    { key: 'is_bestseller', label: 'Is Bestseller?', desc: 'TRUE/FALSE column (or use "bestseller" in tags).' }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">Management Portal</h1>
        
        <div className="flex bg-[hsl(var(--muted))] p-1 rounded-lg">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors ${activeTab === 'overview' ? 'bg-[hsl(var(--background))] shadow-sm text-[hsl(var(--primary))]' : 'text-[hsl(var(--muted-foreground))]'}`}
          >
            <SafeIcon icon={FiDatabase} /> Overview
          </button>
          <button 
            onClick={() => setActiveTab('mapping')}
            className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors ${activeTab === 'mapping' ? 'bg-[hsl(var(--background))] shadow-sm text-[hsl(var(--primary))]' : 'text-[hsl(var(--muted-foreground))]'}`}
          >
            <SafeIcon icon={FiSettings} /> Data Mapping
          </button>
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-end mb-4">
            <button onClick={fetchData} className="p-2 hover:bg-[hsl(var(--muted))] rounded-full transition-colors flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))]">
              <SafeIcon icon={FiRefreshCw} className={loading ? 'animate-spin' : ''} /> Refresh Stats
            </button>
          </div>

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
      )}

      {activeTab === 'mapping' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl">
          <div className="bg-[hsl(var(--card))] p-8 rounded-2xl border border-[hsl(var(--border))] shadow-sm mb-6">
            <h2 className="text-xl font-bold mb-2">Google Sheet Column Mapping</h2>
            <p className="text-[hsl(var(--muted-foreground))] mb-8">
              Select which column header from your Google Sheet (Ebooks-Set1) corresponds to each field required by the app. 
              These settings are saved back to a hidden "Settings" tab in your sheet.
            </p>

            <div className="space-y-6">
              {MAPPING_FIELDS.map(field => (
                <div key={field.key} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center pb-6 border-b border-[hsl(var(--border))] last:border-0 last:pb-0">
                  <div className="md:col-span-1">
                    <label className="font-bold block">{field.label}</label>
                    <span className="text-xs text-[hsl(var(--muted-foreground))]">{field.desc}</span>
                  </div>
                  <div className="md:col-span-2">
                    <select 
                      className="w-full h-10 px-3 rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] focus:ring-2 focus:ring-[hsl(var(--primary))] outline-none"
                      value={mapping[field.key] || ''}
                      onChange={(e) => setMapping({ ...mapping, [field.key]: e.target.value })}
                    >
                      <option value="">-- Not Mapped (Ignore) --</option>
                      {headers.map(h => (
                        <option key={h} value={h}>{h}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-[hsl(var(--border))] flex justify-end">
              <Button onClick={handleSaveMapping} disabled={savingMapping} className="gap-2">
                {savingMapping ? <SafeIcon icon={FiRefreshCw} className="animate-spin" /> : <SafeIcon icon={FiSettings} />}
                {savingMapping ? 'Saving to Sheet...' : 'Save Mapping'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};