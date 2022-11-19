import create from "zustand";
import produce from "immer";
import { ToastContent } from "../../lib/types";

interface UserStoreState {
  activeTab: string;
  setActiveTab: (activeTab: string) => void;
  isAutoSwitch: boolean;
  setAutoSwitch: (isAutoSwitch: boolean) => void;
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
  toastContent: ToastContent;
  setToastContent: (toastContent: ToastContent) => void;
  showAdvanced: boolean;
  setShowAdvanced: (showAdvanced: boolean) => void;
}

export const useUserStore = create<UserStoreState>((set, get) => ({
  activeTab: "damm",
  setActiveTab: (activeTab) => set(() => ({ activeTab: activeTab })),
  isAutoSwitch: false,
  setAutoSwitch: (isAutoSwitch) => set(() => ({ isAutoSwitch: isAutoSwitch })),
  isOpen: false,
  setOpen: (isOpen) => set(() => ({ isOpen: isOpen })),
  toastContent: {
    title: "",
    description: "",
    type: "success",
  },
  setToastContent: (toastContent: ToastContent) =>
    set(() => ({ toastContent: toastContent })),
  showAdvanced: true,
  setShowAdvanced: (showAdvanced) =>
    set(() => ({ showAdvanced: showAdvanced })),
}));
