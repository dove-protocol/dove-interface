import { useAccount } from "wagmi";
import { Currency, CurrencyAmount } from "../../sdk";
import {
  useErc20Allowance,
  useErc20Approve,
  usePrepareErc20Approve,
} from "../../src/generated";

export enum ApprovalState {
  UNKNOWN = "UNKNOWN",
  NOT_APPROVED = "NOT_APPROVED",
  PENDING = "PENDING",
  APPROVED = "APPROVED",
}

export default function useApproval(
  amountToApprove: CurrencyAmount<Currency> | undefined,
  spender: string | undefined
): {
  approve: () => void;
  state: ApprovalState;
} {
  const approvalState = useApprovalStateForSpender(spender, amountToApprove);

  const { config: approvalConfig } = usePrepareErc20Approve({
    address: amountToApprove?.currency?.isToken
      ? (amountToApprove.currency.address as `0x${string}`)
      : undefined,
    args: [
      spender as `0x${string}`,
      BigInt(amountToApprove?.numerator.toString() || "0"),
    ],
    enabled:
      !!spender &&
      !!amountToApprove &&
      approvalState === ApprovalState.NOT_APPROVED,
  });

  // console.log(
  //   amountToApprove?.currency?.isToken &&
  //     (amountToApprove.currency.address as `0x${string}`)
  // );

  const { write } = useErc20Approve(approvalConfig);

  return {
    approve: () => write?.(),
    state: approvalState,
  };
}

function useApprovalStateForSpender(
  spender: string | undefined,
  amountToApprove: CurrencyAmount<Currency> | undefined
): ApprovalState {
  const { address } = useAccount();

  const { data: allowance } = useErc20Allowance({
    address: amountToApprove?.currency?.isToken
      ? (amountToApprove.currency.address as `0x${string}`)
      : undefined,
    args: [address as `0x${string}`, spender as `0x${string}`],
    watch: true,
  });

  if (!amountToApprove) return ApprovalState.UNKNOWN;
  if (amountToApprove.currency.isNative) return ApprovalState.APPROVED;
  if (!allowance) return ApprovalState.UNKNOWN;

  const allowanceAmount = CurrencyAmount.fromRawAmount(
    amountToApprove.currency,
    allowance
  );

  // console.log(
  //   "maxUint256",
  //   "115792089237316195423570985008687907853269984665640564039457584007913129639935"
  // );
  // console.log("amountToApprove", amountToApprove.numerator.toString());
  // console.log("allowanceAmount", allowance.toString());

  return allowanceAmount.greaterThan(amountToApprove) ||
    allowanceAmount.equalTo(amountToApprove)
    ? ApprovalState.APPROVED
    : ApprovalState.NOT_APPROVED;
}
