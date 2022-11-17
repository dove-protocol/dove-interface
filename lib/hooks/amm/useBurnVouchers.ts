import { useContractWrite, useNetwork, usePrepareContractWrite } from "wagmi";
import {
  AMM_ADDRESS,
  ChainId,
  Currency,
  CurrencyAmount,
  LZ_CHAIN,
} from "../../../sdk";
import AMMContractInterface from "../../../abis/AMM.json";
import { useMemo, useCallback } from "react";

export default function useBurnVouchers(
  voucher1ToBurn: CurrencyAmount<Currency>,
  voucher2ToBurn: CurrencyAmount<Currency>
): () => void {
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
      voucher1ToBurn.numerator.toString(),
      voucher2ToBurn.numerator.toString(),
    ],
  });

  const { write } = useContractWrite(config);

  return useCallback(() => {
    if (!voucher1ToBurn || !voucher2ToBurn) return;
    write?.();
  }, [voucher1ToBurn, voucher2ToBurn]);
}
