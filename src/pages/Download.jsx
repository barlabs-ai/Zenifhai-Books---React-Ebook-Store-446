import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../services/api';
import { Button } from '../components/ui/Button';
import SafeIcon from '../common/SafeIcon';
import { FiDownload, FiAlertCircle } from 'react-icons/fi';

export const Download = () => {
  const { token } = useParams();
  const [status, setStatus] = useState('loading'); // loading, valid, invalid
  const [data, setData] = useState(null);

  useEffect(() => {
    api.validateDownloadToken(token).then(res => {
      if (res.valid) {
        setStatus('valid');
        setData(res);
      } else {
        setStatus('invalid');
        setData(res.error);
      }
    });
  }, [token]);

  if (status === 'loading') {
    return <div className="h-screen flex items-center justify-center">Validating token...</div>;
  }

  if (status === 'invalid') {
    return (
      <div className="container mx-auto px-4 py-20 text-center max-w-md">
        <SafeIcon icon={FiAlertCircle} className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Download Error</h2>
        <p className="text-[hsl(var(--muted-foreground))] mb-6">{data}</p>
        <p className="text-sm">Please contact support if you believe this is an error.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-20 max-w-xl text-center">
      <div className="bg-[hsl(var(--card))] p-8 rounded-2xl border border-[hsl(var(--border))] shadow-lg">
        <img src={data.book.cover_image_url} alt="Cover" className="w-32 h-auto mx-auto rounded-md shadow-md mb-6" />
        <h1 className="text-2xl font-bold mb-2">Your Download is Ready</h1>
        <p className="text-[hsl(var(--muted-foreground))] mb-8">
          {data.book.title} by {data.book.author}
        </p>
        
        <Button size="lg" className="w-full gap-2 mb-4">
          <SafeIcon icon={FiDownload} /> Download Full PDF
        </Button>
        
        <p className="text-sm text-[hsl(var(--muted-foreground))]">
          Downloads remaining on this link: <strong className="text-[hsl(var(--foreground))]">{data.remaining}</strong>
        </p>
      </div>
    </div>
  );
};