import React, { useState } from 'react';
import { Search, Filter, X, ChevronDown, SlidersHorizontal } from 'lucide-react';

interface HorizontalFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  maxPrice: number;
  categories: string[];
  totalItems: number;
  filteredCount: number;
  onClearFilters: () => void;
}

export const HorizontalFilters: React.FC<HorizontalFiltersProps> = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  maxPrice,
  categories,
  totalItems,
  filteredCount,
  onClearFilters
}) => {
  const [showPriceFilter, setShowPriceFilter] = useState(false);
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const hasActiveFilters = searchTerm || selectedCategory !== 'all' || priceRange[0] > 0 || priceRange[1] < maxPrice;

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 lg:p-6 shadow-md">
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="w-full flex items-center justify-between px-4 py-3 bg-gray-700/50 hover:bg-gray-600/50 text-white rounded-xl transition-colors"
        >
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-blue-400" />
            <span className="font-medium">Filters & Search</span>
            {hasActiveFilters && (
              <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                Active
              </span>
            )}
          </div>
          <ChevronDown className={`w-5 h-5 transition-transform ${showMobileFilters ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Filters Container */}
      <div className={`space-y-4 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
        {/* Search Bar */}
        <div className="w-full">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search items by title or description..."
              className="w-full pl-12 pr-4 py-3 lg:py-4 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm lg:text-base"
            />
          </div>
        </div>

        {/* Filter Row */}
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
          {/* Left Side - Category and Price Filters */}
          <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
            {/* Category Filter */}
            <div className="relative">
              <button
                onClick={() => setShowCategoryFilter(!showCategoryFilter)}
                className={`flex items-center gap-2 px-4 py-2 lg:py-3 rounded-xl border transition-colors text-sm lg:text-base font-medium ${
                  selectedCategory !== 'all'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-gray-700/50 text-white border-gray-600 hover:bg-gray-600/50'
                }`}
              >
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {selectedCategory === 'all' ? 'All Categories' : selectedCategory}
                </span>
                <span className="sm:hidden">Category</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showCategoryFilter ? 'rotate-180' : ''}`} />
              </button>

              {showCategoryFilter && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-xl shadow-lg z-10 overflow-hidden">
                  <button
                    onClick={() => {
                      onCategoryChange('all');
                      setShowCategoryFilter(false);
                    }}
                    className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                      selectedCategory === 'all'
                        ? 'bg-blue-500/20 text-blue-400 font-medium'
                        : 'text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    All Categories ({totalItems})
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => {
                        onCategoryChange(category);
                        setShowCategoryFilter(false);
                      }}
                      className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                        selectedCategory === category
                          ? 'bg-blue-500/20 text-blue-400 font-medium'
                          : 'text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Price Filter */}
            <div className="relative">
              <button
                onClick={() => setShowPriceFilter(!showPriceFilter)}
                className={`flex items-center gap-2 px-4 py-2 lg:py-3 rounded-xl border transition-colors text-sm lg:text-base font-medium ${
                  priceRange[0] > 0 || priceRange[1] < maxPrice
                    ? 'bg-purple-600 text-white border-purple-600'
                    : 'bg-gray-700/50 text-white border-gray-600 hover:bg-gray-600/50'
                }`}
              >
                <span>${priceRange[0]} - ${priceRange[1]}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showPriceFilter ? 'rotate-180' : ''}`} />
              </button>

              {showPriceFilter && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-gray-800 border border-gray-700 rounded-xl shadow-lg z-10 p-4">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        value={priceRange[0]}
                        onChange={(e) => onPriceRangeChange([parseInt(e.target.value) || 0, priceRange[1]])}
                        placeholder="Min"
                        className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                      />
                      <span className="text-gray-400">-</span>
                      <input
                        type="number"
                        value={priceRange[1]}
                        onChange={(e) => onPriceRangeChange([priceRange[0], parseInt(e.target.value) || maxPrice])}
                        placeholder="Max"
                        className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                      />
                    </div>
                    
                    <div className="relative">
                      <input
                        type="range"
                        min="0"
                        max={maxPrice}
                        value={priceRange[1]}
                        onChange={(e) => onPriceRangeChange([priceRange[0], parseInt(e.target.value)])}
                        className="w-full h-2 bg-purple-500/30 rounded-lg appearance-none cursor-pointer slider"
                      />
                      <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>$0</span>
                        <span>${maxPrice}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setShowPriceFilter(false)}
                      className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Results and Clear */}
          <div className="flex items-center justify-between lg:justify-end gap-4">
            <div className="text-sm text-gray-300">
              <span className="font-medium">{filteredCount}</span> of{' '}
              <span className="font-medium">{totalItems}</span> items
            </div>
            
            {hasActiveFilters && (
              <button
                onClick={onClearFilters}
                className="flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
                <span className="hidden sm:inline">Clear All</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #9333ea;
          cursor: pointer;
          border: 2px solid #1f2937;
          box-shadow: 0 2px 4px rgba(0,0,0,0.5);
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #9333ea;
          cursor: pointer;
          border: 2px solid #1f2937;
          box-shadow: 0 2px 4px rgba(0,0,0,0.5);
        }
      `}</style>
    </div>
  );
};
