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
    addressOrName: DAMM_CONTRACT_ADDRESS,
    contractInterface: dAMMContractInterface,
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
        description: "You have successfully withdrawn liquidity!",
        title: "Success",
        type: "success",
      });
    } else if (isError) {
      trigger({
        description: "Something went wrong. Please try again.",
        title: "Error",
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
