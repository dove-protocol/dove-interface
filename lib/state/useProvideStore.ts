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
  input: string;
  onUserInput: (field: Field, value: string) => void;
}

export const useProvideStore = create<ProvideStoreState>((set, get) => ({
  currencies: {},
  input: "",
  onUserInput: (field: Field, value: string) => {
    set(() => ({ input: value }));
  },
}));
