import React from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { useState } from "react";
import { BiPlus, BiMinus, BiStats } from "react-icons/bi";
import InteractButton from "./InteractButton";
import { chain } from "wagmi";
import { validateNumber } from "../lib/utils";
import usedAMM from "../hooks/usedAMMProvide";

const DammTabContent = () => {
  const [activeTab, setActiveTab] = useState("tab1");

  const [amount1, setAmount1] = useState<string>();
  const [amount2, setAmount2] = useState<string>();

  const { provide } = usedAMM({ amount1, amount2 });

  const handleAmount1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (validateNumber(e.target.value)) {
      setAmount1(e.target.value);
    }
  };

  const handleAmount2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (validateNumber(e.target.value)) {
      setAmount2(e.target.value);
    }
  };

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
          <p className={`font-light ${activeTab === "tab1" && ""}`}>Provide</p>
          <BiPlus className="ml-2 rounded-sm bg-white/5 p-px" />
        </Tabs.Trigger>
        <Tabs.Trigger
          value="tab2"
          className="flex cursor-pointer flex-row items-center rounded-sm border border-transparent px-4 py-1 backdrop-blur-lg transition duration-300 ease-linear hover:text-white focus:outline-none rdx-state-active:border-white/5 rdx-state-active:bg-black/10 rdx-state-active:text-white rdx-state-inactive:text-white/50"
        >
          <p className={`font-light ${activeTab === "tab2" && ""}`}>Withdraw</p>
          <BiMinus className="ml-2 rounded-sm bg-white/5 p-px" />
        </Tabs.Trigger>
        <Tabs.Trigger
          value="tab3"
          className="flex cursor-pointer flex-row items-center rounded-sm border border-transparent px-4 py-1 backdrop-blur-lg transition duration-300 ease-linear hover:text-white focus:outline-none rdx-state-active:border-white/5 rdx-state-active:bg-black/10 rdx-state-active:text-white rdx-state-inactive:text-white/50"
        >
          <p className={`font-light ${activeTab === "tab3" && ""}`}>Reserves</p>
          <BiStats className="ml-2 rounded-sm bg-white/5 p-px" />
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="tab1">
        <div className="relative mb-4">
          <input
            className="flex h-20 w-full items-start justify-between rounded-sm border border-white/5 bg-black/10 p-4 pb-10 pt-4 font-wagmi text-xl text-white  placeholder:text-white/50 focus:outline-none"
            placeholder="0.00"
            value={amount1}
            onChange={handleAmount1Change}
          />
          <h4 className="pointer-events-none absolute top-4 right-4 h-fit rounded-sm border border-white/5 px-2 py-0.5 text-white/50 ">
            USDT
          </h4>
        </div>
        <div className="relative mb-4">
          <input
            className="flex h-20 w-full items-start justify-between rounded-sm border border-white/5 bg-black/10 p-4 pb-10 pt-4 font-wagmi text-xl text-white  placeholder:text-white/50 focus:outline-none"
            placeholder="0.00"
            value={amount2}
            onChange={handleAmount2Change}
          />
          <h4 className="pointer-events-none absolute top-4 right-4 h-fit rounded-sm border border-white/5 px-2 py-0.5 text-white/50 ">
            USDC
          </h4>
        </div>
        <InteractButton
          expectedChainId={chain.goerli.id}
          onClick={() => {}}
          text="Add Liquidity"
        />
      </Tabs.Content>
      <Tabs.Content value="tab2">
        <p className="mb-2 font-thin tracking-widest text-white/50">
          <span className="text-white">Total Balance</span> (ETH)
        </p>
        <h3 className="mb-8 text-white">$392,432.93</h3>
        <div className="mb-4 flex h-20 w-full items-start justify-between rounded-sm border border-white/5 bg-black/10 p-4">
          <input
            className="bg-transparent font-wagmi text-xl text-white  placeholder:text-white/50 focus:outline-none"
            placeholder="0.00"
          />
          <h4 className="h-fit rounded-sm border border-white/5 px-2 py-0.5 text-white/50 ">
            USDT
          </h4>
        </div>
        <InteractButton
          expectedChainId={chain.goerli.id}
          text="Withdraw"
          onClick={() => {}}
        />
      </Tabs.Content>
      <Tabs.Content value="tab3">
        <div className="flex w-full flex-col items-start">
          <p className="mb-2 font-thin tracking-widest text-white">
            Reserve 1 <span className="text-white/50">(USDT)</span>
          </p>
          <h3 className="mb-8 text-white">$139.14</h3>
        </div>
        <div className="flex w-full flex-col items-start">
          <div className="mb-8 h-px w-full bg-white/5" />
          <p className="mb-2 font-thin tracking-widest text-white">
            Reserve 2 <span className="text-white/50">(USDC)</span>
          </p>
          <h3 className="mb-2 text-white">$23.64</h3>
        </div>
      </Tabs.Content>
    </Tabs.Root>
  );
};

export default DammTabContent;
