import { BigNumber, BigNumberish, ethers } from "ethers";
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
  });

  const { config: approvalConfig } = usePrepareContractWrite({
    ...tokenContract,
    functionName: "approve",
    args: [spender, amount],
  });

  const { write: approve } = useContractWrite(approvalConfig);

  function approveToken() {
    approve?.();
  }

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
