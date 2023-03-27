import { BigNumber, ethers } from "ethers";
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
      BigNumber.from(amount1?.numerator.toString() ?? "0"),
      BigNumber.from(amount2?.numerator.toString() ?? "0"),
    ],
  });

  const { config } = usePrepareL1RouterAddLiquidity({
    address: L1_ROUTER_ADDRESS[ChainId.ETHEREUM_GOERLI] as `0x${string}`,
    args: [
      amount1?.currency.isToken ? wrapAddress(amount1.currency.address) : "0x",
      amount2?.currency.isToken ? wrapAddress(amount2.currency.address) : "0x",
      BigNumber.from(amount1?.numerator.toString() ?? "0"),
      BigNumber.from(amount2?.numerator.toString() ?? "0"),
      quoteData?.amountA ?? BigNumber.from("0"),
      quoteData?.amountB ?? BigNumber.from("0"),
      address ?? "0x",
      ethers.constants.MaxUint256,
    ],
    enabled:
      !!amount1 &&
      !!amount2 &&
      approvalState1 === ApprovalState.APPROVED &&
      approvalState2 === ApprovalState.APPROVED,
  });

  const { write } = useL1RouterAddLiquidity(config);

  return {
    provide: () => write?.(),
  };
}
