import { ethers } from "ethers";
import { useMemo } from "react";
import { useNetwork } from "wagmi";
import { ChainId, PAIR_ADDRESS } from "../../../sdk";
import {
  usePairSyncToL1,
  usePreparePairSyncToL1,
} from "../../../src/generated";

export default function useSyncL1(): {
  sync: () => void;
} {
  const { chain } = useNetwork();

  const ammAddress = useMemo(() => {
    if (!chain) return;

    if (chain.id === ChainId.ARBITRUM_GOERLI) {
      return PAIR_ADDRESS[ChainId.ARBITRUM_GOERLI];
    }
    if (chain.id === ChainId.POLYGON_MUMBAI) {
      return PAIR_ADDRESS[ChainId.POLYGON_MUMBAI];
    }
  }, [chain]);

  const { config } = usePreparePairSyncToL1({
    address: ammAddress as `0x${string}`,
    args: [ethers.utils.parseEther("0.1"), ethers.utils.parseEther("0.1")],
    overrides: {
      value: ethers.utils.parseEther("0.2"),
    },
    enabled: !!chain,
  });

  const { write } = usePairSyncToL1(config);

  return {
    sync: () => write?.(),
  };
}
