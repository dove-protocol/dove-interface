import { gql, useQuery } from "@apollo/client";
import { ChainId, DOVE_ADDRESS, HL_DOMAIN } from "../../../sdk";
import {
  useDoveFinalizeSyncFromL2,
  usePrepareDoveFinalizeSyncFromL2,
} from "../../../src/generated";

export default function useFinalizeSyncL1(
  expectedChainId: ChainId | undefined
): {
  finalizeSync: () => void;
  status: string;
} {
  const GET_RECENT_SYNC = gql`
    query GetRecentSync($domainId: Int!) {
      syncs(where: { domainId: $domainId, status_not: SYNCED }, first: 1) {
        syncId
        status
      }
    }
  `;

  type SyncResponse = {
    syncs: {
      syncId: number;
      status: string;
    }[];
  };

  const { data } = useQuery<SyncResponse>(GET_RECENT_SYNC, {
    variables: {
      domainId: HL_DOMAIN[expectedChainId as ChainId],
    },
    skip: !expectedChainId,
  });

  console.log("data", data);

  // TODO: use proper syncID
  const { config } = usePrepareDoveFinalizeSyncFromL2({
    address: DOVE_ADDRESS[ChainId.ETHEREUM_GOERLI] as `0x${string}`,
    args: [HL_DOMAIN[expectedChainId as ChainId], data?.syncs[0]?.syncId ?? 0],
    enabled: !!expectedChainId && data?.syncs[0]?.status === "PENDING_FINAlIZE",
  });

  const { write } = useDoveFinalizeSyncFromL2(config);

  return {
    finalizeSync: () => write?.(),
    status: data?.syncs[0]?.status || "UNKNOWN",
  };
}
