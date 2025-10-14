import { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { BriefCard } from './components/BriefCard';
import { SearchBar } from './components/SearchBar';
import { About } from './components/About';
import { useBriefs } from './hooks/useBriefs';
import { Loader2 } from 'lucide-react';

function App() {
  const { briefs, loading, error } = useBriefs();
  const [currentBriefId, setCurrentBriefId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState<'home' | 'about'>('home');

  // Initialize current brief from URL hash or first brief
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash && briefs.some(b => b.id === hash)) {
      setCurrentBriefId(hash);
    } else if (briefs.length > 0 && !currentBriefId) {
      setCurrentBriefId(briefs[0].id);
    }
  }, [briefs, currentBriefId]);

  // Update URL hash when brief changes
  const handleSelectBrief = (id: string) => {
    setCurrentBriefId(id);
    window.location.hash = id;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Listen for hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash && briefs.some(b => b.id === hash)) {
        setCurrentBriefId(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [briefs]);

  // Filter briefs based on search query
  const filteredBriefs = useMemo(() => {
    if (!searchQuery) return briefs;
    
    const query = searchQuery.toLowerCase();
    return briefs.filter(brief => {
      // Search in tickers
      const tickerMatch = [
        ...brief.json.insights.map(i => i.ticker),
        ...brief.json.watchlist.map(w => w.ticker),
      ].some(ticker => ticker.toLowerCase().includes(query));

      // Search in content
      const contentMatch = 
        brief.json.summary.toLowerCase().includes(query) ||
        brief.json.insights.some(i => i.bullet.toLowerCase().includes(query)) ||
        brief.json.watchlist.some(w => w.why.toLowerCase().includes(query));

      return tickerMatch || contentMatch;
    });
  }, [briefs, searchQuery]);

  const currentBrief = briefs.find(b => b.id === currentBriefId);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading market briefs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center max-w-md">
          <p className="text-red-600 dark:text-red-400 mb-4">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Get today's date in local timezone (not UTC)
  const today = new Date();
  const localDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const handleNavigate = (page: 'home' | 'about') => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header 
        currentDate={localDate} 
        currentPage={currentPage}
        onNavigate={handleNavigate}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentPage === 'about' ? (
          <About />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Search Bar */}
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
              
              {/* Brief Content */}
              {currentBrief ? (
                <>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                      {currentBrief.subject}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {currentBrief.date}
                    </p>
                  </div>
                <BriefCard 
                  brief={currentBrief} 
                  isLatestBrief={currentBrief.id === briefs[0]?.id}
                />
              </>
              ) : (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <p className="text-gray-600 dark:text-gray-400">
                    {searchQuery
                      ? `No briefs found matching "${searchQuery}"`
                      : 'Select a brief from the archive'}
                  </p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Sidebar
                briefs={filteredBriefs}
                currentBriefId={currentBriefId}
                onSelectBrief={handleSelectBrief}
              />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 py-8 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>Built with React, TypeScript, and Tailwind CSS</p>
          <p className="mt-2">Powered by n8n automation & OpenAI</p>
        </div>
      </footer>
    </div>
  );
}

export default App;

