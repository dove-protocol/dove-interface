import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { ChainId, Currency, CurrencyAmount, DAMM_ADDRESS } from "../../../sdk";
import dAMMContractInterface from "../../../abis/dAMM.json";
import { useMemo } from "react";
import { SendTransactionResult } from "@wagmi/core";

export default function useProvideLiquidity(
  amount1: CurrencyAmount<Currency> | undefined,
  amount2: CurrencyAmount<Currency> | undefined
): { callback: null | (() => Promise<SendTransactionResult>) } {
  const { config } = usePrepareContractWrite({
    address: DAMM_ADDRESS[ChainId.ETHEREUM_GOERLI],
    abi: dAMMContractInterface,
    functionName: "provide",
    args: [amount1?.numerator.toString(), amount2?.numerator.toString()],
    enabled: !!amount1 && !!amount2,
  });

  const { writeAsync } = useContractWrite(config);

  if (!writeAsync || !amount1 || !amount2) return { callback: null };

  return {
    callback: async () => await writeAsync(),
  };
}
