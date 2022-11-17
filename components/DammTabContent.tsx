import React from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { useState, useRef, useCallback, useMemo } from "react";
import { BiPlus, BiMinus, BiStats, BiDollar, BiDownload } from "react-icons/bi";
import { chain } from "wagmi";
import InteractButton, { Button } from "./InteractButton";
import InputWithBalance from "./InputWithBalance";
import useProvideLiquidity from "../lib/hooks/damm/useProvideLiquidity";
import { Currency, CurrencyAmount } from "../sdk";
import { useDerivedProvideInfo } from "../state/provide/useDerivedProvideInfo";
import { useChainDefaults } from "../lib/hooks/useDefaults";
import { Field, useProvideStore } from "../state/provide/useProvideStore";
import TabSlider from "./TabSlider";

const DammTabContent = () => {
  //////////////////////////////////////////////////////////

  const tabsData = [
    {
      id: "tab1",
      title: "Provide",
      icon: <BiPlus className="ml-2 rounded-sm bg-white/5 p-px" />,
    },
    {
      id: "tab2",
      title: "Withdraw",
      icon: <BiMinus className="ml-2 rounded-sm bg-white/5 p-px" />,
    },
    {
      id: "tab3",
      title: "Reserves",
      icon: <BiStats className="ml-2 rounded-sm bg-white/5 p-px" />,
    },
    {
      id: "tab4",
      title: "Mint",
      icon: <BiDollar className="ml-2 rounded-sm bg-white/5 p-px" />,
    },
    {
      id: "tab5",
      title: "Sync",
      icon: <BiDownload className="ml-2 rounded-sm bg-white/5 p-px" />,
    },
  ];

  //////////////////////////////////////////////////////////

  // load up default tokens for chain
  useChainDefaults();

  // load up token info
  const { parsedAmounts, currencies, currencyBalances } =
    useDerivedProvideInfo();

  // load up state
  const [fields, onUserInput] = useProvideStore((state) => [
    state.fields,
    state.onUserInput,
  ]);

  // load up liquidity callback
  const { callback } = useProvideLiquidity(
    parsedAmounts[Field.CURRENCY_A],
    parsedAmounts[Field.CURRENCY_B]
  );

  const handleTypeA = (value: string) => {
    onUserInput(Field.CURRENCY_A, value);
  };

  const handleTypeB = (value: string) => {
    onUserInput(Field.CURRENCY_B, value);
  };

  const handleProvideLiquidity = () => {
    callback?.();
  };

  const handleMax = () => {
    currencyBalances[Field.CURRENCY_A] &&
      onUserInput(
        Field.CURRENCY_A,
        currencyBalances[Field.CURRENCY_A].toExact()
      );
  };

  // const handleMaxB = () => {
  //    return (
  //      currencyBalances[Field.CURRENCY_A] &&
  //      onUserInput(
  //        Field.CURRENCY_A,
  //        currencyBalances[Field.CURRENCY_A]?.toExact()
  //      )
  //    );
  // };

  return (
    <TabSlider tabsData={tabsData}>
      <Tabs.Content value="tab1">
        <InputWithBalance
          currency={currencies[Field.CURRENCY_A]}
          balance={currencyBalances[Field.CURRENCY_A]}
          onUserInput={handleTypeA}
          showMaxButton={true}
          onMax={handleMax}
          value={fields[Field.CURRENCY_A]}
        />
        <InputWithBalance
          currency={currencies[Field.CURRENCY_B]}
          balance={currencyBalances[Field.CURRENCY_B]}
          onUserInput={handleTypeB}
          showMaxButton={false}
          value={fields[Field.CURRENCY_B]}
        />
        <InteractButton
          onConfirm={handleProvideLiquidity}
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
    </TabSlider>
  );
};

export default DammTabContent;
