import JSBI from "jsbi";
import { Currency, CurrencyAmount, Fraction } from "../../sdk";

export function formatCurrencyAmount(
  amount: CurrencyAmount<Currency> | undefined,
  sigFigs: number,
  fixedDecimals?: number
): string {
  if (!amount) {
    return "";
  }

  let numberString: number;

  const baseString = parseFloat(amount.toSignificant(sigFigs));
  numberString = fixedDecimals
    ? parseFloat(baseString.toFixed(fixedDecimals))
    : baseString;

  return numberString.toLocaleString();
}

// export function formatPrice(
//   price: Price<Currency, Currency> | undefined,
//   sigFigs: number,
//   locale: SupportedLocale = DEFAULT_LOCALE
// ): string {
//   if (!price) {
//     return "-";
//   }

//   if (parseFloat(price.toFixed(sigFigs)) < 0.0001) {
//     return `<${formatLocaleNumber({ number: 0.00001, locale })}`;
//   }

//   return formatLocaleNumber({ number: price, locale, sigFigs });
// }
