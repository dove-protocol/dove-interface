import create from "zustand";
import produce from "immer";
import { Currency, CurrencyAmount } from "../../sdk";
import { validateNumber } from "../../lib/utils/validateNumber";

export enum Field {
  CURRENCY_A = "CURRENCY_A",
}

interface WithdrawStoreState {
  amounts: { [field in Field]?: CurrencyAmount<Currency> };
  setAmounts: (amounts: {
    [field in Field]?: CurrencyAmount<Currency>;
  }) => void;
  currencies: { [field in Field]?: Currency };
  setCurrencies: (currencies: {
    [field in Field]?: Currency;
  }) => void;
  fields: { [field in Field]?: string };
  onUserInput: (field: Field, value: string) => void;
  onSwitchTokens: () => void;
}

export const useWithdrawStore = create<WithdrawStoreState>((set, get) => ({
  amounts: {},
  setAmounts: (amounts) => set(() => ({ amounts: amounts })),
  currencies: {},
  setCurrencies: (currencies) => set(() => ({ currencies: currencies })),
  fields: {},
  onUserInput: (field: Field, value: string) => {
    set(
      produce((draft) => {
        if (validateNumber(value)) {
          draft.fields[field] = value;
        }
      })
    );
  },
  onSwitchTokens: () => {},
}));
