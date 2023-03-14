import { BigNumber, ethers } from "ethers";
import { useAccount } from "wagmi";
import {
  ChainId,
  Currency,
  CurrencyAmount,
  DOVE_ADDRESS,
  L1_ROUTER_ADDRESS,
} from "../../../sdk";
import {
  useDoveToken0,
  useDoveToken1,
  useL1RouterQuoteRemoveLiquidity,
  useL1RouterRemoveLiquidity,
  usePrepareL1RouterRemoveLiquidity,
} from "../../../src/generated";
import useBlockTimestamp from "../useBlockTimestamp";

export default function useWithdrawLiquidity(
  amount: CurrencyAmount<Currency> | undefined
): {
  withdraw: () => void;
} {
  const blockTimestamp = useBlockTimestamp();
  const { address } = useAccount();

  const { data: token0Data } = useDoveToken0({
    address: DOVE_ADDRESS[ChainId.ETHEREUM_GOERLI] as `0x${string}`,
  });

  const { data: token1Data } = useDoveToken1({
    address: DOVE_ADDRESS[ChainId.ETHEREUM_GOERLI] as `0x${string}`,
  });

  const { data: quotedData } = useL1RouterQuoteRemoveLiquidity({
    address: DOVE_ADDRESS[ChainId.ETHEREUM_GOERLI] as `0x${string}`,
    args: [
      token0Data ?? "0x",
      token1Data ?? "0x",
      BigNumber.from(amount?.numerator.toString() ?? "0"),
    ],
  });

  const { config } = usePrepareL1RouterRemoveLiquidity({
    address: L1_ROUTER_ADDRESS[ChainId.ETHEREUM_GOERLI] as `0x${string}`,
    args: [
      token0Data ?? "0x",
      token1Data ?? "0x",
      BigNumber.from(amount?.numerator.toString() || "0"),
      quotedData?.amountA ?? BigNumber.from("0"),
      quotedData?.amountB ?? BigNumber.from("0"),
      address ?? "0x",
      ethers.constants.MaxUint256, // TODO: use deadline
    ],
    enabled: !!amount,
  });

  const { write } = useL1RouterRemoveLiquidity(config);

  return {
    withdraw: () => write?.(),
  };
}
