import { useMemo } from 'react';
import { useExpenseContext } from '../context/UseExpenseContext';
import { CATEGORIES } from '../constants/categories';

/**
 * Custom hook — pure computation, no side effects.
 * Returns monthlyTotal, categoryBreakdown, and filteredExpenses.
 */
export function useExpenseStats(activeFilter = 'all') {
  const { expenses } = useExpenseContext();

  return useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // ── This month's expenses ──
    const thisMonthExpenses = expenses.filter((exp) => {
      const expDate = new Date(exp.date);
      return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear;
    });

    const monthlyTotal = thisMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);

    // ── Overall total (all time, for percentage calculation) ──
    const overallTotal = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    // ── Category breakdown (all expenses) ──
    const breakdownMap = {};
    expenses.forEach((exp) => {
      if (!breakdownMap[exp.category]) {
        breakdownMap[exp.category] = 0;
      }
      breakdownMap[exp.category] += exp.amount;
    });

    const categoryBreakdown = CATEGORIES
      .filter((cat) => breakdownMap[cat.key])
      .map((cat) => ({
        ...cat,
        total: breakdownMap[cat.key],
        percentage: overallTotal > 0 ? (breakdownMap[cat.key] / overallTotal) * 100 : 0,
      }));

    // ── Category counts (for filter badges) ──
    const categoryCounts = {};
    expenses.forEach((exp) => {
      categoryCounts[exp.category] = (categoryCounts[exp.category] || 0) + 1;
    });

    // ── Filtered + sorted expenses ──
    const filtered =
      activeFilter === 'all'
        ? [...expenses]
        : expenses.filter((exp) => exp.category === activeFilter);

    // Sort: newest first, then by id desc to break ties
    filtered.sort((a, b) => {
      const dateCompare = new Date(b.date) - new Date(a.date);
      return dateCompare !== 0 ? dateCompare : b.id - a.id;
    });

    return {
      monthlyTotal,
      overallTotal,
      categoryBreakdown,
      categoryCounts,
      filteredExpenses: filtered,
    };
  }, [expenses, activeFilter]);
}
