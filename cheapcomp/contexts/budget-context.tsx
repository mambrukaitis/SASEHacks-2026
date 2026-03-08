import * as React from 'react';

import { getBudget } from '@/services/api';

interface BudgetContextValue {
  budget: number;
  setBudget: (value: number) => void;
}

const BudgetContext = React.createContext<BudgetContextValue | null>(null);

const DEFAULT_BUDGET = 250;

export function BudgetProvider({ children }: { children: React.ReactNode }) {
  const [budget, setBudgetState] = React.useState(DEFAULT_BUDGET);

  React.useEffect(() => {
    getBudget().then((b) => {
      if (b != null && typeof b === 'number') setBudgetState(b);
    });
  }, []);

  const setBudget = React.useCallback((value: number) => {
    setBudgetState(Math.max(0, value));
  }, []);

  const value = React.useMemo(
    () => ({ budget, setBudget }),
    [budget, setBudget]
  );

  return <BudgetContext.Provider value={value}>{children}</BudgetContext.Provider>;
}

export function useBudget() {
  const ctx = React.useContext(BudgetContext);
  if (!ctx) {
    return { budget: DEFAULT_BUDGET, setBudget: () => {} };
  }
  return ctx;
}
