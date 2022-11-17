import { BigNumber } from "ethers";
import { useAccount, useBalance, useNetwork } from "wagmi";
import {
  USDC_ARBI_ADDRESS,
  USDC_POLYGON_ADDRESS,
  USDC_GOERLI_ADDRESS,
  USDT_ARBI_ADDRESS,
  USDT_POLYGON_ADDRESS,
  USDT_GOERLI_ADDRESS,
} from "../lib/contracts";

export default function ({ isUSDC }: { isUSDC: boolean | undefined }): {
  formatted: string;
  value: BigNumber;
} {
  const { chain: currentChain, chains } = useNetwork();
  const { address } = useAccount();

  let tokenAddress = "";
  switch (currentChain?.id) {
    // probably bad to manually encode index
    case chains?.[0]?.id: {
      tokenAddress = isUSDC ? USDC_GOERLI_ADDRESS : USDT_GOERLI_ADDRESS;
      break;
    }
    case chains?.[1]?.id: {
      tokenAddress = isUSDC ? USDC_ARBI_ADDRESS : USDT_ARBI_ADDRESS;
      break;
    }
    case chains?.[2]?.id: {
      tokenAddress = isUSDC ? USDC_POLYGON_ADDRESS : USDT_POLYGON_ADDRESS;
      break;
    }
  }

  const { data, isError, isLoading } = useBalance({
    address: address,
    token: tokenAddress,
    watch: true,
  });

  return {
    formatted: data?.formatted ?? "0",
    value: data?.value ?? BigNumber.from(0),
  };
}
