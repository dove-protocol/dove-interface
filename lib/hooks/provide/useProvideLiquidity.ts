import { ethers } from "ethers";
import { useAccount } from "wagmi";
import {
  ChainId,
  Currency,
  CurrencyAmount,
  L1_ROUTER_ADDRESS,
} from "../../../sdk";
import {
  useL1RouterAddLiquidity,
  useL1RouterQuoteAddLiquidity,
  usePrepareL1RouterAddLiquidity,
} from "../../../src/generated";
import { wrapAddress } from "../../utils/wrapAddress";
import { ApprovalState } from "../useApproval";
import useToast from "../useToast";

export default function useProvideLiquidity(
  amount1: CurrencyAmount<Currency> | undefined,
  amount2: CurrencyAmount<Currency> | undefined,
  approvalState1: ApprovalState | undefined,
  approvalState2: ApprovalState | undefined
): { provide: () => void } {
  const { address } = useAccount();
  const { data: quoteData } = useL1RouterQuoteAddLiquidity({
    address: L1_ROUTER_ADDRESS[ChainId.ETHEREUM_GOERLI] as `0x${string}`,
    args: [
      amount1?.currency.isToken ? wrapAddress(amount1.currency.address) : "0x",
      amount2?.currency.isToken ? wrapAddress(amount2.currency.address) : "0x",
      BigInt(amount1?.numerator.toString() ?? "0"),
      BigInt(amount2?.numerator.toString() ?? "0"),
    ],
  });

  const { config } = usePrepareL1RouterAddLiquidity({
    address: L1_ROUTER_ADDRESS[ChainId.ETHEREUM_GOERLI] as `0x${string}`,
    args: [
      amount1?.currency.isToken ? wrapAddress(amount1.currency.address) : "0x",
      amount2?.currency.isToken ? wrapAddress(amount2.currency.address) : "0x",
      BigInt(amount1?.numerator.toString() ?? "0"),
      BigInt(amount2?.numerator.toString() ?? "0"),
      quoteData?.[0] ?? BigInt("0"),
      quoteData?.[1] ?? BigInt("0"),
      address ?? "0x",
      ethers.MaxUint256,
    ],
    enabled:
      !!amount1 &&
      !!amount2 &&
      approvalState1 === ApprovalState.APPROVED &&
      approvalState2 === ApprovalState.APPROVED,
  });

  const { write, data } = useL1RouterAddLiquidity(config);

  useToast(
    data?.hash,
    "Adding Liquidity...",
    "Added Liquidity!",
    "Failed to add liquidity"
  );

  return {
    provide: () => write?.(),
  };
}
