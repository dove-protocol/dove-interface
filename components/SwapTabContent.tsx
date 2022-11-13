import React from "react";
import { chain } from "wagmi";
import InteractButton from "./InteractButton";
import { BiExpandAlt, BiRefresh, BiCog, BiDollar } from "react-icons/bi";
import * as Tabs from "@radix-ui/react-tabs";
import { useState } from "react";
import { validateNumber } from "../lib/utils";
import useMint from "../hooks/useMint";
import InputWithBalance from "./InputWithBalance";

const SwapTabContent = ({ expectedChainId }: { expectedChainId: number }) => {
  const [activeTab, setActiveTab] = useState("tab1");
  const [amount1, setAmount1] = useState<string>("");
  const [amount2, setAmount2] = useState<string>("");
  const [USDCToMint, setUSDCToMint] = useState<string>("");
  const [USDTToMint, setUSDTToMint] = useState<string>("");

  const { mint: mintUSDC } = useMint({ amount: USDCToMint, isUSDC: true });
  const { mint: mintUSDT } = useMint({ amount: USDTToMint, isUSDC: false });

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
          className="flex cursor-pointer flex-row items-center rounded-sm border border-transparent px-4 py-1 backdrop-blur-lg transition duration-300 ease-linear hover:text-white focus:outline-none rdx-state-active:border-white/5 rdx-state-active:bg-black/10 rdx-state-active:text-white rdx-state-inactive:text-white/50"
        >
          <p className={`font-light ${activeTab === "tab1" && ""}`}>Swap</p>
          <BiRefresh className="ml-2 rounded-sm bg-white/5 p-px" />
        </Tabs.Trigger>
        <Tabs.Trigger
          value="tab3"
          className="flex cursor-pointer flex-row items-center rounded-sm border border-transparent px-4 py-1 backdrop-blur-lg transition duration-300 ease-linear hover:text-white focus:outline-none rdx-state-active:border-white/5 rdx-state-active:bg-black/10 rdx-state-active:text-white rdx-state-inactive:text-white/50"
        >
          <p className={`font-light ${activeTab === "tab3" && ""}`}>Mint</p>
          <BiDollar className="ml-2 rounded-sm bg-white/5 p-px" />
        </Tabs.Trigger>
        <Tabs.Trigger
          value="tab2"
          className="flex cursor-pointer flex-row items-center rounded-sm border border-transparent px-4 py-1 backdrop-blur-lg transition duration-300 ease-linear hover:text-white focus:outline-none rdx-state-active:border-white/5 rdx-state-active:bg-black/10 rdx-state-active:text-white rdx-state-inactive:text-white/50"
        >
          <p className={`font-light ${activeTab === "tab2" && ""}`}>Advanced</p>
          <BiCog className="ml-2 rounded-sm bg-white/5 p-px" />
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="tab1">
        <InputWithBalance
          label="USDT"
          value={amount1}
          setValue={setAmount1}
          balance="100"
        />

        <div className="relative -mb-8 -mt-12 flex h-20 w-full items-center justify-center">
          <BiExpandAlt className="-rotate-45 text-2xl text-white/50" />
        </div>
        <InputWithBalance
          label="USDC"
          value={amount2}
          setValue={setAmount2}
          balance="100"
        />
        <InteractButton
          expectedChainId={expectedChainId}
          text="Swap"
          onClick={() => {}}
        />
      </Tabs.Content>
      <Tabs.Content value="tab3">
        <InputWithBalance
          label="USDT"
          value={USDTToMint}
          setValue={setUSDTToMint}
          balance="100"
        />
        <div className="relative mb-4">
          <InteractButton
            expectedChainId={expectedChainId}
            onClick={() => mintUSDT()}
            text="Mint USDT"
          />
        </div>
        <InputWithBalance
          label="USDC"
          value={USDCToMint}
          setValue={setUSDCToMint}
          balance="100"
        />
        <InteractButton
          expectedChainId={expectedChainId}
          onClick={() => mintUSDC()}
          text="Mint USDC"
        />
      </Tabs.Content>
      <Tabs.Content value="tab2">
        <div className="relative">
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
