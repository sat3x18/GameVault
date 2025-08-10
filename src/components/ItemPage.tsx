import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Tag, CheckCircle, XCircle, Calendar, Shield, Zap, Users } from 'lucide-react';
import { useItems } from '../contexts/ItemsContext';
import { useAuth } from '../contexts/AuthContext';
import { PurchaseModal } from './PurchaseModal';
import { GameItem } from '../types';

export const ItemPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { items } = useItems();
  const { isAuthenticated } = useAuth();
  const [selectedItem, setSelectedItem] = useState<GameItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const item = items.find(item => item.id === id);

  if (!item) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Item Not Found</h1>
          <p className="text-gray-400 mb-8">The item you're looking for doesn't exist.</p>
          <Link 
            to="/"
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium rounded-lg transition-all duration-200 inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const handlePurchase = (item: GameItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const relatedItems = items
    .filter(relatedItem => relatedItem.category === item.category && relatedItem.id !== item.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="border-b border-gray-700/50 backdrop-blur-sm bg-gray-900/80 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700/50 hover:bg-gray-600/50 text-white rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            
            <Link 
              to="/"
              className="text-xl font-bold text-white hover:text-blue-400 transition-colors"
            >
              GameVault
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Image Section */}
          <div className="space-y-4">
            <div className="relative">
              <img 
                src={item.image} 
                alt={item.title}
                className="w-full h-96 object-cover rounded-2xl border border-gray-700"
              />
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  item.inStock 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}>
                  {item.inStock ? (
                    <><CheckCircle className="w-4 h-4 inline mr-1" />In Stock</>
                  ) : (
                    <><XCircle className="w-4 h-4 inline mr-1" />Out of Stock</>
                  )}
                </span>
              </div>
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-500/20 text-purple-400 border border-purple-500/30">
                  <Tag className="w-4 h-4 inline mr-1" />
                  {item.category}
                </span>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-4">{item.title}</h1>
              <div className="text-5xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text mb-6">
                ${item.price}
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-3">Description</h3>
              <p className="text-gray-300 leading-relaxed">{item.description}</p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">What's Included</h3>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center gap-3 text-gray-300">
                  <Shield className="w-5 h-5 text-green-400" />
                  <span>Secure transaction via Discord</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Zap className="w-5 h-5 text-blue-400" />
                  <span>Instant delivery after payment</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Users className="w-5 h-5 text-purple-400" />
                  <span>24/7 customer support</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Calendar className="w-5 h-5 text-yellow-400" />
                  <span>7-day warranty included</span>
                </div>
              </div>
            </div>

            {!isAuthenticated && (
              <div className="space-y-4">
                <button
                  onClick={() => handlePurchase(item)}
                  disabled={!item.inStock}
                  className={`w-full py-4 px-6 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-200 ${
                    item.inStock
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {item.inStock ? 'Purchase Now' : 'Currently Unavailable'}
                </button>
                
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                  <p className="text-amber-400 text-sm font-medium">
                    ⚠️ You must be in our Discord server before making a purchase!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Items */}
        {relatedItems.length > 0 && (
          <div className="border-t border-gray-700/50 pt-12">
            <h2 className="text-2xl font-bold text-white mb-8">Related Items</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedItems.map((relatedItem) => (
                <Link
                  key={relatedItem.id}
                  to={`/item/${relatedItem.id}`}
                  className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl overflow-hidden hover:border-blue-500/50 transition-all duration-300 hover:transform hover:scale-105 group"
                >
                  <div className="relative">
                    <img 
                      src={relatedItem.image} 
                      alt={relatedItem.title}
                      className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-white mb-2 line-clamp-1">{relatedItem.title}</h3>
                    <div className="text-lg font-bold text-transparent bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text">
                      ${relatedItem.price}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Purchase Modal */}
      <PurchaseModal 
        item={selectedItem}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};