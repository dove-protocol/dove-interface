import { useMemo, useEffect } from "react";
import { useNetwork } from "wagmi";
import { Currency, CurrencyAmount, USDC, USDC_ADDRESS, USDT } from "../../sdk";
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

export function useChainDefaults() {
  const { chain } = useNetwork();
  const { setCurrencies } = useProvideStore();

  useEffect(() => {
    if (!chain) return;
    setCurrencies({
      [Field.CURRENCY_A]: USDC[chain.id],
      [Field.CURRENCY_B]: USDT[chain.id],
    });
  }, [chain]);
}
