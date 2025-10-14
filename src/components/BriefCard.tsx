import { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { InsightCard } from './InsightCard';
import { ConvictionChart } from './ConvictionChart';
import { StockModal } from './StockModal';
import type { Brief } from '../types';

interface BriefCardProps {
  brief: Brief;
  isLatestBrief?: boolean;
}

export const BriefCard = ({ brief, isLatestBrief = false }: BriefCardProps) => {
  const { json: content } = brief;
  const [selectedTicker, setSelectedTicker] = useState<string | null>(null);
  const [showTooltip, setShowTooltip] = useState(isLatestBrief);

  const handleTickerClick = (ticker: string) => {
    console.log('Ticker clicked:', ticker);
    setSelectedTicker(ticker);
    // Hide tooltip when user clicks any ticker
    setShowTooltip(false);
  };

  const handleCloseModal = () => {
    setSelectedTicker(null);
  };

  const handleTooltipDismiss = () => {
    setShowTooltip(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Summary Section */}
      <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          Summary
        </h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {content.summary}
        </p>
      </section>

      {/* Insights Section */}
      {content.insights.length > 0 && (
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <h2 className="text-2xl font-bold p-6 pb-4 text-gray-900 dark:text-gray-100">
            Insights
          </h2>
          <div>
            {content.insights.map((insight, index) => (
              <InsightCard
                key={`${insight.ticker}-${index}`}
                insight={insight}
                variant="insight"
                index={index}
                onTickerClick={handleTickerClick}
                showTooltip={index === 0 && showTooltip}
                onTooltipDismiss={handleTooltipDismiss}
              />
            ))}
          </div>
        </section>
      )}

      {/* Conviction Chart */}
      {content.insights.length > 0 && (
        <ConvictionChart insights={content.insights} />
      )}

      {/* Watchlist Section */}
      {content.watchlist.length > 0 && (
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <h2 className="text-2xl font-bold p-6 pb-4 text-gray-900 dark:text-gray-100">
            Watchlist
          </h2>
          <div>
            {content.watchlist.map((item, index) => (
              <InsightCard
                key={`${item.ticker}-${index}`}
                insight={item}
                variant="watchlist"
                index={index}
                onTickerClick={handleTickerClick}
              />
            ))}
          </div>
        </section>
      )}

      {/* Sources Section */}
      {content.sources.length > 0 && (
        <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            Sources
          </h2>
          <ul className="space-y-3">
            {content.sources.map((source, index) => {
              // Clean Twitter URLs to show just the profile
              const cleanUrl = source.url.replace(/\/status\/\d+.*$/, '');
              
              return (
                <li key={index} className="text-sm">
                  {source.note && (
                    <span className="text-gray-700 dark:text-gray-300 mr-2">
                      {source.note} —
                    </span>
                  )}
                  <a
                    href={cleanUrl} // Link to clean profile URL
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                  >
                    {cleanUrl}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* Disclaimer */}
      <div className="text-sm text-gray-600 dark:text-gray-400 italic text-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
        Note: This brief is synthesized from social posts. It is not investment advice.
      </div>

      {/* Stock Modal */}
      {selectedTicker && (
        <StockModal
          ticker={selectedTicker}
          isOpen={!!selectedTicker}
          onClose={handleCloseModal}
        />
      )}
    </motion.div>
  );
};

