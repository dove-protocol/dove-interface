import { defineConfig } from "@wagmi/cli";
import { react } from "@wagmi/cli/plugins";
import { erc20ABI } from "wagmi";
import { doveAbi } from "./abis/Dove";
import { erc20MockAbi } from "./abis/ERC20Mock";
import { l1RouterAbi } from "./abis/L1Router";
import { l2RouterAbi } from "./abis/L2Router";
import { pairAbi } from "./abis/Pair";

export default defineConfig({
  out: "src/generated.ts",
  contracts: [
    {
      name: "ERC20",
      abi: erc20ABI,
    },
    {
      name: "ERC20Mock",
      abi: erc20MockAbi,
    },
    {
      name: "L1Router",
      abi: l1RouterAbi,
    },
    {
      name: "L2Router",
      abi: l2RouterAbi,
    },
    {
      name: "Dove",
      abi: doveAbi,
    },
    {
      name: "Pair",
      abi: pairAbi,
    },
  ],
  plugins: [react()],
});
