import { useContractReads, useNetwork } from "wagmi";
import { AMM_ADDRESS, ChainId, Currency, CurrencyAmount } from "../../../sdk";
import AMMContractInterface from "../../../abis/AMM.json";
import { useMemo } from "react";
import { BigNumber } from "ethers";

export default function useAmmData(
  currency1: Currency | undefined,
  currency2: Currency | undefined
): {
  data: {
    reserve0: CurrencyAmount<Currency> | undefined;
    reserve1: CurrencyAmount<Currency> | undefined;
  } | null;
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

  if (!data?.[0] || !data?.[1] || !currency1 || !currency2)
    return { data: null };
  return {
    data: {
      reserve0: CurrencyAmount.fromRawAmount(
        currency1,
        (data[0] as BigNumber).toString()
      ),
      reserve1: CurrencyAmount.fromRawAmount(
        currency1,
        (data[1] as BigNumber).toString()
      ),
    },
  };
}
