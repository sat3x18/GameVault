import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Gamepad2, Shield, Zap, Users, Settings, Search } from 'lucide-react';
import { ItemCard } from './components/ItemCard';
import { ItemPage } from './components/ItemPage';
import { PurchaseModal } from './components/PurchaseModal';
import { SearchAndFilters } from './components/SearchAndFilters';
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
  const [showMobileFilters, setShowMobileFilters] = useState(false);

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
  
  // Initialize price range based on actual max price
  React.useEffect(() => {
    setPriceRange([0, maxPrice]);
  }, [maxPrice]);

  // Filter items based on search, category, and price
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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading items...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="border-b border-gray-700/50 backdrop-blur-sm bg-gray-900/80 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Gamepad2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">GameVault</h1>
                  <p className="text-gray-400 text-sm">Premium Gaming Assets</p>
                </div>
              </div>
            </Link>
            
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-400" />
                <span>Secure Trades</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-400" />
                <span>Instant Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-400" />
                <span>24/7 Support</span>
              </div>
              <button
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="md:hidden flex items-center gap-2 px-3 py-1 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg transition-colors"
              >
                <Search className="w-4 h-4 text-gray-400" />
                <span>Filters</span>
              </button>
              <button
                onClick={() => window.location.href = '/admin'}
                className="flex items-center gap-2 px-3 py-1 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg transition-colors"
              >
                <Settings className="w-4 h-4 text-gray-400" />
                <span>Admin</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Premium Gaming Assets
            <span className="block text-2xl text-transparent bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text mt-2">
              Accounts • Keys • Services
            </span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Discover high-quality gaming accounts, gift cards, and professional services. 
            All transactions are handled securely through our Discord community.
          </p>
        </div>

        {/* Stats */}
        {error && (
          <div className="mb-8 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg max-w-4xl mx-auto">
            <p className="text-amber-400 text-sm text-center">{error}</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">{filteredItems.length}</div>
            <div className="text-gray-300">Items Available</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">{categories.length}</div>
            <div className="text-gray-300">Categories</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">24/7</div>
            <div className="text-gray-300">Support Available</div>
          </div>
        </div>
      </section>

      {/* Main Content with Sidebar */}
      <section className="max-w-7xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters - Desktop */}
          <div className="hidden lg:block">
            <SearchAndFilters
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
          </div>

          {/* Mobile Filters */}
          {showMobileFilters && (
            <div className="lg:hidden fixed inset-0 z-50 bg-black/70 backdrop-blur-sm">
              <div className="absolute right-0 top-0 h-full w-80 bg-gray-900 border-l border-gray-700 overflow-y-auto">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white">Filters</h3>
                    <button
                      onClick={() => setShowMobileFilters(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <SearchAndFilters
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
                </div>
              </div>
            </div>
          )}

          {/* Items Grid */}
          <div className="lg:col-span-3">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {selectedCategory === 'all' ? 'All Items' : selectedCategory}
                  </h3>
                  <p className="text-gray-400">
                    {filteredItems.length === 0 
                      ? 'No items match your current filters'
                      : `Showing ${filteredItems.length} item${filteredItems.length !== 1 ? 's' : ''}`
                    }
                  </p>
                </div>
                
                {/* Quick Search - Desktop */}
                <div className="hidden md:block">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Quick search..."
                      className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                    />
                  </div>
                </div>
              </div>
            </div>

            {filteredItems.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-semibold mb-2">No items found</h3>
                  <p>Try adjusting your search terms or filters</p>
                </div>
                <button
                  onClick={handleClearFilters}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredItems.map((item) => (
                  <ItemCard 
                    key={item.id} 
                    item={item} 
                    onPurchase={handlePurchase}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-700/50 bg-gray-900/80 backdrop-blur-sm mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Gamepad2 className="w-5 h-5 text-white" />
              </div>
              <Link to="/" className="text-xl font-bold text-white hover:text-blue-400 transition-colors">
                GameVault
              </Link>
            </div>
            <p className="text-gray-400 mb-4">
              Your trusted source for premium gaming assets and services
            </p>
            <div className="text-sm text-gray-500">
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