import { useBalance } from "wagmi";
import { Currency, CurrencyAmount, Token } from "../../sdk";

export function useTokenBalance(
  token: Token | undefined,
  account?: string
): CurrencyAmount<Currency> | undefined {
  const { data, isError, isLoading } = useBalance({
    address: account as `0x${string}`,
    token: token?.address as `0x${string}`,
    watch: true,
    chainId: token?.chainId,
    enabled: !!token && !!account,
  });

  if (token && data) {
    return CurrencyAmount.fromRawAmount(token, data.value);
  }
}

export function useTokenBalances(
  tokens: Token[] | undefined,
  account?: string
): (CurrencyAmount<Currency> | undefined)[] {
  return tokens?.map((token) => useTokenBalance(token, account)) ?? [];
}
