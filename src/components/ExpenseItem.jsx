import { useState, useEffect, useCallback } from 'react';
import { useExpenseContext } from '../context/UseExpenseContext';
import { CATEGORY_MAP, CATEGORIES } from '../constants/categories';
import {
  Trash2,
  AlertTriangle,
  Pencil,
  Check,
  X,
} from 'lucide-react';

export default function ExpenseItem({ expense }) {
  const { dispatch, getAuthHeaders } = useExpenseContext();

  const [confirming, setConfirming] = useState(false);
  const [editing, setEditing] = useState(false);

  const [editTitle, setEditTitle] = useState(expense.title);
  const [editAmount, setEditAmount] = useState(String(expense.amount));
  const [editCategory, setEditCategory] = useState(expense.category);
  const [editDate, setEditDate] = useState(expense.date);

  const cat =
    CATEGORY_MAP[expense.category] || CATEGORY_MAP['other'];

  const CatIcon = cat.Icon;

  useEffect(() => {
    if (!confirming) return;

    const timer = setTimeout(
      () => setConfirming(false),
      3000
    );

    return () => clearTimeout(timer);
  }, [confirming]);

  const handleDelete = useCallback(async () => {
    if (!confirming) {
      setConfirming(true);
      return;
    }

    try {
      const headers = await getAuthHeaders();

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/expenses/${expense.id}`,
        {
          method: 'DELETE',
          headers,
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete expense');
      }

      dispatch({
        type: 'DELETE_EXPENSE',
        payload: expense.id,
      });

      setConfirming(false);
    } catch (error) {
      console.error('Failed to delete expense:', error);
    }
  }, [confirming, dispatch, expense.id, getAuthHeaders]);

  const handleEdit = () => {
    setEditTitle(expense.title);
    setEditAmount(String(expense.amount));
    setEditCategory(expense.category);
    setEditDate(expense.date);
    setEditing(true);
    setConfirming(false);
  };

  const handleCancel = () => {
    setEditing(false);
  };

  const handleSave = async () => {
    const amount = parseFloat(editAmount);

    if (
      !editTitle.trim() ||
      !amount ||
      amount <= 0 ||
      !editDate
    ) {
      return;
    }

    const updatedExpense = {
      title: editTitle.trim(),
      amount,
      category: editCategory,
      date: editDate,
    };

    try {
      const headers = await getAuthHeaders();

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/expenses/${expense.id}`,
        {
          method: 'PUT',
          headers,
          body: JSON.stringify(updatedExpense),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update expense');
      }

      const savedExpense = await response.json();

      dispatch({
        type: 'UPDATE_EXPENSE',
        payload: savedExpense,
      });

      setEditing(false);
    } catch (error) {
      console.error('Failed to update expense:', error);
    }
  };

  if (editing) {
    return (
      <div className="rounded-xl border border-accent-primary/30 bg-dark-700/70 p-4 animate-slide-in">
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Expense title"
            className="w-full rounded-lg border border-dark-600 bg-dark-800 px-3 py-2 text-sm text-dark-50 outline-none focus:border-accent-primary"
          />

          <input
            type="number"
            min="0"
            step="0.01"
            value={editAmount}
            onChange={(e) => setEditAmount(e.target.value)}
            placeholder="Amount"
            className="w-full rounded-lg border border-dark-600 bg-dark-800 px-3 py-2 text-sm text-dark-50 outline-none focus:border-accent-primary"
          />

          <select
            value={editCategory}
            onChange={(e) => setEditCategory(e.target.value)}
            className="w-full rounded-lg border border-dark-600 bg-dark-800 px-3 py-2 text-sm text-dark-50 outline-none focus:border-accent-primary"
          >
            {CATEGORIES.map((category) => (
              <option key={category.key} value={category.key}>
                {category.label}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={editDate}
            onChange={(e) => setEditDate(e.target.value)}
            className="w-full rounded-lg border border-dark-600 bg-dark-800 px-3 py-2 text-sm text-dark-50 outline-none focus:border-accent-primary"
          />
        </div>

        <div className="mt-3 flex justify-end gap-2">
          <button
            onClick={handleCancel}
            className="flex cursor-pointer items-center gap-1 rounded-lg px-3 py-2 text-xs font-medium text-dark-300 transition-colors hover:bg-dark-600 hover:text-dark-50"
          >
            <X className="h-3.5 w-3.5" />
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="flex cursor-pointer items-center gap-1 rounded-lg bg-accent-primary px-3 py-2 text-xs font-semibold text-dark-900 transition-opacity hover:opacity-90"
          >
            <Check className="h-3.5 w-3.5" />
            Save
          </button>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(expense.date).toLocaleDateString(
    'en-IN',
    {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }
  );

  return (
    <div className="group flex items-center gap-3 rounded-xl border border-dark-600/40 bg-dark-700/50 px-4 py-3 transition-all duration-200 hover:border-dark-500/60 hover:bg-dark-700/80 animate-slide-in">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${cat.bgClass}`}
      >
        <CatIcon className={`h-5 w-5 ${cat.textClass}`} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-dark-50">
          {expense.title}
        </p>

        <div className="mt-0.5 flex items-center gap-2">
          <span className="text-xs text-dark-300">
            {formattedDate}
          </span>

          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${cat.bgClass} ${cat.textClass} border ${cat.borderClass}`}
          >
            {cat.label}
          </span>
        </div>
      </div>

      <p className="shrink-0 text-sm font-bold text-dark-50 tabular-nums">
        ₹{expense.amount.toLocaleString('en-IN')}
      </p>

      <button
        onClick={handleEdit}
        className="shrink-0 cursor-pointer rounded-lg p-2 text-dark-300 transition-all duration-200 hover:bg-accent-primary/10 hover:text-accent-primary"
        title="Edit expense"
      >
        <Pencil className="h-4 w-4" />
      </button>

      <button
        id={`delete-expense-${expense.id}`}
        onClick={handleDelete}
        className={`shrink-0 flex cursor-pointer items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all duration-200 ${
          confirming
            ? 'bg-danger/20 text-danger border border-danger/40 animate-pulse-soft'
            : 'text-dark-300 hover:bg-danger/10 hover:text-danger'
        }`}
        title={
          confirming
            ? 'Click again to confirm'
            : 'Delete expense'
        }
      >
        {confirming ? (
          <>
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>Confirm?</span>
          </>
        ) : (
          <Trash2 className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}