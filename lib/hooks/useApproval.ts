import { BigNumber, BigNumberish, ethers } from "ethers";
import { useEffect, useMemo, useCallback } from "react";
import {
  erc20ABI,
  useAccount,
  useContractRead,
  useContractReads,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { Currency, CurrencyAmount } from "../../sdk";
import useTriggerToast from "./useTriggerToast";
import { MaxUint256 } from "@ethersproject/constants";

export enum ApprovalState {
  UNKNOWN = "UNKNOWN",
  NOT_APPROVED = "NOT_APPROVED",
  PENDING = "PENDING",
  APPROVED = "APPROVED",
}

export default function useApproval(
  amountToApprove: CurrencyAmount<Currency> | undefined,
  spender: string | undefined
): [() => void, ApprovalState] {
  const { trigger } = useTriggerToast();

  const tokenContract = {
    address: amountToApprove?.currency?.isToken
      ? amountToApprove.currency.address
      : undefined,
    abi: erc20ABI,
  };

  const approvalState = useApprovalStateForSpender(spender, amountToApprove);

  const { config: approvalConfig } = usePrepareContractWrite({
    ...tokenContract,
    functionName: "approve",
    args: [spender as `0x${string}`, MaxUint256],
  });

  const {
    data: approveTxData,
    write: approve,
    isSuccess,
  } = useContractWrite(approvalConfig);

  const approveCallback = useCallback(() => {
    approve?.();
  }, [approve]);

  return [approveCallback, approvalState];
}

function useApprovalStateForSpender(
  spender: string | undefined,
  amountToApprove: CurrencyAmount<Currency> | undefined
): ApprovalState {
  const { address } = useAccount();

  const tokenContract = {
    address: amountToApprove?.currency?.isToken
      ? amountToApprove.currency.address
      : "",
    abi: erc20ABI,
  };

  const { data: currentAllowance } = useContractRead({
    ...tokenContract,
    functionName: "allowance",
    args: [address!, spender as `0x${string}`],
    watch: true,
  });

  return useMemo(() => {
    if (!amountToApprove) return ApprovalState.UNKNOWN;
    if (amountToApprove.currency.isNative) return ApprovalState.APPROVED;
    if (!currentAllowance) return ApprovalState.UNKNOWN;

    return currentAllowance.lt(
      BigNumber.from(amountToApprove.numerator.toString())
    )
      ? ApprovalState.NOT_APPROVED
      : ApprovalState.APPROVED;
  }, [amountToApprove, currentAllowance]);
}
