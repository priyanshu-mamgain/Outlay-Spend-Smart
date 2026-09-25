import { useState, useCallback } from 'react';
import { useExpenseContext } from '../context/UseExpenseContext.js';
import { CATEGORIES } from '../constants/categories';
import {
  PlusCircle,
  CalendarDays,
  Tag,
  IndianRupee,
  Type,
} from 'lucide-react';

export default function ExpenseForm() {
  const { dispatch, getAuthHeaders } = useExpenseContext();

  const todayStr = new Date().toISOString().slice(0, 10);

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0].key);
  const [date, setDate] = useState(todayStr);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = useCallback(() => {
    const errs = {};

    if (!title.trim()) errs.title = 'Title is required';

    const num = parseFloat(amount);

    if (!amount || isNaN(num) || num <= 0) {
      errs.amount = 'Enter a positive amount';
    }

    if (!date) errs.date = 'Date is required';

    return errs;
  }, [title, amount, date]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      const errs = validate();
      setErrors(errs);

      if (Object.keys(errs).length > 0) return;

      setIsSubmitting(true);

      try {
        const headers = await getAuthHeaders();

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/expenses`,
          {
            method: 'POST',
            headers,
            body: JSON.stringify({
              title: title.trim(),
              amount: parseFloat(amount),
              category,
              date,
            }),
          }
        );

        if (!response.ok) {
          throw new Error('Failed to add expense');
        }

        const newExpense = await response.json();

        dispatch({
          type: 'ADD_EXPENSE',
          payload: newExpense,
        });

        setTitle('');
        setAmount('');
        setCategory(CATEGORIES[0].key);
        setDate(todayStr);
        setErrors({});
      } catch (error) {
        console.error('Failed to add expense:', error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      title,
      amount,
      category,
      date,
      dispatch,
      validate,
      todayStr,
      getAuthHeaders,
    ]
  );

  const inputBase =
    'w-full rounded-xl border border-dark-600 bg-dark-700/80 px-4 py-2.5 text-sm text-dark-50 placeholder-dark-300 outline-none transition-all duration-200 focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/25';

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-dark-600/50 bg-dark-800/70 p-5 backdrop-blur-sm"
    >
      <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-dark-50">
        <PlusCircle className="h-5 w-5 text-accent-primary" />
        Add Expense
      </h2>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1 flex items-center gap-1.5 text-xs font-medium text-dark-200">
            <Type className="h-3.5 w-3.5" />
            Title
          </label>

          <input
            id="expense-title"
            type="text"
            placeholder="What did you spend on?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`${inputBase} ${
              errors.title
                ? 'border-danger/60 focus:border-danger focus:ring-danger/25'
                : ''
            }`}
          />

          {errors.title && (
            <p className="mt-1 text-xs font-medium text-danger animate-fade-in">
              {errors.title}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1 flex items-center gap-1.5 text-xs font-medium text-dark-200">
            <IndianRupee className="h-3.5 w-3.5" />
            Amount (₹)
          </label>

          <input
            id="expense-amount"
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={`${inputBase} ${
              errors.amount
                ? 'border-danger/60 focus:border-danger focus:ring-danger/25'
                : ''
            }`}
          />

          {errors.amount && (
            <p className="mt-1 text-xs font-medium text-danger animate-fade-in">
              {errors.amount}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1 flex items-center gap-1.5 text-xs font-medium text-dark-200">
            <Tag className="h-3.5 w-3.5" />
            Category
          </label>

          <select
            id="expense-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={`${inputBase} cursor-pointer`}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.key} value={cat.key}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 flex items-center gap-1.5 text-xs font-medium text-dark-200">
            <CalendarDays className="h-3.5 w-3.5" />
            Date
          </label>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={`${inputBase} ${
              errors.date
                ? 'border-danger/60 focus:border-danger focus:ring-danger/25'
                : ''
            }`}
          />

          {errors.date && (
            <p className="mt-1 text-xs font-medium text-danger animate-fade-in">
              {errors.date}
            </p>
          )}
        </div>

        <div className="sm:col-span-2">
          <button
            id="expense-submit"
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent-primary px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-accent-primary/25 transition-all duration-200 hover:bg-accent-hover hover:shadow-accent-hover/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
          >
            <PlusCircle className="h-4 w-4" />
            {isSubmitting ? 'Adding…' : 'Add Expense'}
          </button>
        </div>
      </div>
    </form>
  );
}