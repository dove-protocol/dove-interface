import { useMemo } from "react";
import { Currency, CurrencyAmount } from "../../sdk";
import { Field, useProvideStore } from "../state/useProvideStore";

export default function useDerivedTokenInfo(): {
  currencies: { [field in Field]?: Currency | undefined };
  currencyBalances: { [field in Field]?: CurrencyAmount<Currency> };
} {
  const { currencies } = useProvideStore();

  return useMemo(() => {
    return {
      currencies,
      currencyBalances: {},
    };
  }, [currencies]);
}
