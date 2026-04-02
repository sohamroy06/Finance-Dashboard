import { useEffect } from 'react';
import { useStore } from './store/useStore';
import Navbar from './components/Navbar';
import Overview from './components/Overview';
import Analytics from './components/Analytics';
import Transactions from './components/Transactions';
import Insights from './components/Insights';

export default function App() {
  const { darkMode } = useStore();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    document.documentElement.classList.toggle('light-theme', !darkMode);
    document.body.classList.toggle('light-theme', !darkMode);
  }, [darkMode]);

  return (
    <div className={`min-h-screen font-body relative transition-colors duration-300 ${
      darkMode ? 'bg-ink-950 text-white' : 'bg-[#f4f7fb] text-slate-900'
    }`}>
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-3xl transition-opacity duration-300 ${
          darkMode ? 'bg-gold-400/3' : 'bg-gold-400/10'
        }`} />
      </div>
      <Navbar />
      <main className="relative z-10">
        <Overview />
        <Analytics />
        <Transactions />
        <Insights />
      </main>
    </div>
  );
}