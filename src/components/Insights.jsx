import { TrendingUp, AlertTriangle, Trophy, Target, Zap, ArrowRight } from 'lucide-react';
import { useStore } from '../store/useStore';
import { categorySpending, monthlyData } from '../data/mockData';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

function InsightCard({ icon: Icon, color, title, value, subtitle, detail, delay, isVisible }) {
  return (
    <div
      className="group relative bg-white/3 border border-white/8 rounded-2xl p-6 hover:border-white/15 hover:bg-white/5 transition-all duration-500 overflow-hidden cursor-default"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.98)',
        transition: `all 0.45s ease ${delay}ms`,
      }}
    >
      <div className={`absolute -bottom-6 -right-6 w-32 h-32 rounded-full blur-3xl opacity-5 group-hover:opacity-15 transition-opacity duration-500 ${color}`} />

      <div className={`w-10 h-10 rounded-xl mb-4 flex items-center justify-center ${color.replace('bg-', 'bg-').split(' ')[0]}/15`}>
        <Icon size={18} className={color.replace('bg-', 'text-')} />
      </div>

      <p className="text-slate-500 text-xs font-mono uppercase tracking-widest mb-1">{title}</p>
      <p className="text-white font-display text-2xl font-bold mb-1">{value}</p>
      <p className="text-slate-400 text-sm font-body">{subtitle}</p>
      {detail && (
        <div className={`mt-4 pt-4 border-t border-white/5 flex items-center justify-between`}>
          <p className="text-slate-600 text-xs font-body">{detail}</p>
          <ArrowRight size={12} className="text-slate-600 group-hover:text-slate-400 group-hover:translate-x-1 transition-all" />
        </div>
      )}
    </div>
  );
}

export default function Insights() {
  const { getSummary, transactions } = useStore();
  const summary = getSummary();
  const { ref, isVisible } = useScrollAnimation(0.05);

  const topCategory = [...categorySpending].sort((a, b) => b.value - a.value)[0];
  const lastMonth = monthlyData[monthlyData.length - 2];
  const thisMonth = monthlyData[monthlyData.length - 1];
  const expenseChange = (((thisMonth.expenses - lastMonth.expenses) / lastMonth.expenses) * 100).toFixed(1);
  const incomeChange = (((thisMonth.income - lastMonth.income) / lastMonth.income) * 100).toFixed(1);

  const avgExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + Math.abs(t.amount), 0) / Math.max(transactions.filter(t => t.type === 'expense').length, 1);

  return (
    <section id="insights" className="py-24 px-6 pb-32 relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold-400/4 rounded-full blur-3xl" />
        <div className="absolute top-0 right-1/4 w-64 h-64 bg-coral-400/4 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10" ref={ref}>
        {/* Header */}
        <div
          className="mb-16"
          style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(24px)', transition: 'all 0.45s ease' }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-5 rounded-full bg-gold-400" />
            <span className="text-slate-500 text-xs font-mono uppercase tracking-widest">Insights</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mt-2">
            What the Data <br /><span className="text-slate-500">Is Telling You</span>
          </h2>
        </div>

        {/* Insight Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          <InsightCard
            icon={Trophy}
            color="bg-gold-400"
            title="Top Spending Category"
            value={topCategory.name}
            subtitle={`₹${topCategory.value.toLocaleString('en-IN')} this month`}
            detail={`${topCategory.percent}% of total spend`}
            delay={0} isVisible={isVisible}
          />
          <InsightCard
            icon={TrendingUp}
            color="bg-emerald-400"
            title="Income vs Last Month"
            value={`${incomeChange > 0 ? '+' : ''}${incomeChange}%`}
            subtitle={`₹${thisMonth.income.toLocaleString('en-IN')} this month`}
            detail={`Was ₹${lastMonth.income.toLocaleString('en-IN')} last month`}
            delay={100} isVisible={isVisible}
          />
          <InsightCard
            icon={expenseChange < 0 ? AlertTriangle : Zap}
            color={expenseChange < 0 ? "bg-coral-400" : "bg-blue-400"}
            title="Expense Change"
            value={`${expenseChange > 0 ? '+' : ''}${expenseChange}%`}
            subtitle={`₹${thisMonth.expenses.toLocaleString('en-IN')} this month`}
            detail={expenseChange < 0 ? "Expenses increased this month" : "Expenses reduced — great job!"}
            delay={200} isVisible={isVisible}
          />
          <InsightCard
            icon={Target}
            color="bg-purple-400"
            title="Savings Rate"
            value={`${summary.savingsRate}%`}
            subtitle="Of income saved this month"
            detail={summary.savingsRate >= 30 ? "Excellent! Above 30% target" : "Try to reach the 30% goal"}
            delay={300} isVisible={isVisible}
          />
          <InsightCard
            icon={TrendingUp}
            color="bg-teal-400"
            title="Avg Transaction Size"
            value={`₹${Math.round(avgExpense).toLocaleString('en-IN')}`}
            subtitle="Per expense transaction"
            detail={`Over ${transactions.filter(t => t.type === 'expense').length} transactions`}
            delay={400} isVisible={isVisible}
          />
          <InsightCard
            icon={Zap}
            color="bg-orange-400"
            title="Net Cash Flow"
            value={`₹${(thisMonth.income - thisMonth.expenses).toLocaleString('en-IN')}`}
            subtitle="This month's net savings"
            detail="Income minus all expenses"
            delay={500} isVisible={isVisible}
          />
        </div>

        {/* Spending bar breakdown */}
        <div
          className="bg-white/3 border border-white/8 rounded-2xl p-6"
          style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(24px)', transition: 'all 0.45s ease 0.2s' }}
        >
          <p className="text-slate-500 text-xs font-mono uppercase tracking-widest mb-4">Category Spending Breakdown</p>
          <div className="space-y-3">
            {categorySpending.map((c, i) => (
              <div key={i} className="flex items-center gap-4">
                <span className="text-slate-400 text-sm font-body w-28 shrink-0">{c.name}</span>
                <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: isVisible ? `${c.percent}%` : '0%',
                      background: c.color,
                      transitionDelay: `${i * 80 + 400}ms`
                    }}
                  />
                </div>
                <span className="text-white text-xs font-mono w-20 text-right">₹{c.value.toLocaleString('en-IN')}</span>
                <span className="text-slate-600 text-xs font-mono w-8 text-right">{c.percent}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center"
          style={{ opacity: isVisible ? 1 : 0, transition: 'all 0.45s ease 0.3s' }}>
          <p className="text-slate-700 text-xs font-mono">
            Finyze · Built with React, Recharts & Zustand · Data persisted locally
          </p>
        </div>
      </div>
    </section>
  );
}
