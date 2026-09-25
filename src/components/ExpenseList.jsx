import ExpenseItem from './ExpenseItem';
import { PackageOpen } from 'lucide-react';

export default function ExpenseList({ filteredExpenses }) {
  if (filteredExpenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-dark-500/50 bg-dark-800/40 py-16 animate-fade-in">
        <PackageOpen className="mb-4 h-16 w-16 text-dark-400 opacity-50" />
        <p className="text-lg font-semibold text-dark-200">No expenses found</p>
        <p className="mt-1 text-sm text-dark-300">
          Add your first expense above
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {filteredExpenses.map((exp) => (
        <ExpenseItem key={exp.id} expense={exp} />
      ))}
    </div>
  );
}
