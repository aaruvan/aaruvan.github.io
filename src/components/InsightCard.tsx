import { motion } from 'framer-motion';
import { TickerBadge } from './TickerBadge';
import { Chip } from './Chip';
import { TickerTooltip } from './TickerTooltip';
import type { Insight, WatchlistItem } from '../types';

interface InsightCardProps {
  insight: Insight | WatchlistItem;
  variant: 'insight' | 'watchlist';
  index: number;
  onTickerClick?: (ticker: string) => void;
  showTooltip?: boolean;
  onTooltipDismiss?: () => void;
}

export const InsightCard = ({ insight, variant, index, onTickerClick, showTooltip, onTooltipDismiss }: InsightCardProps) => {
  const isInsight = (item: Insight | WatchlistItem): item is Insight => {
    return 'bullet' in item;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="p-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
    >
      <div className="flex items-start mb-2 relative">
        <div className="relative">
          <TickerBadge
            ticker={insight.ticker}
            variant={variant}
            onClick={onTickerClick ? () => onTickerClick(insight.ticker) : undefined}
          />
          {showTooltip && onTooltipDismiss && (
            <TickerTooltip onDismiss={onTooltipDismiss} />
          )}
        </div>
        <span className="text-gray-800 dark:text-gray-200">
          {isInsight(insight) ? insight.bullet : insight.why}
        </span>
      </div>
      
      <div className="flex flex-wrap gap-1 mb-2">
        {insight.horizon && <Chip label="Horizon" value={insight.horizon} />}
        {isInsight(insight) && insight.conviction && (
          <Chip label="Conviction" value={insight.conviction} />
        )}
      </div>
      
      {insight.recommendation && (
        <div className="text-sm text-gray-600 dark:text-gray-400 italic mt-2">
          {insight.recommendation}
        </div>
      )}
    </motion.div>
  );
};

