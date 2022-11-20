import { AMM_ADDRESS, ChainId, DAMM_ADDRESS, LZ_CHAIN } from "../../../sdk";
import { useMemo, useCallback } from "react";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { ethers } from "ethers";
import { SendTransactionResult } from "@wagmi/core";
import { dAMM as dAMMContractInterface } from "../../../abis/dAMM";
import { wrapAddress } from "../../utils/wrapAddress";

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
    args: [lzChainId!, wrapAddress(AMM_ADDRESS[chainToSync])],
    overrides: {
      value: ethers.utils.parseEther("0.2"),
    },
    enabled: !!lzChainId,
  });

  const { writeAsync } = useContractWrite(config);

  if (!writeAsync) return { callback: null };

  return {
    callback: async () => await writeAsync(),
  };
}
