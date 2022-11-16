import {
  useContractWrite,
  usePrepareContractWrite,
  useNetwork,
  useWaitForTransaction,
} from "wagmi";
import {
  ARBI_AMM_CONTRACT_ADDRESS,
  FUJI_AMM_CONTRACT_ADDRESS,
} from "../lib/contracts";
import AMMInterface from "../abis/AMM.json";
import { useEffect } from "react";
import useTriggerToast from "./useTriggerToast";

export default function ({
  amount0In,
  amount1In,
}: {
  amount0In: string;
  amount1In: string;
}): {
  swap: () => void;
} {
  let ammAddress = "";
  const { chain: currentChain, chains } = useNetwork();
  const { trigger } = useTriggerToast();

  switch (currentChain?.id) {
    case chains?.[1]?.id: {
      ammAddress = ARBI_AMM_CONTRACT_ADDRESS;
      break;
    }
    case chains?.[2]?.id: {
      ammAddress = FUJI_AMM_CONTRACT_ADDRESS;
      break;
    }
  }
  const { config } = usePrepareContractWrite({
    addressOrName: ammAddress,
    contractInterface: AMMInterface,
    functionName: "swap",
    args: [amount0In, amount1In],
  });
  const { data: swapTxData, write } = useContractWrite(config);

  const {
    data: txData,
    isError,
    isLoading,
  } = useWaitForTransaction({
    hash: swapTxData?.hash,
  });

  useEffect(() => {
    if (txData && !isError && !isLoading) {
      trigger({
        description: "Swap successful",
        title: "Success",
        txid: swapTxData?.hash || "",
        type: "success",
      });
    } else if (isError) {
      trigger({
        description: "Transaction failed",
        title: "Error",
        txid: swapTxData?.hash || "",
        type: "error",
      });
    }
  }, [txData]);

  function swapTokens() {
    write?.();
  }

  return {
    swap: () => swapTokens(),
  };
}
