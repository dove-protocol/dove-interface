import React from "react";
import { BiError } from "react-icons/bi";
import { GiPeaceDove } from "react-icons/gi";
import { useSwitchNetwork } from "wagmi";
import { ChainId } from "../sdk";
import { SUPPORTED_CHAIN_NAMES } from "../sdk/constants/chains";

const UnsupportedNetworkContent = () => {
  const { switchNetwork } = useSwitchNetwork();

  const handleSwitchNetwork = (chainId: number) => {
    switchNetwork?.(chainId);
  };

  const supportedChainIds = Object.values(ChainId)
    .filter((x) => typeof x === "number")
    .filter((values) => values !== ChainId.ETHEREUM_GOERLI) as number[];

  const chainImage = (chainId: number) => {
    switch (chainId) {
      case ChainId.POLYGON_MUMBAI:
        return "/polygon.png";
      case ChainId.ARBITRUM_GOERLI:
        return "/arbitrum.png";
      default:
        return "";
    }
  };

  return (
    <div className="flex flex-col">
      <div className="mb-8 flex flex-col items-start justify-start">
        <GiPeaceDove className="mb-4 rounded-sm bg-black/50 p-2 text-4xl text-white" />
        <div className="flex flex-col">
          <h4 className="text-white">Dove Protocol</h4>
          <p className=" text-xs text-white/50">
            Please select a supported network
          </p>
        </div>
      </div>
      {supportedChainIds.map((chainId) => {
        return (
          <button
            onClick={() => handleSwitchNetwork(chainId)}
            className="relative mb-2 flex h-16 w-full items-center justify-between overflow-hidden rounded-sm border border-white/5 bg-black/10 p-4 shadow-damn transition duration-500 ease-in-out hover:shadow-none"
          >
            <div className="flex items-center">
              <p className=" text-white">
                {SUPPORTED_CHAIN_NAMES[chainId as ChainId]}
              </p>
            </div>
            <img
              className="absolute right-0 h-24 w-24 opacity-5 grayscale"
              src={chainImage(chainId)}
            />
          </button>
        );
      })}
    </div>
  );
};

export default UnsupportedNetworkContent;
