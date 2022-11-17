import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { ChainId, Currency, CurrencyAmount, DAMM_ADDRESS } from "../../../sdk";
import dAMMContractInterface from "../../../abis/dAMM.json";
import { useCallback } from "react";

export default function useWithdrawLiquidity(
  amount: CurrencyAmount<Currency>
): () => void {
  const { config } = usePrepareContractWrite({
    address: DAMM_ADDRESS[ChainId.ETHEREUM_GOERLI],
    abi: dAMMContractInterface,
    functionName: "provide",
    args: [amount.numerator.toString()],
  });

  const { write } = useContractWrite(config);

  return useCallback(() => {
    if (!amount) return;
    write?.();
  }, [amount]);
}
