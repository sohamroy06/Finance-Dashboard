import { TrendingUp, TrendingDown, Wallet, PiggyBank, ArrowDown } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useScrollAnimation, useCountUp } from '../hooks/useScrollAnimation';

const formatINR = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

function StatCard({ label, value, icon: Icon, color, trend, delay = 0, isVisible }) {
  const count = useCountUp(Math.abs(value), 1400, isVisible);
  return (
    <div
      className="relative group rounded-2xl border border-white/8 bg-white/4 backdrop-blur-sm p-6 hover:border-white/15 hover:bg-white/7 transition-all duration-500 overflow-hidden"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      {/* Glow */}
      <div className={`absolute -top-8 -right-8 w-32 h-32 rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity duration-500 ${color}`} />

      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color} bg-opacity-15`}>
          <Icon size={18} className={color.replace('bg-', 'text-')} />
        </div>
        {trend !== undefined && (
          <span className={`flex items-center gap-1 text-xs font-mono font-medium px-2 py-1 rounded-full ${
            trend >= 0 ? 'bg-emerald-400/10 text-emerald-400' : 'bg-coral-400/10 text-coral-400'
          }`}>
            {trend >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>

      <div className="space-y-1">
        <p className="text-slate-500 text-xs font-body uppercase tracking-widest">{label}</p>
        <p className="text-white font-display text-2xl font-bold tracking-tight">
          ₹{count.toLocaleString('en-IN')}
        </p>
      </div>
    </div>
  );
}

export default function Overview() {
  const { getSummary } = useStore();
  const summary = getSummary();
  const { ref, isVisible } = useScrollAnimation(0.05);

  return (
    <section id="overview" className="min-h-screen flex flex-col justify-center pt-20 pb-16 px-6 relative">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gold-400/4 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-400/5 rounded-full blur-3xl" />
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10">
        {/* Header */}
        <div
          className="mb-16 text-center"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(-20px)',
            transition: 'all 0.5s ease',
          }}
          ref={ref}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold-400/20 bg-gold-400/5 text-gold-400 text-xs font-mono uppercase tracking-widest mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
            March 2025 · Live Overview
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-bold text-white leading-tight mb-4">
            Your Financial
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-gold-600">
              Pulse
            </span>
          </h1>
          <p className="text-slate-500 font-body text-lg max-w-lg mx-auto">
            A real-time view into your money — where it comes from, where it goes, and how it grows.
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <StatCard label="Total Balance" value={summary.balance} icon={Wallet} color="bg-gold-400" trend={8.2} delay={0} isVisible={isVisible} />
          <StatCard label="Monthly Income" value={summary.income} icon={TrendingUp} color="bg-emerald-400" trend={12.4} delay={100} isVisible={isVisible} />
          <StatCard label="Monthly Expenses" value={summary.expenses} icon={TrendingDown} color="bg-coral-400" trend={-3.1} delay={200} isVisible={isVisible} />
          <StatCard label="Savings Rate" value={summary.savingsRate} icon={PiggyBank} color="bg-blue-400" trend={5.8} delay={300} isVisible={isVisible} />
        </div>

        {/* Scroll cue */}
        <div className="flex justify-center">
          <button
            onClick={() => document.getElementById('analytics')?.scrollIntoView({ behavior: 'smooth' })}
            className="flex flex-col items-center gap-2 text-slate-600 hover:text-gold-400 transition-colors group"
          >
            <span className="text-xs font-mono uppercase tracking-widest">Explore Analytics</span>
            <ArrowDown size={16} className="animate-bounce" />
          </button>
        </div>
      </div>
    </section>
  );
}
