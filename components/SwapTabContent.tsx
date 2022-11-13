import React from "react";
import { chain } from "wagmi";
import InteractButton from "./InteractButton";
import { BiExpandAlt, BiRefresh, BiCog } from "react-icons/bi";
import * as Tabs from "@radix-ui/react-tabs";
import { useState } from "react";

const SwapTabContent = ({ expectedChainId }: { expectedChainId: number }) => {
  const [activeTab, setActiveTab] = useState("tab1");

  return (
    <Tabs.Root
      defaultValue="tab1"
      value={activeTab}
      onValueChange={(v) => setActiveTab(v)}
      className="w-full"
    >
      <Tabs.List className="mb-4 flex w-full flex-row rounded-sm bg-black/10 p-1">
        <Tabs.Trigger
          value="tab1"
          className="flex cursor-pointer flex-row items-center rounded-sm border border-transparent px-4 py-1 backdrop-blur-lg transition duration-300 ease-linear hover:text-white rdx-state-active:border-white/5 rdx-state-active:bg-black/10 rdx-state-active:text-white rdx-state-inactive:text-white/50"
        >
          <p className={`font-light ${activeTab === "tab1" && ""}`}>Swap</p>
          <BiRefresh className="ml-2 rounded-sm bg-white/5 p-px" />
        </Tabs.Trigger>
        <Tabs.Trigger
          value="tab2"
          className="flex cursor-pointer flex-row items-center rounded-sm border border-transparent px-4 py-1 backdrop-blur-lg transition duration-300 ease-linear hover:text-white rdx-state-active:border-white/5 rdx-state-active:bg-black/10 rdx-state-active:text-white rdx-state-inactive:text-white/50"
        >
          <p className={`font-light ${activeTab === "tab2" && ""}`}>Advanced</p>
          <BiCog className="ml-2 rounded-sm bg-white/5 p-px" />
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="tab1">
        <div className="relative">
          <input
            className="flex h-20 w-full items-start justify-between rounded-sm border border-white/5 bg-black/10 p-4 pb-10 pt-4 font-wagmi text-xl text-white  placeholder:text-white/50 focus:outline-none"
            placeholder="0.00"
          />
          <h4 className="pointer-events-none absolute top-4 right-4 h-fit rounded-sm border border-white/5 px-2 py-0.5 text-white/50 ">
            USDT
          </h4>
        </div>

        <div className="relative -my-8 flex h-20 w-full items-center justify-center">
          <BiExpandAlt className="-rotate-45 text-2xl text-white/50" />
        </div>
        <div className="relative mb-4">
          <input
            className="flex h-20 w-full items-start justify-between rounded-sm border border-white/5 bg-black/10 p-4 pb-10 pt-4 font-wagmi text-xl text-white  placeholder:text-white/50 focus:outline-none"
            placeholder="0.00"
          />
          <h4 className="pointer-events-none absolute top-4 right-4 h-fit rounded-sm border border-white/5 px-2 py-0.5 text-white/50 ">
            USDC
          </h4>
        </div>
        <InteractButton
          expectedChainId={expectedChainId}
          text="Swap"
          onClick={() => {}}
        />
      </Tabs.Content>
      <Tabs.Content value="tab2">
        <div className="relative mb-4">
          <InteractButton
            expectedChainId={expectedChainId}
            onClick={() => {}}
            text="Sync to L1"
          />
        </div>
      </Tabs.Content>
    </Tabs.Root>
  );
};

export default SwapTabContent;
