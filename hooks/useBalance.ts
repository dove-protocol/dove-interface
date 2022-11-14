import { useAccount, useBalance, useNetwork } from "wagmi";
import {
  USDC_ARBI_ADDRESS,
  USDC_FUJI_ADDRESS,
  USDC_GOERLI_ADDRESS,
  USDT_ARBI_ADDRESS,
  USDT_FUJI_ADDRESS,
  USDT_GOERLI_ADDRESS,
} from "../lib/contracts";

export default function ({ isUSDC }: { isUSDC: boolean | undefined }): {
  balance: string;
} {
  const { chain: currentChain, chains } = useNetwork();
  const { address } = useAccount();

  let tokenAddress = "";
  switch (currentChain?.id) {
    // probably bad to manually encode index
    case chains[0].id: {
      tokenAddress = isUSDC ? USDC_GOERLI_ADDRESS : USDT_GOERLI_ADDRESS;
      break;
    }
    case chains[1].id: {
      tokenAddress = isUSDC ? USDC_ARBI_ADDRESS : USDT_ARBI_ADDRESS;
      break;
    }
    case chains[2].id: {
      tokenAddress = isUSDC ? USDC_FUJI_ADDRESS : USDT_FUJI_ADDRESS;
      break;
    }
  }

  const { data, isError, isLoading } = useBalance({
    addressOrName: address,
    token: tokenAddress,
  });

  return {
    balance: data?.formatted || "0",
  };
}
