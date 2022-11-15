import { useContractWrite, usePrepareContractWrite, useNetwork } from "wagmi";
import {
  ARBI_AMM_CONTRACT_ADDRESS,
  FUJI_AMM_CONTRACT_ADDRESS,
} from "../lib/contracts";
import AMMInterface from "../abis/AMM.json";

export default function ({
  vUSDCToBurn,
  vUSDTToBurn,
}: {
  vUSDCToBurn: string;
  vUSDTToBurn: string;
}): {
  burn: () => void;
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
  const { config } = usePrepareContractWrite({
    addressOrName: ammAddress,
    contractInterface: AMMInterface,
    functionName: "burnVouchers",
    args: [10121, vUSDCToBurn, vUSDTToBurn],
  });
  const { write } = useContractWrite(config);

  function burnVouchers() {
    write?.();
  }

  return {
    burn: () => burnVouchers(),
  };
}
