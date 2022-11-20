import { Currency, CurrencyAmount } from "../../../sdk";
import { useCallback } from "react";
import { useAccount, useContractWrite, usePrepareContractWrite } from "wagmi";
import { SendTransactionResult } from "@wagmi/core";
import { ERC20 as ERC20Interface } from "../../../abis/ERC20";
import { wrapAddress } from "../../utils/wrapAddress";
import { BigNumber } from "ethers";

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
    abi: ERC20Interface,
    functionName: "mint",
    args: [
      wrapAddress(account ?? address),
      BigNumber.from(amountToMint?.numerator.toString()),
    ],
    enabled: !!amountToMint && (!!address || !!account),
  });

  const { writeAsync } = useContractWrite(config);

  if (!writeAsync || !amountToMint) return { callback: null };

  return {
    callback: async () => await writeAsync(),
  };
}
