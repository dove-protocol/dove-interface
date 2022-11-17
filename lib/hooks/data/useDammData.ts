import {
  useContractReads,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
} from "wagmi";
import {
  ChainId,
  Currency,
  CurrencyAmount,
  DAMM_ADDRESS,
  LZ_CHAIN,
} from "../../../sdk";
import dAMMContractInterface from "../../../abis/dAMM.json";
import { useMemo } from "react";
import { BigNumber } from "ethers";

export default function useDammData(
  currency1: Currency | undefined,
  currency2: Currency | undefined,
  totalSupplyCurrency: Currency | undefined
): {
  data: CurrencyAmount<Currency>[] | null;
} {
  const { chain } = useNetwork();

  const dAMMContract = {
    address: DAMM_ADDRESS[ChainId.ETHEREUM_GOERLI],
    abi: dAMMContractInterface,
    chainId: ChainId.ETHEREUM_GOERLI,
  };

  const lzChainId = useMemo(() => {
    if (!chain) return;

    if (chain.id === ChainId.ARBITRUM_GOERLI) {
      return LZ_CHAIN[ChainId.ARBITRUM_GOERLI];
    }
    if (chain.id === ChainId.POLYGON_MUMBAI) {
      return LZ_CHAIN[ChainId.POLYGON_MUMBAI];
    } else {
      return 0;
    }
  }, [chain]);

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
      {
        ...dAMMContract,
        functionName: "marked0",
        args: [lzChainId],
      },
      {
        ...dAMMContract,
        functionName: "marked1",
        args: [lzChainId],
      },
    ],
    watch: true,
  });

  if (
    !data?.[0] ||
    !data?.[1] ||
    !data?.[2] ||
    !data?.[3] ||
    !data?.[4] ||
    !currency1 ||
    !currency2 ||
    !totalSupplyCurrency
  )
    return { data: null };
  return {
    data: [
      CurrencyAmount.fromRawAmount(
        currency1,
        (data[0] as BigNumber).toString()
      ),
      CurrencyAmount.fromRawAmount(
        currency2,
        (data[1] as BigNumber).toString()
      ),
      CurrencyAmount.fromRawAmount(
        totalSupplyCurrency,
        (data[2] as BigNumber).toString()
      ),
      CurrencyAmount.fromRawAmount(
        currency1,
        (data[3] as BigNumber).toString()
      ),
      CurrencyAmount.fromRawAmount(
        currency2,
        (data[4] as BigNumber).toString()
      ),
    ],
  };
}
