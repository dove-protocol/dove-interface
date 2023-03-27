import { ChainId, DOVE_ADDRESS, HL_DOMAIN } from "../../../sdk";
import {
  useDoveFinalizeSyncFromL2,
  usePrepareDoveFinalizeSyncFromL2,
} from "../../../src/generated";

export default function useFinalizeSyncL1(
  expectedChainId: ChainId | undefined
): {
  finalizeSync: () => void;
} {
  // TODO: use proper syncID
  const { config } = usePrepareDoveFinalizeSyncFromL2({
    address: DOVE_ADDRESS[ChainId.ETHEREUM_GOERLI] as `0x${string}`,
    args: [HL_DOMAIN[expectedChainId as ChainId], 1],
    enabled: !!expectedChainId,
  });

  const { write } = useDoveFinalizeSyncFromL2(config);

  return {
    finalizeSync: () => write?.(),
  };
}
