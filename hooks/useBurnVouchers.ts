import {
  useContractWrite,
  usePrepareContractWrite,
  useNetwork,
  useWaitForTransaction,
} from "wagmi";
import {
  ARBI_AMM_CONTRACT_ADDRESS,
  POLYGON_AMM_CONTRACT_ADDRESS,
} from "../lib/contracts";
import AMMInterface from "../abis/AMM.json";
import { useEffect } from "react";
import useTriggerToast from "./useTriggerToast";

export default function ({
  vUSDCToBurn,
  vUSDTToBurn,
}: {
  vUSDCToBurn: string;
  vUSDTToBurn: string;
}): {
  burn: () => void;
} {
  let ammAddress = "";
  const { chain: currentChain, chains } = useNetwork();
  const { trigger } = useTriggerToast();

  switch (currentChain?.id) {
    case chains?.[1]?.id: {
      ammAddress = ARBI_AMM_CONTRACT_ADDRESS;
      break;
    }
    case chains?.[2]?.id: {
      ammAddress = POLYGON_AMM_CONTRACT_ADDRESS;
      break;
    }
  }
  const { config } = usePrepareContractWrite({
    addressOrName: ammAddress,
    contractInterface: AMMInterface,
    functionName: "burnVouchers",
    args: [10121, vUSDCToBurn, vUSDTToBurn],
  });
  const { data: burnTxData, write } = useContractWrite(config);

  const {
    data: txData,
    isError,
    isLoading,
  } = useWaitForTransaction({
    hash: burnTxData?.hash,
  });

  useEffect(() => {
    if (txData && !isError && !isLoading) {
      trigger({
        description: `Burn successful`,
        title: "Success",
        txid: burnTxData?.hash || "",
        type: "success",
      });
    } else if (isError) {
      trigger({
        description: `Burn failed`,
        title: "Error",
        txid: burnTxData?.hash || "",
        type: "error",
      });
    }
  }, [txData]);

  function burnVouchers() {
    write?.();
  }

  return {
    burn: () => burnVouchers(),
  };
}
