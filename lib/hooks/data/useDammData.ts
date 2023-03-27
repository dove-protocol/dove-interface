import { useMemo } from "react";
import { useContractReads, useNetwork } from "wagmi";
import {
  ChainId,
  Currency,
  CurrencyAmount,
  DOVE_ADDRESS,
  HL_DOMAIN,
} from "../../../sdk";
import { doveABI } from "../../../src/generated";

export default function useDammData(
  currency1: Currency | undefined,
  currency2: Currency | undefined,
  totalSupplyCurrency: Currency | undefined
): {
  data: {
    reserve0: CurrencyAmount<Currency> | undefined;
    reserve1: CurrencyAmount<Currency> | undefined;
    totalSupply: CurrencyAmount<Currency> | undefined;
    marked0: CurrencyAmount<Currency> | undefined;
    marked1: CurrencyAmount<Currency> | undefined;
  } | null;
} {
  const { chain } = useNetwork();

  const doveContract = {
    address: DOVE_ADDRESS[ChainId.ETHEREUM_GOERLI] as `0x${string}`,
    abi: doveABI,
    chainId: ChainId.ETHEREUM_GOERLI,
  };

  const hlDomainId = useMemo(() => {
    if (!chain) return;

    if (chain.id === ChainId.ARBITRUM_GOERLI) {
      return HL_DOMAIN[ChainId.ARBITRUM_GOERLI];
    }
    if (chain.id === ChainId.POLYGON_MUMBAI) {
      return HL_DOMAIN[ChainId.POLYGON_MUMBAI];
    } else {
      return 0;
    }
  }, [chain]);

  const { data } = useContractReads({
    contracts: [
      {
        ...doveContract,
        functionName: "reserve0",
      },
      {
        ...doveContract,
        functionName: "reserve1",
      },
      {
        ...doveContract,
        functionName: "totalSupply",
      },
      {
        ...doveContract,
        functionName: "marked",
        args: [hlDomainId ?? 0],
      },
    ],
    watch: true,
  });

  if (
    !data?.[0] ||
    !data?.[1] ||
    !data?.[2] ||
    !data?.[3] ||
    !currency1 ||
    !currency2 ||
    !totalSupplyCurrency
  )
    return { data: null };

  return {
    data: {
      reserve0: CurrencyAmount.fromRawAmount(currency1, data[0].toString()),
      reserve1: CurrencyAmount.fromRawAmount(currency2, data[1].toString()),
      totalSupply: CurrencyAmount.fromRawAmount(
        totalSupplyCurrency,
        data[2].toString()
      ),
      marked0: CurrencyAmount.fromRawAmount(
        currency1,
        data[3].marked0.toString()
      ),
      marked1: CurrencyAmount.fromRawAmount(
        currency2,
        data[3].marked1.toString()
      ),
    },
  };
}
