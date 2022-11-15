import { BigNumber } from "ethers";
import React from "react";
import { BiDollar } from "react-icons/bi";
import { useNetwork } from "wagmi";
import { validateNumber } from "../lib/utils";

const InputWithBalance = ({
  label,
  expectedChainId,
  balance,
  value,
  setValue,
  setError,
  maxEnabled = false,
}: {
  label: string;
  expectedChainId: number;
  balance?: {
    formatted: string;
    value: BigNumber;
  };
  value: string;
  setValue: (value: string) => void;
  setError?: (error: string | undefined) => void;
  maxEnabled?: boolean;
}) => {
  const { chain } = useNetwork();

  let error = chain?.id !== expectedChainId;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (validateNumber(e.target.value)) {
      setValue(e.target.value);

      if (setError && balance && e.target.value !== "") {
        if (BigNumber.from(e.target.value).gt(balance.value)) {
          setError("Insufficient balance");
        } else {
          setError(undefined);
        }
      }
    }
  };

  return (
    <div className="relative mb-4">
      <input
        disabled={error}
        className={`flex h-24 w-full items-start justify-between rounded-sm border border-white/5 ${
          error ? "bg-transparent" : "bg-black/10"
        } p-4 pb-12 pt-4 font-wagmi text-xl text-white  placeholder:text-white/50 focus:outline-none`}
        placeholder="0.00"
        value={value}
        onChange={handleChange}
      />
      <div className="absolute top-4 right-4 flex flex-col items-end">
        <h4
          className={`mb-2 flex h-fit items-center  rounded-sm border border-white/5 px-2 py-0.5 ${
            error ? "text-white/50" : "bg-black/10 text-white"
          }`}
        >
          <BiDollar className="mr-2 rounded-sm bg-white/5 p-px" />
          {label}
        </h4>
        {!error && (
          <div className="flex items-center space-x-2">
            {balance && (
              <p className="text-sm text-white/50">
                Balance: {parseFloat(parseFloat(balance.formatted).toFixed(6))}
              </p>
            )}
            {maxEnabled && balance && (
              <button
                onClick={() => {
                  setValue(
                    balance.value.div(BigNumber.from(10).pow(6)).toString()
                  );
                }}
              >
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
