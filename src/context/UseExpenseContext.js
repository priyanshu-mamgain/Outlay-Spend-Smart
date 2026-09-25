import { useContext } from 'react';
import { ExpenseContext } from './ExpenseContextValue';

export function useExpenseContext() {
  const context = useContext(ExpenseContext);

  if (!context) {
    throw new Error(
      'useExpenseContext must be used within ExpenseProvider'
    );
  }

  return context;
}