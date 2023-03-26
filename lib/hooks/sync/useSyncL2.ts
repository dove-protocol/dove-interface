import { ethers } from "ethers";
import { useMemo } from "react";
import { ChainId, DOVE_ADDRESS, HL_DOMAIN, PAIR_ADDRESS } from "../../../sdk";
import { useDoveSyncL2, usePrepareDoveSyncL2 } from "../../../src/generated";
import { wrapAddress } from "../../utils/wrapAddress";

export default function useSyncL2(chainToSync: ChainId): {
  sync: () => void;
} {
  const domainId = useMemo(() => {
    if (!chainToSync) return;

    return HL_DOMAIN[chainToSync];
  }, [chainToSync]);

  const { config } = usePrepareDoveSyncL2({
    address: DOVE_ADDRESS[ChainId.ETHEREUM_GOERLI] as `0x${string}`,
    args: [domainId ?? 0, wrapAddress(PAIR_ADDRESS[chainToSync])],
    overrides: {
      // TODO: estimate gas with SDK or onchain
      value: ethers.utils.parseEther("0.5"),
    },
    enabled: !!domainId,
  });


  const { write } = useDoveSyncL2(config);

  return {
    sync: () => write?.(),
  };
}
