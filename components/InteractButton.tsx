import React from "react";
import { useAccount } from "wagmi";
import { CustomConnectButton } from "./CustomConnectButton";

const InteractButton = ({
  text,
  onClick,
}: {
  text: string;
  onClick: () => void;
}) => {
  const { address } = useAccount();

  return (
    <>
      {address ? (
        <Button onClick={onClick} text={text} />
      ) : (
        <CustomConnectButton />
      )}
    </>
  );
};

export const Button = ({
  text,
  onClick,
}: {
  text: string;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className="flex h-16 w-full items-center justify-center rounded-sm border border-white/5 shadow-damn transition duration-500 ease-in-out hover:shadow-none"
    >
      <p className="text-white drop-shadow-soju">{text}</p>
    </button>
  );
};

export default InteractButton;
