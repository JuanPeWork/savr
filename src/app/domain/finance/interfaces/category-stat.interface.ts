import { StatType } from '@shared/constants/category-display.const';

export type { StatType };

export interface CategoryStat {
    total: number;
    percentage: number;
    name: string;
    icon: string;
    color: StatType;
}
