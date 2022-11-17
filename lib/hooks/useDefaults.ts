import { useEffect } from "react";
import { useNetwork } from "wagmi";
import {
  USDC,
  USDT,
} from "../../sdk";
import { Field, useProvideStore } from "../../state/provide/useProvideStore";


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
