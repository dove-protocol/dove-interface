import { useContractWrite, useNetwork, usePrepareContractWrite } from "wagmi";
import {
  ARBI_AMM_CONTRACT_ADDRESS,
  DAMM_CONTRACT_ADDRESS,
  POLYGON_AMM_CONTRACT_ADDRESS,
} from "../lib/contracts";
import dAMMContractInterface from "../abis/dAMM.json";
import { BigNumberish, ethers } from "ethers";

export default function ({ chainId }: { chainId: BigNumberish }): {
  sync: () => void;
} {
  const { chain: currentChain, chains } = useNetwork();

  let ammAddress = "";
  let layerZeroChainId = 0;
  switch (chainId) {
    // probably bad to manually encode index
    case chains?.[1]?.id: {
      ammAddress = ARBI_AMM_CONTRACT_ADDRESS;
      layerZeroChainId = 10143;
      break;
    }
    case chains?.[2]?.id: {
      ammAddress = POLYGON_AMM_CONTRACT_ADDRESS;
      layerZeroChainId = 10109;
      break;
    }
  }

  const { config } = usePrepareContractWrite({
    address: DAMM_CONTRACT_ADDRESS,
    abi: dAMMContractInterface,
    functionName: "syncL2",
    args: [layerZeroChainId, ammAddress],
    overrides: {
      value: ethers.utils.parseEther("0.1"),
    },
  });

  const { write } = useContractWrite(config);

  function syncL2() {
    write?.();
  }

  return {
    sync: () => syncL2(),
  };
}