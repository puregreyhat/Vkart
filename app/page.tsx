'use client';

import { useState, useEffect } from 'react';
import { products, categories } from '@/lib/products';
import { useCartStore, Product } from '@/lib/store';
import Link from 'next/link';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showProductDetail, setShowProductDetail] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchPlaceholder, setSearchPlaceholder] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showCartPreview, setShowCartPreview] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  // Login state
  const [username, setUsername] = useState<string>("");
  const [tempUsername, setTempUsername] = useState<string>("");
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  // Eye tracking state
  const [eyePosition, setEyePosition] = useState({ x: 0, y: 0 });
  const [isBlinking, setIsBlinking] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { cart, addToCart, updateQuantity, getItemCount } = useCartStore();

  const searchSuggestions = ['Milk', 'Snacks', 'Rice', 'Vegetables', 'Fruits', 'Bread', 'Eggs', 'Dal', 'Masala', 'Medicine', 'Sanitizer', 'Bandages'];

  // Initialize client state
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load username and dark mode from localStorage on mount
  useEffect(() => {
    if (!isClient || typeof window === 'undefined' || typeof localStorage === 'undefined') return;

    const storedUsername = localStorage.getItem('vcart_username');
    const storedDarkMode = localStorage.getItem('vcart_darkMode');
    
    if (storedUsername) {
      setUsername(storedUsername);
      setShowWelcomeModal(false);
    } else {
      setShowWelcomeModal(true);
    }
    
    if (storedDarkMode === 'true') {
      setDarkMode(true);
    }
  }, [isClient]);

  // Save username to localStorage when it changes
  useEffect(() => {
    if (!isClient || !username || typeof localStorage === 'undefined') return;
    localStorage.setItem('vcart_username', username);
  }, [username, isClient]);

  // Save dark mode to localStorage and update body class
  useEffect(() => {
    if (!isClient || typeof localStorage === 'undefined' || typeof document === 'undefined') return;

    localStorage.setItem('vcart_darkMode', darkMode.toString());
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode, isClient]);

  // Get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    if (hour < 21) return "Good Evening";
    return "Welcome"; // For night time (9pm onwards)
  };

  // Track cursor movement for eye following
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!showWelcomeModal || username) return;
      
      const modalElement = document.getElementById('welcome-modal');
      if (!modalElement) return;
      
      const rect = modalElement.getBoundingClientRect();
      const modalCenterX = rect.left + rect.width / 2;
      const modalCenterY = rect.top + rect.height / 2;
      
      const deltaX = e.clientX - modalCenterX;
      const deltaY = e.clientY - modalCenterY;
      
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const maxDistance = 300;
      const normalizedDistance = Math.min(distance / maxDistance, 1);
      
      const eyeX = (deltaX / distance) * normalizedDistance * 12;
      const eyeY = (deltaY / distance) * normalizedDistance * 8;
      
      setEyePosition({ x: eyeX, y: eyeY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [showWelcomeModal, username]);

  // Handle blinking when typing
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempUsername(e.target.value);
    
    // Trigger blink animation
    setIsBlinking(true);
    setTimeout(() => setIsBlinking(false), 150);
  };

  // Animated placeholder effect
  useEffect(() => {
    let currentIndex = 0;
    let currentText = '';
    let isDeleting = false;
    let timeout: NodeJS.Timeout;

    const animatePlaceholder = () => {
      const fullText = `Search "${searchSuggestions[placeholderIndex]}"`;
      
      if (!isDeleting && currentText.length < fullText.length) {
        currentText = fullText.substring(0, currentText.length + 1);
        setSearchPlaceholder(currentText);
        timeout = setTimeout(animatePlaceholder, 100);
      } else if (!isDeleting && currentText.length === fullText.length) {
        timeout = setTimeout(() => {
          isDeleting = true;
          animatePlaceholder();
        }, 2000);
      } else if (isDeleting && currentText.length > 0) {
        currentText = currentText.substring(0, currentText.length - 1);
        setSearchPlaceholder(currentText);
        timeout = setTimeout(animatePlaceholder, 50);
      } else if (isDeleting && currentText.length === 0) {
        isDeleting = false;
        setPlaceholderIndex((prev) => (prev + 1) % searchSuggestions.length);
        timeout = setTimeout(animatePlaceholder, 500);
      }
    };

    animatePlaceholder();
    return () => clearTimeout(timeout);
  }, [placeholderIndex]);

  // Filter products based on search query
  const filteredProducts = searchQuery.trim() 
    ? products.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // Group products by category
  const productsByCategory = categories.reduce((acc, category) => {
    const categoryProducts = products.filter(p => p.category === category.id);
    if (categoryProducts.length > 0) {
      acc[category.id] = categoryProducts;
    }
    return acc;
  }, {} as Record<string, typeof products>);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-black' : 'bg-gradient-to-br from-gray-50 via-white to-gray-50'}`}>
      {/* Header with Glass Effect */}
      <header className={`sticky top-0 z-50 shadow-lg transition-colors duration-300 ${darkMode ? 'bg-black/95 backdrop-blur-2xl border-b border-gray-800' : 'glass'}`}>
        <div className="max-w-[1600px] mx-auto px-3 sm:px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 sm:gap-4">
              <h1 className={`text-2xl sm:text-3xl font-bold ${darkMode ? 'bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent' : 'bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent'}`}>V-it</h1>
              <div className="hidden md:block">
                <p className={`text-sm font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Delivery in 8 minutes</p>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>VIT, Upper Indira Nagar, Bibewadi Pun...</p>
              </div>
              
              {/* Mobile Search Icon */}
              <button
                onClick={() => setShowMobileSearch(!showMobileSearch)}
                className={`md:hidden p-2 rounded-lg transition-all ${darkMode ? 'bg-gray-900 text-gray-200 hover:bg-gray-800' : 'glass-button'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
            
            <div className="flex items-center gap-3 sm:gap-4 flex-1 max-w-4xl">
              <div className="relative flex-1 md:block">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={searchPlaceholder}
                    className={`w-full px-6 py-3 pl-12 pr-12 rounded-2xl text-sm font-medium focus:outline-none transition-colors duration-300 ${
                      darkMode 
                        ? 'bg-gray-900 text-white placeholder-gray-500 border-2 border-gray-800 focus:border-yellow-500' 
                        : 'glass-search text-gray-900 placeholder-gray-600'
                    }`}
                  />
                  <svg 
                    className={`w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className={`absolute right-4 top-1/2 transform -translate-y-1/2 p-1.5 rounded-full transition-all ${
                        darkMode 
                          ? 'text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700' 
                          : 'text-gray-600 hover:text-gray-900 glass-button'
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
                
                {/* Search Results Dropdown */}
                {searchQuery && filteredProducts.length > 0 && (
                  <div className={`absolute top-full left-0 right-0 mt-3 rounded-2xl shadow-2xl max-h-96 overflow-y-auto z-50 search-dropdown transition-colors duration-300 ${
                    darkMode ? 'bg-gray-950 border border-gray-800' : 'glass-modal'
                  }`}>
                    <div className="p-3">
                      <p className={`text-xs px-3 py-2 font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {filteredProducts.length} results found
                      </p>
                      {filteredProducts.slice(0, 8).map((product) => {
                        const inCart = cart.find(p => p.id === product.id);
                        return (
                          <div
                            key={product.id}
                            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                              darkMode 
                                ? 'hover:bg-gray-900 bg-gray-900/50 border border-gray-800' 
                                : 'hover:bg-white/50 glass-card'
                            }`}
                            onClick={() => {
                              setSelectedProduct(product);
                              setShowProductDetail(true);
                              setSearchQuery('');
                            }}
                          >
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0 ${
                              darkMode ? 'bg-gray-800' : 'bg-gray-100'
                            }`}>
                              {product.image ? (
                                <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
                              ) : (
                                <span className="text-gray-400 text-xs">No img</span>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className={`text-sm font-semibold truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>{product.name}</h4>
                              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{product.weight}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>₹{product.price}</span>
                              {inCart ? (
                                <div className={`flex items-center gap-1 border-2 rounded-lg px-2 py-1 ${
                                  darkMode 
                                    ? 'bg-green-900/30 border-green-600' 
                                    : 'glass-button border-green-600'
                                }`}>
                                  <span className={`text-xs font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>{inCart.quantity}</span>
                                </div>
                              ) : (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    addToCart(product);
                                  }}
                                  className="bg-gradient-to-r from-green-600 to-green-500 text-white px-3 py-1 rounded-lg text-xs font-bold hover:shadow-lg transition-all"
                                >
                                  ADD
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* No Results Message */}
                {searchQuery && filteredProducts.length === 0 && (
                  <div className={`absolute top-full left-0 right-0 mt-3 rounded-2xl shadow-2xl p-6 z-50 search-dropdown transition-colors duration-300 ${
                    darkMode ? 'bg-gray-950 border border-gray-800' : 'glass-modal'
                  }`}>
                    <div className="text-center">
                      <svg className={`w-16 h-16 mx-auto mb-3 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className={`font-semibold mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>No products found</p>
                      <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Try searching for something else</p>
                    </div>
                  </div>
                )}
              </div>
              
              {username && (
                <span className={`text-sm font-semibold hidden lg:inline whitespace-nowrap ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Welcome, {username}
                </span>
              )}
              
              {/* Dark Mode Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2.5 rounded-xl transition-all shadow-md ${
                  darkMode 
                    ? 'bg-yellow-500 hover:bg-yellow-400 text-black' 
                    : 'bg-gray-800 hover:bg-gray-900 text-yellow-400'
                }`}
                title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {darkMode ? (
                  // Sun icon for light mode
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  // Moon icon for dark mode
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
              
              {/* Cart Button with Hover Preview */}
              <div 
                className="relative"
                onMouseEnter={() => setShowCartPreview(true)}
                onMouseLeave={() => setShowCartPreview(false)}
              >
                <Link
                  href="/checkout"
                  className="relative bg-green-600 text-white px-3 sm:px-4 lg:px-6 py-2.5 rounded-xl font-semibold hover:bg-green-700 hover:shadow-xl transition-all flex items-center gap-2 shadow-md border-2 border-green-700"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <div className="text-left hidden sm:block">
                    <div className="text-xs opacity-90">{getItemCount()} Items</div>
                    <div className="text-sm font-bold">₹{useCartStore.getState().getTotal()}</div>
                  </div>
                  {getItemCount() > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold shadow-lg border-2 border-white animate-pulse">
                      {getItemCount()}
                    </span>
                  )}
                </Link>

                {/* Cart Preview Tooltip */}
                {showCartPreview && cart.length > 0 && (
                  <div className="absolute top-full right-0 mt-3 w-80 glass-modal rounded-2xl shadow-2xl z-50 search-dropdown">
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200">
                        <h3 className="font-bold text-gray-900">Cart Summary</h3>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
                          {getItemCount()} items
                        </span>
                      </div>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {cart.slice(0, 5).map((item) => (
                          <div key={item.id} className="flex items-center gap-3 p-2 glass-card rounded-lg">
                            <div className="w-12 h-12 glass-card rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                              {item.image ? (
                                <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                              ) : (
                                <span className="text-gray-400 text-xs">📦</span>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xs font-semibold text-gray-900 truncate">{item.name}</h4>
                              <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                            </div>
                            <div className="text-sm font-bold text-gray-900">₹{item.price * (item.quantity || 1)}</div>
                          </div>
                        ))}
                        {cart.length > 5 && (
                          <p className="text-xs text-gray-500 text-center py-2">
                            +{cart.length - 5} more items
                          </p>
                        )}
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between">
                        <span className="font-bold text-gray-900">Total:</span>
                        <span className="text-lg font-bold text-green-600">₹{useCartStore.getState().getTotal()}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Mobile Search Bar */}
          {showMobileSearch && (
            <div className="md:hidden mt-3 relative search-dropdown">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="glass-search w-full px-6 py-3 pl-12 pr-12 rounded-2xl text-sm font-medium text-gray-900 placeholder-gray-600 focus:outline-none"
                  autoFocus
                />
                <svg 
                  className="w-5 h-5 text-gray-600 absolute left-4 top-1/2 transform -translate-y-1/2"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-900 glass-button p-1.5 rounded-full"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              
              {/* Mobile Search Results */}
              {searchQuery && filteredProducts.length > 0 && (
                <div className={`absolute top-full left-0 right-0 mt-3 rounded-2xl shadow-2xl max-h-96 overflow-y-auto z-50 search-dropdown transition-colors duration-300 ${
                  darkMode ? 'bg-gray-950 border border-gray-800' : 'glass-modal'
                }`}>
                  <div className="p-2">
                    <p className={`text-xs px-3 py-2 font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {filteredProducts.length} results found
                    </p>
                    {filteredProducts.slice(0, 8).map((product) => {
                      const inCart = cart.find(p => p.id === product.id);
                      return (
                        <div
                          key={product.id}
                          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                            darkMode 
                              ? 'hover:bg-gray-900 bg-gray-900/50' 
                              : 'hover:bg-gray-50'
                          }`}
                          onClick={() => {
                            setSelectedProduct(product);
                            setShowProductDetail(true);
                            setSearchQuery('');
                            setShowMobileSearch(false);
                          }}
                        >
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0 ${
                            darkMode ? 'bg-gray-800' : 'bg-gray-100'
                          }`}>
                            {product.image ? (
                              <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
                            ) : (
                              <span className="text-gray-400 text-xs">No img</span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className={`text-sm font-semibold truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>{product.name}</h4>
                            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{product.weight}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>₹{product.price}</span>
                            {inCart ? (
                              <div className={`flex items-center gap-1 border rounded-lg px-2 py-1 ${
                                darkMode 
                                  ? 'bg-green-900/30 border-green-600' 
                                  : 'bg-green-50 border-green-600'
                              }`}>
                                <span className={`text-xs font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>{inCart.quantity}</span>
                              </div>
                            ) : (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  addToCart(product);
                                }}
                                className="bg-green-600 text-white px-3 py-1 rounded-lg text-xs font-bold hover:bg-green-700"
                              >
                                ADD
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              
              {/* Mobile No Results */}
              {searchQuery && filteredProducts.length === 0 && (
                <div className={`absolute top-full left-0 right-0 mt-2 rounded-xl shadow-2xl p-6 z-50 search-dropdown transition-colors duration-300 ${
                  darkMode ? 'bg-gray-950 border-2 border-gray-800' : 'bg-white border-2 border-gray-200'
                }`}>
                  <div className="text-center">
                    <svg className={`w-16 h-16 mx-auto mb-3 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className={`font-semibold mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>No products found</p>
                    <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Try searching for something else</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </header>


      {/* Promo Banners - Food Only */}

      {/* Modern Promo Banners - Food Only */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 py-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className={`flex-1 rounded-3xl p-8 flex flex-col justify-center items-start transition-colors duration-300 ${
            darkMode ? 'bg-gray-900 border border-gray-800' : 'glass-card'
          }`}>
            <h3 className={`text-xl sm:text-2xl font-bold mb-2 ${
              darkMode 
                ? 'bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent' 
                : 'bg-gradient-to-r from-green-700 to-green-500 bg-clip-text text-transparent'
            }`}>Fresh Groceries Delivered Fast</h3>
            <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-700'}`}>Vegetables, fruits, dairy & more</p>
            <button className="bg-green-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-green-700 hover:shadow-lg transition-all shadow-md">
              Order Now
            </button>
          </div>
          <div className={`flex-1 rounded-3xl p-8 flex flex-col justify-center items-start transition-colors duration-300 ${
            darkMode ? 'bg-gray-900 border border-gray-800' : 'glass-card'
          }`}>
            <h3 className={`text-xl sm:text-2xl font-bold mb-2 ${
              darkMode 
                ? 'bg-gradient-to-r from-orange-400 to-orange-300 bg-clip-text text-transparent' 
                : 'bg-gradient-to-r from-orange-700 to-orange-500 bg-clip-text text-transparent'
            }`}>Snacks & Drinks in Minutes</h3>
            <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-700'}`}>Chips, biscuits, juices & more</p>
            <button className="bg-orange-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-orange-700 hover:shadow-lg transition-all shadow-md">
              Order Now
            </button>
          </div>
        </div>
      </div>

      {/* Category Grid */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 py-6">
        <h2 className={`text-2xl sm:text-3xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Shop by Category</h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4 sm:gap-5">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => {
                setSelectedCategory(category.id);
                setShowModal(true);
              }}
              className="group cursor-pointer flex flex-col items-center justify-center"
            >
              <div className={`w-full aspect-square mb-2 flex items-center justify-center rounded-3xl overflow-hidden hover:scale-105 transition-all duration-300 ${
                darkMode ? 'bg-gray-900 border border-gray-800' : 'glass-card'
              }`}>
                {category.icon ? (
                  <img
                    src={category.icon}
                    alt={category.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        parent.innerHTML = `<div class="text-4xl">🛒</div>`;
                      }
                    }}
                  />
                ) : (
                  <div className="text-4xl">🛒</div>
                )}
              </div>
              <p className={`text-[10px] sm:text-xs font-semibold text-center group-hover:text-green-600 transition-colors leading-tight px-1 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {category.name}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Category Modal Popup */}
      {showModal && selectedCategory && (
        <div 
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
            darkMode ? 'bg-black/80 backdrop-blur-md' : 'bg-black/40 backdrop-glass'
          }`}
          onClick={() => setShowModal(false)}
        >
          <div 
            className={`rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto transition-colors duration-300 ${
              darkMode ? 'bg-gray-950 border border-gray-800' : 'glass-modal'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className={`sticky top-0 rounded-t-3xl px-6 py-5 flex items-center justify-between transition-colors duration-300 ${
              darkMode ? 'bg-black/95 backdrop-blur-2xl border-b border-gray-800' : 'glass-dark'
            }`}>
              <div>
                <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {categories.find(c => c.id === selectedCategory)?.name}
                </h2>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {productsByCategory[selectedCategory]?.slice(0, 10).length || 0} products available
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  darkMode ? 'bg-gray-900 hover:bg-gray-800 text-gray-300' : 'glass-button'
                }`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content - Product Grid */}
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {productsByCategory[selectedCategory]?.slice(0, 10).map((product) => {
                  const inCart = cart.find((p) => p.id === product.id);
                  
                  return (
                    <div
                      key={product.id}
                      className={`rounded-2xl p-4 hover:shadow-xl transition-all cursor-pointer ${
                        darkMode ? 'bg-gray-900 border border-gray-800' : 'glass-card border-0'
                      }`}
                    >
                      <div 
                        className="relative mb-3"
                        onClick={() => {
                          setSelectedProduct(product);
                          setShowProductDetail(true);
                        }}
                      >
                        {/* Delivery time badge */}
                        <div className={`absolute top-2 left-2 rounded-full px-2 py-1 text-[10px] font-semibold flex items-center gap-1 shadow-sm z-10 ${
                          darkMode ? 'bg-gray-800 text-gray-200' : 'glass-button'
                        }`}>
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                          8 MINS
                        </div>
                        
                        {/* Product Image */}
                        <div className={`w-full h-32 rounded-xl flex items-center justify-center overflow-hidden ${
                          darkMode ? 'bg-gray-800' : 'glass-card'
                        }`}>
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                const parent = e.currentTarget.parentElement;
                                if (parent) {
                                  parent.innerHTML = '<span class="text-gray-400 text-xs">Image unavailable</span>';
                                }
                              }}
                            />
                          ) : (
                            <span className="text-gray-400 text-xs">No Image</span>
                          )}
                        </div>
                      </div>
                      
                      <div 
                        onClick={() => {
                          setSelectedProduct(product);
                          setShowProductDetail(true);
                        }}
                      >
                        <h4 className={`font-semibold text-xs mb-1 line-clamp-2 min-h-[32px] ${
                          darkMode ? 'text-gray-200' : 'text-gray-800'
                        }`}>
                          {product.name}
                        </h4>
                        <p className={`text-[10px] mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{product.weight}</p>
                      </div>
                      
                      <div className="flex items-center justify-between gap-2">
                        <div className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>₹{product.price}</div>
                        
                        <div className="flex items-center gap-1">
                          {inCart ? (
                            <>
                              <button
                                onClick={() => updateQuantity(product.id, (inCart.quantity || 1) - 1)}
                                className={`px-2 py-1 rounded-lg text-xs font-bold hover:shadow-md transition-all ${
                                  darkMode 
                                    ? 'bg-gray-800 text-gray-200 hover:bg-gray-700' 
                                    : 'glass-button text-gray-700'
                                }`}
                              >
                                -
                              </button>
                              <span className={`px-2 text-xs font-bold ${darkMode ? 'text-white' : ''}`}>{inCart.quantity}</span>
                              <button
                                onClick={() => updateQuantity(product.id, (inCart.quantity || 1) + 1)}
                                className={`px-2 py-1 rounded-lg text-xs font-bold hover:shadow-md transition-all ${
                                  darkMode 
                                    ? 'bg-gray-800 text-gray-200 hover:bg-gray-700' 
                                    : 'glass-button text-gray-700'
                                }`}
                              >
                                +
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => addToCart(product)}
                              className={`px-3 py-1.5 rounded-lg font-bold text-[10px] hover:shadow-md transition-all ${
                                darkMode 
                                  ? 'border-2 border-green-500 text-green-400 hover:bg-green-500/10' 
                                  : 'glass-button border-2 border-green-600 text-green-600'
                              }`}
                            >
                              ADD
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product Detail Modal */}
      {showProductDetail && selectedProduct && (
        <div className={`fixed inset-0 flex items-center justify-center z-50 p-4 ${
          darkMode ? 'bg-black/80 backdrop-blur-md' : 'bg-black/40 backdrop-glass'
        }`}>
          <div className={`rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transition-colors duration-300 ${
            darkMode ? 'bg-gray-950 border border-gray-800' : 'glass-modal'
          }`}>
            {/* Modal Header */}
            <div className={`sticky top-0 rounded-t-3xl px-6 py-5 flex items-center justify-between z-10 transition-colors duration-300 ${
              darkMode ? 'bg-black/95 backdrop-blur-2xl border-b border-gray-800' : 'glass-dark'
            }`}>
              <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Product Details</h2>
              <button
                onClick={() => setShowProductDetail(false)}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-2xl font-bold transition-all ${
                  darkMode ? 'bg-gray-900 hover:bg-gray-800 text-gray-300' : 'glass-button text-gray-700 hover:text-gray-900'
                }`}
              >
                ×
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Product Image */}
                <div className="md:w-1/2">
                  <div className={`w-full h-64 rounded-2xl flex items-center justify-center overflow-hidden ${
                    darkMode ? 'bg-gray-900 border border-gray-800' : 'glass-card'
                  }`}>
                    {selectedProduct.image ? (
                      <img
                        src={selectedProduct.image}
                        alt={selectedProduct.name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <span className={darkMode ? 'text-gray-500' : 'text-gray-400'}>No Image</span>
                    )}
                  </div>
                </div>

                {/* Product Info */}
                <div className="md:w-1/2 space-y-4">
                  <div>
                    <h3 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedProduct.name}</h3>
                    <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{selectedProduct.weight}</p>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className={`text-3xl font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>₹{selectedProduct.price}</span>
                    <span className="text-sm text-gray-500">per unit</span>
                  </div>

                  {/* Expiry Info */}
                  {selectedProduct.daysUntilExpiry !== undefined && (
                    <div className={`rounded-2xl p-4 ${
                      darkMode ? 'bg-yellow-900/30 border-2 border-yellow-700' : 'glass-card border-2 border-yellow-300'
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">⏰</span>
                        <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Freshness Info</h4>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Arrived at store:</span>
                          <span className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                            {selectedProduct.arrivalDate ? new Date(selectedProduct.arrivalDate).toLocaleDateString('en-IN', { 
                              day: 'numeric', 
                              month: 'short', 
                              year: 'numeric' 
                            }) : 'N/A'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Best before:</span>
                          <span className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                            {selectedProduct.expiryDate ? new Date(selectedProduct.expiryDate).toLocaleDateString('en-IN', { 
                              day: 'numeric', 
                              month: 'short', 
                              year: 'numeric' 
                            }) : 'N/A'}
                          </span>
                        </div>
                        <div className={`flex justify-between items-center pt-2 border-t ${darkMode ? 'border-yellow-700' : 'border-yellow-300'}`}>
                          <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Days until expiry:</span>
                          <span className={`font-bold text-lg ${
                            selectedProduct.daysUntilExpiry <= 2 ? 'text-red-500' : 
                            selectedProduct.daysUntilExpiry <= 7 ? 'text-orange-500' : 
                            darkMode ? 'text-green-400' : 'text-green-600'
                          }`}>
                            {selectedProduct.daysUntilExpiry} days
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Stock Status */}
                  <div className={`rounded-2xl p-4 ${
                    darkMode ? 'bg-green-900/30 border-2 border-green-700' : 'glass-card border-2 border-green-300'
                  }`}>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">✅</span>
                      <span className={`font-semibold ${darkMode ? 'text-green-400' : 'text-green-700'}`}>In Stock</span>
                    </div>
                    <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Ready for delivery in 8 minutes</p>
                  </div>

                  {/* Product Type (Internal) */}
                  {selectedProduct.productType && (
                    <div className={`text-xs rounded-xl p-3 ${
                      darkMode ? 'text-gray-400 bg-gray-900 border border-gray-800' : 'text-gray-600 glass-card'
                    }`}>
                      <span className="font-semibold">Category:</span> {selectedProduct.productType.replace('-', ' ').toUpperCase()}
                    </div>
                  )}

                  {/* Add to Cart */}
                  <div className="pt-4">
                    {cart.find(p => p.id === selectedProduct.id) ? (
                      <div className={`flex items-center justify-between rounded-xl p-3 ${
                        darkMode 
                          ? 'bg-green-900/30 border-2 border-green-600' 
                          : 'glass-card border-2 border-green-600'
                      }`}>
                        <button
                          onClick={() => updateQuantity(selectedProduct.id, (cart.find(p => p.id === selectedProduct.id)?.quantity || 1) - 1)}
                          className={`px-4 py-2 rounded-xl text-lg font-bold hover:shadow-md transition-all ${
                            darkMode ? 'bg-gray-800 text-gray-200 hover:bg-gray-700' : 'glass-button text-gray-700'
                          }`}
                        >
                          -
                        </button>
                        <span className={`px-4 text-xl font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                          {cart.find(p => p.id === selectedProduct.id)?.quantity || 0} in cart
                        </span>
                        <button
                          onClick={() => updateQuantity(selectedProduct.id, (cart.find(p => p.id === selectedProduct.id)?.quantity || 1) + 1)}
                          className={`px-4 py-2 rounded-xl text-lg font-bold hover:shadow-md transition-all ${
                            darkMode ? 'bg-gray-800 text-gray-200 hover:bg-gray-700' : 'glass-button text-gray-700'
                          }`}
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          addToCart(selectedProduct);
                          setShowProductDetail(false);
                        }}
                        className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white px-6 py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all"
                      >
                        Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product Sections by Category */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 pb-12">
        {Object.entries(productsByCategory).map(([categoryId, categoryProducts]) => {
          const category = categories.find(c => c.id === categoryId);
          if (!category || categoryProducts.length === 0) return null;

          return (
            <div key={categoryId} className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-xl sm:text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{category.name}</h3>
                <button className={`text-sm sm:text-base font-semibold ${darkMode ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-700'}`}>
                  see all
                </button>
              </div>

              {/* Horizontal Scroll Products */}
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {categoryProducts.map((product) => {
                  const inCart = cart.find((p) => p.id === product.id);
                  
                  return (
                    <div
                      key={product.id}
                      className={`rounded-xl p-4 flex-shrink-0 w-44 sm:w-48 hover:shadow-lg transition-all cursor-pointer ${
                        darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'
                      }`}
                    >
                      <div 
                        className="relative mb-3"
                        onClick={() => {
                          setSelectedProduct(product);
                          setShowProductDetail(true);
                        }}
                      >
                        {/* Delivery time badge */}
                        <div className={`absolute top-2 left-2 rounded-full px-2 py-1 text-[11px] font-semibold flex items-center gap-1 shadow-sm ${
                          darkMode ? 'bg-gray-800 text-gray-200' : 'bg-white'
                        }`}>
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                          8 MINS
                        </div>
                        
                        {/* Product Image */}
                        <div className={`w-full h-32 sm:h-36 rounded-lg flex items-center justify-center ${
                          darkMode ? 'bg-gray-800' : 'bg-gray-100'
                        }`}>
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-contain rounded-lg"
                            />
                          ) : (
                            <span className="text-gray-400 text-xs">No Image</span>
                          )}
                        </div>
                      </div>
                      
                      <div 
                        onClick={() => {
                          setSelectedProduct(product);
                          setShowProductDetail(true);
                        }}
                      >
                        <h4 className={`font-semibold text-sm mb-1 line-clamp-2 min-h-[40px] ${
                          darkMode ? 'text-gray-200' : 'text-gray-800'
                        }`}>
                          {product.name}
                        </h4>
                        <p className={`text-xs mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{product.weight}</p>
                      </div>
                      
                      <div className="flex items-center justify-between gap-2">
                        <div className={`text-base sm:text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>₹{product.price}</div>
                        
                        <div className="flex items-center gap-1">
                          {inCart ? (
                            <>
                              <button
                                onClick={() => updateQuantity(product.id, (inCart.quantity || 1) - 1)}
                                className={`px-2 py-1 rounded-lg text-xs font-bold transition-all ${
                                  darkMode 
                                    ? 'bg-gray-800 text-gray-200 hover:bg-gray-700 border border-gray-700' 
                                    : 'border border-gray-300 text-gray-600 hover:bg-gray-100'
                                }`}
                              >
                                -
                              </button>
                              <span className={`px-2 text-xs font-bold ${darkMode ? 'text-white' : ''}`}>{inCart.quantity}</span>
                              <button
                                onClick={() => updateQuantity(product.id, (inCart.quantity || 1) + 1)}
                                className={`px-2 py-1 rounded-lg text-xs font-bold transition-all ${
                                  darkMode 
                                    ? 'bg-gray-800 text-gray-200 hover:bg-gray-700 border border-gray-700' 
                                    : 'border border-gray-300 text-gray-600 hover:bg-gray-100'
                                }`}
                              >
                                +
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => addToCart(product)}
                              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-bold text-xs sm:text-sm transition-all ${
                                darkMode 
                                  ? 'border-2 border-green-500 text-green-400 hover:bg-green-500/10' 
                                  : 'border-2 border-green-600 text-green-600 hover:bg-green-50'
                              }`}
                            >
                              ADD
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Cart Button (Mobile) */}
      {getItemCount() > 0 && (
        <Link
          href="/checkout"
          className="fixed bottom-6 right-6 bg-green-600 text-white px-6 py-4 rounded-full shadow-2xl font-bold flex items-center gap-2 hover:bg-green-700 transition-all z-40"
        >
          <span className="text-xl">🛒</span>
          <span>{getItemCount()} Items</span>
        </Link>
      )}

      {/* Welcome Popup Modal */}
      {showWelcomeModal && !username && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              // Don't allow closing by clicking outside
            }
          }}
        >
          <div 
            id="welcome-modal"
            className={`rounded-3xl max-w-md w-full p-8 shadow-2xl transition-all duration-300 animate-scaleIn ${
              darkMode ? 'bg-gray-950 border border-gray-800' : 'glass-modal'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Greeting Header with Animated Face */}
            <div className="text-center mb-6">
              {/* Animated Emoji Face */}
              <div className="relative w-32 h-32 mx-auto mb-4">
                {/* Face */}
                <div className={`w-full h-full rounded-full flex items-center justify-center ${
                  darkMode ? 'bg-gradient-to-br from-yellow-400 to-orange-400' : 'bg-gradient-to-br from-yellow-300 to-orange-300'
                }`}>
                  {/* Eyes Container */}
                  <div className="flex gap-6 mb-4">
                    {/* Left Eye */}
                    <div className="relative w-8 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden">
                      {!isBlinking ? (
                        <div 
                          className="w-4 h-4 bg-gray-900 rounded-full transition-transform duration-150 ease-out"
                          style={{
                            transform: `translate(${eyePosition.x}px, ${eyePosition.y}px)`
                          }}
                        />
                      ) : (
                        <div className="w-full h-1 bg-gray-900 animate-blink" />
                      )}
                    </div>
                    
                    {/* Right Eye */}
                    <div className="relative w-8 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden">
                      {!isBlinking ? (
                        <div 
                          className="w-4 h-4 bg-gray-900 rounded-full transition-transform duration-150 ease-out"
                          style={{
                            transform: `translate(${eyePosition.x}px, ${eyePosition.y}px)`
                          }}
                        />
                      ) : (
                        <div className="w-full h-1 bg-gray-900 animate-blink" />
                      )}
                    </div>
                  </div>
                  
                  {/* Mouth - Happy Smile */}
                  <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                    <div className="w-12 h-6 border-4 border-gray-900 rounded-b-full border-t-0" />
                  </div>
                </div>
              </div>
              
              <h2 className={`text-3xl font-bold mb-2 ${
                darkMode 
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent' 
                  : 'bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent'
              }`}>
                {getGreeting()}!
              </h2>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Welcome to V-it - Your groceries in 8 minutes
              </p>
            </div>

            {/* Username Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (tempUsername.trim()) {
                  setUsername(tempUsername.trim());
                  setShowWelcomeModal(false);
                }
              }}
              className="space-y-4"
            >
              <div>
                <label 
                  htmlFor="username" 
                  className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  What should we call you?
                </label>
                <input
                  id="username"
                  type="text"
                  value={tempUsername}
                  onChange={handleUsernameChange}
                  placeholder="Enter your name"
                  autoFocus
                  className={`w-full px-4 py-3 rounded-xl text-base font-medium focus:outline-none transition-all ${
                    darkMode 
                      ? 'bg-gray-900 text-white placeholder-gray-500 border-2 border-gray-800 focus:border-yellow-500' 
                      : 'glass-search text-gray-900 placeholder-gray-600 border-2 border-transparent focus:border-yellow-500'
                  }`}
                />
              </div>

              <button
                type="submit"
                disabled={!tempUsername.trim()}
                className={`w-full py-3 rounded-xl font-bold text-base transition-all shadow-lg ${
                  tempUsername.trim()
                    ? darkMode
                      ? 'bg-yellow-500 text-black hover:bg-yellow-400 hover:shadow-xl'
                      : 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:shadow-xl hover:scale-[1.02]'
                    : darkMode
                    ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Let's Shop! 🛒
              </button>
            </form>

            {/* Skip Option */}
            <button
              onClick={() => {
                setUsername("Guest");
                setShowWelcomeModal(false);
              }}
              className={`w-full mt-3 text-sm font-semibold transition-colors ${
                darkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Continue as Guest
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
