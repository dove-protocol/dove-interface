import create from "zustand";
import produce from "immer";
import { ToastContent } from "../../lib/types";
import { devtools } from "zustand/middleware";

interface UserStoreState {
  activeTab: string;
  setActiveTab: (activeTab: string) => void;
  isAutoSwitch: boolean;
  setAutoSwitch: (isAutoSwitch: boolean) => void;
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
  allToastContents: ToastContent[];
  toastContent: ToastContent;
  setToastContent: (toastContent: ToastContent) => void;
  showAdvanced: boolean;
  setShowAdvanced: (showAdvanced: boolean) => void;
}

export const useUserStore = create<UserStoreState>(
  devtools(
    (set, get) => ({
      activeTab: "damm",
      setActiveTab: (activeTab) => set(() => ({ activeTab: activeTab })),
      isAutoSwitch: false,
      setAutoSwitch: (isAutoSwitch) =>
        set(() => ({ isAutoSwitch: isAutoSwitch })),
      isOpen: false,
      setOpen: (isOpen) => set(() => ({ isOpen: isOpen })),
      toastContent: {
        title: "",
        description: "",
        type: "success",
      },
      allToastContents: [],
      setToastContent: (toastContent) => {
        set(
          produce((draft: UserStoreState) => {
            draft.toastContent = toastContent;
            draft.allToastContents.push(toastContent);
          })
        );
      },
      showAdvanced: true,
      setShowAdvanced: (showAdvanced) =>
        set(() => ({ showAdvanced: showAdvanced })),
    }),
    {
      name: "userStore",
    }
  )
);
