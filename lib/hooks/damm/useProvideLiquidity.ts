import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { ChainId, Currency, CurrencyAmount, DAMM_ADDRESS } from "../../../sdk";
import dAMMContractInterface from "../../../abis/dAMM.json";
import { useCallback } from "react";

export default function useProvideLiquidity(
  amount1: CurrencyAmount<Currency>,
  amount2: CurrencyAmount<Currency>
): () => void {
  const { config } = usePrepareContractWrite({
    address: DAMM_ADDRESS[ChainId.ETHEREUM_GOERLI],
    abi: dAMMContractInterface,
    functionName: "provide",
    args: [amount1.numerator.toString(), amount2.numerator.toString()],
  });

  const { write } = useContractWrite(config);

  return useCallback(() => {
    if (!amount1) return;
    if (!amount2) return;
    write?.();
  }, [amount1, amount2]);
}
