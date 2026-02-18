import { MovementCategory } from '@domain/finance/models/movement.model';

export type StatType = 'error' | 'warning' | 'success' | 'info';

export interface CategoryDisplay {
  name: string;
  icon: string;
  color: StatType;
}

export const CATEGORY_DISPLAY: Record<MovementCategory, CategoryDisplay> = {
  fixed:    { name: 'Fijos',     icon: '🏠', color: 'error' },
  variable: { name: 'Variables', icon: '🛒', color: 'warning' },
  saving:   { name: 'Ahorro',    icon: '💰', color: 'success' },
  leisure:  { name: 'Ocio',      icon: '🎮', color: 'info' },
};
