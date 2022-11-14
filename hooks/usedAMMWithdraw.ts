import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { DAMM_CONTRACT_ADDRESS } from "../lib/contracts";
import dAMMContractInterface from "../abis/dAMM.json";

export default function ({ amount }: { amount: string }): {
  withdraw: () => void;
} {
  const { config } = usePrepareContractWrite({
    addressOrName: DAMM_CONTRACT_ADDRESS,
    contractInterface: dAMMContractInterface,
    functionName: "withdraw",
    args: [amount],
  });

  const { write } = useContractWrite(config);

  function withdrawLiquidity() {
    write?.();
  }

  return {
    withdraw: () => withdrawLiquidity(),
  };
}
