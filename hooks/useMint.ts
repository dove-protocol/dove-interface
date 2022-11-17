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
  USDC_POLYGON_ADDRESS,
  USDT_POLYGON_ADDRESS,
} from "../lib/contracts";
import MintableERC20 from "../abis/ERC20.json";
import { getTokenAddress } from "../lib/utils";
import { BigNumber, BigNumberish } from "ethers";

export default function ({
  amount,
  isUSDC,
}: {
  amount: BigNumberish;
  isUSDC: boolean;
}): {
  mint: () => void;
} {
  const { chain: currentChain, chains } = useNetwork();

  let tokenAddress = getTokenAddress(isUSDC);

  const { address } = useAccount();
  // assume correct chain id will be selected as it's enforced on each tab
  const { config } = usePrepareContractWrite({
    address: tokenAddress,
    abi: MintableERC20,
    functionName: "mint",
    args: [address, BigNumber.from(amount).mul(10 ** 6)],
  });

  const { write } = useContractWrite(config);

  function mintToken() {
    write?.();
  }

  return {
    mint: () => mintToken(),
  };
}
