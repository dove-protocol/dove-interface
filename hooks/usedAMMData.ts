import { useContractReads, chain, useNetwork } from "wagmi";
import { DAMM_CONTRACT_ADDRESS } from "../lib/contracts";
import DAMMABI from "../abis/dAMM.json";
import { BigNumber } from "ethers";
import Big from "big.js";

export default function (): {
  reserve0: BigNumber | undefined;
  reserve1: BigNumber | undefined;
  totalSupply: BigNumber | undefined;
  marked0: BigNumber | undefined;
  marked1: BigNumber | undefined;
} {
  const { chain: lchain } = useNetwork();
  // to replace with single function contract-side to return all data
  const dAMMContract = {
    address: DAMM_CONTRACT_ADDRESS,
    abi: DAMMABI,
    chainId: chain.goerli.id,
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
      {
        ...dAMMContract,
        functionName: "marked0",
        args: [lchain?.id == chain.arbitrumGoerli.id ? 10143 : 10109],
      },
      {
        ...dAMMContract,
        functionName: "marked1",
        args: [lchain?.id == chain.arbitrumGoerli.id ? 10143 : 10109],
      },
    ],
    watch: true,
  });

  return {
    reserve0: data?.[0] as any as BigNumber,
    reserve1: data?.[1] as any as BigNumber,
    totalSupply: data?.[2] as any as BigNumber,
    marked0: data?.[3] as any as BigNumber,
    marked1: data?.[4] as any as BigNumber,
  };
}
