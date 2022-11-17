import { Currency, CurrencyAmount } from "../../../sdk";
import { useCallback } from "react";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import MintableERC20 from "../../../abis/ERC20.json";

export default function useMint(
  amountToMint: CurrencyAmount<Currency> | undefined,
  account?: string
): () => void {
  const { config } = usePrepareContractWrite({
    address: amountToMint?.currency.isToken
      ? amountToMint.currency.address
      : undefined,
    abi: MintableERC20,
    functionName: "mint",
    args: [account, amountToMint?.numerator.toString()],
  });

  const { write } = useContractWrite(config);

  return useCallback(() => {
    if (!amountToMint) return;
    if (!account) return;
    write?.();
  }, [amountToMint, account]);
}
