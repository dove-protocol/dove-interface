import React from "react";
import { chain } from "wagmi";
import InteractButton from "./InteractButton";
import {
  BiExpandAlt,
  BiRefresh,
  BiCog,
  BiDollar,
  BiDownload,
} from "react-icons/bi";
import * as Tabs from "@radix-ui/react-tabs";
import { useState, useRef } from "react";
import { validateNumber } from "../lib/utils";
import useMint from "../hooks/useMint";
import InputWithBalance from "./InputWithBalance";
import Tab from "./Tab";
import useBalance from "../hooks/useBalance";
import useSyncToL1 from "../hooks/useSyncToL1";

const SwapTabContent = ({ expectedChainId }: { expectedChainId: number }) => {
  const [activeTab, setActiveTab] = useState("tab1");
  const [amount1, setAmount1] = useState<string>("");
  const [amount2, setAmount2] = useState<string>("");
  const [USDCToMint, setUSDCToMint] = useState<string>("");
  const [USDTToMint, setUSDTToMint] = useState<string>("");
  const [swapError, setSwapError] = useState<string | undefined>();

  const { sync } = useSyncToL1();
  const { balance: USDCBalance } = useBalance({ isUSDC: true });
  const { balance: USDTBalance } = useBalance({ isUSDC: false });
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
      label: "Swap",
      content: <BiRefresh className="ml-2 rounded-sm bg-white/5 p-px" />,
    },
    {
      id: "tab2",
      label: "Mint",
      content: <BiDollar className="ml-2 rounded-sm bg-white/5 p-px" />,
    },
    {
      id: "tab3",
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
          setValue={setAmount1}
          setError={setSwapError}
          balance={USDTBalance}
        />

        <div className="relative z-10 -mb-8 -mt-12 flex h-20 w-full items-center justify-center">
          <BiExpandAlt className="-rotate-45 border border-white/10 bg-[#26272b] text-2xl text-white/50" />
        </div>
        <InputWithBalance
          label="USDC"
          value={amount2}
          setValue={setAmount2}
          setError={setSwapError}
          balance={USDCBalance}
        />
        <InteractButton
          expectedChainId={expectedChainId}
          text="Swap"
          error={swapError}
          onClick={() => {}}
        />
      </Tabs.Content>
      <Tabs.Content value="tab2">
        <InputWithBalance
          label="USDT"
          value={USDTToMint}
          setValue={setUSDTToMint}
          balance={USDTBalance}
        />
        <div className="relative mb-4">
          <InteractButton
            expectedChainId={expectedChainId}
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
          expectedChainId={expectedChainId}
          onClick={mintUSDC}
          text="Mint USDC"
        />
      </Tabs.Content>
      <Tabs.Content value="tab3">
        <div className="relative">
          <InteractButton
            expectedChainId={expectedChainId}
            onClick={sync}
            text="Sync to L1"
          />
        </div>
      </Tabs.Content>
    </Tabs.Root>
  );
};

export default SwapTabContent;
