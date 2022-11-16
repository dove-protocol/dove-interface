import {
  erc20ABI,
  useAccount,
  useContractReads,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { DAMM_CONTRACT_ADDRESS } from "../lib/contracts";
import dAMMContractInterface from "../abis/dAMM.json";
import { getTokenAddress } from "../lib/utils";
import { BigNumber, BigNumberish, ethers } from "ethers";
import useApproveToken from "./useApproveToken";
import useTriggerToast from "./useTriggerToast";
import { useEffect } from "react";

export default function ({
  amount1,
  amount2,
}: {
  amount1: BigNumberish;
  amount2: BigNumberish;
}): {
  provide: () => void;
} {
  const { trigger } = useTriggerToast();
  const { config } = usePrepareContractWrite({
    addressOrName: DAMM_CONTRACT_ADDRESS,
    contractInterface: dAMMContractInterface,
    functionName: "provide",
    args: [
      BigNumber.from(amount1).mul(BigNumber.from(10).pow(6)),
      BigNumber.from(amount2).mul(BigNumber.from(10).pow(6)),
    ],
  });

  const { data: provideTxData, write } = useContractWrite(config);

  const {
    data: txData,
    isError,
    isLoading,
  } = useWaitForTransaction({
    hash: provideTxData?.hash,
  });

  useEffect(() => {
    if (txData && !isError && !isLoading) {
      trigger({
        description: "You have successfully provided liquidity!",
        title: "Success",
        txid: provideTxData?.hash || "",
        type: "success",
      });
    } else if (isError) {
      trigger({
        description: "Something went wrong. Please try again.",
        title: "Error",
        txid: provideTxData?.hash || "",
        type: "error",
      });
    }
  }, [txData]);

  function provideLiquidity() {
    write?.();
  }

  return {
    provide: () => provideLiquidity(),
  };
}
