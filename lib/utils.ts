import { chainId, useNetwork } from "wagmi";
import {
  USDC_ARBI_ADDRESS,
  USDC_FUJI_ADDRESS,
  USDC_GOERLI_ADDRESS,
  USDT_ARBI_ADDRESS,
  USDT_FUJI_ADDRESS,
  USDT_GOERLI_ADDRESS,
} from "./contracts";

export const transitionAnimation = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
  },
};

export const validateNumber = (value: string) => {
  return RegExp(/^[0-9]*\.?[0-9]*$/).test(value);
};

export const getTokenAddress = (isUSDC: boolean): string => {
  const { chain: currentChain, chains } = useNetwork();

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
      tokenAddress = isUSDC ? USDC_FUJI_ADDRESS : USDT_FUJI_ADDRESS;
      break;
    }
  }

  return tokenAddress;
};
