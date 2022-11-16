import create from "zustand";
import produce from "immer";
import { ToastContent } from "./types";

interface StoreState {
  isAutoSwitch: boolean;
  setAutoSwitch: (isAutoSwitch: boolean) => void;
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
  toastContent: ToastContent;
  setToastContent: (toastContent: ToastContent) => void;
}

export const useStore = create<StoreState>((set, get) => ({
  isAutoSwitch: false,
  setAutoSwitch: (isAutoSwitch) =>
    set((state) => ({ isAutoSwitch: isAutoSwitch })),
  isOpen: false,
  setOpen: (isOpen) => set((state) => ({ isOpen: isOpen })),
  toastContent: {
    title: "",
    description: "",
    type: "success",
  },
  setToastContent: (toastContent) =>
    set((state) => ({ toastContent: toastContent })),
}));
