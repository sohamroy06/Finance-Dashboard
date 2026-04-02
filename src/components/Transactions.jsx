import { useState } from 'react';
import { Search, Filter, ArrowUpDown, Plus, Pencil, Trash2, Download, X, Check } from 'lucide-react';
import { useStore } from '../store/useStore';
import { categories } from '../data/mockData';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const formatINR = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Math.abs(n));

function Modal({ onClose, onSave, initial, darkMode }) {
  const [form, setForm] = useState(initial || { description: '', amount: '', category: 'Food & Dining', type: 'expense', date: new Date().toISOString().split('T')[0] });
  const cats = categories.filter(c => c !== 'All' && c !== 'Income');
  const shellClass = darkMode ? 'bg-ink-800 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900';
  const fieldClass = darkMode
    ? 'bg-white/5 border-white/10 text-white placeholder-slate-500'
    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400';
  const optionClass = darkMode ? 'bg-ink-800' : 'bg-white';

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className={`rounded-2xl p-6 w-full max-w-md shadow-2xl ${shellClass}`} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-xl font-semibold">{initial ? 'Edit' : 'Add'} Transaction</h3>
          <button onClick={onClose} className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${darkMode ? 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900'}`}>
            <X size={15} />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-slate-500 text-xs font-mono uppercase tracking-widest block mb-1.5">Description</label>
            <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className={`w-full rounded-xl px-4 py-2.5 text-sm font-body focus:outline-none focus:border-gold-400/50 transition-colors ${fieldClass}`} placeholder="e.g. Netflix Subscription" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-500 text-xs font-mono uppercase tracking-widest block mb-1.5">Amount (₹)</label>
              <input type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} className={`w-full rounded-xl px-4 py-2.5 text-sm font-body focus:outline-none focus:border-gold-400/50 transition-colors ${fieldClass}`} placeholder="0" />
            </div>
            <div>
              <label className="text-slate-500 text-xs font-mono uppercase tracking-widest block mb-1.5">Date</label>
              <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className={`w-full rounded-xl px-4 py-2.5 text-sm font-body focus:outline-none focus:border-gold-400/50 transition-colors ${fieldClass}`} />
            </div>
          </div>
          <div>
            <label className="text-slate-500 text-xs font-mono uppercase tracking-widest block mb-1.5">Type</label>
            <div className="flex gap-2">
              {['income', 'expense'].map(t => (
                <button key={t} onClick={() => setForm(f => ({ ...f, type: t }))} className={`flex-1 py-2 rounded-xl text-sm font-body font-medium capitalize transition-all border ${form.type === t ? (t === 'income' ? 'bg-emerald-400/20 text-emerald-400 border-emerald-400/30' : 'bg-coral-400/20 text-coral-400 border-coral-400/30') : darkMode ? 'bg-white/5 text-slate-400 border-transparent hover:bg-white/8' : 'bg-slate-100 text-slate-600 border-transparent hover:bg-slate-200'}`}>{t}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-slate-500 text-xs font-mono uppercase tracking-widest block mb-1.5">Category</label>
            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className={`w-full rounded-xl px-4 py-2.5 text-sm font-body focus:outline-none focus:border-gold-400/50 transition-colors ${fieldClass}`}>
              {(form.type === 'income' ? ['Income', 'Salary', 'Freelance', 'Investment'] : cats).map(c => <option key={c} value={c} className={optionClass}>{c}</option>)}
            </select>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className={`flex-1 py-2.5 rounded-xl text-sm font-body transition-colors ${darkMode ? 'border border-white/10 text-slate-400 hover:text-white' : 'border border-slate-200 text-slate-600 hover:text-slate-900'}`}>Cancel</button>
          <button onClick={() => onSave({ ...form, amount: form.type === 'income' ? Number(form.amount) : -Math.abs(Number(form.amount)) })} className="flex-1 py-2.5 rounded-xl bg-gold-400 text-ink-950 font-body font-semibold text-sm hover:bg-gold-500 transition-colors flex items-center justify-center gap-2">
            <Check size={15} /> Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Transactions() {
  const { role, darkMode, searchQuery, setSearchQuery, filterCategory, setFilterCategory, filterType, setFilterType, sortBy, setSortBy, sortOrder, setSortOrder, addTransaction, editTransaction, deleteTransaction, getFilteredTransactions } = useStore();
  const filtered = getFilteredTransactions();
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const { ref, isVisible } = useScrollAnimation(0.05);
  const isAdmin = role === 'admin';

  const exportCSV = () => {
    const headers = 'Date,Description,Category,Type,Amount\n';
    const rows = filtered.map(t => `${t.date},"${t.description}",${t.category},${t.type},${t.amount}`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'transactions.csv'; a.click();
  };

  return (
    <section id="transactions" className="py-24 px-6 relative">
      <div className="max-w-7xl mx-auto" ref={ref}>
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10"
          style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(24px)', transition: 'all 0.6s ease' }}>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-1 h-5 rounded-full bg-gold-400" />
              <span className="text-slate-500 text-xs font-mono uppercase tracking-widest">Transactions</span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white">
              Every Rupee <br /><span className="text-slate-500">Accounted For</span>
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-body transition-all">
              <Download size={14} /> Export CSV
            </button>
            {isAdmin && (
              <button onClick={() => { setEditItem(null); setShowModal(true); }} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gold-400 text-ink-950 font-body font-semibold text-sm hover:bg-gold-500 transition-all">
                <Plus size={14} /> Add Transaction
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6"
          style={{ opacity: isVisible ? 1 : 0, transition: 'all 0.6s ease 0.1s' }}>
          <div className="relative flex-1 min-w-48">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search transactions..." className={`w-full rounded-xl pl-9 pr-4 py-2.5 text-sm font-body focus:outline-none focus:border-gold-400/40 transition-colors ${darkMode ? 'bg-white/4 border border-white/8 text-white placeholder-slate-600' : 'bg-white border border-slate-200 text-slate-900 placeholder-slate-400 shadow-sm'}`} />
          </div>
          <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className={`rounded-xl px-3 py-2.5 text-sm font-body focus:outline-none focus:border-gold-400/40 transition-colors ${darkMode ? 'bg-white/4 border border-white/8 text-slate-300' : 'bg-white border border-slate-200 text-slate-700 shadow-sm'}`}>
            {categories.map(c => <option key={c} value={c} className={darkMode ? 'bg-ink-800' : 'bg-white'}>{c}</option>)}
          </select>
          <select value={filterType} onChange={e => setFilterType(e.target.value)} className={`rounded-xl px-3 py-2.5 text-sm font-body focus:outline-none focus:border-gold-400/40 transition-colors ${darkMode ? 'bg-white/4 border border-white/8 text-slate-300' : 'bg-white border border-slate-200 text-slate-700 shadow-sm'}`}>
            {['All', 'income', 'expense'].map(t => <option key={t} value={t} className={darkMode ? 'bg-ink-800 capitalize' : 'bg-white capitalize'}>{t === 'All' ? 'All Types' : t}</option>)}
          </select>
          <select value={`${sortBy}-${sortOrder}`} onChange={e => { const [s, o] = e.target.value.split('-'); setSortBy(s); setSortOrder(o); }} className={`rounded-xl px-3 py-2.5 text-sm font-body focus:outline-none focus:border-gold-400/40 transition-colors ${darkMode ? 'bg-white/4 border border-white/8 text-slate-300' : 'bg-white border border-slate-200 text-slate-700 shadow-sm'}`}>
            <option value="date-desc" className={darkMode ? 'bg-ink-800' : 'bg-white'}>Newest First</option>
            <option value="date-asc" className={darkMode ? 'bg-ink-800' : 'bg-white'}>Oldest First</option>
            <option value="amount-desc" className={darkMode ? 'bg-ink-800' : 'bg-white'}>Highest Amount</option>
            <option value="amount-asc" className={darkMode ? 'bg-ink-800' : 'bg-white'}>Lowest Amount</option>
            <option value="category-asc" className={darkMode ? 'bg-ink-800' : 'bg-white'}>Category A-Z</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white/2 border border-white/8 rounded-2xl overflow-hidden"
          style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.6s ease 0.2s' }}>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-600">
              <span className="text-5xl mb-4">🔍</span>
              <p className="font-display text-xl font-semibold text-slate-500">No transactions found</p>
              <p className="text-sm font-body mt-1">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left px-6 py-3.5 text-slate-500 text-xs font-mono uppercase tracking-widest font-normal">Date</th>
                    <th className="text-left px-6 py-3.5 text-slate-500 text-xs font-mono uppercase tracking-widest font-normal">Description</th>
                    <th className="text-left px-6 py-3.5 text-slate-500 text-xs font-mono uppercase tracking-widest font-normal hidden sm:table-cell">Category</th>
                    <th className="text-left px-6 py-3.5 text-slate-500 text-xs font-mono uppercase tracking-widest font-normal hidden md:table-cell">Type</th>
                    <th className="text-right px-6 py-3.5 text-slate-500 text-xs font-mono uppercase tracking-widest font-normal">Amount</th>
                    {isAdmin && <th className="px-6 py-3.5" />}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/4">
                  {filtered.map((tx, i) => (
                    <tr key={tx.id} className="hover:bg-white/3 transition-colors group"
                      style={{ opacity: isVisible ? 1 : 0, transition: `opacity 0.4s ease ${Math.min(i * 30, 400)}ms` }}>
                      <td className="px-6 py-4">
                        <span className="text-slate-500 text-xs font-mono">{new Date(tx.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{tx.icon}</span>
                          <span className="text-white text-sm font-body">{tx.description}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden sm:table-cell">
                        <span className="px-2.5 py-1 rounded-full text-xs font-body bg-white/5 text-slate-400">{tx.category}</span>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-body capitalize ${tx.type === 'income' ? 'bg-emerald-400/10 text-emerald-400' : 'bg-coral-400/10 text-coral-400'}`}>{tx.type}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`font-mono font-semibold text-sm ${tx.type === 'income' ? 'text-emerald-400' : 'text-coral-400'}`}>
                          {tx.type === 'income' ? '+' : '-'}{formatINR(tx.amount)}
                        </span>
                      </td>
                      {isAdmin && (
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => { setEditItem(tx); setShowModal(true); }} className="w-7 h-7 rounded-lg bg-white/5 hover:bg-gold-400/20 hover:text-gold-400 flex items-center justify-center text-slate-500 transition-all">
                              <Pencil size={12} />
                            </button>
                            <button onClick={() => deleteTransaction(tx.id)} className="w-7 h-7 rounded-lg bg-white/5 hover:bg-coral-400/20 hover:text-coral-400 flex items-center justify-center text-slate-500 transition-all">
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Row count */}
        <p className="text-slate-600 text-xs font-mono mt-3 text-right">
          Showing {filtered.length} transaction{filtered.length !== 1 ? 's' : ''}
        </p>
      </div>

      {showModal && (
        <Modal
          initial={editItem}
          darkMode={darkMode}
          onClose={() => { setShowModal(false); setEditItem(null); }}
          onSave={(data) => {
            if (editItem) editTransaction(editItem.id, data);
            else addTransaction(data);
            setShowModal(false); setEditItem(null);
          }}
        />
      )}
    </section>
  );
}
