import * as React from 'react';

interface BudgetContextValue {
  budget: number;
  setBudget: (value: number) => void;
}

const BudgetContext = React.createContext<BudgetContextValue | null>(null);

export function BudgetProvider({ children }: { children: React.ReactNode }) {
  const [budget, setBudgetState] = React.useState(250);

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
    return { budget: 250, setBudget: () => {} };
  }
  return ctx;
}
