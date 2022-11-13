import {
  useAccount,
  useNetwork,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import {
  USDC_GOERLI_ADDRESS,
  USDT_GOERLI_ADDRESS,
  USDC_ARBI_ADDRESS,
  USDT_ARBI_ADDRESS,
  USDC_FUJI_ADDRESS,
  USDT_FUJI_ADDRESS,
} from "../lib/contracts";
import MintableERC20 from "../abis/ERC20.json";
import { avalancheChain } from "../pages/_app";

export default function ({
  amount,
  isUSDC,
}: {
  amount: string | undefined;
  isUSDC: boolean | undefined;
}): {
  mint: () => void;
} {
  const { chain: currentChain, chains } = useNetwork();

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

  const { address } = useAccount();
  // assume correct chain id will be selected as it's enforced on each tab
  const { config } = usePrepareContractWrite({
    addressOrName: tokenAddress,
    contractInterface: MintableERC20,
    functionName: "mint",
    args: [address, amount],
  });

  const { write } = useContractWrite(config);

  function mintToken() {
    write?.();
  }

  return {
    mint: () => mintToken(),
  };
}
