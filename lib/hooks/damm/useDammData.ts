import {
  useContractReads,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import { ChainId, Currency, CurrencyAmount, DAMM_ADDRESS } from "../../../sdk";
import dAMMContractInterface from "../../../abis/dAMM.json";
import { useMemo } from "react";

export default function useDammData(): [
  reserve1: CurrencyAmount<Currency> | undefined,
  reserve2: CurrencyAmount<Currency> | undefined,
  totalSupply: CurrencyAmount<Currency> | undefined
] {
  const dAMMContract = {
    address: DAMM_ADDRESS[ChainId.ETHEREUM_GOERLI],
    abi: dAMMContractInterface,
  };

  const { data, isError, isLoading } = useContractReads({
    contracts: [
      {
        ...dAMMContract,
        functionName: "reserve0",
      },
      {
        ...dAMMContract,
        functionName: "reserve1",
      },
      {
        ...dAMMContract,
        functionName: "totalSupply",
      },
    ],
    watch: true,
  });

  return useMemo(() => {
    if (!data) return [undefined, undefined, undefined];
    return [
      data?.[0] as any as CurrencyAmount<Currency>,
      data?.[1] as any as CurrencyAmount<Currency>,
      data?.[2] as any as CurrencyAmount<Currency>,
    ];
  }, [data]);
}
