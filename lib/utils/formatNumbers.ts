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

/**
 * Returns a numerical amount of any token formatted in human readable string for use in template.
 *
 * For transaction review numbers, such as token quantities, NFT price (token-denominated),
 *  network fees, transaction history items. Adheres to guidelines defined here:
 * https://www.notion.so/uniswaplabs/Number-standards-fbb9f533f10e4e22820722c2f66d23c0
 * @param num numerical value denominated in any token
 * @param maxDigits the maximum number of digits that should be shown for the quantity
 */
export const formatTransactionAmount = (
  num: number | undefined | null,
  maxDigits = 9
) => {
  if (num === 0) return "0.00";
  if (!num) return "";
  if (num < 0.00001) {
    return "<0.00001";
  }
  if (num >= 0.00001 && num < 1) {
    return `${Number(num.toFixed(5)).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 5,
    })}`;
  }
  if (num >= 1 && num < 10000) {
    return `${Number(num.toPrecision(6)).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    })}`;
  }
  if (num >= 10000 && num < 1000000) {
    return `${Number(num.toFixed(2)).toLocaleString(undefined, {
      minimumFractionDigits: 2,
    })}`;
  }
  // For very large numbers, switch to scientific notation and show as much precision
  // as permissible by maxDigits param.
  if (num >= Math.pow(10, maxDigits - 1)) {
    return `${num.toExponential(maxDigits - 3)}`;
  }
  return `${Number(num.toFixed(2)).toLocaleString(undefined, {
    minimumFractionDigits: 2,
  })}`;
};
