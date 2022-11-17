import { Currency, CurrencyAmount, Token } from "../../sdk";
import tryParseCurrencyAmount from "../../lib/utils/tryParseCurrencyAmount";
import { useTokenBalances } from "../../lib/hooks/useTokenBalance";
import { useAccount } from "wagmi";
import { Field, useSwapStore } from "./useSwapStore";

export function useDerivedMintInfo(): {
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

  // TODO: useTokenBalances should be able to take an array of tokens
  const relevantTokenBalances = useTokenBalances(
    [currencies.INPUT as Token, currencies.OUTPUT as Token],
    address
  );

  const parsedAmounts = {
    [Field.INPUT]: tryParseCurrencyAmount(
      fields[Field.INPUT],
      currencies[Field.INPUT]
    ),
    [Field.OUTPUT]: tryParseCurrencyAmount(
      fields[Field.OUTPUT],
      currencies[Field.OUTPUT]
    ),
  };

  const currencyBalances = {
    [Field.INPUT]: relevantTokenBalances[0],
    [Field.OUTPUT]: relevantTokenBalances[1],
  };

  return {
    parsedAmounts,
    currencies,
    currencyBalances,
  };
}
