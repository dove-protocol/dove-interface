import { useMemo } from "react";
import { useNetwork } from "wagmi";
import { ChainId, Currency, CurrencyAmount } from "../../../sdk";
import { DAMM_ADDRESS } from "../../../sdk/constants";
import { MaxUint256 } from "@ethersproject/constants";
import useApproval from "../useApproval";

export { ApprovalState } from "../useApproval";

// wraps useApproveCallback in the context of a swap
export default function useSwapApproval(
  amountIn: CurrencyAmount<Currency>,
  amountOut: CurrencyAmount<Currency>
) {
  const { chain } = useNetwork();

  const amountToApprove = useMemo(
    () => (amountIn.currency.isToken ? amountIn : undefined),
    [amountIn]
  );
  const spender = chain?.id ? DAMM_ADDRESS[ChainId.ETHEREUM_GOERLI] : undefined;

  return useApproval(amountToApprove, spender);
}
