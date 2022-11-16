import {
  useContractWrite,
  usePrepareContractWrite,
  useNetwork,
  useWaitForTransaction,
} from "wagmi";
import AMMInterface from "../abis/AMM.json";
import { useEffect, useMemo } from "react";
import useTriggerToast from "./useTriggerToast";
import { CurrencyAmount } from "../sdk/entities/fractions/currencyAmount";
import { Currency } from "../sdk/entities/currency";
import { AMM_ADDRESS } from "../sdk/constants";
import { ChainId } from "../sdk";

export default function ({
  amountIn,
  amountOut,
}: {
  amountIn: CurrencyAmount<Currency>;
  amountOut: CurrencyAmount<Currency>;
}): {
  swap: () => void;
} {
  const { chain: currentChain, chains } = useNetwork();
  const { trigger } = useTriggerToast();

  let ammAddress = useMemo(() => {
    if (currentChain?.id === ChainId.ARBITRUM_GOERLI) {
      return AMM_ADDRESS[ChainId.ARBITRUM_GOERLI];
    }
    if (currentChain?.id === ChainId.POLYGON_MUMBAI) {
      return AMM_ADDRESS[ChainId.POLYGON_MUMBAI];
    }
  }, [currentChain]);

  const { config } = usePrepareContractWrite({
    address: ammAddress,
    abi: AMMInterface,
    functionName: "swap",
    args: [amountIn.quotient.toString(), amountOut.quotient.toString()],
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
