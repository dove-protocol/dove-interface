import { AMM_ADDRESS, ChainId, DAMM_ADDRESS, LZ_CHAIN } from "../../../sdk";
import { useMemo, useCallback } from "react";
import dAMMContractInterface from "../../../abis/dAMM.json";
import { useContractWrite, useNetwork, usePrepareContractWrite } from "wagmi";
import AMMContractInterface from "../../../abis/AMM.json";
import { ethers } from "ethers";
import { SendTransactionResult } from "@wagmi/core";

export default function useSyncL1(): {
  callback: null | (() => Promise<SendTransactionResult>);
} {
  const { chain } = useNetwork();

  const ammAddress = useMemo(() => {
    if (!chain) return;

    if (chain.id === ChainId.ARBITRUM_GOERLI) {
      return AMM_ADDRESS[ChainId.ARBITRUM_GOERLI];
    }
    if (chain.id === ChainId.POLYGON_MUMBAI) {
      return AMM_ADDRESS[ChainId.POLYGON_MUMBAI];
    }
  }, [chain]);

  const AMMContract = {
    address: ammAddress,
    abi: AMMContractInterface,
  };

  const { config } = usePrepareContractWrite({
    ...AMMContract,
    functionName: "syncToL1",
    args: [LZ_CHAIN[ChainId.ETHEREUM_GOERLI], 1, 1, 2, 2],
    overrides: {
      value: ethers.utils.parseEther("0.1"),
    },
    enabled: !!chain,
  });

  const { writeAsync } = useContractWrite(config);

  if (!writeAsync) return { callback: null };
  return {
    callback: async () => await writeAsync(),
  };
}
