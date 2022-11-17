import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { ChainId, Currency, CurrencyAmount, DAMM_ADDRESS } from "../../../sdk";
import dAMMContractInterface from "../../../abis/dAMM.json";
import { useCallback } from "react";

export default function useWithdrawLiquidity(
  amount: CurrencyAmount<Currency> | undefined
): {
  callback: null | (() => void);
} {
  const { config } = usePrepareContractWrite({
    address: DAMM_ADDRESS[ChainId.ETHEREUM_GOERLI],
    abi: dAMMContractInterface,
    functionName: "withdraw",
    args: [amount?.numerator.toString()],
  });

  const { write } = useContractWrite(config);

  if (!write || !amount) return { callback: null };

  return {
    callback: () => write(),
  };
}
