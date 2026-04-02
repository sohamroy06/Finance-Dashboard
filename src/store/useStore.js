import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { transactions as initialTransactions } from '../data/mockData';

export const useStore = create(
  persist(
    (set, get) => ({
      role: 'admin',
      setRole: (role) => set({ role }),

      darkMode: true,
      toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),

      transactions: initialTransactions,
      addTransaction: (tx) =>
        get().role === 'admin' &&
        set((s) => ({
          transactions: [
            { ...tx, id: Date.now(), icon: tx.type === 'income' ? '💰' : '💸' },
            ...s.transactions,
          ],
        })),
      editTransaction: (id, updated) =>
        get().role === 'admin' &&
        set((s) => ({
          transactions: s.transactions.map((t) => (t.id === id ? { ...t, ...updated } : t)),
        })),
      deleteTransaction: (id) =>
        get().role === 'admin' &&
        set((s) => ({ transactions: s.transactions.filter((t) => t.id !== id) })),

      searchQuery: '',
      setSearchQuery: (q) => set({ searchQuery: q }),
      filterCategory: 'All',
      setFilterCategory: (c) => set({ filterCategory: c }),
      filterType: 'All',
      setFilterType: (t) => set({ filterType: t }),
      sortBy: 'date',
      setSortBy: (s) => set({ sortBy: s }),
      sortOrder: 'desc',
      setSortOrder: (o) => set({ sortOrder: o }),

      getFilteredTransactions: () => {
        const { transactions, searchQuery, filterCategory, filterType, sortBy, sortOrder } = get();
        let filtered = [...transactions];
        if (searchQuery) filtered = filtered.filter(t => t.description.toLowerCase().includes(searchQuery.toLowerCase()));
        if (filterCategory !== 'All') filtered = filtered.filter(t => t.category === filterCategory);
        if (filterType !== 'All') filtered = filtered.filter(t => t.type === filterType);
        filtered.sort((a, b) => {
          let val = 0;
          if (sortBy === 'date') val = new Date(b.date) - new Date(a.date);
          if (sortBy === 'amount') val = Math.abs(b.amount) - Math.abs(a.amount);
          if (sortBy === 'category') val = a.category.localeCompare(b.category);
          return sortOrder === 'desc' ? val : -val;
        });
        return filtered;
      },

      getSummary: () => {
        const { transactions } = get();
        const currentMonth = transactions.filter(t => t.date.startsWith('2025-03'));
        const income = currentMonth.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
        const expenses = Math.abs(currentMonth.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0));
        return {
          balance: 284500 + income - expenses,
          income,
          expenses,
          savingsRate: income > 0 ? Math.round(((income - expenses) / income) * 100) : 0,
        };
      },
    }),
    { name: 'finance-dashboard-storage' }
  )
);