import { useContractReads, useNetwork } from "wagmi";
import { pairAbi } from "../../../abis/Pair";
import {
  ChainId,
  Currency,
  CurrencyAmount,
  PAIR_ADDRESS,
  Token,
} from "../../../sdk";
import { useTokenBalances } from "../useTokenBalance";

export default function useAmmData(
  currency1: Currency | undefined,
  currency2: Currency | undefined,
  expectedChainId: ChainId | undefined
): {
  data: {
    reserve0: CurrencyAmount<Currency> | undefined;
    reserve1: CurrencyAmount<Currency> | undefined;
  } | null;
  balances: (CurrencyAmount<Currency> | undefined)[];
} {
  const { chain } = useNetwork();

  // const ammAddress = useMemo(() => {
  //   if (!chain) return;

  //   if (chain.id === ChainId.ARBITRUM_GOERLI) {
  //     return AMM_ADDRESS[ChainId.ARBITRUM_GOERLI];
  //   }
  //   if (chain.id === ChainId.POLYGON_MUMBAI) {
  //     return AMM_ADDRESS[ChainId.POLYGON_MUMBAI];
  //   }
  // }, [chain]);

  const pairAddress = expectedChainId && PAIR_ADDRESS[expectedChainId];

  const PairContract = {
    address: pairAddress as `0x${string}`,
    abi: pairAbi,
    chainId: expectedChainId,
  };

  const { data } = useContractReads({
    contracts: [
      {
        ...PairContract,
        functionName: "reserve0",
      },
      {
        ...PairContract,
        functionName: "reserve1",
      },
    ],
    watch: true,
  });

  const amounts = useTokenBalances(
    [currency1 as Token, currency2 as Token],
    pairAddress
  );

  if (!data?.[0] || !data?.[1] || !currency1 || !currency2)
    return { data: null, balances: [] };

  return {
    data: {
      reserve0: CurrencyAmount.fromRawAmount(currency1, data[0].result as bigint),
      reserve1: CurrencyAmount.fromRawAmount(currency1, data[1].result as bigint),
    },
    balances: amounts,
  };
}
