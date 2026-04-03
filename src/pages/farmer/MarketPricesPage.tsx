import { useState, useEffect, useCallback } from 'react';
import { Search, TrendingUp, TrendingDown, Minus, MapPin, RefreshCw } from 'lucide-react';
import { apiClient } from '@/services/api';
import type { ApiResponse } from '@/types';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

interface MarketPrice {
  _id: string;
  commodity: string;
  commodityHindi: string;
  market: string;
  state: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  priceChange?: number; // positive = up, negative = down
  unit: string;
  date: string;
}

export function MarketPricesPage() {
  const [prices, setPrices] = useState<MarketPrice[]>([]);
  const [filteredPrices, setFilteredPrices] = useState<MarketPrice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [states, setStates] = useState<string[]>([]);

  const fetchPrices = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedState) params.set('state', selectedState);
      const res = await apiClient<ApiResponse<MarketPrice[]>>(`/markets/prices?${params.toString()}`);
      setPrices(res.data);
      setFilteredPrices(res.data);

      // Extract unique states
      const uniqueStates = [...new Set(res.data.map((p) => p.state))].sort();
      setStates(uniqueStates);
    } catch {
      // fail silently
    } finally {
      setIsLoading(false);
    }
  }, [selectedState]);

  useEffect(() => {
    fetchPrices();
  }, [fetchPrices]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredPrices(prices);
      return;
    }
    const q = searchQuery.toLowerCase();
    setFilteredPrices(
      prices.filter(
        (p) =>
          p.commodity.toLowerCase().includes(q) ||
          p.commodityHindi.includes(searchQuery) ||
          p.market.toLowerCase().includes(q)
      )
    );
  }, [searchQuery, prices]);

  const getPriceIcon = (change?: number) => {
    if (!change || change === 0) return <Minus className="w-5 h-5 text-earth-400" />;
    if (change > 0) return <TrendingUp className="w-5 h-5 text-green-600" />;
    return <TrendingDown className="w-5 h-5 text-red-600" />;
  };

  const getPriceBg = (change?: number) => {
    if (!change || change === 0) return 'border-earth-200';
    if (change > 0) return 'border-green-200 bg-green-50/50';
    return 'border-red-200 bg-red-50/50';
  };

  return (
    <div className="space-y-5 pb-24">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-earth-900">🌾 मंडी भाव</h1>
        <p className="text-base text-earth-500">Mandi Prices</p>
      </div>

      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-earth-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="फसल खोजें / Search commodity..."
          className="w-full pl-12 pr-4 py-4 text-base bg-white border-2 border-earth-200 rounded-2xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
        />
      </div>

      {/* State filter */}
      {states.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          <button
            onClick={() => setSelectedState('')}
            className={`flex-shrink-0 px-4 py-2.5 rounded-full text-base font-bold transition-colors ${
              !selectedState
                ? 'bg-primary-600 text-white'
                : 'bg-white border border-earth-200 text-earth-700'
            }`}
          >
            सभी राज्य
          </button>
          {states.map((state) => (
            <button
              key={state}
              onClick={() => setSelectedState(state)}
              className={`flex-shrink-0 px-4 py-2.5 rounded-full text-base font-bold transition-colors ${
                selectedState === state
                  ? 'bg-primary-600 text-white'
                  : 'bg-white border border-earth-200 text-earth-700'
              }`}
            >
              {state}
            </button>
          ))}
        </div>
      )}

      {/* Refresh */}
      <div className="flex justify-end">
        <button
          onClick={fetchPrices}
          disabled={isLoading}
          className="flex items-center gap-2 text-base text-primary-600 font-medium disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          ताज़ा करें
        </button>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex justify-center py-10">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {/* Price cards */}
      {!isLoading && filteredPrices.length === 0 && (
        <div className="text-center py-12">
          <p className="text-lg font-bold text-earth-700">कोई भाव नहीं मिला</p>
          <p className="text-base text-earth-500 mt-1">No prices found</p>
        </div>
      )}

      {!isLoading && (
        <div className="space-y-3">
          {filteredPrices.map((price) => (
            <div
              key={price._id}
              className={`bg-white rounded-2xl border-2 ${getPriceBg(price.priceChange)} p-4`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-lg font-bold text-earth-900">{price.commodityHindi}</p>
                  <p className="text-sm text-earth-500">{price.commodity}</p>
                  <div className="flex items-center gap-1.5 mt-1 text-sm text-earth-400">
                    <MapPin className="w-3.5 h-3.5" />
                    {price.market}, {price.state}
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  {getPriceIcon(price.priceChange)}
                  {price.priceChange !== undefined && price.priceChange !== 0 && (
                    <span className={`text-sm font-bold ${price.priceChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {price.priceChange > 0 ? '+' : ''}{price.priceChange}%
                    </span>
                  )}
                </div>
              </div>

              {/* Price row */}
              <div className="grid grid-cols-3 gap-3 mt-3 pt-3 border-t border-earth-100">
                <div className="text-center">
                  <p className="text-xs text-earth-400 font-medium">न्यूनतम</p>
                  <p className="text-base font-bold text-earth-800">₹{price.minPrice}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-earth-400 font-medium">अधिकतम</p>
                  <p className="text-base font-bold text-earth-800">₹{price.maxPrice}</p>
                </div>
                <div className="text-center bg-primary-50 rounded-lg py-1">
                  <p className="text-xs text-primary-600 font-medium">मॉडल</p>
                  <p className="text-lg font-bold text-primary-700">₹{price.modalPrice}</p>
                </div>
              </div>
              <p className="text-xs text-earth-400 text-right mt-1">प्रति {price.unit}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
