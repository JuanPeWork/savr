export interface Salary {
  id: string;
  amount: number;
  distribution: {
    fixed: number;
    leisure: number;
    saving: number;
    variable: number;
  };
  date: string;
}
