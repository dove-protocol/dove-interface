import { useContractReads, useNetwork } from "wagmi";
import {
  ARBI_AMM_CONTRACT_ADDRESS,
  FUJI_AMM_CONTRACT_ADDRESS,
} from "../lib/contracts";
import AMMInterface from "../abis/AMM.json";
import { BigNumber } from "ethers";

export default function (): {
  reserve0: BigNumber | undefined;
  reserve1: BigNumber | undefined;
} {
  let ammAddress = "";
  const { chain: currentChain, chains } = useNetwork();

  switch (currentChain?.id) {
    case chains?.[1]?.id: {
      ammAddress = ARBI_AMM_CONTRACT_ADDRESS;
      break;
    }
    case chains?.[2]?.id: {
      ammAddress = FUJI_AMM_CONTRACT_ADDRESS;
      break;
    }
  }
  const AMMContract = {
    addressOrName: ammAddress,
    contractInterface: AMMInterface,
  };
  const { data, isError, isLoading } = useContractReads({
    contracts: [
      {
        ...AMMContract,
        functionName: "reserve0",
      },
      {
        ...AMMContract,
        functionName: "reserve1",
      },
    ],
    watch: true,
  });

  return {
    reserve0: data?.[0] as any as BigNumber,
    reserve1: data?.[1] as any as BigNumber,
  };
}
