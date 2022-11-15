import React from "react";
import { useAccount, useNetwork } from "wagmi";
import {
  CustomConnectButton,
  InteractConnectButton,
} from "./CustomConnectButton";

const InteractButton = ({
  text,
  expectedChainId,
  onClick,
  error = undefined,
  children,
}: {
  text: string;
  expectedChainId: number;
  error?: string;
  onClick: () => void;
  children?: React.ReactNode;
}) => {
  const { address } = useAccount();
  const { chain } = useNetwork();

  return (
    <>
      {(() => {
        if (address) {
          if (chain?.id !== expectedChainId) {
            return <Button disabled text="Wrong Network" />;
          }
          if (error) {
            return <Button disabled text={error} />;
          }

          if (children) {
            return <>{children}</>;
          }

          return <Button onClick={onClick} text={text} />;
        } else {
          return <InteractConnectButton />;
        }
      })()}
    </>
  );
};

export const Button = ({
  text,
  disabled = false,
  onClick,
}: {
  text: string;
  disabled?: boolean;
  onClick?: () => void;
}) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className="flex h-16 w-full  items-center justify-center rounded-sm border border-white/5 shadow-damn transition duration-500 ease-in-out hover:shadow-none disabled:shadow-none"
    >
      <p
        className={`${
          disabled
            ? "text-white/50 drop-shadow-none"
            : "text-white drop-shadow-soju"
        }`}
      >
        {text}
      </p>
    </button>
  );
};

export default InteractButton;
