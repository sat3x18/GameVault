// Your original code with the same colors and styles exactly as before:

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Gamepad2, Shield, Zap, Users, Settings, Search, Menu, X } from 'lucide-react';
import { ItemCard } from './components/ItemCard';
import { ItemPage } from './components/ItemPage';
import { PurchaseModal } from './components/PurchaseModal';
import { HorizontalFilters } from './components/HorizontalFilters';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ItemsProvider, useItems } from './contexts/ItemsContext';
import { GameItem } from './types';

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { items, loading, error } = useItems();
  const [selectedItem, setSelectedItem] = useState<GameItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handlePurchase = (item: GameItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const categories = [...new Set(items.map(item => item.category))];
  const maxPrice = Math.max(...items.map(item => item.price), 100);
  
  React.useEffect(() => {
    setPriceRange([0, maxPrice]);
  }, [maxPrice]);

  const filteredItems = items.filter(item => {
    const matchesSearch = searchTerm === '' || 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    
    const matchesPrice = item.price >= priceRange[0] && item.price <= priceRange[1];
    
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const inStockItems = filteredItems.filter(item => item.inStock);

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setPriceRange([0, maxPrice]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-emerald-800 text-lg">Loading items...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100">
      {/* Header */}
      <header className="border-b border-emerald-200 backdrop-blur-sm bg-white/90 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Gamepad2 className="w-6 h-6 text-white" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-2xl font-bold text-emerald-900">GameVault</h1>
                  <p className="text-emerald-600 text-sm">Premium Gaming Assets</p>
                </div>
              </div>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-6 text-sm text-emerald-700">
              <div className="flex items-center gap-2 bg-emerald-100 px-3 py-2 rounded-full">
                <Shield className="w-4 h-4 text-emerald-600" />
                <span className="font-medium">Secure Trades</span>
              </div>
              <div className="flex items-center gap-2 bg-teal-100 px-3 py-2 rounded-full">
                <Zap className="w-4 h-4 text-teal-600" />
                <span className="font-medium">Instant Delivery</span>
              </div>
              <div className="flex items-center gap-2 bg-blue-100 px-3 py-2 rounded-full">
                <Users className="w-4 h-4 text-blue-600" />
                <span className="font-medium">24/7 Support</span>
              </div>
            </div>

            {/* Mobile Menu Button & Admin Button */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => window.location.href = '/admin'}
                className="flex items-center gap-2 px-3 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-lg transition-colors"
              >
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Admin</span>
              </button>
              
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="lg:hidden flex items-center gap-2 px-3 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-lg transition-colors"
              >
                {showMobileMenu ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {showMobileMenu && (
            <div className="lg:hidden mt-4 pt-4 border-t border-emerald-200">
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 bg-emerald-100 px-3 py-2 rounded-full text-sm">
                  <Shield className="w-4 h-4 text-emerald-600" />
                  <span className="font-medium text-emerald-700">Secure</span>
                </div>
                <div className="flex items-center gap-2 bg-teal-100 px-3 py-2 rounded-full text-sm">
                  <Zap className="w-4 h-4 text-teal-600" />
                  <span className="font-medium text-teal-700">Instant</span>
                </div>
                <div className="flex items-center gap-2 bg-blue-100 px-3 py-2 rounded-full text-sm">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-blue-700">24/7 Support</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
        <div className="text-center mb-8 lg:mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-emerald-900 mb-4">
            Premium Gaming Assets
            <span className="block text-xl lg:text-2xl text-transparent bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text mt-2">
              Accounts • Keys • Services
            </span>
          </h2>
          <p className="text-emerald-700 max-w-2xl mx-auto text-base lg:text-lg leading-relaxed">
            Discover high-quality gaming accounts, gift cards, and professional services. 
            All transactions are handled securely through our Discord community.
          </p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-xl max-w-4xl mx-auto">
            <p className="text-amber-700 text-sm text-center">{error}</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 mb-8 lg:mb-12">
          <div className="bg-white/70 backdrop-blur-sm border border-emerald-200 rounded-xl p-4 lg:p-6 text-center shadow-sm">
            <div className="text-2xl lg:text-3xl font-bold text-emerald-600 mb-2">{filteredItems.length}</div>
            <div className="text-emerald-800 text-sm lg:text-base">Items Available</div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm border border-teal-200 rounded-xl p-4 lg:p-6 text-center shadow-sm">
            <div className="text-2xl lg:text-3xl font-bold text-teal-600 mb-2">{categories.length}</div>
            <div className="text-teal-800 text-sm lg:text-base">Categories</div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm border border-blue-200 rounded-xl p-4 lg:p-6 text-center shadow-sm">
            <div className="text-2xl lg:text-3xl font-bold text-blue-600 mb-2">24/7</div>
            <div className="text-blue-800 text-sm lg:text-base">Support Available</div>
          </div>
        </div>
      </section>

      {/* Horizontal Filters */}
      <section className="max-w-7xl mx-auto px-4 mb-8">
        <HorizontalFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          priceRange={priceRange}
          onPriceRangeChange={setPriceRange}
          maxPrice={maxPrice}
          categories={categories}
          totalItems={items.length}
          filteredCount={filteredItems.length}
          onClearFilters={handleClearFilters}
        />
      </section>

      {/* Items Grid */}
      <section className="max-w-7xl mx-auto px-4 pb-12">
        <div className="mb-6">
          <h3 className="text-xl lg:text-2xl font-bold text-emerald-900 mb-2">
            {selectedCategory === 'all' ? 'All Items' : selectedCategory}
          </h3>
          <p className="text-emerald-700">
            {filteredItems.length === 0 
              ? 'No items match your current filters'
              : `Showing ${filteredItems.length} item${filteredItems.length !== 1 ? 's' : ''}`
            }
          </p>
        </div>

        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-emerald-600 mb-4">
              <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No items found</h3>
              <p>Try adjusting your search terms or filters</p>
            </div>
            <button
              onClick={handleClearFilters}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium transition-colors shadow-lg"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
            {filteredItems.map((item) => (
              <ItemCard 
                key={item.id} 
                item={item} 
                onPurchase={handlePurchase}
              />
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-emerald-200 bg-white/80 backdrop-blur-sm mt-16">
        <div className="max-w-7xl mx-auto px-4 py-6 lg:py-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow-lg">
                <Gamepad2 className="w-5 h-5 text-white" />
              </div>
              <Link to="/" className="text-xl font-bold text-emerald-900 hover:text-emerald-700 transition-colors">
                GameVault
              </Link>
            </div>
            <p className="text-emerald-700 mb-4 text-sm lg:text-base">
              Your trusted source for premium gaming assets and services
            </p>
            <div className="text-xs lg:text-sm text-emerald-600">
              <p>All transactions are processed securely through Discord</p>
              <p className="mt-1">Join our server for instant support and updates</p>
            </div>
          </div>
        </div>
      </footer>

      {/* Purchase Modal */}
      <PurchaseModal 
        item={selectedItem}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  if (showAdminLogin && !isAuthenticated) {
    return <AdminLogin />;
  }

  if (isAuthenticated) {
    return <AdminDashboard />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/item/:id" element={<ItemPage />} />
        <Route path="/admin" element={<AdminLogin />} />
      </Routes>
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <ItemsProvider>
        <AppContent />
      </ItemsProvider>
    </AuthProvider>
  );
}

export default App;
