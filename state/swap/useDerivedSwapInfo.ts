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
  const [fields, currencies, independentField] = useSwapStore((state) => [
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

  // fallback to undefined if parsing fails?
  let dependentAmount;

  console.log(
    data?.reserve0?.toExact(),
    data?.reserve1?.toExact(),
    independentAmount?.toExact()
  );

  // calculate output amount for swap (mr. tabler wrote proof so it's correct)

  // amountIn = (amountOut * reserveIn) / (reserveOut - amountOut)
  // amountOut = (amountIn * reserveOut) / (reserveIn + amountIn);
  if (data?.reserve0 && data?.reserve1 && independentAmount) {
    dependentAmount = tryParseCurrencyAmount(
      independentAmount
        .multiply(
          dependentField === Field.CURRENCY_A ? data.reserve0 : data.reserve1
        )
        .divide(
          dependentField === Field.CURRENCY_A
            ? data.reserve1.add(independentAmount)
            : data.reserve0.subtract(independentAmount)
        )
        .toExact(),
      currencies[dependentField]
    );
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
