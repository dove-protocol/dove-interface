import { useAccount, useBalance, useNetwork } from "wagmi";
import { DAMM_CONTRACT_ADDRESS } from "../lib/contracts";

export default function (): {
  balance: string;
} {
  const { address } = useAccount();

  const { data, isError, isLoading } = useBalance({
    addressOrName: address,
    token: DAMM_CONTRACT_ADDRESS,
  });

  return {
    balance: data
      ? parseFloat(parseFloat(data?.formatted).toFixed(6)).toString()
      : "0",
  };
}
