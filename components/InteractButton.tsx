import React from "react";
import { useAccount, useNetwork } from "wagmi";
import { ChainId } from "../sdk";
import {
  CustomConnectButton,
  InteractConnectButton,
} from "./CustomConnectButton";

const InteractButton = ({
  text,
  expectedChainId,
  onConfirm,
  children,
}: {
  text: string;
  expectedChainId: ChainId | undefined;
  error?: string;
  onConfirm: () => void;
  children?: React.ReactNode;
}) => {
  const { address } = useAccount();
  const { chain } = useNetwork();

  const error = false;

  return (
    <>
      {(() => {
        if (address) {
          if (!chain) {
            return <Button disabled text="Unsupported Network" />;
          }
          if (chain?.id !== expectedChainId) {
            return <Button disabled text="Wrong Network" />;
          }
          if (error) {
            return <Button disabled text={error} />;
          }

          if (children) {
            return <>{children}</>;
          }

          return <Button onClick={onConfirm} text={text} />;
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
      className="group flex h-16 w-full items-center justify-center rounded-sm border border-sky-400/50 bg-sky-400/5 transition duration-500 ease-in-out hover:shadow-none disabled:border-none disabled:bg-white/5 disabled:shadow-none"
    >
      <p
        className={`transition duration-500 ease-in-out ${
          disabled
            ? "text-white/50 drop-shadow-none"
            : "text-sky-400 group-hover:drop-shadow-soju"
        }`}
      >
        {text}
      </p>
    </button>
  );
};

export default InteractButton;
