import { BigNumber } from "ethers";
import React, { useMemo } from "react";
import { BiDollar } from "react-icons/bi";
import { useNetwork } from "wagmi";
import { formatCurrencyAmount } from "../lib/utils/formatCurrencyAmount";
import { ChainId, Currency, CurrencyAmount } from "../sdk";

const InputWithBalance = ({
  currency,
  balance,
  value,
  onUserInput,
  showMaxButton,
  onMax,
  disabled = false,
  expectedChainId,
}: {
  currency: Currency | undefined;
  balance: CurrencyAmount<Currency> | undefined;
  value: string;
  onUserInput?: (value: string) => void;
  showMaxButton: boolean;
  onMax?: () => void;
  disabled?: boolean;
  expectedChainId: ChainId | undefined;
}) => {
  const { chain } = useNetwork();

  if (!chain || chain.id !== expectedChainId) {
    disabled = true;
  }

  return (
    <div className="relative mb-2">
      <input
        disabled={disabled}
        className={`disabled flex h-24 w-full items-start justify-between rounded-sm border border-white/10 bg-transparent p-4 pb-12 pt-4 text-xl font-normal text-white placeholder:text-white/50 focus:outline-none  disabled:bg-white/5 disabled:font-thin`}
        placeholder="0.00"
        value={value}
        onChange={(e) => {
          if (onUserInput) {
            onUserInput(e.target.value);
          }
        }}
      />
      <div className="absolute top-4 right-4 flex flex-col items-end">
        {currency && (
          <h4
            className={`mb-2 flex h-fit items-center  rounded-sm border border-white/10 px-2 py-0.5 ${
              disabled ? "text-white/50" : "bg-black/10 text-white"
            }`}
          >
            <BiDollar className="mr-2 rounded-sm bg-white/10 p-px" />
            {currency?.symbol}
          </h4>
        )}
        {!disabled && (
          <div className="flex items-center space-x-2">
            {balance && (
              <p className="text-sm text-white/50">
                Balance: {formatCurrencyAmount(balance, 6)}
              </p>
            )}
            {showMaxButton && balance && (
              <button onClick={onMax}>
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
