import { Currency, CurrencyAmount } from "../../../sdk";
import { useCallback } from "react";
import { useAccount, useContractWrite, usePrepareContractWrite } from "wagmi";
import MintableERC20 from "../../../abis/ERC20.json";
import { SendTransactionResult } from "@wagmi/core";

export default function useMint(
  amountToMint: CurrencyAmount<Currency> | undefined,
  account?: string
): {
  callback: null | (() => Promise<SendTransactionResult>);
} {
  const { address } = useAccount();

  const { config } = usePrepareContractWrite({
    address: amountToMint?.currency.isToken
      ? amountToMint.currency.address
      : undefined,
    abi: MintableERC20,
    functionName: "mint",
    args: [account ?? address, amountToMint?.numerator.toString()],
  });

  const { writeAsync } = useContractWrite(config);

  if (!writeAsync || !amountToMint) return { callback: null };

  return {
    callback: async () => await writeAsync(),
  };
}
