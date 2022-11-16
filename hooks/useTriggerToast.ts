import { useStore } from "../lib/store";
import { ToastContent } from "../lib/types";

export default function (): {
  trigger: ({ description, title, type }: ToastContent) => void;
} {
  const { isOpen, setOpen, setToastContent } = useStore();

  return {
    trigger: function triggerToast({ description, title, type }: ToastContent) {
      setOpen(true);
      setToastContent({ description, title, type });
    },
  };
}
