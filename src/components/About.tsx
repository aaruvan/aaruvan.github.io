import { motion } from 'framer-motion';
import { Twitter, TrendingUp, Info } from 'lucide-react';

export const About = () => {
  const twitterSources = [
    'mvcinvesting',
    'MMMTwealth',
    'thexcapitalist',
    'alc2022',
    'Ashton_1nvests',
    'BanklessHQ',
    'amitisinvesting',
    'pepemoonboy',
    'StockSavvyShay',
    'EndicottInvests',
    'jakebrowatzke',
    'FunOfInvesting',
    'FransBakker9812',
    'spacanpanman',
    'Couch_Investor',
  ];

  const brokers = [
    {
      name: 'Interactive Brokers',
      regions: ['International'],
      url: 'https://www.interactivebrokers.com',
      description: 'Best for international traders with access to global markets',
    },
    {
      name: 'Charles Schwab',
      regions: ['USA'],
      url: 'https://www.schwab.com',
      description: 'Excellent for US-based investors with comprehensive research tools',
    },
    {
      name: 'Fidelity',
      regions: ['USA'],
      url: 'https://www.fidelity.com',
      description: 'Top choice for US investors with exceptional customer service',
    },
    {
      name: 'Trading 212',
      regions: ['UK', 'UAE'],
      url: 'https://www.trading212.com',
      description: 'User-friendly platform for UK and UAE traders',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Header */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-900 rounded-lg p-8 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <Info className="w-8 h-8" />
          <h1 className="text-4xl font-bold">About</h1>
        </div>
        <p className="text-blue-100 text-lg leading-relaxed">
          Your daily digest of market insights, powered by the most informed voices in finance Twitter.
        </p>
      </section>

      {/* Mission */}
      <section className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">My Mission</h2>
        </div>
        <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
          <p>
            In today's fast-paced markets, staying informed is crucial. I noticed that Twitter investment communities 
            provide some of the most up-to-date and actionable market information available. However, keeping track 
            of multiple sources can be overwhelming.
          </p>
          <p>
            I created this daily brief to solve that problem. Every day, insights are automatically aggregated and synthesized 
            from carefully curated Twitter accounts of experienced investors and analysts. The posts are analyzed 
            to identify key investment themes, high-conviction opportunities, and stocks worth watching.
          </p>
          <p>
            My goal is simple: deliver timely, actionable market intelligence in an easy-to-digest format, so you can 
            make better-informed investment decisions.
          </p>
        </div>
      </section>

      {/* Data Sources */}
      <section className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-6">
          <Twitter className="w-6 h-6 text-blue-500" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Sources</h2>
        </div>
        <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
          Insights are tracked from these trusted Twitter accounts, chosen for their track record, analysis quality, 
          and unique market perspectives:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {twitterSources.map((handle) => (
            <a
              key={handle}
              href={`https://twitter.com/${handle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors group"
            >
              <Twitter className="w-4 h-4 text-blue-500 flex-shrink-0" />
              <span className="text-gray-900 dark:text-gray-100 font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400">
                @{handle}
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">How It Works</h2>
        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
              1
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Data Collection</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Every 24 hours, an automated system collects tweets from a curated list of investment Twitter accounts.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
              2
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">AI Analysis</h3>
              <p className="text-gray-700 dark:text-gray-300">
                OpenAI's GPT-4 analyzes the content to identify key insights, ticker mentions, 
                conviction levels, and investment horizons.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
              3
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Synthesis & Delivery</h3>
              <p className="text-gray-700 dark:text-gray-300">
                The insights are synthesized into a clean, structured brief with summaries, actionable insights, 
                watchlist items, and source references.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
              4
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Automated Publishing</h3>
              <p className="text-gray-700 dark:text-gray-300">
                The brief is automatically published to this website, making it accessible to you anytime, anywhere.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recommended Brokers */}
      <section className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Recommended Brokers</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
          To act on the insights you find here, you'll need a reliable broker. Based on my experience, 
          I recommend the following platforms depending on your location:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {brokers.map((broker) => (
            <div
              key={broker.name}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {broker.name}
                </h3>
                <div className="flex gap-1">
                  {broker.regions.map((region) => (
                    <span
                      key={region}
                      className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs rounded-full"
                    >
                      {region}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                {broker.description}
              </p>
              <a
                href={broker.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
              >
                Learn more →
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Technology Stack */}
      <section className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Technology Stack</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
          This is built with modern technologies to ensure reliability, speed, and a great user experience:
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            'React + TypeScript',
            'Tailwind CSS',
            'n8n Automation',
            'OpenAI GPT-4',
            'GitHub Pages',
            'Yahoo Finance API',
          ].map((tech) => (
            <div
              key={tech}
              className="px-4 py-3 bg-gray-50 dark:bg-gray-900 rounded-lg text-center text-gray-900 dark:text-gray-100 font-medium"
            >
              {tech}
            </div>
          ))}
        </div>
      </section>

      {/* Disclaimer */}
      <section className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-6">
        <h2 className="text-xl font-bold text-amber-900 dark:text-amber-200 mb-3">Important Disclaimer</h2>
        <p className="text-amber-800 dark:text-amber-300 text-sm leading-relaxed">
          This brief aggregates and synthesizes publicly available information from Twitter. This content is for 
          informational purposes only and should not be considered as financial advice. Always do your own research 
          and consult with a qualified financial advisor before making investment decisions. Past performance does 
          not guarantee future results. Investing carries risk, including the potential loss of capital.
        </p>
      </section>
    </motion.div>
  );
};

