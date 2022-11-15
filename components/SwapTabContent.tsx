import React from "react";
import { chain } from "wagmi";
import InteractButton, { Button } from "./InteractButton";
import {
  BiExpandAlt,
  BiRefresh,
  BiCog,
  BiDollar,
  BiDownload,
} from "react-icons/bi";
import * as Tabs from "@radix-ui/react-tabs";
import { useState, useRef } from "react";
import { getDammAddress, getTokenAddress, validateNumber } from "../lib/utils";
import useMint from "../hooks/useMint";
import InputWithBalance from "./InputWithBalance";
import Tab from "./Tab";
import useBalance from "../hooks/useBalance";
import useSyncToL1 from "../hooks/useSyncToL1";
import useApproveToken from "../hooks/useApproveToken";
import { BigNumber } from "ethers";

const SwapTabContent = ({ expectedChainId }: { expectedChainId: number }) => {
  const [activeTab, setActiveTab] = useState("tab1");
  const [isSwapped, setIsSwapped] = useState(false);
  const [amount1, setAmount1] = useState<string>("");
  const [amount2, setAmount2] = useState<string>("");
  const [USDCToMint, setUSDCToMint] = useState<string>("");
  const [USDTToMint, setUSDTToMint] = useState<string>("");
  const [swapError, setSwapError] = useState<string | undefined>();

  const { approve: approveAmount1, isApproved: isApprovedAmount1 } =
    useApproveToken({
      token: getTokenAddress(true),
      spender: getDammAddress(),
      amountRequested: amount1,
    });

  const { sync } = useSyncToL1();
  const usdcData = useBalance({ isUSDC: true });
  const usdtData = useBalance({ isUSDC: false });
  const { mint: mintUSDC } = useMint({
    amount: USDCToMint === "" ? 0 : USDCToMint,
    isUSDC: true,
  });
  const { mint: mintUSDT } = useMint({
    amount: USDTToMint === "" ? 0 : USDTToMint,
    isUSDC: false,
  });

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
        {!isSwapped ? (
          <InputWithBalance
            label="USDT"
            expectedChainId={expectedChainId}
            value={amount1}
            setValue={setAmount1}
            setError={setSwapError}
            balance={usdtData}
            maxEnabled
          />
        ) : (
          <InputWithBalance
            label="USDC"
            expectedChainId={expectedChainId}
            value={amount2}
            setValue={setAmount2}
            setError={setSwapError}
            balance={usdcData}
            maxEnabled
          />
        )}
        <div className="relative left-1/2 z-10 -my-12 -mb-8 flex h-20 w-fit -translate-x-1/2 items-center justify-center">
          <button className="group" onClick={() => setIsSwapped(!isSwapped)}>
            <BiExpandAlt className="-rotate-45 border border-white/10 bg-[#26272b] text-2xl text-white/50 transition ease-in-out group-hover:scale-110 group-hover:text-white" />
          </button>
        </div>
        {!isSwapped ? (
          <InputWithBalance
            label="USDC"
            expectedChainId={expectedChainId}
            value={amount2}
            setValue={setAmount2}
            setError={setSwapError}
            balance={usdcData}
          />
        ) : (
          <InputWithBalance
            label="USDT"
            expectedChainId={expectedChainId}
            value={amount1}
            setValue={setAmount1}
            setError={setSwapError}
            balance={usdtData}
          />
        )}
        <InteractButton
          expectedChainId={expectedChainId}
          text="Swap"
          error={swapError}
          onClick={() => {}}
        >
          {(() => {
            if (!isApprovedAmount1) {
              return <Button onClick={approveAmount1} text="Approve USDC" />;
            }
          })()}
        </InteractButton>
      </Tabs.Content>
      <Tabs.Content value="tab2">
        <InputWithBalance
          label="USDT"
          expectedChainId={expectedChainId}
          value={USDTToMint}
          setValue={setUSDTToMint}
          balance={usdtData}
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
          expectedChainId={expectedChainId}
          value={USDCToMint}
          setValue={setUSDCToMint}
          balance={usdcData}
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
