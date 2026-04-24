import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, ShoppingBag, ArrowLeft, Minus, Plus } from 'lucide-react';

const Cart = () => {
  const { cartItems, removeFromCart, updateQty, clearCart } = useCart();
  const navigate = useNavigate();

  const totalAmount = cartItems.reduce((sum, item) => sum + (item.pricePerKg * item.qty), 0);

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag size={48} className="text-gray-300" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Cart is Empty</h2>
        <p className="text-gray-500 mb-6">Browse the marketplace and add some fresh produce!</p>
        <button onClick={() => navigate('/marketplace')} className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 transition shadow-md">
          Go to Marketplace
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <button onClick={() => navigate('/marketplace')} className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 font-medium transition">
        <ArrowLeft size={18} /> Back to Marketplace
      </button>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Your Cart ({cartItems.length} items)</h1>
        <button onClick={clearCart} className="text-red-500 hover:text-red-700 text-sm font-medium transition">
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex gap-4 hover:shadow-md transition">
              <img 
                src={item.imageUrl} 
                alt={item.title} 
                className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=500&q=80" }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{item.title}</h3>
                    <p className="text-sm text-gray-500">By {item.farmerName}</p>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500 transition p-1">
                    <Trash2 size={18} />
                  </button>
                </div>
                
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2 bg-gray-50 rounded-lg border border-gray-200">
                    <button 
                      onClick={() => updateQty(item.id, Math.max(1, item.qty - 5))} 
                      className="p-2 text-gray-600 hover:text-gray-800 transition"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-3 font-bold text-gray-800 min-w-[50px] text-center">{item.qty} Kg</span>
                    <button 
                      onClick={() => updateQty(item.id, item.qty + 5)} 
                      className="p-2 text-gray-600 hover:text-gray-800 transition"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">₹{item.pricePerKg}/Kg</p>
                    <p className="font-bold text-green-700 text-lg">₹{(item.pricePerKg * item.qty).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-8">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Order Summary</h3>
            
            <div className="space-y-3 text-sm border-b border-gray-100 pb-4 mb-4">
              {cartItems.map(item => (
                <div key={item.id} className="flex justify-between text-gray-600">
                  <span className="truncate mr-2">{item.title} ({item.qty} Kg)</span>
                  <span className="font-semibold whitespace-nowrap">₹{(item.pricePerKg * item.qty).toLocaleString()}</span>
                </div>
              ))}
            </div>
            
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Delivery:</span>
              <span className="font-semibold text-green-600">Free</span>
            </div>
            
            <div className="flex justify-between font-bold text-xl text-gray-900 pt-3 border-t border-gray-100 mb-6">
              <span>Total:</span>
              <span className="text-green-700">₹{totalAmount.toLocaleString()}</span>
            </div>
            
            <button 
              onClick={() => {
                // Navigate to checkout with the first item (for demo)
                navigate('/checkout', { state: { product: cartItems[0] } });
              }}
              className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-green-700 transition shadow-md text-lg"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
