import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { ChainId, Currency, CurrencyAmount, DAMM_ADDRESS } from "../../../sdk";
import { useMemo } from "react";
import { SendTransactionResult } from "@wagmi/core";
import { ApprovalState } from "../useApproval";
import { dAMM as dAMMContractInterface } from "../../../abis/dAMM";
import { BigNumber } from "ethers";

export default function useProvideLiquidity(
  amount1: CurrencyAmount<Currency> | undefined,
  amount2: CurrencyAmount<Currency> | undefined,
  approvalState1: ApprovalState | undefined,
  approvalState2: ApprovalState | undefined
): { callback: null | (() => Promise<SendTransactionResult>) } {
  const { config } = usePrepareContractWrite({
    address: DAMM_ADDRESS[ChainId.ETHEREUM_GOERLI],
    abi: dAMMContractInterface,
    functionName: "provide",
    args: [
      BigNumber.from(amount1?.numerator.toString() || "0"),
      BigNumber.from(amount2?.numerator.toString() || "0"),
    ],
    enabled:
      !!amount1 &&
      !!amount2 &&
      approvalState1 === ApprovalState.APPROVED &&
      approvalState2 === ApprovalState.APPROVED,
  });

  const { writeAsync } = useContractWrite(config);

  if (!writeAsync || !amount1 || !amount2) return { callback: null };

  return {
    callback: async () => await writeAsync(),
  };
}
