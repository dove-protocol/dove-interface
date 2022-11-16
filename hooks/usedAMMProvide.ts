import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import dAMMContractInterface from "../abis/dAMM.json";
import { BigNumber, BigNumberish } from "ethers";
import useTriggerToast from "./useTriggerToast";
import { useEffect } from "react";
import { DAMM_ADDRESS } from "../sdk/constants";
import { ChainId } from "../sdk";

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
    address: DAMM_ADDRESS[ChainId.ETHEREUM_GOERLI],
    abi: dAMMContractInterface,
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
        description: "Liquidity provided",
        title: "Success",
        txid: provideTxData?.hash || "",
        type: "success",
      });
    } else if (isError) {
      trigger({
        description: "Transaction failed",
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
