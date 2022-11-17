import create from "zustand";
import produce from "immer";
import { ToastContent } from "../types";
import { Currency } from "../../sdk";

export enum Field {
  INDEPENDENT = "INDEPENDENT",
  DEPENDENT = "DEPENDENT",
}

interface ProvideStoreState {
  currencies: { [field in Field]?: Currency | undefined };
  setCurrencies: (currencies: {
    [field in Field]?: Currency | undefined;
  }) => void;
  input: string;
  onUserInput: (field: Field, value: string) => void;
}

export const useProvideStore = create<ProvideStoreState>((set, get) => ({
  currencies: {
    [Field.INDEPENDENT]: undefined,
    [Field.DEPENDENT]: undefined,
  },
  setCurrencies: (currencies) => set(() => ({ currencies: currencies })),
  input: "",
  onUserInput: (field: Field, value: string) => {
    set(() => ({ input: value }));
  },
}));
