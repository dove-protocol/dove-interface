import create from "zustand";
import produce from "immer";
import { ToastContent } from "../types";
import { Currency } from "../../sdk";

export enum Field {
  CURRENCY_A = "CURRENCY_A",
  CURRENCY_B = "CURRENCY_B",
}

interface ProvideStoreState {
  currencies: { [field in Field]?: Currency | undefined };
  setCurrencies: (currencies: {
    [field in Field]?: Currency | undefined;
  }) => void;
  fields: { [field in Field]?: string };
  onUserInput: (field: Field, value: string) => void;
}

export const useProvideStore = create<ProvideStoreState>((set, get) => ({
  currencies: {
    [Field.CURRENCY_A]: undefined,
    [Field.CURRENCY_B]: undefined,
  },
  setCurrencies: (currencies) => set(() => ({ currencies: currencies })),
  fields: {
    [Field.CURRENCY_A]: "",
    [Field.CURRENCY_B]: "",
  },
  onUserInput: (field: Field, value: string) => {
    set(
      produce((draft) => {
        draft.fields[field] = value;
      })
    );
  },
}));
