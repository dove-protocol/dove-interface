import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { ChainId, Currency, CurrencyAmount, DAMM_ADDRESS } from "../../../sdk";
import { useCallback } from "react";
import { SendTransactionResult } from "@wagmi/core";
import { dAMM as dAMMContractInterface } from "../../../abis/dAMM";
import { BigNumber } from "ethers";

export default function useWithdrawLiquidity(
  amount: CurrencyAmount<Currency> | undefined
): {
  callback: null | (() => Promise<SendTransactionResult>);
} {
  const { config } = usePrepareContractWrite({
    address: DAMM_ADDRESS[ChainId.ETHEREUM_GOERLI],
    abi: dAMMContractInterface,
    functionName: "withdraw",
    args: [BigNumber.from(amount?.numerator.toString())],
    enabled: !!amount,
  });

  const { writeAsync } = useContractWrite(config);

  if (!writeAsync || !amount) return { callback: null };

  return {
    callback: async () => await writeAsync(),
  };
}
