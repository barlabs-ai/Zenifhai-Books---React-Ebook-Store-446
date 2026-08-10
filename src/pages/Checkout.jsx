import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import SafeIcon from '../common/SafeIcon';
import { FiLock, FiCheckCircle } from 'react-icons/fi';

export const Checkout = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  if (cart.length === 0 && !success) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <Button onClick={() => navigate('/catalog')}>Continue Shopping</Button>
      </div>
    );
  }

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.checkout(cart, email);
      if (response.success) {
        setSuccess(response);
        clearCart();
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-2xl text-center">
        <SafeIcon icon={FiCheckCircle} className="w-20 h-20 text-green-500 mx-auto mb-6" />
        <h1 className="text-4xl font-bold mb-4">Payment Successful!</h1>
        <p className="text-lg text-[hsl(var(--muted-foreground))] mb-8">
          Thank you for your purchase. We've sent a receipt to <strong>{email}</strong>.
        </p>
        <div className="bg-[hsl(var(--muted))/30] p-6 rounded-xl border border-[hsl(var(--border))] mb-8 text-left">
          <h3 className="font-bold text-lg mb-4">Your Download Links:</h3>
          <div className="flex flex-col gap-3">
            {success.tokens.map(t => (
              <div key={t.token} className="flex justify-between items-center bg-[hsl(var(--background))] p-3 rounded-md border border-[hsl(var(--border))]">
                <span className="font-medium">{t.bookTitle}</span>
                <Button size="sm" onClick={() => window.open(`#/download/${t.token}`, '_blank')}>
                  Download PDF
                </Button>
              </div>
            ))}
          </div>
        </div>
        <Button onClick={() => navigate('/')}>Return Home</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        
        {/* Payment Form (Simulated Stripe) */}
        <div>
          <form onSubmit={handlePayment} className="space-y-6 bg-[hsl(var(--card))] p-6 rounded-xl border border-[hsl(var(--border))] shadow-sm">
            <div>
              <label className="block text-sm font-medium mb-2">Email Address (for delivery)</label>
              <Input 
                type="email" 
                required 
                value={email} 
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
            
            <div className="pt-4 border-t border-[hsl(var(--border))]">
              <div className="flex items-center gap-2 mb-4 text-[hsl(var(--muted-foreground))]">
                <SafeIcon icon={FiLock} />
                <span className="text-sm">Secure Payment (Simulated)</span>
              </div>
              <div className="space-y-4 opacity-70 pointer-events-none">
                <Input placeholder="Card Number" value="**** **** **** 4242" readOnly />
                <div className="grid grid-cols-2 gap-4">
                  <Input placeholder="MM/YY" value="12/25" readOnly />
                  <Input placeholder="CVC" value="***" readOnly />
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={loading || !email}>
              {loading ? 'Processing...' : `Pay ${(cartTotal / 100).toFixed(2)}`}
            </Button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="bg-[hsl(var(--muted))/20] p-6 rounded-xl border border-[hsl(var(--border))] h-fit">
          <h3 className="font-bold text-lg mb-4">Order Summary</h3>
          <div className="space-y-4 mb-6">
            {cart.map(item => (
              <div key={item.id} className="flex justify-between">
                <div className="flex gap-4">
                  <img src={item.cover_image_url} alt={item.title} className="w-12 h-16 object-cover rounded" />
                  <div>
                    <p className="font-medium line-clamp-1">{item.title}</p>
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">Qty: {item.quantity}</p>
                  </div>
                </div>
                <p className="font-medium">${((item.price * item.quantity) / 100).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="border-t border-[hsl(var(--border))] pt-4 space-y-2">
            <div className="flex justify-between text-[hsl(var(--muted-foreground))]">
              <span>Subtotal</span>
              <span>${(cartTotal / 100).toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-xl pt-2">
              <span>Total</span>
              <span>${(cartTotal / 100).toFixed(2)}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};