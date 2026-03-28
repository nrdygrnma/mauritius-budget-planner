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

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  locale: string;
}

export interface Country {
  name: string;
  code: string;
  flag: string;
  currency: string;
  region: string;
}
