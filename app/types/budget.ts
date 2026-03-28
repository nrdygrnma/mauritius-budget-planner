export interface OptionalExpense {
  enabled: boolean;
  value: number;
  label: string;
  min: number;
  max: number;
  step: number;
  description: string;
}

export interface Milestone {
  label: string;
  amount: number;
  date: Date | null;
  months: number | null;
}
