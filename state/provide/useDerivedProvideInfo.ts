import { ChainId, Currency, CurrencyAmount, DAMM_LP, Token } from "../../sdk";
import tryParseCurrencyAmount from "../../lib/utils/tryParseCurrencyAmount";
import { Field, useProvideStore } from "./useProvideStore";
import { useTokenBalances } from "../../lib/hooks/useTokenBalance";
import { useAccount } from "wagmi";
import useDammData from "../../lib/hooks/data/useDammData";

export function useDerivedProvideInfo(): {
  currencies: { [field in Field]?: Currency | undefined };
  currencyBalances: { [field in Field]?: CurrencyAmount<Currency> | undefined };
  parsedAmounts: {
    [field in Field]?: CurrencyAmount<Currency> | undefined;
  };
} {
  const { address } = useAccount();
  const [fields, currencies] = useProvideStore((state) => [
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

  if (data?.reserve0 && data?.reserve1 && independentAmount) {
    dependentAmount = data.reserve0
      .multiply(independentAmount)
      .divide(data.reserve1);
  }

  // onUserInput(
  //   Field.CURRENCY_B,

  // );

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
