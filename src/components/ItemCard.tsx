import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Tag, CheckCircle, XCircle } from 'lucide-react';
import { GameItem } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface ItemCardProps {
  item: GameItem;
  onPurchase: (item: GameItem) => void;
  onEdit?: (item: GameItem) => void;
  onDelete?: (id: string) => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item, onPurchase, onEdit, onDelete }) => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl overflow-hidden hover:border-blue-500/50 transition-all duration-300 hover:transform hover:scale-105 group">
      <div className="relative">
        <Link to={`/item/${item.id}`} className="block">
          <img 
            src={item.image} 
            alt={item.title}
            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
        </Link>

        {/* Stock Badge */}
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
            item.inStock 
              ? 'bg-green-500/20 text-green-400 border-green-500/30' 
              : 'bg-red-500/20 text-red-400 border-red-500/30'
          }`}>
            {item.inStock ? (
              <><CheckCircle className="w-3 h-3 inline mr-1" />In Stock</>
            ) : (
              <><XCircle className="w-3 h-3 inline mr-1" />Out of Stock</>
            )}
          </span>
        </div>

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400 border border-purple-500/30">
            <Tag className="w-3 h-3 inline mr-1" />
            {item.category}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <Link to={`/item/${item.id}`} className="block">
          <h3 className="text-lg lg:text-xl font-bold text-white mb-2 line-clamp-1 hover:text-blue-400 transition-colors">
            {item.title}
          </h3>
        </Link>
        <p className="text-gray-300 text-sm mb-4 line-clamp-2 leading-relaxed">
          {item.description}
        </p>
        
        <div className="flex items-center justify-between">
          <Link to={`/item/${item.id}`} className="block">
            <div className="text-xl lg:text-2xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text">
              ${item.price}
            </div>
          </Link>
          
          {isAuthenticated ? (
            <div className="flex gap-2">
              {onEdit && (
                <button
                  onClick={() => onEdit(item)}
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors text-sm"
                >
                  Edit
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(item.id)}
                  className="px-3 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-medium transition-colors text-sm"
                >
                  Delete
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={() => onPurchase(item)}
              disabled={!item.inStock}
              className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all duration-200 text-sm ${
                item.inStock
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg hover:shadow-xl'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              <ShoppingCart className="w-3 h-3" />
              {item.inStock ? 'Buy' : 'Sold Out'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
