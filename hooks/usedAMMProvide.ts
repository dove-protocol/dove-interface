import {
  erc20ABI,
  useAccount,
  useContractReads,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import { DAMM_CONTRACT_ADDRESS } from "../lib/contracts";
import dAMMContractInterface from "../abis/dAMM.json";
import { getTokenAddress } from "../lib/utils";
import { BigNumber, ethers } from "ethers";
import useApproveToken from "./useApproveToken";

export default function ({
  amount1,
  amount2,
}: {
  amount1: string;
  amount2: string;
}): {
  provide: () => void;
} {
  const { config } = usePrepareContractWrite({
    addressOrName: DAMM_CONTRACT_ADDRESS,
    contractInterface: dAMMContractInterface,
    functionName: "provide",
    args: [amount1, amount2],
  });

  const { write } = useContractWrite(config);

  function provideLiquidity() {
    write?.();
  }

  return {
    provide: () => provideLiquidity(),
  };
}
