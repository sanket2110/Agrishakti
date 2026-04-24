import React, { useState, useEffect } from 'react';
import { Search, Filter, ShoppingCart, MapPin, Package, Plus, X, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { API_BASE_URL } from '../config';

const Marketplace = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    pricePerKg: '',
    quantityAvailable: '',
    imageUrl: ''
  });

  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/products`);
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };

  const isFarmer = user && user.roles && user.roles.includes('ROLE_FARMER');
  const isBuyer = user && user.roles && user.roles.includes('ROLE_BUYER');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('pricePerKg', formData.pricePerKg);
      formDataToSend.append('quantityAvailable', formData.quantityAvailable);
      
      if (selectedFile) {
        formDataToSend.append('image', selectedFile);
      }

      await axios.post(`${API_BASE_URL}/api/products`, formDataToSend, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setShowAddForm(false);
      fetchProducts(); // Refresh list
      setFormData({ title: '', description: '', pricePerKg: '', quantityAvailable: '', imageUrl: '' });
      setSelectedFile(null);
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product. Please check your connection.");
    }
  };

  const { addToCart } = useCart();

  const handleBuy = (product) => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate('/checkout', { state: { product } });
  };

  const handleAddToCart = (product) => {
    if (!user) {
      navigate('/login');
      return;
    }
    const added = addToCart(product);
    if (added) {
      setOrderSuccess(`${product.title} added to cart!`);
    } else {
      setOrderSuccess(`${product.title} is already in your cart!`);
    }
    setTimeout(() => setOrderSuccess(null), 3000);
  };

  const filteredProducts = products.filter(product => 
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Direct Farmer Marketplace</h1>
          <p className="text-gray-600">Buy directly from farmers, cutting out the middlemen.</p>
        </div>
        
        {isFarmer && (
          <button 
            onClick={() => setShowAddForm(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium shadow transition flex items-center gap-2"
          >
            <Plus size={18} />
            List Your Crop
          </button>
        )}
      </div>

      {orderSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded flex items-center gap-2 shadow-sm">
          <CheckCircle size={20} />
          <span>Successfully placed order for <strong>{orderSuccess}</strong>! The farmer will contact you soon.</span>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Add New Crop/Paddy</h2>
              <button onClick={() => setShowAddForm(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Title</label>
                <input required type="text" name="title" value={formData.title} onChange={handleInputChange} className="w-full border rounded-md p-2 focus:ring-green-500 focus:border-green-500" placeholder="e.g. Premium Basmati Rice" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea required name="description" value={formData.description} onChange={handleInputChange} className="w-full border rounded-md p-2 focus:ring-green-500 focus:border-green-500" rows="2" placeholder="Describe the crop quality, season, etc."></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price per Kg (₹)</label>
                  <input required type="number" step="0.01" name="pricePerKg" value={formData.pricePerKg} onChange={handleInputChange} className="w-full border rounded-md p-2 focus:ring-green-500 focus:border-green-500" placeholder="120.00" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity (Kg)</label>
                  <input required type="number" name="quantityAvailable" value={formData.quantityAvailable} onChange={handleInputChange} className="w-full border rounded-md p-2 focus:ring-green-500 focus:border-green-500" placeholder="500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Upload Crop Image</label>
                <input type="file" accept="image/*" onChange={handleFileChange} className="w-full border rounded-md p-2 focus:ring-green-500 focus:border-green-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100" />
              </div>
              <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition mt-4">
                List Product
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 text-sm"
            placeholder="Search for rice, paddy, seeds..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <Filter size={16} />
            Filter
          </button>
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading marketplace...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition group flex flex-col">
              <div className="relative h-48 overflow-hidden bg-gray-200">
                <img 
                  src={product.imageUrl} 
                  alt={product.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=500&q=80" }}
                />
                <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded text-xs font-bold text-green-700 shadow">
                  ₹{product.pricePerKg} / kg
                </div>
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{product.title}</h3>
                </div>
                <p className="text-sm text-gray-500 mb-4 line-clamp-2 flex-grow">{product.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600 gap-2">
                    <Package size={16} className="text-gray-400" />
                    {product.quantityAvailable} kg available
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-100 mt-auto">
                  <div className="text-sm font-medium text-gray-800 mb-3">
                    By <span className="text-green-700">{product.farmerName}</span>
                  </div>
                  
                  {isBuyer ? (
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleAddToCart(product)}
                        className="flex-1 flex items-center justify-center gap-1 bg-white border-2 border-green-600 text-green-700 hover:bg-green-50 px-3 py-2 rounded-lg text-sm font-bold transition"
                      >
                        <ShoppingCart size={16} />
                        Add to Cart
                      </button>
                      <button 
                        onClick={() => handleBuy(product)}
                        className="flex-1 flex items-center justify-center gap-1 bg-green-600 text-white hover:bg-green-700 px-3 py-2 rounded-lg text-sm font-bold transition shadow-sm"
                      >
                        Buy Now
                      </button>
                    </div>
                  ) : isFarmer ? (
                    <div className="text-center text-sm text-gray-400 italic py-1">
                      Seller View — Buyers can purchase this
                    </div>
                  ) : (
                    <button 
                      onClick={() => navigate('/login')}
                      className="w-full flex items-center justify-center gap-1 bg-gray-100 text-gray-600 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm font-medium transition"
                    >
                      Login to Purchase
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {!loading && filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No products found. Be the first farmer to list one!</p>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
