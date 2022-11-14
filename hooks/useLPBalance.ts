import { BigNumber } from "ethers";
import { useAccount, useBalance, useNetwork } from "wagmi";
import { DAMM_CONTRACT_ADDRESS } from "../lib/contracts";

export default function (): {
  formatted: string;
  value: BigNumber;
} {
  const { address } = useAccount();

  const { data, isError, isLoading } = useBalance({
    addressOrName: address,
    token: DAMM_CONTRACT_ADDRESS,
  });

  return {
    formatted: data?.formatted ?? "0",
    value: data?.value ?? BigNumber.from(0),
  };
}
