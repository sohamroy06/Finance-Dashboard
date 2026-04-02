import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import { monthlyData, categorySpending } from '../data/mockData';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const formatK = (v) => v >= 1000 ? `₹${(v / 1000).toFixed(0)}k` : `₹${v}`;

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-ink-800 border border-white/10 rounded-xl p-3 shadow-2xl">
      <p className="text-slate-400 text-xs font-mono mb-2">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-sm font-body font-medium" style={{ color: p.color }}>
          {p.name}: ₹{p.value.toLocaleString('en-IN')}
        </p>
      ))}
    </div>
  );
};

function SectionLabel({ children }) {
  return (
    <div className="flex items-center gap-3 mb-2">
      <div className="w-1 h-5 rounded-full bg-gold-400" />
      <span className="text-slate-500 text-xs font-mono uppercase tracking-widest">{children}</span>
    </div>
  );
}

export default function Analytics() {
  const { ref, isVisible } = useScrollAnimation(0.05);

  return (
    <section id="analytics" className="py-24 px-6 relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/4 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10" ref={ref}>
        {/* Heading */}
        <div
          className="mb-16"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(24px)',
            transition: 'all 0.5s ease',
          }}
        >
          <SectionLabel>Analytics</SectionLabel>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mt-2">
            Visualize the Story
            <br />
            <span className="text-slate-500">Behind the Numbers</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
          {/* Area Chart - Balance Trend */}
          <div
            className="lg:col-span-3 bg-white/3 border border-white/8 rounded-2xl p-6 hover:border-white/15 transition-all duration-500"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateX(0)' : 'translateX(-30px)',
              transition: 'all 0.5s ease 0.05s',
            }}
          >
            <SectionLabel>6-Month Balance Trend</SectionLabel>
            <h3 className="text-white font-display text-xl font-semibold mb-6">Balance Evolution</h3>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F5C842" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#F5C842" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34D399" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#34D399" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" tick={{ fill: '#64748B', fontSize: 12, fontFamily: 'DM Sans' }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={formatK} tick={{ fill: '#64748B', fontSize: 11, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="income" name="Income" stroke="#34D399" strokeWidth={2} fill="url(#incomeGrad)" dot={false} />
                <Area type="monotone" dataKey="balance" name="Balance" stroke="#F5C842" strokeWidth={2.5} fill="url(#balanceGrad)" dot={{ fill: '#F5C842', r: 4, strokeWidth: 0 }} activeDot={{ r: 6, fill: '#F5C842' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Donut Chart - Spending Breakdown */}
          <div
            className="lg:col-span-2 bg-white/3 border border-white/8 rounded-2xl p-6 hover:border-white/15 transition-all duration-500"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateX(0)' : 'translateX(30px)',
              transition: 'all 0.5s ease 0.1s',
            }}
          >
            <SectionLabel>Spending Breakdown</SectionLabel>
            <h3 className="text-white font-display text-xl font-semibold mb-4">By Category</h3>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={categorySpending} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                  {categorySpending.map((entry, i) => (
                    <Cell key={i} fill={entry.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => [`₹${v.toLocaleString('en-IN')}`, '']} contentStyle={{ background: '#141B2D', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontFamily: 'DM Sans' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-2">
              {categorySpending.slice(0, 4).map((c, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: c.color }} />
                    <span className="text-slate-400 text-xs font-body">{c.name}</span>
                  </div>
                  <span className="text-white text-xs font-mono">₹{c.value.toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bar Chart - Monthly Comparison */}
        <div
          className="bg-white/3 border border-white/8 rounded-2xl p-6 hover:border-white/15 transition-all duration-500"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.5s ease 0.15s',
          }}
        >
          <SectionLabel>Monthly Comparison</SectionLabel>
          <h3 className="text-white font-display text-xl font-semibold mb-6">Income vs Expenses</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyData} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: '#64748B', fontSize: 12, fontFamily: 'DM Sans' }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={formatK} tick={{ fill: '#64748B', fontSize: 11, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="income" name="Income" fill="#34D399" radius={[6, 6, 0, 0]} />
              <Bar dataKey="expenses" name="Expenses" fill="#FB7185" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
