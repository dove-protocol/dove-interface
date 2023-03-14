import { ethers } from "ethers";
import { useMemo } from "react";
import { ChainId, DOVE_ADDRESS, LZ_CHAIN, PAIR_ADDRESS } from "../../../sdk";
import { useDoveSyncL2, usePrepareDoveSyncL2 } from "../../../src/generated";
import { wrapAddress } from "../../utils/wrapAddress";

export default function useSyncL2(chainToSync: ChainId): {
  sync: () => void;
} {
  const lzChainId = useMemo(() => {
    if (!chainToSync) return;

    return LZ_CHAIN[chainToSync];
  }, [chainToSync]);

  const { config } = usePrepareDoveSyncL2({
    address: DOVE_ADDRESS[ChainId.ETHEREUM_GOERLI] as `0x${string}`,
    args: [lzChainId!, wrapAddress(PAIR_ADDRESS[chainToSync])],
    overrides: {
      value: ethers.utils.parseEther("0.2"),
    },
    enabled: !!lzChainId,
  });

  const { write } = useDoveSyncL2(config);

  return {
    sync: () => write?.(),
  };
}
