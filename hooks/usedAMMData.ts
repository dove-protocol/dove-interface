import { useContractReads } from "wagmi";
import { DAMM_CONTRACT_ADDRESS } from "../lib/contracts";
import DAMMABI from "../abis/dAMM.json";

export default function () {
  // to replace with single function contract-side to return all data
  console.log("here");
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
    reserve0: data?.[0],
    reserve1: data?.[1],
    totalSupply: data?.[2],
  };
}
