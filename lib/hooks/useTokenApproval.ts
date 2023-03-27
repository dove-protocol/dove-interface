import { useMemo } from "react";
import { useNetwork } from "wagmi";
import {
  ChainId,
  Currency,
  CurrencyAmount,
  L1_ROUTER_ADDRESS,
  L2_ROUTER_ADDRESS,
} from "../../sdk";
import useApproval, { ApprovalState } from "./useApproval";

// wraps useApproveCallback in the context of a swap
export default function useTokenApproval(
  currencyAmount: CurrencyAmount<Currency> | undefined
): {
  approve: () => void;
  state: ApprovalState;
} {
  const { chain } = useNetwork();

  const spender = useMemo(() => {
    if (!chain) return;
    if (chain.id === ChainId.ETHEREUM_GOERLI) {
      return L1_ROUTER_ADDRESS[ChainId.ETHEREUM_GOERLI];
    }
    if (chain.id === ChainId.POLYGON_MUMBAI) {
      return L2_ROUTER_ADDRESS[ChainId.POLYGON_MUMBAI];
    }
    if (chain.id === ChainId.ARBITRUM_GOERLI) {
      return L2_ROUTER_ADDRESS[ChainId.ARBITRUM_GOERLI];
    }
  }, [chain]);

  return {
    ...useApproval(currencyAmount, spender),
  };
}
