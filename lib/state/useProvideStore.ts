import create from "zustand";
import produce from "immer";
import { ToastContent } from "../types";
import { Currency, CurrencyAmount } from "../../sdk";
import { validateNumber } from "../utils";

export enum Field {
  CURRENCY_A = "CURRENCY_A",
  CURRENCY_B = "CURRENCY_B",
}

interface ProvideStoreState {
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
}

export const useProvideStore = create<ProvideStoreState>((set, get) => ({
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
}));
