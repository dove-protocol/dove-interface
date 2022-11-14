import { useContractWrite, useNetwork, usePrepareContractWrite } from "wagmi";
import {
  ARBI_AMM_CONTRACT_ADDRESS,
  DAMM_CONTRACT_ADDRESS,
  FUJI_AMM_CONTRACT_ADDRESS,
} from "../lib/contracts";
import dAMMContractInterface from "../abis/dAMM.json";

export default function ({ chainId }: { chainId: number }): {
  sync: () => void;
} {
  const { chain: currentChain, chains } = useNetwork();

  let ammAddress = "";
  switch (chainId) {
    // probably bad to manually encode index
    case chains[1].id: {
      ammAddress = ARBI_AMM_CONTRACT_ADDRESS;
      break;
    }
    case chains[2].id: {
      ammAddress = FUJI_AMM_CONTRACT_ADDRESS;
      break;
    }
  }

  const { config } = usePrepareContractWrite({
    addressOrName: DAMM_CONTRACT_ADDRESS,
    contractInterface: dAMMContractInterface,
    functionName: "syncL2",
    args: [chainId, ammAddress],
  });

  const { write } = useContractWrite(config);

  function syncL2() {
    write?.();
  }

  return {
    sync: () => syncL2(),
  };
}
