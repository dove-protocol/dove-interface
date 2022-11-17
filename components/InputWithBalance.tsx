import { BigNumber } from "ethers";
import React from "react";
import { BiDollar } from "react-icons/bi";
import { useNetwork } from "wagmi";
import { formatCurrencyAmount } from "../lib/utils/formatCurrencyAmount";
import { Currency, CurrencyAmount } from "../sdk";

const InputWithBalance = ({
  currency,
  balance,
  value,
  onUserInput,
  showMaxButton,
  onMax,
}: {
  currency: Currency | undefined;
  balance: CurrencyAmount<Currency> | undefined;
  value: string | undefined;
  onUserInput: (value: string) => void;
  showMaxButton: boolean;
  onMax?: () => void;
}) => {
  const error = false;

  return (
    <div className="relative mb-4">
      <input
        disabled={error}
        className={`flex h-24 w-full items-start justify-between rounded-sm border border-white/5 ${
          error ? "bg-transparent" : "bg-black/10"
        } p-4 pb-12 pt-4 font-wagmi text-xl text-white  placeholder:text-white/50 focus:outline-none`}
        placeholder="0.00"
        value={value}
        onChange={(e) => onUserInput(e.target.value)}
      />
      <div className="absolute top-4 right-4 flex flex-col items-end">
        {currency && (
          <h4
            className={`mb-2 flex h-fit items-center  rounded-sm border border-white/5 px-2 py-0.5 ${
              error ? "text-white/50" : "bg-black/10 text-white"
            }`}
          >
            <BiDollar className="mr-2 rounded-sm bg-white/5 p-px" />
            {currency?.symbol}
          </h4>
        )}
        {!error && (
          <div className="flex items-center space-x-2">
            {balance && (
              <p className="text-sm text-white/50">
                Balance: {formatCurrencyAmount(balance, 6)}
              </p>
            )}
            {showMaxButton && balance && (
              <button onClick={() => {}}>
                <p className="text-sm text-white">Max</p>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default InputWithBalance;
