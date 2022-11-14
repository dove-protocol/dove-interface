import React from "react";
import { validateNumber } from "../lib/utils";

const InputWithBalance = ({
  label,
  balance,
  value,
  setValue,
  setError,
}: {
  label: string;
  balance: string;
  value: string;
  setValue: (value: string) => void;
  setError?: (error: string | undefined) => void;
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (validateNumber(e.target.value)) {
      setValue(e.target.value);

      if (setError) {
        if (parseFloat(e.target.value) > parseFloat(balance)) {
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
        className="flex h-24 w-full items-start justify-between rounded-sm border border-white/5 bg-black/10 p-4 pb-12 pt-4 font-wagmi text-xl text-white  placeholder:text-white/50 focus:outline-none"
        placeholder="0.00"
        value={value}
        onChange={handleChange}
      />
      <div className="absolute top-4 right-4 flex flex-col items-end">
        <h4 className="mb-2 h-fit rounded-sm border border-white/5 px-2 py-0.5 text-white">
          {label}
        </h4>
        <p className="text-sm text-white/50">
          Balance: {parseFloat(parseFloat(balance).toFixed(6))}
        </p>
      </div>
    </div>
  );
};

export default InputWithBalance;
