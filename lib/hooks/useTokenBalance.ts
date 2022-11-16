import { BigNumber } from "ethers";
import { useMemo } from "react";
import { useAccount, useBalance, useNetwork } from "wagmi";
import { ChainId, Currency, CurrencyAmount, Token } from "../../sdk";
import { AMM_ADDRESS } from "../../sdk/constants";

export function useTokenBalance(
  token: Token | undefined,
  account?: string
): CurrencyAmount<Currency> | undefined {
  const { data, isError, isLoading } = useBalance({
    address: account as `0x${string}`,
    token: token?.address as `0x${string}`,
    watch: true,
  });

  return useMemo(() => {
    if (token && data) {
      return CurrencyAmount.fromRawAmount(token, data.value.toString());
    }
  }, [token, data]);
}

export function useTokenBalances(
  tokens: Token[] | undefined,
  account?: string
): (CurrencyAmount<Currency> | undefined)[] {
  return useMemo(() => {
    return tokens?.map((token) => useTokenBalance(token, account)) ?? [];
  }, [tokens, account]);
}
