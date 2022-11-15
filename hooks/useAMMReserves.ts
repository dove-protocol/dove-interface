import { useContractReads, useNetwork } from "wagmi";
import {
  ARBI_AMM_CONTRACT_ADDRESS,
  FUJI_AMM_CONTRACT_ADDRESS,
} from "../lib/contracts";
import AMMContractInterface from "../abis/AMM.json";

export default function () {
  const { chain: currentChain, chains } = useNetwork();

  let ammAddress = "";
  switch (currentChain?.id) {
    // probably bad to manually encode index
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
    contractInterface: AMMContractInterface,
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
  });

  return {
    reserve0: data?.[0],
    reserve1: data?.[1],
  };
}
