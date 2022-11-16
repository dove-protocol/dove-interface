import { useMemo } from "react";
import { useContractReads, useNetwork } from "wagmi";
import AMMInterface from "../abis/AMM.json";
import { BigNumber } from "ethers";
import { ChainId } from "../sdk";
import { AMM_ADDRESS } from "../sdk/constants";

export default function (): {
  reserve0: BigNumber | undefined;
  reserve1: BigNumber | undefined;
} {
  const { chain: currentChain, chains } = useNetwork();

  let ammAddress = useMemo(() => {
    if (currentChain?.id === ChainId.ARBITRUM_GOERLI) {
      return AMM_ADDRESS[ChainId.ARBITRUM_GOERLI];
    }
    if (currentChain?.id === ChainId.POLYGON_MUMBAI) {
      return AMM_ADDRESS[ChainId.POLYGON_MUMBAI];
    }
  }, [currentChain]);

  const AMMContract = {
    address: ammAddress,
    abi: AMMInterface,
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
