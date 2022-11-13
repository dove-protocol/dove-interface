import React from "react";
import { chain } from "wagmi";
import InteractButton from "./InteractButton";
import { BiExpandAlt } from "react-icons/bi";

const SwapTabContent = ({ expectedChainId }: { expectedChainId: number }) => {
  return (
    <>
      <p className="mb-4 font-thin text-white">Swap</p>
      <div className="flex h-20 w-full items-start justify-between rounded-sm border border-white/5 bg-black/10 p-4">
        <input
          className="bg-transparent font-wagmi text-xl text-white  placeholder:text-white/50 focus:outline-none"
          placeholder="0.00"
        />
        <h4 className="h-fit rounded-sm border border-white/5 px-2 py-0.5 text-white/50 ">
          USDT
        </h4>
      </div>
      <div className="relative -my-8 flex h-20 w-full items-center justify-center">
        <BiExpandAlt className="text-2xl -rotate-45 text-white drop-shadow-soju" />
      </div>
      <div className="relative mb-4 flex h-20 w-full items-start justify-between rounded-sm border border-white/5 bg-black/10 p-4">
        <input
          className="bg-transparent font-wagmi text-xl text-white  placeholder:text-white/50 focus:outline-none"
          placeholder="0.00"
        />
        <h4 className="h-fit rounded-sm border border-white/5 px-2 py-0.5 text-white/50 ">
          USDC
        </h4>
      </div>
      <InteractButton
        expectedChainId={expectedChainId}
        text="Swap"
        onClick={() => {}}
      />
    </>
  );
};

export default SwapTabContent;
