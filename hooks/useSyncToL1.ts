import { useContractWrite, useNetwork, usePrepareContractWrite } from "wagmi";
import {
  ARBI_AMM_CONTRACT_ADDRESS,
  DAMM_CONTRACT_ADDRESS,
  FUJI_AMM_CONTRACT_ADDRESS,
} from "../lib/contracts";
import AMMContractInterface from "../abis/AMM.json";
import { ethers } from "ethers";

export default function (): {
  sync: () => void;
} {
  const { chain: currentChain, chains } = useNetwork();

  let ammAddress = "";
  let dstChainId = 10121;
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

  const { config } = usePrepareContractWrite({
    addressOrName: ammAddress,
    contractInterface: AMMContractInterface,
    functionName: "syncToL1",
    args: [dstChainId, 1, 1, 2, 2],
    overrides: {
      value: ethers.utils.parseEther("0.1"),
    },
  });

  const { write } = useContractWrite(config);

  function syncToL1() {
    write?.();
  }

  return {
    sync: () => syncToL1(),
  };
}
