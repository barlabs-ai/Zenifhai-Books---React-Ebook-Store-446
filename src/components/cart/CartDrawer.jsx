import React from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import {useNavigate} from 'react-router-dom';
import {useCart} from '../../context/CartContext';
import {Button} from '../ui/Button';
import SafeIcon from '../../common/SafeIcon';
import {FiX, FiPlus, FiMinus, FiTrash2, FiShoppingCart} from 'react-icons/fi';

export const CartDrawer = () => {
  const {isCartOpen, setIsCartOpen, cart, updateQuantity, removeFromCart, cartTotal} = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div 
            initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}
            className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm"
            onClick={() => setIsCartOpen(false)}
          />
          <motion.div 
            initial={{x: '100%'}} animate={{x: 0}} exit={{x: '100%'}}
            transition={{type: 'spring', damping: 25, stiffness: 200}}
            className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-[hsl(var(--background))] shadow-2xl z-[70] flex flex-col border-l border-[hsl(var(--border))]"
          >
            <div className="flex items-center justify-between p-4 border-b border-[hsl(var(--border))]">
              <h2 className="text-lg font-bold">Your Cart</h2>
              <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-[hsl(var(--muted))] rounded-full">
                <SafeIcon icon={FiX} className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-[hsl(var(--muted-foreground))]">
                  <SafeIcon icon={FiShoppingCart} className="w-12 h-12 mb-4 opacity-20" />
                  <p>Your cart is empty.</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="flex gap-4 bg-[hsl(var(--muted))/30] p-2 rounded-lg">
                    <img src={item.cover_image_url} alt={item.title} className="w-16 h-24 object-cover rounded" />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-semibold text-sm line-clamp-1">{item.title}</h4>
                        <p className="text-xs text-[hsl(var(--muted-foreground))]">{item.author}</p>
                        <p className="font-bold mt-1">${(item.price / 100).toFixed(2)}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center bg-[hsl(var(--background))] rounded-md border border-[hsl(var(--border))]">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2 py-1 hover:bg-[hsl(var(--muted))]">
                            <SafeIcon icon={FiMinus} className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-sm">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 py-1 hover:bg-[hsl(var(--muted))]">
                            <SafeIcon icon={FiPlus} className="w-3 h-3" />
                          </button>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="text-red-500 p-1 hover:bg-red-500/10 rounded">
                          <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-4 border-t border-[hsl(var(--border))] bg-[hsl(var(--muted))/10]">
                <div className="flex justify-between mb-4 font-bold text-lg">
                  <span>Subtotal</span>
                  <span>${(cartTotal / 100).toFixed(2)}</span>
                </div>
                <Button className="w-full" size="lg" onClick={handleCheckout}>
                  Proceed to Checkout
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};