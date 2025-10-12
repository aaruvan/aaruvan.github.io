import { motion } from 'framer-motion';
import { formatDate } from '../utils/dateFormatter';
import type { Brief } from '../types';

interface SidebarProps {
  briefs: Brief[];
  currentBriefId: string;
  onSelectBrief: (id: string) => void;
}

export const Sidebar = ({ briefs, currentBriefId, onSelectBrief }: SidebarProps) => {
  return (
    <aside className="lg:sticky lg:top-20 h-fit">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
            Archive
          </h3>
        </div>
        
        <div className="max-h-[calc(100vh-12rem)] overflow-y-auto scrollbar-hide">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {briefs.map((brief, index) => (
              <motion.li
                key={brief.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <button
                  onClick={() => onSelectBrief(brief.id)}
                  className={`w-full text-left p-4 transition-colors ${
                    currentBriefId === brief.id
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <div className="font-medium text-gray-900 dark:text-gray-100 text-sm mb-1">
                    {brief.subject}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {formatDate(brief.date)}
                  </div>
                </button>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
};

