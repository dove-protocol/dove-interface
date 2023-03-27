import { useEffect, useState } from "react";
import { useBlockNumber, useProvider } from "wagmi";

export default function useBlockTimestamp(): number | undefined {
  const [blockTimestamp, setBlockTimestamp] = useState<number | undefined>();
  const { data: blockData } = useBlockNumber();

  const provider = useProvider();

  useEffect(() => {
    if (!blockData || !provider) return;

    (async () => {
      const blockInfo = await provider.getBlock(blockData);

      setBlockTimestamp(blockInfo.timestamp);
    })();
  });

  return blockTimestamp;
}
