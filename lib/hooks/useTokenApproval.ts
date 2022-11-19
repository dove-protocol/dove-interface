import { useMemo } from "react";
import { useNetwork } from "wagmi";
import {
  AMM_ADDRESS,
  ChainId,
  Currency,
  CurrencyAmount,
  DAMM_ADDRESS,
  MaxUint256,
} from "../../sdk";
import useApproval, { ApprovalState } from "./useApproval";
import { SendTransactionResult } from "@wagmi/core";

// wraps useApproveCallback in the context of a swap
export default function useTokenApproval(
  currencyAmount: CurrencyAmount<Currency> | undefined
): {
  callback: null | (() => Promise<SendTransactionResult>);
  state: ApprovalState;
} {
  const { chain } = useNetwork();

  const spender = useMemo(() => {
    if (!chain) return;
    if (chain.id === ChainId.ETHEREUM_GOERLI) {
      return DAMM_ADDRESS[ChainId.ETHEREUM_GOERLI];
    }
    if (chain.id === ChainId.POLYGON_MUMBAI) {
      return AMM_ADDRESS[ChainId.POLYGON_MUMBAI];
    }
    if (chain.id === ChainId.ARBITRUM_GOERLI) {
      return AMM_ADDRESS[ChainId.ARBITRUM_GOERLI];
    }
  }, [chain]);

  return {
    ...useApproval(currencyAmount, spender),
  };
}
