import { useState, useEffect, useRef } from 'react';
import { Moon, Sun, ChevronDown, BarChart3 } from 'lucide-react';
import { useStore } from '../store/useStore';

const sections = ['Overview', 'Analytics', 'Transactions', 'Insights'];

export default function Navbar() {
  const { role, setRole, darkMode, toggleDarkMode } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('Overview');
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const roleMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (roleMenuRef.current && !roleMenuRef.current.contains(event.target)) {
        setRoleMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: 'smooth' });
    setActiveSection(id);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled
        ? 'bg-ink-900/95 backdrop-blur-xl border-b border-white/5 shadow-2xl'
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gold-400 flex items-center justify-center">
            <BarChart3 size={16} className="text-ink-950" />
          </div>
          <span className="font-display font-bold text-lg text-white tracking-tight">Finyze</span>
        </div>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-1">
          {sections.map((s) => (
            <button
              key={s}
              onClick={() => scrollTo(s)}
              className={`px-4 py-1.5 rounded-full text-sm font-body font-medium transition-all duration-200 ${
                activeSection === s
                  ? 'bg-gold-400/15 text-gold-400'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          {/* Role Switch */}
          <div className="relative" ref={roleMenuRef}>
            <button
              type="button"
              onClick={() => setRoleMenuOpen((open) => !open)}
              aria-haspopup="menu"
              aria-expanded={roleMenuOpen}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-all text-sm text-slate-300 font-body"
            >
              <span className={`w-2 h-2 rounded-full ${role === 'admin' ? 'bg-gold-400' : 'bg-emerald-400'}`} />
              <span className="capitalize">{role}</span>
              <ChevronDown size={14} />
            </button>
            <div className={`absolute right-0 top-11 bg-ink-800 border border-white/10 rounded-xl overflow-hidden shadow-2xl transition-all duration-200 w-36 z-50 ${
              roleMenuOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-1 pointer-events-none'
            }`}>
              {['admin', 'viewer'].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => {
                    setRole(r);
                    setRoleMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-body hover:bg-white/5 transition-colors ${role === r ? 'text-gold-400' : 'text-slate-300'}`}
                >
                  <span className={`w-2 h-2 rounded-full ${r === 'admin' ? 'bg-gold-400' : 'bg-emerald-400'}`} />
                  <span className="capitalize">{r}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Dark Mode */}
          <button
            onClick={toggleDarkMode}
            className="w-9 h-9 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-all flex items-center justify-center text-slate-300 hover:text-gold-400"
          >
            {darkMode ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </div>
      </div>
    </nav>
  );
}
