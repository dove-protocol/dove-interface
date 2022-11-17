import { useUserStore } from "../../state/user/useUserStore";
import { ToastContent } from "../types";

export default function useTriggerToast(): {
  callback: (({ description, title, txid, type }: ToastContent) => void) | null;
} {
  const [setOpen, setToastContent] = useUserStore((state) => [
    state.setOpen,
    state.setToastContent,
  ]);

  return {
    callback: ({ description, title, txid, type }: ToastContent) => {
      setToastContent({ description, title, txid, type });
      setOpen(true);
    },
  };
}
