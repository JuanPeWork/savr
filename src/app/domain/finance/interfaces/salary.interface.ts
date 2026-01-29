export interface Salary {
  id: string;
  amount: number;
  distribution: {
    fixed: number;
    leisure: number;
    savings: number;
    variable: number;
  };
  date: string;
}
