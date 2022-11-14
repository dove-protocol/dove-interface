import { BigNumber, ethers } from "ethers";
import {
  erc20ABI,
  useAccount,
  useContractReads,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import { DAMM_CONTRACT_ADDRESS } from "../lib/contracts";
import { getTokenAddress } from "../lib/utils";

export default function ({
  tokenAddress,
  amountRequested,
}: {
  tokenAddress: string;
  amountRequested: string;
}): {
  approve: () => void;
} {
  const { address } = useAccount();

  const tokenContract = {
    addressOrName: tokenAddress,
    contractInterface: erc20ABI,
  };

  const { data, isError, isLoading } = useContractReads({
    contracts: [
      {
        ...tokenContract,
        functionName: "allowance",
        args: [address, DAMM_CONTRACT_ADDRESS],
      },
    ],
  });

  const { config: approvalConfig } = usePrepareContractWrite({
    ...tokenContract,
    functionName: "approve",
    args: [DAMM_CONTRACT_ADDRESS, ethers.constants.MaxUint256],
  });

  const { write: approve } = useContractWrite(approvalConfig);

  function approveToken() {
    if (data && data[0] && amountRequested) {
      if ((data[0] as any as BigNumber) < BigNumber.from(amountRequested)) {
        approve?.();
      }
    }
  }

  return {
    approve: () => approveToken(),
  };
}
