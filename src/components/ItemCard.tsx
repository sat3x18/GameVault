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
    <div className="bg-white/80 backdrop-blur-sm border border-emerald-200 rounded-2xl overflow-hidden hover:border-emerald-400 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-xl group">
      <div className="relative">
        <Link to={`/item/${item.id}`} className="block">
          <img 
            src={item.image} 
            alt={item.title}
            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-emerald-900/0 group-hover:bg-emerald-900/10 transition-colors" />
        </Link>
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            item.inStock 
              ? 'bg-green-100 text-green-700 border border-green-200' 
              : 'bg-red-100 text-red-700 border border-red-200'
          }`}>
            {item.inStock ? (
              <><CheckCircle className="w-3 h-3 inline mr-1" />In Stock</>
            ) : (
              <><XCircle className="w-3 h-3 inline mr-1" />Out of Stock</>
            )}
          </span>
        </div>
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 border border-emerald-200">
            <Tag className="w-3 h-3 inline mr-1" />
            {item.category}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <Link to={`/item/${item.id}`} className="block">
          <h3 className="text-lg lg:text-xl font-bold text-emerald-900 mb-2 line-clamp-1 hover:text-emerald-700 transition-colors">{item.title}</h3>
        </Link>
        <p className="text-emerald-700 text-sm mb-4 line-clamp-2 leading-relaxed">
          {item.description}
        </p>
        
        <div className="flex items-center justify-between">
          <Link to={`/item/${item.id}`} className="block">
            <div className="text-xl lg:text-2xl font-bold text-transparent bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text hover:from-emerald-500 hover:to-teal-500 transition-all">
              ${item.price}
            </div>
          </Link>
          
          {isAuthenticated ? (
            <div className="flex gap-2">
              {onEdit && (
                <button
                  onClick={() => onEdit(item)}
                  className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors text-sm"
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
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg hover:shadow-xl'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
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