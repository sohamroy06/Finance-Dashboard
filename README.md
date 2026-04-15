# Finyze — Finance Dashboard

A professional, scroll-based finance dashboard built with React + Vite + Tailwind CSS.

---

## 🚀 Setup & Installation

```bash
npm install
npm run dev      # development
npm run build    # production build
```

Visit `http://localhost:5173` after running `npm run dev`.

---

## 🧭 Overview of Approach

Single-page scrolling experience — each section animates in as you scroll, with fade-up transitions and count-up number effects. Dark financial aesthetic inspired by Bloomberg Terminal and modern fintech apps.

**Scroll order:** Summary Cards → Charts → Transactions → Insights (natural finance mental model)

---

## ✅ Features

### Core
- Summary Cards: Balance, Income, Expenses, Savings Rate (with count-up animation)
- Time-based chart: 6-month balance trend (Area Chart)
- Categorical chart: Spending by category (Donut + horizontal bars)
- Monthly comparison: Income vs Expenses (Bar Chart)
- Transactions table: date, amount, category, type (income/expense)
- Search, filter by category/type, sort by date/amount/category
- Role-based UI: Admin (view + add/edit/delete) vs Viewer (read-only)
- Insights: top spending category, monthly comparison, savings rate, net flow
- Responsive: mobile → tablet → desktop
- Empty state handling on transactions

### Bonus
- Dark mode toggle (persisted)
- LocalStorage persistence via Zustand persist middleware
- CSV export of filtered transactions
- Scroll-triggered animations (IntersectionObserver)
- Count-up number animations on stat cards
- Micro-interactions: hover glows, row fade-in, button transitions

---

## 🔐 Role-Based UI

Switch roles via the dropdown in the top navbar.

| Role | Capabilities |
|---|---|
| **Admin** | View all + Add / Edit / Delete transactions |
| **Viewer** | View only — action buttons hidden |

---

## 📁 Structure

```
src/
├── components/
│   ├── Navbar.jsx           # Sticky nav, role switcher, dark mode
│   ├── Overview.jsx         # Hero + summary stat cards
│   ├── Analytics.jsx        # Area, Donut, Bar charts
│   ├── Transactions.jsx     # Table with CRUD + filters + CSV export
│   └── Insights.jsx         # Insight cards + category breakdown bars
├── data/mockData.js         # 40 transactions + monthly/category data
├── hooks/useScrollAnimation.js  # IntersectionObserver + countUp hooks
├── store/useStore.js        # Zustand store with localStorage persistence
└── App.jsx
```

---

## 🛠 Tech Stack

React 18 + Vite · Tailwind CSS v3 · Recharts · Zustand · Lucide React · Google Fonts (Playfair Display, DM Sans, JetBrains Mono)

---
