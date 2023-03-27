import { BigNumber } from "ethers";
import { useAccount } from "wagmi";
import { Currency, CurrencyAmount } from "../../../sdk";
import {
  useErc20MockMint,
  usePrepareErc20MockMint,
} from "../../../src/generated";
import { wrapAddress } from "../../utils/wrapAddress";

export default function useMint(
  amountToMint: CurrencyAmount<Currency> | undefined,
  account?: string
): {
  mint: () => void;
} {
  const { address } = useAccount();

  const { config } = usePrepareErc20MockMint({
    address: amountToMint?.currency.isToken
      ? amountToMint.currency.address as `0x${string}`
      : undefined,
    args: [
      wrapAddress(account ?? address),
      BigNumber.from(amountToMint?.numerator.toString() || "0"),
    ],
    enabled: !!amountToMint && (!!address || !!account),
  });

  const { write } = useErc20MockMint(config);

  return {
    mint: () => write?.(),
  };
}
