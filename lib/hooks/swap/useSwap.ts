import { useContractWrite, useNetwork, usePrepareContractWrite } from "wagmi";
import { AMM_ADDRESS, ChainId, Currency, CurrencyAmount } from "../../../sdk";
import { useMemo, useCallback } from "react";
import { SendTransactionResult } from "@wagmi/core";
import { ApprovalState } from "../useApproval";
import { AMM as AMMContractInterface } from "../../../abis/AMM";
import { BigNumber } from "ethers";

export default function useSwap(
  amountIn: CurrencyAmount<Currency> | undefined,
  approvalState: ApprovalState | undefined
): {
  callback: null | (() => Promise<SendTransactionResult>);
} {
  const { chain } = useNetwork();

  const ammAddress = useMemo(() => {
    if (!chain) return;

    if (chain.id === ChainId.ARBITRUM_GOERLI) {
      return AMM_ADDRESS[ChainId.ARBITRUM_GOERLI];
    }
    if (chain.id === ChainId.POLYGON_MUMBAI) {
      return AMM_ADDRESS[ChainId.POLYGON_MUMBAI];
    }
  }, [chain]);

  const AMMContract = {
    address: ammAddress,
    abi: AMMContractInterface,
  };

  // temporary routing
  const isToken0 = amountIn?.currency.symbol === "USDC" ? true : false;

  const { config } = usePrepareContractWrite({
    ...AMMContract,
    functionName: "swap",
    args: isToken0
      ? [BigNumber.from(amountIn?.numerator.toString() || 0), BigNumber.from(0)]
      : [
          BigNumber.from(0),
          BigNumber.from(amountIn?.numerator.toString() || 0),
        ],
    enabled: !!amountIn && approvalState === ApprovalState.APPROVED,
  });

  const { writeAsync } = useContractWrite(config);

  if (!writeAsync || !amountIn) return { callback: null };
  return {
    callback: async () => await writeAsync(),
  };
}
