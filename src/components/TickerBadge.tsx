interface TickerBadgeProps {
  ticker: string;
  variant?: 'insight' | 'watchlist';
  onClick?: () => void;
}

export const TickerBadge = ({ ticker, variant = 'insight', onClick }: TickerBadgeProps) => {
  const baseClasses = "inline-block px-2 py-1 rounded font-semibold text-sm mr-2 transition-all";
  const variantClasses = variant === 'insight'
    ? "bg-blue-600 text-white dark:bg-blue-500"
    : "bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-100";
  const interactiveClasses = onClick
    ? "cursor-pointer hover:scale-105 hover:shadow-md active:scale-95"
    : "";

  const handleClick = (e: React.MouseEvent) => {
    console.log('TickerBadge clicked:', ticker, 'onClick exists:', !!onClick);
    if (onClick) {
      e.stopPropagation();
      onClick();
    }
  };

  return (
    <span
      className={`${baseClasses} ${variantClasses} ${interactiveClasses}`}
      onClick={handleClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      } : undefined}
    >
      {ticker.toUpperCase()}
    </span>
  );
};

