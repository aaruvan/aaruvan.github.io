import { Moon, Sun, Home, Info } from 'lucide-react';
import { useDarkMode } from '../hooks/useDarkMode';
import { formatDate } from '../utils/dateFormatter';

interface HeaderProps {
  currentDate?: string;
  currentPage?: 'home' | 'about';
  onNavigate?: (page: 'home' | 'about') => void;
}

export const Header = ({ currentDate, currentPage = 'home', onNavigate }: HeaderProps) => {
  const { darkMode, toggleDarkMode } = useDarkMode();

  return (
    <header className="sticky top-0 z-50 bg-gray-900 dark:bg-gray-950 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">
                Aarush's Daily Market Brief
              </h1>
              {currentDate && currentPage === 'home' && (
                <p className="text-sm text-gray-300 mt-1">
                  {formatDate(currentDate)}
                </p>
              )}
            </div>
            
            {/* Navigation */}
            {onNavigate && (
              <nav className="hidden sm:flex items-center gap-2">
                <button
                  onClick={() => onNavigate('home')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    currentPage === 'home'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  <Home className="w-4 h-4" />
                  <span>Home</span>
                </button>
                <button
                  onClick={() => onNavigate('about')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    currentPage === 'about'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  <Info className="w-4 h-4" />
                  <span>About</span>
                </button>
              </nav>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {/* Mobile Navigation */}
            {onNavigate && (
              <nav className="flex sm:hidden items-center gap-1">
                <button
                  onClick={() => onNavigate('home')}
                  className={`p-2 rounded-lg transition-colors ${
                    currentPage === 'home'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800'
                  }`}
                  aria-label="Home"
                >
                  <Home className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onNavigate('about')}
                  className={`p-2 rounded-lg transition-colors ${
                    currentPage === 'about'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800'
                  }`}
                  aria-label="About"
                >
                  <Info className="w-5 h-5" />
                </button>
              </nav>
            )}
            
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

