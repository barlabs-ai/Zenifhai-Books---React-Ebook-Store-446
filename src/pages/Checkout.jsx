import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import SafeIcon from '../common/SafeIcon';
import { FiLock } from 'react-icons/fi';

export const Checkout = () => {
  const { cart, cartTotal } = useCart();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <Button onClick={() => navigate('/catalog')}>Continue Shopping</Button>
      </div>
    );
  }

  const handleStripeCheckout = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.createCheckoutSession(cart, email);
      if (response.success) {
        // In this simulation, we go to our internal success page
        window.location.hash = '/checkout/success';
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Complete Your Purchase</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Payment Form */}
        <div className="order-2 md:order-1">
          <form onSubmit={handleStripeCheckout} className="space-y-6 bg-[hsl(var(--card))] p-8 rounded-2xl border border-[hsl(var(--border))] shadow-xl">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <SafeIcon icon={FiLock} className="text-[hsl(var(--primary))]" />
              Secure Checkout
            </h3>
            
            <div>
              <label className="block text-sm font-medium mb-2">Delivery Email Address</label>
              <Input 
                type="email" 
                required 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                placeholder="you@example.com" 
                className="h-12"
              />
              <p className="text-xs text-[hsl(var(--muted-foreground))] mt-2">
                Download links will be sent to this email address.
              </p>
            </div>

            <div className="pt-4 border-t border-[hsl(var(--border))]">
              <p className="text-sm text-[hsl(var(--muted-foreground))] mb-4">
                You will be redirected to Stripe's secure payment page to complete your purchase.
              </p>
              
              <div className="grid grid-cols-2 gap-4 opacity-50 grayscale scale-95 pointer-events-none mb-6">
                 <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center text-[10px] font-bold">APPLE PAY</div>
                 <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center text-[10px] font-bold">GOOGLE PAY</div>
              </div>
            </div>

            <Button type="submit" className="w-full h-14 text-lg font-bold shadow-lg shadow-[hsl(var(--primary))]/20" disabled={loading || !email}>
              {loading ? 'Initializing Stripe...' : `Pay ${(cartTotal / 100).toFixed(2)} with Stripe`}
            </Button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="order-1 md:order-2">
          <div className="bg-[hsl(var(--muted))/20] p-8 rounded-2xl border border-[hsl(var(--border))] h-fit sticky top-24">
            <h3 className="font-bold text-lg mb-6">Order Summary</h3>
            <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto pr-2">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center">
                  <div className="flex gap-4">
                    <img src={item.cover_image_url} alt={item.title} className="w-14 h-20 object-cover rounded shadow-sm" />
                    <div>
                      <p className="font-bold line-clamp-1">{item.title}</p>
                      <p className="text-sm text-[hsl(var(--muted-foreground))]">Quantity: {item.quantity}</p>
                      <p className="text-sm font-medium mt-1">${(item.price / 100).toFixed(2)} each</p>
                    </div>
                  </div>
                  <p className="font-bold">${((item.price * item.quantity) / 100).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-[hsl(var(--border))] pt-6 space-y-3">
              <div className="flex justify-between text-[hsl(var(--muted-foreground))]">
                <span>Subtotal</span>
                <span>${(cartTotal / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[hsl(var(--muted-foreground))]">
                <span>Delivery</span>
                <span className="text-green-500 font-medium">Free (Instant)</span>
              </div>
              <div className="flex justify-between font-bold text-2xl pt-4 border-t border-[hsl(var(--border))]">
                <span>Total</span>
                <span>${(cartTotal / 100).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};