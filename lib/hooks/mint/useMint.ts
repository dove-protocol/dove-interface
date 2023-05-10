import { useAccount } from "wagmi";
import { Currency, CurrencyAmount } from "../../../sdk";
import {
  useErc20MockMint,
  usePrepareErc20MockMint,
} from "../../../src/generated";
import { wrapAddress } from "../../utils/wrapAddress";
import useToast from "../useToast";

export default function useMint(
  amountToMint: CurrencyAmount<Currency> | undefined,
  account?: string
): {
  mint: () => void;
} {
  const { address } = useAccount();

  const { config } = usePrepareErc20MockMint({
    address: amountToMint?.currency.isToken
      ? (amountToMint.currency.address as `0x${string}`)
      : undefined,
    args: [
      wrapAddress(account ?? address),
      BigInt(amountToMint?.numerator.toString() || "0"),
    ],
    enabled: !!amountToMint && (!!address || !!account),
  });

  const { write, data } = useErc20MockMint(config);

  useToast(data?.hash, "Minting...", "Minted!", "Failed to mint");

  return {
    mint: () => write?.(),
  };
}
