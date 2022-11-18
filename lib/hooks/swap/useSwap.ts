import { useContractWrite, useNetwork, usePrepareContractWrite } from "wagmi";
import { AMM_ADDRESS, ChainId, Currency, CurrencyAmount } from "../../../sdk";
import AMMContractInterface from "../../../abis/AMM.json";
import { useMemo, useCallback } from "react";
import { SendTransactionResult } from "@wagmi/core";

export default function useSwap(
  amountIn: CurrencyAmount<Currency> | undefined,
  amountOut: CurrencyAmount<Currency> | undefined
): {
  callback: null | (() => Promise<SendTransactionResult>);
} {
  const { chain } = useNetwork();

  const ammAddress = useMemo(() => {
    if (!chain) return;

    if (chain.id === ChainId.ARBITRUM_GOERLI) {
      return AMM_ADDRESS[ChainId.ARBITRUM_GOERLI];
    }
    if (chain.id === ChainId.POLYGON_MUMBAI) {
      return AMM_ADDRESS[ChainId.POLYGON_MUMBAI];
    }
  }, [chain]);

  const AMMContract = {
    address: ammAddress,
    abi: AMMContractInterface,
  };

  const { config } = usePrepareContractWrite({
    ...AMMContract,
    functionName: "swap",
    args: [amountIn?.quotient.toString(), amountOut?.quotient.toString()],
    enabled: !!amountIn && !!amountOut,
  });

  const { writeAsync } = useContractWrite(config);

  if (!writeAsync || !amountIn || !amountOut) return { callback: null };
  return {
    callback: async () => await writeAsync(),
  };
}
