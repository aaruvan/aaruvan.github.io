interface TickerBadgeProps {
  ticker: string;
  variant?: 'insight' | 'watchlist';
}

export const TickerBadge = ({ ticker, variant = 'insight' }: TickerBadgeProps) => {
  const baseClasses = "inline-block px-2 py-1 rounded font-semibold text-sm mr-2";
  const variantClasses = variant === 'insight'
    ? "bg-blue-600 text-white dark:bg-blue-500"
    : "bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-100";

  return (
    <span className={`${baseClasses} ${variantClasses}`}>
      {ticker.toUpperCase()}
    </span>
  );
};

