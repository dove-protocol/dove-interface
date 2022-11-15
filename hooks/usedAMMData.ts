import { useContractReads } from "wagmi";
import { DAMM_CONTRACT_ADDRESS } from "../lib/contracts";
import DAMMABI from "../abis/dAMM.json";
import { BigNumber } from "ethers";

export default function (): {
  reserve0: BigNumber | undefined;
  reserve1: BigNumber | undefined;
  totalSupply: BigNumber | undefined;
} {
  // to replace with single function contract-side to return all data
  const dAMMContract = {
    addressOrName: DAMM_CONTRACT_ADDRESS,
    contractInterface: DAMMABI,
  };
  const { data, isError, isLoading } = useContractReads({
    contracts: [
      {
        ...dAMMContract,
        functionName: "reserve0",
      },
      {
        ...dAMMContract,
        functionName: "reserve1",
      },
      {
        ...dAMMContract,
        functionName: "totalSupply",
      },
    ],
  });

  return {
    reserve0: data?.[0] as any as BigNumber,
    reserve1: data?.[1] as any as BigNumber,
    totalSupply: data?.[2] as any as BigNumber,
  };
}
