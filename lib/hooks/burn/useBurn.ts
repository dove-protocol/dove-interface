import { BigNumber, utils } from "ethers";
import { useMemo } from "react";
import { useNetwork } from "wagmi";
import { ChainId, Currency, CurrencyAmount, PAIR_ADDRESS } from "../../../sdk";
import {
  usePairBurnVouchers,
  usePreparePairBurnVouchers,
} from "../../../src/generated";
import { ApprovalState } from "../useApproval";

export default function useBurn(
  voucher1ToBurn: CurrencyAmount<Currency> | undefined,
  voucher2ToBurn: CurrencyAmount<Currency> | undefined,
  approvalState1: ApprovalState | undefined,
  approvalState2: ApprovalState | undefined
): {
  burn: () => void;
} {
  const { chain } = useNetwork();

  const pairAddress = useMemo(() => {
    if (!chain) return;

    if (chain.id === ChainId.ARBITRUM_GOERLI) {
      return PAIR_ADDRESS[ChainId.ARBITRUM_GOERLI];
    }
    if (chain.id === ChainId.POLYGON_MUMBAI) {
      return PAIR_ADDRESS[ChainId.POLYGON_MUMBAI];
    }
  }, [chain]);

  const { config } = usePreparePairBurnVouchers({
    address: pairAddress as `0x${string}`,
    args: [
      BigNumber.from(voucher1ToBurn?.quotient.toString() || 0),
      BigNumber.from(voucher2ToBurn?.quotient.toString() || 0),
    ],
    overrides: {
      value: utils.parseEther("0.1"),
    },
    enabled:
      !!voucher1ToBurn &&
      !!voucher2ToBurn &&
      approvalState1 === ApprovalState.APPROVED &&
      approvalState2 === ApprovalState.APPROVED,
  });

  const { write } = usePairBurnVouchers(config);

  return {
    burn: () => write?.(),
  };
}
