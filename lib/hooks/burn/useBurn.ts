import { useContractWrite, useNetwork, usePrepareContractWrite } from "wagmi";
import {
  AMM_ADDRESS,
  ChainId,
  Currency,
  CurrencyAmount,
  LZ_CHAIN,
} from "../../../sdk";
import { useMemo, useCallback } from "react";
import { BigNumber, utils } from "ethers";
import { SendTransactionResult } from "@wagmi/core";
import { ApprovalState } from "../useApproval";
import { AMM as AMMContractInterface } from "../../../abis/AMM";

export default function useBurn(
  voucher1ToBurn: CurrencyAmount<Currency> | undefined,
  voucher2ToBurn: CurrencyAmount<Currency> | undefined,
  approvalState1: ApprovalState | undefined,
  approvalState2: ApprovalState | undefined
): {
  callback: null | (() => Promise<SendTransactionResult>);
} {
  const { chain } = useNetwork();

  const ammAddress = useMemo(() => {
    if (!chain) return;

    if (chain.id === ChainId.ARBITRUM_GOERLI) {
      return AMM_ADDRESS[ChainId.ARBITRUM_GOERLI];
    }
    if (chain.id === ChainId.POLYGON_MUMBAI) {
      return AMM_ADDRESS[ChainId.POLYGON_MUMBAI];
    }
  }, [chain]);

  const AMMContract = {
    address: ammAddress,
    abi: AMMContractInterface,
  };

  const { config } = usePrepareContractWrite({
    ...AMMContract,
    functionName: "burnVouchers",
    args: [
      LZ_CHAIN[ChainId.ETHEREUM_GOERLI],
      BigNumber.from(voucher1ToBurn?.quotient.toString()),
      BigNumber.from(voucher2ToBurn?.quotient.toString()),
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

  const { writeAsync } = useContractWrite(config);

  if (!writeAsync || !voucher1ToBurn || !voucher2ToBurn)
    return { callback: null };
  return {
    callback: async () => await writeAsync(),
  };
}
