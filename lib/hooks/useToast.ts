import { getPublicClient } from "@wagmi/core";
import { useEffect } from "react";
import { toast } from "sonner";

export default function useToast(
  hash: `0x${string}` | undefined,
  loadingMessage: string,
  successMessage: string,
  errorMessage: string
) {
  useEffect(() => {
    if (!!hash) {
      const tx = getPublicClient().waitForTransactionReceipt({
        hash: hash ?? "0x",
      });

      toast.promise(tx, {
        loading: loadingMessage,
        success: successMessage,
        error: (error) => `${errorMessage}: ${error.message}`,
      });
    }
  }, [hash]);
}
