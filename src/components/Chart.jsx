import { useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PieChart as PieIcon, BarChart3 } from 'lucide-react';

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="rounded-lg border border-dark-600 bg-dark-800 px-3 py-2 shadow-xl">
      <p className="text-xs font-semibold text-dark-100">{d.name || d.payload?.label}</p>
      <p className="text-sm font-bold text-dark-50">₹{d.value.toLocaleString('en-IN')}</p>
    </div>
  );
};

export default function Chart({ categoryBreakdown }) {
  const [chartType, setChartType] = useState('pie');

  const data = categoryBreakdown.map((cat) => ({
    name: cat.label,
    value: cat.total,
    color: cat.color,
  }));

  if (data.length === 0) {
    return (
      <div className="rounded-2xl border border-dark-600/50 bg-dark-800/70 p-5 backdrop-blur-sm">
        <p className="text-center text-sm text-dark-300">No data to display</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-dark-600/50 bg-dark-800/70 p-5 backdrop-blur-sm">
      {/* Header + Toggle */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-dark-100">Spending Overview</h3>
        <div className="flex rounded-lg border border-dark-600 bg-dark-700/60 p-0.5">
          <button
            id="chart-toggle-pie"
            onClick={() => setChartType('pie')}
            className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-all duration-200 cursor-pointer ${
              chartType === 'pie' ? 'bg-accent-primary/20 text-accent-hover shadow-sm' : 'text-dark-300 hover:text-dark-100'
            }`}
          >
            <PieIcon className="h-3.5 w-3.5" /> Pie
          </button>
          <button
            id="chart-toggle-bar"
            onClick={() => setChartType('bar')}
            className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-all duration-200 cursor-pointer ${
              chartType === 'bar' ? 'bg-accent-primary/20 text-accent-hover shadow-sm' : 'text-dark-300 hover:text-dark-100'
            }`}
          >
            <BarChart3 className="h-3.5 w-3.5" /> Bar
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[260px] w-full">
        <ResponsiveContainer width="100%" height="100%"> 
          {chartType === 'pie' ? (
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
                animationBegin={0}
                animationDuration={600}
                stroke="none"
              >
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.color} className="outline-none" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                iconType="circle"
                iconSize={8}
                formatter={(val) => <span className="text-xs text-dark-200">{val}</span>}
              />
            </PieChart>
          ) : (
            <BarChart data={data} barSize={32}>
              <XAxis dataKey="name" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v >= 1000 ? `${(v/1000).toFixed(1)}k` : v}`} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99,102,241,0.08)' }} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} animationDuration={600}>
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
