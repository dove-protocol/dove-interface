import create from "zustand";
import produce from "immer";

interface StoreState {
  isAutoSwitch: boolean;
  setAutoSwitch: (isAutoSwitch: boolean) => void;
}

export const useStore = create<StoreState>((set, get) => ({
  isAutoSwitch: false,
  setAutoSwitch: (isAutoSwitch) =>
    set((state) => ({ isAutoSwitch: isAutoSwitch })),
}));
