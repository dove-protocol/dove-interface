import { BigNumber, BigNumberish, ethers } from "ethers";
import { useEffect } from "react";
import {
  erc20ABI,
  useAccount,
  useContractReads,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { DAMM_CONTRACT_ADDRESS } from "../lib/contracts";
import { useStore } from "../lib/store";
import { getTokenAddress } from "../lib/utils";
import useTriggerToast from "./useTriggerToast";

export default function useApproveToken({
  token,
  spender,
  amount = ethers.constants.MaxUint256,
  amountRequested,
}: {
  token: string;
  spender: string;
  amount?: BigNumberish;
  amountRequested: BigNumberish;
}): {
  approve: () => void;
  isApproved: boolean;
} {
  const { address } = useAccount();
  const { trigger } = useTriggerToast();

  const tokenContract = {
    addressOrName: token,
    contractInterface: erc20ABI,
  };

  const { data, isError, isLoading } = useContractReads({
    contracts: [
      {
        ...tokenContract,
        functionName: "allowance",
        args: [address, spender],
      },
    ],
    watch: true,
  });

  const { config: approvalConfig } = usePrepareContractWrite({
    ...tokenContract,
    functionName: "approve",
    args: [spender, amount],
  });

  const {
    data: approveTxData,
    write: approve,
    isSuccess,
  } = useContractWrite(approvalConfig);

  const { data: txData } = useWaitForTransaction({
    hash: approveTxData?.hash,
  });

  useEffect(() => {
    if (txData && !isError && !isLoading) {
      trigger({
        description: `Approved ${amountRequested}`,
        title: "Success",
        type: "success",
      });
    } else if (isError) {
      trigger({
        description: `Failed to approve ${amountRequested}`,
        title: "Error",
        type: "error",
      });
    }
  }, [txData]);

  function approveToken() {
    approve?.();
  }

  console.log(data);

  return {
    approve: () => approveToken(),
    isApproved:
      amountRequested && data?.[0]
        ? (data?.[0] as any as BigNumber).gte(
            BigNumber.from(amountRequested).mul(BigNumber.from(10).pow(6))
          )
        : false,
  };
}
