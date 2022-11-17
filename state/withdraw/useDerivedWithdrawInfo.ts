import { Currency, CurrencyAmount, Token } from "../../sdk";
import tryParseCurrencyAmount from "../../lib/utils/tryParseCurrencyAmount";
import { useTokenBalances } from "../../lib/hooks/useTokenBalance";
import { useAccount } from "wagmi";
import { Field, useWithdrawStore } from "./useWithdrawStore";

export function useDerivedWithdrawInfo(): {
  currencies: { [field in Field]?: Currency | undefined };
  currencyBalances: { [field in Field]?: CurrencyAmount<Currency> | undefined };
  parsedAmounts: {
    [field in Field]?: CurrencyAmount<Currency> | undefined;
  };
} {
  const { address } = useAccount();
  const [fields, currencies] = useWithdrawStore((state) => [
    state.fields,
    state.currencies,
  ]);

  // TODO: useTokenBalances should be able to take an array of tokens
  const relevantTokenBalances = useTokenBalances(
    [currencies.CURRENCY_A as Token],
    address
  );

  const parsedAmounts = {
    [Field.CURRENCY_A]: tryParseCurrencyAmount(
      fields[Field.CURRENCY_A],
      currencies[Field.CURRENCY_A]
    ),
  };

  const currencyBalances = {
    [Field.CURRENCY_A]: relevantTokenBalances[0],
  };

  return {
    parsedAmounts,
    currencies,
    currencyBalances,
  };
}
