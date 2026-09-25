import { TrendingUp, Wallet } from 'lucide-react';

export default function Summary({ monthlyTotal, overallTotal, categoryBreakdown }) {
  const monthName = new Date().toLocaleString('en-IN', { month: 'long', year: 'numeric' });

  return (
    <div className="rounded-2xl border border-dark-600/50 bg-dark-800/70 p-5 backdrop-blur-sm">
      <div className="mb-5">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-dark-300">
          <Wallet className="h-4 w-4 text-accent-primary" />
          {monthName}
        </div>
        <p className="mt-1 text-3xl font-extrabold tracking-tight text-dark-50">
          ₹{monthlyTotal.toLocaleString('en-IN')}
        </p>
        <p className="mt-0.5 text-xs text-dark-300">
          Total across all time: ₹{overallTotal.toLocaleString('en-IN')}
        </p>
      </div>

      {categoryBreakdown.length > 0 && (
        <div>
          <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-dark-300">
            <TrendingUp className="h-4 w-4 text-accent-primary" />
            Category Breakdown
          </div>
          <div className="space-y-3">
            {categoryBreakdown.map((cat) => (
              <div key={cat.key}>
                <div className="mb-1 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span className="text-sm font-medium text-dark-100">{cat.label}</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-bold tabular-nums text-dark-50">₹{cat.total.toLocaleString('en-IN')}</span>
                    <span className="text-xs tabular-nums text-dark-300">{cat.percentage.toFixed(1)}%</span>
                  </div>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-dark-600/50">
                  <div className="h-full rounded-full transition-all duration-500 ease-out" style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
