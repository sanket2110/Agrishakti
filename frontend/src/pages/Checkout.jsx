import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, Smartphone, Building2, ShieldCheck, ArrowLeft, CheckCircle2 } from 'lucide-react';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product;

  const [step, setStep] = useState(1); // 1 = details, 2 = payment, 3 = success
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [details, setDetails] = useState({
    name: '', mobile: '', email: '', address: '', city: '', pincode: ''
  });
  const [upiId, setUpiId] = useState('');
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '', holder: '' });
  const [processing, setProcessing] = useState(false);

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-gray-500 text-lg mb-4">No product selected for checkout.</p>
        <button onClick={() => navigate('/marketplace')} className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition">
          Go to Marketplace
        </button>
      </div>
    );
  }

  const handleDetailsSubmit = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePayment = (e) => {
    e.preventDefault();
    setProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      setStep(3);
    }, 2500);
  };

  const totalPrice = (product.pricePerKg * 10).toFixed(2); // Assume 10 kg order

  if (step === 3) {
    return (
      <div className="max-w-lg mx-auto py-16 text-center animate-fade-in">
        <div className="bg-white rounded-2xl shadow-lg p-10 border border-gray-100">
          <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 size={48} className="text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Payment Successful!</h2>
          <p className="text-gray-600 mb-2">Your order for <strong className="text-green-700">{product.title}</strong> has been placed.</p>
          <p className="text-gray-500 text-sm mb-6">Order ID: #AGR{Date.now().toString().slice(-8)}</p>
          
          <div className="bg-green-50 rounded-xl p-4 mb-8 text-left space-y-2 border border-green-100">
            <div className="flex justify-between text-sm"><span className="text-gray-600">Amount Paid:</span><span className="font-bold text-green-800">₹{totalPrice}</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-600">Payment Mode:</span><span className="font-semibold text-gray-800">{paymentMethod === 'upi' ? 'UPI' : paymentMethod === 'card' ? 'Card' : 'Net Banking'}</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-600">Paid To Farmer:</span><span className="font-semibold text-gray-800">{product.farmerName}</span></div>
            {product.farmerUpiId && <div className="flex justify-between text-sm"><span className="text-gray-600">Farmer UPI:</span><span className="font-semibold text-green-700">{product.farmerUpiId}</span></div>}
            <div className="flex justify-between text-sm"><span className="text-gray-600">Delivery To:</span><span className="font-semibold text-gray-800">{details.name}</span></div>
          </div>
          
          <button onClick={() => navigate('/marketplace')} className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 transition shadow-md w-full">
            Back to Marketplace
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <button onClick={() => step === 1 ? navigate('/marketplace') : setStep(1)} className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 font-medium transition">
        <ArrowLeft size={18} /> {step === 1 ? 'Back to Marketplace' : 'Back to Details'}
      </button>

      {/* Progress Bar */}
      <div className="flex items-center gap-2 mb-8">
        <div className={`flex-1 h-2 rounded-full ${step >= 1 ? 'bg-green-500' : 'bg-gray-200'}`}></div>
        <div className={`flex-1 h-2 rounded-full ${step >= 2 ? 'bg-green-500' : 'bg-gray-200'}`}></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Form */}
        <div className="lg:col-span-2">
          {step === 1 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-fade-in">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Delivery Details</h2>
              <form onSubmit={handleDetailsSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <input required type="text" value={details.name} onChange={e => setDetails({...details, name: e.target.value})} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-green-500 focus:border-green-500" placeholder="Ravi Kumar" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number *</label>
                    <input required type="tel" pattern="[0-9]{10}" value={details.mobile} onChange={e => setDetails({...details, mobile: e.target.value})} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-green-500 focus:border-green-500" placeholder="9876543210" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                  <input required type="email" value={details.email} onChange={e => setDetails({...details, email: e.target.value})} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-green-500 focus:border-green-500" placeholder="ravi@email.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Delivery Address *</label>
                  <textarea required value={details.address} onChange={e => setDetails({...details, address: e.target.value})} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-green-500 focus:border-green-500" rows="2" placeholder="House No, Street, Area..." />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                    <input required type="text" value={details.city} onChange={e => setDetails({...details, city: e.target.value})} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-green-500 focus:border-green-500" placeholder="Chennai" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">PIN Code *</label>
                    <input required type="text" pattern="[0-9]{6}" value={details.pincode} onChange={e => setDetails({...details, pincode: e.target.value})} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-green-500 focus:border-green-500" placeholder="600001" />
                  </div>
                </div>
                <button type="submit" className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-green-700 transition shadow-md mt-4 text-lg">
                  Proceed to Payment →
                </button>
              </form>
            </div>
          )}

          {step === 2 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-fade-in">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Choose Payment Method</h2>
              
              {/* Payment Method Tabs */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <button onClick={() => setPaymentMethod('upi')} className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition font-medium ${paymentMethod === 'upi' ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'}`}>
                  <Smartphone size={28} />
                  <span className="text-sm">UPI</span>
                </button>
                <button onClick={() => setPaymentMethod('card')} className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition font-medium ${paymentMethod === 'card' ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'}`}>
                  <CreditCard size={28} />
                  <span className="text-sm">Card</span>
                </button>
                <button onClick={() => setPaymentMethod('netbanking')} className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition font-medium ${paymentMethod === 'netbanking' ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'}`}>
                  <Building2 size={28} />
                  <span className="text-sm">Net Banking</span>
                </button>
              </div>

              {/* Farmer Payment Info Banner */}
              {product.farmerUpiId && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
                  <p className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-1">💰 Paying Directly To Farmer</p>
                  <p className="text-sm text-amber-700">Farmer: <strong>{product.farmerName}</strong></p>
                  <p className="text-sm text-amber-700">UPI: <strong className="text-green-700">{product.farmerUpiId}</strong></p>
                </div>
              )}

              <form onSubmit={handlePayment} className="space-y-4">
                {paymentMethod === 'upi' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Enter UPI ID</label>
                    <input required type="text" value={upiId} onChange={e => setUpiId(e.target.value)} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-green-500 focus:border-green-500" placeholder="yourname@upi" />
                    <div className="flex gap-3 mt-3">
                      {['Google Pay', 'PhonePe', 'Paytm'].map(app => (
                        <button key={app} type="button" onClick={() => setUpiId(`user@${app.toLowerCase().replace(' ', '')}`)} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-200 transition border">
                          {app}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {paymentMethod === 'card' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                      <input required type="text" maxLength="19" value={cardDetails.number} onChange={e => setCardDetails({...cardDetails, number: e.target.value})} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-green-500 focus:border-green-500 tracking-widest" placeholder="1234 5678 9012 3456" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                      <input required type="text" value={cardDetails.holder} onChange={e => setCardDetails({...cardDetails, holder: e.target.value})} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-green-500 focus:border-green-500" placeholder="RAVI KUMAR" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                        <input required type="text" maxLength="5" value={cardDetails.expiry} onChange={e => setCardDetails({...cardDetails, expiry: e.target.value})} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-green-500 focus:border-green-500" placeholder="MM/YY" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                        <input required type="password" maxLength="3" value={cardDetails.cvv} onChange={e => setCardDetails({...cardDetails, cvv: e.target.value})} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-green-500 focus:border-green-500" placeholder="***" />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'netbanking' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Your Bank</label>
                    <select required className="w-full border border-gray-300 rounded-lg p-3 focus:ring-green-500 focus:border-green-500">
                      <option value="">-- Choose Bank --</option>
                      <option value="sbi">State Bank of India</option>
                      <option value="hdfc">HDFC Bank</option>
                      <option value="icici">ICICI Bank</option>
                      <option value="axis">Axis Bank</option>
                      <option value="bob">Bank of Baroda</option>
                      <option value="pnb">Punjab National Bank</option>
                      <option value="kotak">Kotak Mahindra Bank</option>
                    </select>
                  </div>
                )}

                <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-100 mt-4">
                  <ShieldCheck size={16} className="text-green-600 flex-shrink-0" />
                  <span>Your payment is 100% secure. This is a demo simulation and no real money is deducted.</span>
                </div>

                <button type="submit" disabled={processing} className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-green-700 transition shadow-md text-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  {processing ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Processing Payment...
                    </>
                  ) : (
                    `Pay ₹${totalPrice}`
                  )}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-8">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Order Summary</h3>
            <div className="rounded-lg overflow-hidden mb-4">
              <img src={product.imageUrl} alt={product.title} className="w-full h-32 object-cover rounded-lg" onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=500&q=80" }} />
            </div>
            <h4 className="font-bold text-gray-900 text-lg mb-1">{product.title}</h4>
            <p className="text-sm text-gray-500 mb-4">By {product.farmerName}</p>
            
            <div className="space-y-2 border-t border-gray-100 pt-4 text-sm">
              <div className="flex justify-between text-gray-600"><span>Price per Kg:</span><span className="font-semibold">₹{product.pricePerKg}</span></div>
              <div className="flex justify-between text-gray-600"><span>Quantity:</span><span className="font-semibold">10 Kg</span></div>
              <div className="flex justify-between text-gray-600"><span>Delivery:</span><span className="font-semibold text-green-600">Free</span></div>
              <div className="flex justify-between text-gray-900 font-bold text-lg pt-3 border-t border-gray-100">
                <span>Total:</span><span className="text-green-700">₹{totalPrice}</span>
              </div>
            </div>
            
            {/* Farmer Payment Info in Sidebar */}
            {product.farmerUpiId && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Payment Goes To</p>
                <div className="bg-green-50 rounded-lg p-3 border border-green-100">
                  <p className="text-sm font-bold text-gray-800">{product.farmerName}</p>
                  <p className="text-sm text-green-700 font-mono font-semibold">{product.farmerUpiId}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
