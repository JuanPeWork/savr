export type StatType = 'error' | 'warning' | 'success' | 'info'

export interface CategoryStat {
    total: number;
    percentage: number;
    name: string;
    icon: string;
    color: StatType;
}
