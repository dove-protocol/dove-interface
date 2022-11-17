import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { DAMM_CONTRACT_ADDRESS } from "../lib/contracts";
import dAMMContractInterface from "../abis/dAMM.json";
import { BigNumberish } from "ethers";
import useTriggerToast from "./useTriggerToast";
import { useEffect } from "react";

export default function ({ amount }: { amount: BigNumberish }): {
  withdraw: () => void;
} {
  const { trigger } = useTriggerToast();
  const { config } = usePrepareContractWrite({
    address: DAMM_CONTRACT_ADDRESS,
    abi: dAMMContractInterface,
    functionName: "withdraw",
    args: [amount],
  });

  const { data: withdrawTxData, write } = useContractWrite(config);
  const {
    data: txData,
    isError,
    isLoading,
  } = useWaitForTransaction({
    hash: withdrawTxData?.hash,
  });

  useEffect(() => {
    if (txData && !isError && !isLoading) {
      trigger({
        description: "Liquidity withdrawn",
        title: "Success",
        txid: withdrawTxData?.hash || "",
        type: "success",
      });
    } else if (isError) {
      trigger({
        description: "Transaction failed",
        title: "Error",
        txid: withdrawTxData?.hash || "",
        type: "error",
      });
    }
  }, [txData]);

  function withdrawLiquidity() {
    write?.();
  }

  return {
    withdraw: () => withdrawLiquidity(),
  };
}
