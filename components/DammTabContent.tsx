import React from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { useState, useRef } from "react";
import { BiPlus, BiMinus, BiStats, BiDollar, BiDownload } from "react-icons/bi";
import { chain } from "wagmi";

import InteractButton from "./InteractButton";
import InputWithBalance from "./InputWithBalance";
import Tab from "./Tab";

import { validateNumber } from "../lib/utils";
import { DAMM } from "../lib/contracts";
import usedAMM from "../hooks/usedAMMProvide";
import usedAMMData from "../hooks/usedAMMData";
import useMint from "../hooks/useMint";
import useBalance from "../hooks/useBalance";
import useSyncL2 from "../hooks/useSyncL2";
import { avalancheChain } from "../pages/_app";
import { BigNumber } from "ethers";

const DammTabContent = () => {
  const [activeTab, setActiveTab] = useState("tab1");

  const { reserve0, reserve1 } = usedAMMData();
  const [amount1, setAmount1] = useState<string>("");
  // wrapper around setAmount1
  // automatically sets other field
  const reactiveSetAmount1 = (value: string) => {
    setAmount1(value);
    const amount0 = value == "" ? 0 : BigNumber.from(value);
    setAmount2(reserve1.mul(amount0).div(reserve0).toString());
  };
  const [amount2, setAmount2] = useState<string>("");
  const reactiveSetAmount2 = (value: string) => {
    setAmount2(value);
    const amount1 = value == "" ? 0 : BigNumber.from(value);
    setAmount1(reserve0.mul(amount1).div(reserve1).toString());
  };
  const [USDCToMint, setUSDCToMint] = useState<string>("");
  const [USDTToMint, setUSDTToMint] = useState<string>("");
  const [withdrawAmount, setWithdrawAmount] = useState<string>("");

  const [damm, setDamm] = useState<DAMM | undefined>();

  const [provideError, setProvideError] = useState<string | undefined>();
  const [withdrawError, setWithdrawError] = useState<string | undefined>();

  const { balance: USDCBalance } = useBalance({ isUSDC: true });
  const { balance: USDTBalance } = useBalance({ isUSDC: false });
  const { sync: syncArbi } = useSyncL2({ chainId: chain.arbitrumGoerli.id });
  const { sync: syncFuji } = useSyncL2({ chainId: avalancheChain.id });
  const { provide } = usedAMM({ amount1, amount2 });
  const { mint: mintUSDC } = useMint({ amount: USDCToMint, isUSDC: true });
  const { mint: mintUSDT } = useMint({ amount: USDTToMint, isUSDC: false });

  const wrapperRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);

  const [tabBoundingBox, setTabBoundingBox] = useState<DOMRect | null>(null);
  const [wrapperBoundingBox, setWrapperBoundingBox] = useState<DOMRect | null>(
    null
  );
  const [highlightedTab, setHighlightedTab] = useState<string | null>(null);
  const [isHoveredFromNull, setIsHoveredFromNull] = useState(true);

  const repositionHighlight = (e: any, id: string) => {
    if (wrapperRef.current) {
      setTabBoundingBox(e.target.getBoundingClientRect());
      setWrapperBoundingBox(wrapperRef.current.getBoundingClientRect());
      setIsHoveredFromNull(!highlightedTab);
      setHighlightedTab(id);
    }
  };

  const highlightStyles: any = {};

  if (tabBoundingBox && wrapperBoundingBox) {
    highlightStyles.transitionDuration = isHoveredFromNull ? "0ms" : "150ms";
    highlightStyles.opacity = highlightedTab ? 1 : 0;
    highlightStyles.width = `${tabBoundingBox.width - 1}px`;
    highlightStyles.transform = `translate(${
      tabBoundingBox.left - wrapperBoundingBox.left + 1
    }px)`;
  }

  const tabsData = [
    {
      id: "tab1",
      label: "Provide",
      content: <BiPlus className="ml-2 rounded-sm bg-white/5 p-px" />,
    },
    {
      id: "tab2",
      label: "Withdraw",
      content: <BiMinus className="ml-2 rounded-sm bg-white/5 p-px" />,
    },
    {
      id: "tab3",
      label: "Reserves",
      content: <BiStats className="ml-2 rounded-sm bg-white/5 p-px" />,
    },
    {
      id: "tab4",
      label: "Mint",
      content: <BiDollar className="ml-2 rounded-sm bg-white/5 p-px" />,
    },
    {
      id: "tab5",
      label: "Sync",
      content: <BiDownload className="ml-2 rounded-sm bg-white/5 p-px" />,
    },
  ];

  return (
    <Tabs.Root
      defaultValue="tab1"
      value={activeTab}
      onValueChange={(v) => setActiveTab(v)}
      className="w-full"
    >
      <Tabs.List
        ref={wrapperRef}
        onMouseLeave={() => setHighlightedTab(null)}
        className="relative mb-4 flex w-full flex-row rounded-sm bg-black/10 p-1"
      >
        <div
          className="absolute -left-px h-[34px] translate-y-[4px] rounded-sm bg-white/5 transition"
          ref={highlightRef}
          style={highlightStyles}
        />
        {tabsData.map((tab) => (
          <Tab
            key={tab.id}
            id={tab.id}
            label={tab.label}
            repositionHighlight={repositionHighlight}
          >
            {tab.content}
          </Tab>
        ))}
      </Tabs.List>
      <Tabs.Content value="tab1">
        <InputWithBalance
          label="USDT"
          value={amount1}
          setError={setProvideError}
          setValue={reactiveSetAmount1}
          balance={USDTBalance}
        />
        <InputWithBalance
          label="USDC"
          value={amount2}
          setError={setProvideError}
          setValue={reactiveSetAmount2}
          balance={USDCBalance}
        />
        <InteractButton
          expectedChainId={chain.goerli.id}
          error={provideError}
          onClick={() => {}}
          text="Add Liquidity"
        />
      </Tabs.Content>
      <Tabs.Content value="tab2">
        <InputWithBalance
          label="DAMM-LP"
          value={withdrawAmount}
          setError={setWithdrawError}
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
          error={withdrawError}
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
          balance={USDTBalance}
        />
        <div className="relative mb-4">
          <InteractButton
            expectedChainId={chain.goerli.id}
            onClick={mintUSDT}
            text="Mint USDT"
          />
        </div>
        <InputWithBalance
          label="USDC"
          value={USDCToMint}
          setValue={setUSDCToMint}
          balance={USDCBalance}
        />
        <InteractButton
          expectedChainId={chain.goerli.id}
          onClick={mintUSDC}
          text="Mint USDC"
        />
      </Tabs.Content>
      <Tabs.Content value="tab5">
        <div className="relative mb-4">
          <InteractButton
            expectedChainId={chain.goerli.id}
            onClick={syncArbi}
            text="Sync to Arbitrum AMM"
          />
        </div>
        <div className="relative">
          <InteractButton
            expectedChainId={chain.goerli.id}
            onClick={syncFuji}
            text="Sync to Fuji AMM"
          />
        </div>
      </Tabs.Content>
    </Tabs.Root>
  );
};

export default DammTabContent;
