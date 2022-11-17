import React from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { useState, useRef, useCallback, useMemo } from "react";
import { BiPlus, BiMinus, BiStats, BiDollar, BiDownload } from "react-icons/bi";
import { chain } from "wagmi";
import InteractButton, { Button } from "./InteractButton";
import InputWithBalance from "./InputWithBalance";
import Tab from "./Tab";
import { Field, useProvideStore } from "../lib/state/useProvideStore";
import useDerivedTokenInfo from "../lib/hooks/useDerivedTokenInfo";

const DammTabContent = () => {
  const [activeTab, setActiveTab] = useState("tab1");

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

  const { currencies } = useDerivedTokenInfo();
  const { onUserInput } = useProvideStore();

  const formattedAmounts = useMemo(() => {
    return {
      [Field.INDEPENDENT]: "",
      [Field.DEPENDENT]: "",
    };
  }, []);

  const handleTypeIndependent = useCallback(() => {
    (value: string) => {
      onUserInput(Field.INDEPENDENT, value);
    };
  }, [onUserInput]);

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
          currency={currencies[Field.INDEPENDENT]}
          onUserInput={handleTypeIndependent}
          value={formattedAmounts[Field.INDEPENDENT]}
        />
        <InputWithBalance
          currency={currencies[Field.DEPENDENT]}
          onUserInput={handleTypeIndependent}
          value={formattedAmounts[Field.DEPENDENT]}
        />
        <InteractButton
          onClick={() => {}}
          expectedChainId={chain.goerli.id}
          text="Add Liquidity"
        >
          {(() => {
            // if (amount1 === "" || amount2 === "") {
            //   return <Button disabled text="Enter an amount" />;
            // }
            // if (!isApprovedUSDC) {
            //   return <Button onClick={approveUSDC} text="Approve USDC" />;
            // }
            // if (!isApprovedUSDT) {
            //   return <Button onClick={approveUSDT} text="Approve USDT" />;
            // }
          })()}
        </InteractButton>
      </Tabs.Content>
      {/* <Tabs.Content value="tab2">
        <InputWithBalance
          label="DAMM-LP"
          expectedChainId={chain.goerli.id}
          value={withdrawAmount}
          setError={setWithdrawError}
          setValue={reactiveSetWithdrawAmount}
          balance={balances[2]}
        />
        <p className="mb-2 text-white">You receive</p>
        <div className="mb-1 flex w-full items-start justify-between rounded-sm py-2">
          <p className="text-sm text-white/50">USDC</p>
          <p className="text-sm text-white">{expectedUSDCWithdrawn}</p>
        </div>
        <div className="mb-4 flex w-full items-start justify-between rounded-sm py-2">
          <p className="text-sm text-white/50">USDT</p>
          <p className="text-sm text-white">{expectedUSDTWithdrawn}</p>
        </div>
        <InteractButton
          expectedChainId={chain.goerli.id}
          error={withdrawError}
          text="Withdraw"
          onClick={withdraw}
        />
      </Tabs.Content>
      <Tabs.Content value="tab3">
        <div className="flex w-full flex-col items-start">
          <p className="mb-2 font-thin tracking-widest text-white">
            Reserve 1 <span className="text-white/50">(USDT)</span>
          </p>
          <h3 className="mb-8 text-white">
            {reserve1?.div(10 ** 6).toString()}
          </h3>
        </div>
        <div className="flex w-full flex-col items-start">
          <div className="mb-8 h-px w-full bg-white/5" />
          <p className="mb-2 font-thin tracking-widest text-white">
            Reserve 2 <span className="text-white/50">(USDC)</span>
          </p>
          <h3 className="mb-2 text-white">
            {reserve0?.div(10 ** 6).toString()}
          </h3>
        </div>
      </Tabs.Content>
      <Tabs.Content value="tab4">
        <InputWithBalance
          label="USDT"
          expectedChainId={chain.goerli.id}
          value={USDTToMint}
          setValue={setUSDTToMint}
          balance={balances[1]}
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
          expectedChainId={chain.goerli.id}
          value={USDCToMint}
          setValue={setUSDCToMint}
          balance={balances[0]}
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
            onClick={syncPolygon}
            text="Sync to Polygon AMM"
          />
        </div>
      </Tabs.Content> */}
    </Tabs.Root>
  );
};

export default DammTabContent;
