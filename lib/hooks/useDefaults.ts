import { useEffect } from "react";
import { useNetwork } from "wagmi";
import { DAMM_LP, USDC, USDT } from "../../sdk";
import { useMintStore } from "../../state/mint/useMintStore";
import { Field, useProvideStore } from "../../state/provide/useProvideStore";
import { useWithdrawStore } from "../../state/withdraw/useWithdrawStore";

export function useChainDefaults() {
  const { chain } = useNetwork();
  const setProvideCurrencies = useProvideStore((store) => store.setCurrencies);
  const setWithdrawCurrencies = useWithdrawStore(
    (store) => store.setCurrencies
  );
  const setMintCurrencies = useMintStore((store) => store.setCurrencies);

  useEffect(() => {
    if (!chain) return;
    setProvideCurrencies({
      [Field.CURRENCY_A]: USDC[chain.id],
      [Field.CURRENCY_B]: USDT[chain.id],
    });
    setWithdrawCurrencies({
      [Field.CURRENCY_A]: DAMM_LP[chain.id],
    });
    setMintCurrencies({
      [Field.CURRENCY_A]: USDC[chain.id],
      [Field.CURRENCY_B]: USDT[chain.id],
    });
  }, [chain]);
}
