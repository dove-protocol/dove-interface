import { ChainId, Currency, CurrencyAmount, DAMM_LP, Token } from "../../sdk";
import tryParseCurrencyAmount from "../../lib/utils/tryParseCurrencyAmount";
import { useTokenBalances } from "../../lib/hooks/useTokenBalance";
import { useAccount } from "wagmi";
import { Field, useSwapStore } from "./useSwapStore";
import useDammData from "../../lib/hooks/data/useDammData";

export function useDerivedSwapInfo(): {
  currencies: { [field in Field]?: Currency | undefined };
  currencyBalances: { [field in Field]?: CurrencyAmount<Currency> | undefined };
  parsedAmounts: {
    [field in Field]?: CurrencyAmount<Currency> | undefined;
  };
} {
  const { address } = useAccount();
  const [fields, currencies] = useSwapStore((state) => [
    state.fields,
    state.currencies,
  ]);

  const { data } = useDammData(
    currencies.CURRENCY_A,
    currencies.CURRENCY_B,
    DAMM_LP[ChainId.ETHEREUM_GOERLI]
  );

  const independentAmount = tryParseCurrencyAmount(
    fields[Field.CURRENCY_A],
    currencies[Field.CURRENCY_A]
  );

  let dependentAmount = tryParseCurrencyAmount(
    fields[Field.CURRENCY_B],
    currencies[Field.CURRENCY_B]
  );

  // calculate output amount for swap
  if (data?.reserve0 && data?.reserve1 && independentAmount) {
    dependentAmount = tryParseCurrencyAmount(
      independentAmount
        .multiply(data.reserve1)
        .divide(data.reserve0.add(independentAmount))
        .toExact(),
      currencies[Field.CURRENCY_B]
    );
  }

  // TODO: useTokenBalances should be able to take an array of tokens
  const relevantTokenBalances = useTokenBalances(
    [currencies.CURRENCY_A as Token, currencies.CURRENCY_B as Token],
    address
  );

  const parsedAmounts = {
    [Field.CURRENCY_A]: independentAmount,
    [Field.CURRENCY_B]: dependentAmount,
  };

  const currencyBalances = {
    [Field.CURRENCY_A]: relevantTokenBalances[0],
    [Field.CURRENCY_B]: relevantTokenBalances[1],
  };

  return {
    parsedAmounts,
    currencies,
    currencyBalances,
  };
}
