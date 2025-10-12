import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface StockData {
  price: number;
  change: number;
  changePercent: number;
  previousClose: number;
  high: number;
  low: number;
  open: number;
}

interface HistoricalData {
  timestamp: string;
  close: number;
}

interface StockModalProps {
  ticker: string;
  isOpen: boolean;
  onClose: () => void;
}

export const StockModal = ({ ticker, isOpen, onClose }: StockModalProps) => {
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'1D' | '1W' | '1M' | '3M' | '1Y'>('1D');

  useEffect(() => {
    if (!isOpen || !ticker) return;

    const fetchStockData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Using Yahoo Finance API via AllOrigins CORS proxy (more reliable)
        const symbol = ticker.toUpperCase();
        
        // Fetch current price data using Yahoo Finance via AllOrigins proxy
        const quoteUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`;
        const quoteResponse = await fetch(
          `https://api.allorigins.win/raw?url=${encodeURIComponent(quoteUrl)}`
        );
        
        if (!quoteResponse.ok) {
          throw new Error('Failed to fetch stock data');
        }

        const quoteData = await quoteResponse.json();
        const result = quoteData.chart.result[0];
        const meta = result.meta;
        const quote = result.indicators.quote[0];

        const currentPrice = meta.regularMarketPrice;
        const previousClose = meta.chartPreviousClose;
        const change = currentPrice - previousClose;
        const changePercent = (change / previousClose) * 100;

        setStockData({
          price: currentPrice,
          change: change,
          changePercent: changePercent,
          previousClose: previousClose,
          high: meta.regularMarketDayHigh || currentPrice,
          low: meta.regularMarketDayLow || currentPrice,
          open: quote.open[0] || currentPrice,
        });

        // Fetch historical data based on time range
        let range = '1mo';
        let interval = '1d';
        
        switch (timeRange) {
          case '1D':
            range = '1d';
            interval = '5m';
            break;
          case '1W':
            range = '5d';
            interval = '1h';
            break;
          case '1M':
            range = '1mo';
            interval = '1d';
            break;
          case '3M':
            range = '3mo';
            interval = '1d';
            break;
          case '1Y':
            range = '1y';
            interval = '1wk';
            break;
        }

        const histUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=${interval}&range=${range}`;
        const histResponse = await fetch(
          `https://api.allorigins.win/raw?url=${encodeURIComponent(histUrl)}`
        );

        if (!histResponse.ok) {
          throw new Error('Failed to fetch historical data');
        }

        const histData = await histResponse.json();
        const histResult = histData.chart.result[0];
        const timestamps = histResult.timestamp;
        const closes = histResult.indicators.quote[0].close;

        let formattedData: HistoricalData[] = timestamps.map((ts: number, idx: number) => ({
          timestamp: new Date(ts * 1000).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            ...(timeRange === '1D' ? { hour: 'numeric', minute: '2-digit' } : {}),
          }),
          close: closes[idx],
        })).filter((d: HistoricalData) => d.close !== null);

        // Debug: Log the first few dates to see what Yahoo Finance returns
        console.log(`${symbol} ${timeRange} - First 3 dates:`, 
          formattedData.slice(0, 3).map(d => d.timestamp),
          'Total data points:', formattedData.length
        );

        // Yahoo Finance often includes an extra day at the start of the range
        // Remove the first data point for non-1D ranges to show the correct period
        if (timeRange !== '1D' && formattedData.length > 1) {
          formattedData = formattedData.slice(1);
        }

        setHistoricalData(formattedData);

        // Update change and changePercent based on the selected time range
        // For 1D, keep the original previousClose calculation (most accurate)
        // For other ranges, use the last regular market close (not after-hours price)
        if (timeRange !== '1D' && formattedData.length > 0) {
          const firstPrice = formattedData[0].close;
          // Use the last close price from historical data (regular market close)
          // instead of currentPrice which may include after-hours trading
          const lastClosePrice = formattedData[formattedData.length - 1].close;
          const rangeChange = lastClosePrice - firstPrice;
          const rangeChangePercent = (rangeChange / firstPrice) * 100;
          
          setStockData(prev => prev ? {
            ...prev,
            change: rangeChange,
            changePercent: rangeChangePercent,
          } : null);
        }
      } catch (err) {
        console.error('Error fetching stock data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load stock data');
      } finally {
        setLoading(false);
      }
    };

    fetchStockData();
  }, [ticker, isOpen, timeRange]);

  if (!isOpen) return null;

  const isPositive = stockData && stockData.change >= 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {ticker.toUpperCase()}
                </h2>
                {stockData && (
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                      ${stockData.price.toFixed(2)}
                    </span>
                    <div className={`flex items-center gap-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                      {isPositive ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                      <span className="text-lg font-semibold">
                        {isPositive ? '+' : ''}{stockData.change.toFixed(2)} ({isPositive ? '+' : ''}{stockData.changePercent.toFixed(2)}%)
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-red-600 dark:text-red-400">{error}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    This ticker may not be available or the API limit has been reached.
                  </p>
                </div>
              ) : stockData ? (
                <>
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Open</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        ${stockData.open.toFixed(2)}
                      </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Previous Close</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        ${stockData.previousClose.toFixed(2)}
                      </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Day High</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        ${stockData.high.toFixed(2)}
                      </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Day Low</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        ${stockData.low.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Time Range Selector */}
                  <div className="flex gap-2 mb-4">
                    {(['1D', '1W', '1M', '3M', '1Y'] as const).map((range) => (
                      <button
                        key={range}
                        onClick={() => setTimeRange(range)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          timeRange === range
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {range}
                      </button>
                    ))}
                  </div>

                  {/* Chart */}
                  {historicalData.length > 0 && (
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={historicalData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                          <XAxis
                            dataKey="timestamp"
                            stroke="#6B7280"
                            tick={{ fill: '#6B7280', fontSize: 12 }}
                            angle={-45}
                            textAnchor="end"
                            height={80}
                          />
                          <YAxis
                            stroke="#6B7280"
                            tick={{ fill: '#6B7280', fontSize: 12 }}
                            domain={['auto', 'auto']}
                            tickFormatter={(value) => `$${value.toFixed(2)}`}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#1F2937',
                              border: '1px solid #374151',
                              borderRadius: '8px',
                              color: '#F9FAFB',
                            }}
                            formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
                          />
                          <Line
                            type="monotone"
                            dataKey="close"
                            stroke={isPositive ? '#10B981' : '#EF4444'}
                            strokeWidth={2}
                            dot={false}
                            animationDuration={500}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  )}

                  {/* Disclaimer */}
                  <div className="mt-6 text-xs text-gray-600 dark:text-gray-400 text-center">
                    Data provided by Yahoo Finance. This is not financial advice.
                  </div>
                </>
              ) : null}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

