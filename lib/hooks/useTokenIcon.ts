import { useMemo } from "react";
import { Currency, Token } from "../../sdk";

export default function useCurrencyIcon(
  currency: Currency | undefined
): string | undefined {
  return useMemo(() => {
    if (currency?.symbol === "USDC") {
      return "/usdc.png";
    }
    if (currency?.symbol === "USDT") {
      return "/usdt.png";
    }
    if (currency?.symbol === "DAMM-LP") {
      return "/dove.png";
    }
    if (currency?.symbol === "vUSDC") {
      return "/usdc.png";
    }
    if (currency?.symbol === "vUSDT") {
      return "/usdt.png";
    }
  }, [currency]);
}
