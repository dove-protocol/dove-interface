import { Currency, CurrencyAmount } from "../../sdk";

// Convert [CurrencyAmount] to number with necessary precision for price formatting.
export const currencyAmountToPreciseFloat = (
  currencyAmount: CurrencyAmount<Currency> | undefined
) => {
  if (!currencyAmount) return undefined;
  const floatForLargerNumbers = parseFloat(currencyAmount.toExact());
  if (floatForLargerNumbers < 0.1) {
    return parseFloat(currencyAmount.toSignificant(6));
  }
  return floatForLargerNumbers;
};
