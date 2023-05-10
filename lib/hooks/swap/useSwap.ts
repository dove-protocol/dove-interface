import { ethers } from "ethers";
import { useMemo } from "react";
import { useAccount, useNetwork } from "wagmi";
import {
  ChainId,
  Currency,
  CurrencyAmount,
  L2_ROUTER_ADDRESS,
  PAIR_ADDRESS,
} from "../../../sdk";
import {
  useL2RouterGetAmountOut,
  useL2RouterSwapExactTokensForTokensSimple,
  usePairToken0,
  usePairToken1,
  usePrepareL2RouterSwapExactTokensForTokensSimple,
} from "../../../src/generated";
import { ApprovalState } from "../useApproval";

export default function useSwap(
  amountIn: CurrencyAmount<Currency> | undefined,
  approvalState: ApprovalState | undefined
): {
  swap: () => void;
} {
  const { chain } = useNetwork();
  const { address } = useAccount();

  const routerAddress = useMemo(() => {
    if (!chain) return;

    if (chain.id === ChainId.ARBITRUM_GOERLI) {
      return L2_ROUTER_ADDRESS[ChainId.ARBITRUM_GOERLI];
    }
    if (chain.id === ChainId.POLYGON_MUMBAI) {
      return L2_ROUTER_ADDRESS[ChainId.POLYGON_MUMBAI];
    }
  }, [chain]);

  // temporary routing
  const pairAddress = useMemo(() => {
    if (!chain) return;

    if (chain.id === ChainId.ARBITRUM_GOERLI) {
      return PAIR_ADDRESS[ChainId.ARBITRUM_GOERLI];
    }

    if (chain.id === ChainId.POLYGON_MUMBAI) {
      return PAIR_ADDRESS[ChainId.POLYGON_MUMBAI];
    }
  }, [chain]);

  const { data: token0Data } = usePairToken0({
    address: pairAddress as `0x${string}`,
    enabled: !!pairAddress,
  });

  const { data: token1Data } = usePairToken1({
    address: pairAddress as `0x${string}`,
    enabled: !!pairAddress,
  });

  const isToken0 =
    amountIn?.currency.isToken && token0Data === amountIn?.currency.address;

  const { data: amountOutData } = useL2RouterGetAmountOut({
    address: routerAddress as `0x${string}`,
    args: [
      BigInt(amountIn?.numerator.toString() ?? 0),
      amountIn?.currency.isToken
        ? (amountIn?.currency.address as `0x${string}`)
        : "0x",
      isToken0 ? token1Data ?? "0x" : token0Data ?? "0x",
    ],
  });

  const { config } = usePrepareL2RouterSwapExactTokensForTokensSimple({
    address: routerAddress as `0x${string}`,
    args: [
      BigInt(amountIn?.numerator.toString() ?? 0),
      BigInt(amountOutData?.toString() ?? 0),
      amountIn?.currency.isToken
        ? (amountIn?.currency.address as `0x${string}`)
        : "0x",
      isToken0 ? token1Data ?? "0x" : token0Data ?? "0x",
      address ?? "0x",
      BigInt(ethers.constants.MaxUint256.toString()), // TODO: use deadline
    ],
    enabled:
      !!amountIn && !!amountOutData && approvalState === ApprovalState.APPROVED,
  });

  const { write } = useL2RouterSwapExactTokensForTokensSimple(config);

  return {
    swap: () => write?.(),
  };
}
