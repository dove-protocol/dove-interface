import {
  useAccount,
  useNetwork,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import MintableERC20 from "../abis/ERC20.json";
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
