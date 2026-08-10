import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Button } from '../components/ui/Button';
import SafeIcon from '../common/SafeIcon';
import { FiCheckCircle, FiLoader, FiDownload } from 'react-icons/fi';

export const Success = () => {
  const [status, setStatus] = useState('processing'); // processing, success, error
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const finalize = async () => {
      try {
        const result = await api.finalizeOrder();
        if (result) {
          setData(result);
          setStatus('success');
        } else {
          navigate('/');
        }
      } catch (err) {
        console.error(err);
        setStatus('error');
      }
    };
    finalize();
  }, [navigate]);

  if (status === 'processing') {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4">
        <SafeIcon icon={FiLoader} className="w-12 h-12 text-[hsl(var(--primary))] animate-spin" />
        <h2 className="text-xl font-bold">Verifying Payment...</h2>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Something went wrong</h2>
        <p className="mb-8">We couldn't verify your order. Please contact support.</p>
        <Button onClick={() => navigate('/')}>Return Home</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-20 max-w-2xl text-center">
      <SafeIcon icon={FiCheckCircle} className="w-20 h-20 text-green-500 mx-auto mb-6" />
      <h1 className="text-4xl font-bold mb-4">Payment Successful!</h1>
      <p className="text-lg text-[hsl(var(--muted-foreground))] mb-8">
        Thank you for your purchase. We've generated your download links.
      </p>

      <div className="bg-[hsl(var(--card))] p-6 rounded-xl border border-[hsl(var(--border))] mb-8 text-left shadow-lg">
        <h3 className="font-bold text-lg mb-4">Your Downloads:</h3>
        <div className="flex flex-col gap-3">
          {data.tokens.map(t => (
            <div key={t.id} className="flex justify-between items-center bg-[hsl(var(--muted))/20] p-4 rounded-lg border border-[hsl(var(--border))]">
              <span className="font-semibold">{t.bookTitle}</span>
              <Button size="sm" className="gap-2" onClick={() => window.open(`#/download/${t.id}`, '_blank')}>
                <SafeIcon icon={FiDownload} />
                Get PDF
              </Button>
            </div>
          ))}
        </div>
      </div>

      <Button variant="outline" onClick={() => navigate('/')}>Return Home</Button>
    </div>
  );
};