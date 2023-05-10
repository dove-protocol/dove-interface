import { useEffect, useState } from "react";
import { useBlockNumber, usePublicClient } from "wagmi";

export default function useBlockTimestamp(): number | undefined {
  const [blockTimestamp, setBlockTimestamp] = useState<number | undefined>();
  const { data: blockData } = useBlockNumber();

  const provider = usePublicClient();

  useEffect(() => {
    if (!blockData || !provider) return;

    (async () => {
      const blockInfo = await provider.getBlock({
        blockNumber: blockData,
      });

      setBlockTimestamp(Number(blockInfo.timestamp));
    })();
  });

  return blockTimestamp;
}
