import { useContractWrite, usePrepareContractWrite, useNetwork } from "wagmi";
import {
  ARBI_AMM_CONTRACT_ADDRESS,
  FUJI_AMM_CONTRACT_ADDRESS,
} from "../lib/contracts";
import AMMInterface from "../abis/AMM.json";

export default function ({
  amount0In,
  amount1In,
}: {
  amount0In: string;
  amount1In: string;
}): {
  swap: () => void;
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
    functionName: "swap",
    args: [amount0In, amount1In],
  });
  const { write } = useContractWrite(config);

  function swapTokens() {
    write?.();
  }

  return {
    swap: () => swapTokens(),
  };
}
