import { useContractReads, useNetwork } from "wagmi";
import { AMM_ADDRESS, ChainId, Currency, CurrencyAmount } from "../../../sdk";
import AMMContractInterface from "../../../abis/AMM.json";
import { useMemo } from "react";

export default function useAmmData(): [
  reserve1: CurrencyAmount<Currency> | undefined,
  reserve2: CurrencyAmount<Currency> | undefined
] {
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

  const { data } = useContractReads({
    contracts: [
      {
        ...AMMContract,
        functionName: "reserve0",
      },
      {
        ...AMMContract,
        functionName: "reserve1",
      },
    ],
    watch: true,
  });

  if (!data) return [undefined, undefined];

  return [
    data?.[0] as any as CurrencyAmount<Currency>,
    data?.[1] as any as CurrencyAmount<Currency>,
  ];
}
