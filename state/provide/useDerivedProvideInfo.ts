import { useAccount } from "wagmi";
import useDammData from "../../lib/hooks/data/useDammData";
import { useTokenBalances } from "../../lib/hooks/useTokenBalance";
import tryParseCurrencyAmount from "../../lib/utils/tryParseCurrencyAmount";
import { ChainId, Currency, CurrencyAmount, DAMM_LP, Token } from "../../sdk";
import { Field, useProvideStore } from "./useProvideStore";

export function useDerivedProvideInfo(): {
  currencies: { [field in Field]?: Currency | undefined };
  currencyBalances: { [field in Field]?: CurrencyAmount<Currency> | undefined };
  parsedAmounts: {
    [field in Field]?: CurrencyAmount<Currency> | undefined;
  };
} {
  const { address } = useAccount();
  const [fields, currencies, independentField] = useProvideStore((state) => [
    state.fields,
    state.currencies,
    state.independentField,
  ]);

  const { data } = useDammData(
    currencies.CURRENCY_A,
    currencies.CURRENCY_B,
    DAMM_LP[ChainId.ETHEREUM_GOERLI]
  );

  const dependentField =
    independentField === Field.CURRENCY_A ? Field.CURRENCY_B : Field.CURRENCY_A;

  const independentAmount = tryParseCurrencyAmount(
    fields[independentField],
    currencies[independentField]
  );

  let dependentAmount;

  // calculate amount of second token to provide
  if (data?.reserve0 && data?.reserve1 && independentAmount) {
    // first provider of liquidity
    if (data.reserve0.equalTo("0") || data.reserve1.equalTo("0")) {
      dependentAmount = tryParseCurrencyAmount(
        independentAmount.toExact(),
        currencies[dependentField]
      );
    } else {
      dependentAmount = tryParseCurrencyAmount(
        data.reserve0
          .multiply(independentAmount)
          .divide(data.reserve1)
          .toExact(),
        currencies[dependentField]
      );
    }
  }

  // TODO: useTokenBalances should be able to take an array of tokens
  const relevantTokenBalances = useTokenBalances(
    [currencies.CURRENCY_A as Token, currencies.CURRENCY_B as Token],
    address
  );

  const parsedAmounts = {
    [Field.CURRENCY_A]:
      independentField === Field.CURRENCY_A
        ? independentAmount
        : dependentAmount,
    [Field.CURRENCY_B]:
      independentField === Field.CURRENCY_B
        ? independentAmount
        : dependentAmount,
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
