import React from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { useState } from "react";
import { BiPlus, BiMinus, BiStats, BiDollar, BiDownload } from "react-icons/bi";
import InteractButton from "./InteractButton";
import { chain } from "wagmi";
import { validateNumber } from "../lib/utils";
import usedAMM from "../hooks/usedAMMProvide";
import useMint from "../hooks/useMint";
import InputWithBalance from "./InputWithBalance";

const DammTabContent = () => {
  const [activeTab, setActiveTab] = useState("tab1");

  const [amount1, setAmount1] = useState<string>("");
  const [amount2, setAmount2] = useState<string>("");
  const [USDCToMint, setUSDCToMint] = useState<string>("");
  const [USDTToMint, setUSDTToMint] = useState<string>("");
  const [withdrawAmount, setWithdrawAmount] = useState<string>("");

  const { provide } = usedAMM({ amount1, amount2 });
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
        <Tabs.Trigger
          value="tab4"
          className="flex cursor-pointer flex-row items-center rounded-sm border border-transparent px-4 py-1 backdrop-blur-lg transition duration-300 ease-linear hover:text-white rdx-state-active:border-white/5 rdx-state-active:bg-black/10 rdx-state-active:text-white rdx-state-inactive:text-white/50"
        >
          <p className={`font-light ${activeTab === "tab4" && ""}`}>Mint</p>
          <BiDollar className="ml-2 rounded-sm bg-white/5 p-px" />
        </Tabs.Trigger>
        <Tabs.Trigger
          value="tab5"
          className="flex cursor-pointer flex-row items-center rounded-sm border border-transparent px-4 py-1 backdrop-blur-lg transition duration-300 ease-linear hover:text-white rdx-state-active:border-white/5 rdx-state-active:bg-black/10 rdx-state-active:text-white rdx-state-inactive:text-white/50"
        >
          <p className={`font-light ${activeTab === "tab5" && ""}`}>Sync</p>
          <BiDownload className="ml-2 rounded-sm bg-white/5 p-px" />
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="tab1">
        <InputWithBalance
          label="USDT"
          value={amount1}
          setValue={setAmount1}
          balance={"100"}
        />
        <InputWithBalance
          label="USDC"
          value={amount2}
          setValue={setAmount2}
          balance={"200"}
        />
        <InteractButton
          expectedChainId={chain.goerli.id}
          onClick={() => {}}
          text="Add Liquidity"
        />
      </Tabs.Content>
      <Tabs.Content value="tab2">
        {/* <p className="mb-2 font-thin tracking-widest text-white/50">
          <span className="text-white">Total Balance</span> (DAMM-LP)
        </p>
        <h3 className="mb-8 text-white">100</h3> */}
        <InputWithBalance
          label="DAMM-LP"
          value={withdrawAmount}
          setValue={setWithdrawAmount}
          balance={"100"}
        />
        <p className="mb-2 text-white">You receive</p>
        <div className="mb-1 flex w-full items-start justify-between rounded-sm py-2">
          <p className="text-sm text-white/50">USDC</p>
          <p className="text-sm text-white">100</p>
        </div>
        <div className="mb-4 flex w-full items-start justify-between rounded-sm py-2">
          <p className="text-sm text-white/50">USDT</p>
          <p className="text-sm text-white">100</p>
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
      <Tabs.Content value="tab4">
        <InputWithBalance
          label="USDT"
          value={USDTToMint}
          setValue={setUSDTToMint}
          balance="100"
        />
        <div className="relative mb-4">
          <InteractButton
            expectedChainId={chain.goerli.id}
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
          expectedChainId={chain.goerli.id}
          onClick={() => mintUSDC()}
          text="Mint USDC"
        />
      </Tabs.Content>
      <Tabs.Content value="tab5">
        <div className="relative mb-4">
          <InteractButton
            expectedChainId={chain.goerli.id}
            onClick={() => {}}
            text="Sync to Arbitrum AMM"
          />
        </div>
        <div className="relative mb-4">
          <InteractButton
            expectedChainId={chain.goerli.id}
            onClick={() => {}}
            text="Sync to Fuji AMM"
          />
        </div>
      </Tabs.Content>
    </Tabs.Root>
  );
};

export default DammTabContent;
