import { CATEGORIES } from '../constants/categories';
import { Filter as FilterIcon } from 'lucide-react';

export default function Filter({ activeFilter, setActiveFilter, categoryCounts }) {
  const totalCount = Object.values(categoryCounts).reduce((s, c) => s + c, 0);

  return (
    <div className="rounded-2xl border border-dark-600/50 bg-dark-800/70 p-4 backdrop-blur-sm">
      <div className="mb-3 flex items-center gap-2">
        <FilterIcon className="h-4 w-4 text-accent-primary" />
        <h3 className="text-sm font-semibold text-dark-100">Filter by Category</h3>
      </div>

      <div className="flex flex-wrap gap-2">
        {/* All pill */}
        <button
          id="filter-all"
          onClick={() => setActiveFilter('all')}
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all duration-200 cursor-pointer ${
            activeFilter === 'all'
              ? 'border-accent-primary/50 bg-accent-primary/15 text-accent-hover shadow-sm shadow-accent-primary/10'
              : 'border-dark-600 bg-dark-700/60 text-dark-200 hover:border-dark-500 hover:bg-dark-600/60'
          }`}
        >
          All
          <span className={`rounded-full px-1.5 py-0.5 text-[10px] leading-none ${
            activeFilter === 'all' ? 'bg-accent-primary/30 text-accent-hover' : 'bg-dark-600 text-dark-300'
          }`}>
            {totalCount}
          </span>
        </button>

        {/* Category pills */}
        {CATEGORIES.map((cat) => {
          const count = categoryCounts[cat.key] || 0;
          const isActive = activeFilter === cat.key;
          const CatIcon = cat.Icon;

          return (
            <button
              id={`filter-${cat.key}`}
              key={cat.key}
              onClick={() => setActiveFilter(cat.key)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all duration-200 cursor-pointer ${
                isActive
                  ? `${cat.borderClass} ${cat.bgClass} ${cat.textClass} shadow-sm`
                  : 'border-dark-600 bg-dark-700/60 text-dark-200 hover:border-dark-500 hover:bg-dark-600/60'
              }`}
            >
              <CatIcon className="h-3 w-3" />
              {cat.label}
              {count > 0 && (
                <span className={`rounded-full px-1.5 py-0.5 text-[10px] leading-none ${
                  isActive ? `${cat.bgClass} ${cat.textClass}` : 'bg-dark-600 text-dark-300'
                }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
