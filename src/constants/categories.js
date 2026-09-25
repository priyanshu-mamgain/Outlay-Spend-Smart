import {
  UtensilsCrossed,
  Car,
  Film,
  ShoppingBag,
  Zap,
  HeartPulse,
  GraduationCap,
  MoreHorizontal,
} from 'lucide-react';

/**
 * Single source of truth for category definitions.
 * Each category has a unique key, display label, hex color, Tailwind classes, and icon.
 */
export const CATEGORIES = [
  {
    key: 'food',
    label: 'Food',
    color: '#f97316',       // orange-500
    bgClass: 'bg-orange-500/15',
    textClass: 'text-orange-400',
    borderClass: 'border-orange-500/30',
    Icon: UtensilsCrossed,
  },
  {
    key: 'transport',
    label: 'Transport',
    color: '#3b82f6',       // blue-500
    bgClass: 'bg-blue-500/15',
    textClass: 'text-blue-400',
    borderClass: 'border-blue-500/30',
    Icon: Car,
  },
  {
    key: 'entertainment',
    label: 'Entertainment',
    color: '#a855f7',       // purple-500
    bgClass: 'bg-purple-500/15',
    textClass: 'text-purple-400',
    borderClass: 'border-purple-500/30',
    Icon: Film,
  },
  {
    key: 'shopping',
    label: 'Shopping',
    color: '#ec4899',       // pink-500
    bgClass: 'bg-pink-500/15',
    textClass: 'text-pink-400',
    borderClass: 'border-pink-500/30',
    Icon: ShoppingBag,
  },
  {
    key: 'utilities',
    label: 'Utilities',
    color: '#eab308',       // yellow-500
    bgClass: 'bg-yellow-500/15',
    textClass: 'text-yellow-400',
    borderClass: 'border-yellow-500/30',
    Icon: Zap,
  },
  {
    key: 'health',
    label: 'Health',
    color: '#10b981',       // emerald-500
    bgClass: 'bg-emerald-500/15',
    textClass: 'text-emerald-400',
    borderClass: 'border-emerald-500/30',
    Icon: HeartPulse,
  },
  {
    key: 'education',
    label: 'Education',
    color: '#06b6d4',       // cyan-500
    bgClass: 'bg-cyan-500/15',
    textClass: 'text-cyan-400',
    borderClass: 'border-cyan-500/30',
    Icon: GraduationCap,
  },
  {
    key: 'other',
    label: 'Other',
    color: '#6b7280',       // gray-500
    bgClass: 'bg-gray-500/15',
    textClass: 'text-gray-400',
    borderClass: 'border-gray-500/30',
    Icon: MoreHorizontal,
  },
];

/** Quick lookup map: key -> category object */
export const CATEGORY_MAP = Object.fromEntries(
  CATEGORIES.map((cat) => [cat.key, cat])
);

/** Just the keys for validation / dropdown options */
export const CATEGORY_KEYS = CATEGORIES.map((cat) => cat.key);
