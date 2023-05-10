import { goerli } from "viem/chains";
import { DOVE_ADDRESS } from "../../sdk";
import { useDoveIsLiquidityLocked } from "../../src/generated";

export default function useLiquidityLocked(): {
  isLocked: boolean | undefined;
} {
  const { data } = useDoveIsLiquidityLocked({
    address: DOVE_ADDRESS[goerli.id] as `0x${string}`,
    watch: true,
  });

  return {
    isLocked: data,
  };
}
