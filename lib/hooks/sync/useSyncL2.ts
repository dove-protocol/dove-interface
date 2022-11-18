import { AMM_ADDRESS, ChainId, DAMM_ADDRESS, LZ_CHAIN } from "../../../sdk";
import { useMemo, useCallback } from "react";
import dAMMContractInterface from "../../../abis/dAMM.json";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { ethers } from "ethers";
import { SendTransactionResult } from "@wagmi/core";

export default function useSyncL2(chainToSync: ChainId): {
  callback: null | (() => Promise<SendTransactionResult>);
} {
  const dAMMContract = {
    address: DAMM_ADDRESS[ChainId.ETHEREUM_GOERLI],
    abi: dAMMContractInterface,
  };

  const lzChainId = useMemo(() => {
    if (!chainToSync) return;

    return LZ_CHAIN[chainToSync];
  }, [chainToSync]);

  const { config } = usePrepareContractWrite({
    ...dAMMContract,
    functionName: "syncL2",
    args: [lzChainId, AMM_ADDRESS[chainToSync]],
    overrides: {
      value: ethers.utils.parseEther("0.1"),
    },
    enabled: !!chainToSync,
  });

  const { writeAsync } = useContractWrite(config);

  if (!writeAsync) return { callback: null };

  return {
    callback: async () => await writeAsync(),
  };
}
