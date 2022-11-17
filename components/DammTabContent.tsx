import React from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { useState, useRef, useCallback, useMemo } from "react";
import { BiPlus, BiMinus, BiStats, BiDollar, BiDownload } from "react-icons/bi";
import { chain } from "wagmi";
import InteractButton, { Button } from "./InteractButton";
import InputWithBalance from "./InputWithBalance";
import useProvideLiquidity from "../lib/hooks/provide/useProvideLiquidity";
import { ChainId, Currency, CurrencyAmount, DAMM_LP } from "../sdk";
import { useDerivedProvideInfo } from "../state/provide/useDerivedProvideInfo";
import { useChainDefaults } from "../lib/hooks/useDefaults";
import { Field, useProvideStore } from "../state/provide/useProvideStore";
import TabSlider from "./TabSlider";
import {
  Field as WithdrawField,
  useWithdrawStore,
} from "../state/withdraw/useWithdrawStore";
import { useDerivedWithdrawInfo } from "../state/withdraw/useDerivedWithdrawInfo";
import useWithdrawLiquidity from "../lib/hooks/withdraw/useWithdrawLiquidity";
import { useDerivedMintInfo } from "../state/mint/useDerivedMintInfo";
import { Field as MintField, useMintStore } from "../state/mint/useMintStore";
import useMint from "../lib/hooks/mint/useMint";
import useDammData from "../lib/hooks/data/useDammData";
import { formatCurrencyAmount } from "../lib/utils/formatCurrencyAmount";
import useSyncL2 from "../lib/hooks/sync/useSyncL2";

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

  // load up state
  const [fields, onUserInput] = useProvideStore((state) => [
    state.fields,
    state.onUserInput,
  ]);

  // load up token info
  const { parsedAmounts, currencies, currencyBalances } =
    useDerivedProvideInfo();

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

  //////////////////////////////////////////////////////////

  const [withdrawFields, onUserInputWithdraw] = useWithdrawStore((state) => [
    state.fields,
    state.onUserInput,
  ]);

  const {
    parsedAmounts: withdrawAmounts,
    currencies: withdrawCurrency,
    currencyBalances: withdrawBalance,
  } = useDerivedWithdrawInfo();

  const { callback: withdrawCallback } = useWithdrawLiquidity(
    withdrawAmounts[Field.CURRENCY_A]
  );

  const handleTypeWithdraw = (value: string) => {
    onUserInputWithdraw(WithdrawField.CURRENCY_A, value);
  };

  const handleWithdraw = () => {
    withdrawCallback?.();
  };

  const handleMaxWithdraw = () => {
    withdrawBalance[WithdrawField.CURRENCY_A] &&
      onUserInputWithdraw(
        WithdrawField.CURRENCY_A,
        withdrawBalance[WithdrawField.CURRENCY_A].toExact()
      );
  };

  //////////////////////////////////////////////////////////

  const {
    parsedAmounts: mintAmounts,
    currencies: mintCurrency,
    currencyBalances: mintBalance,
  } = useDerivedMintInfo();

  const [mintFields, onUserInputMint] = useMintStore((state) => [
    state.fields,
    state.onUserInput,
  ]);

  const { callback: mintCallbackA } = useMint(mintAmounts[Field.CURRENCY_A]);

  const { callback: mintCallbackB } = useMint(mintAmounts[Field.CURRENCY_B]);

  const handleTypeMintA = (value: string) => {
    onUserInputMint(MintField.CURRENCY_A, value);
  };

  const handleTypeMintB = (value: string) => {
    onUserInputMint(MintField.CURRENCY_B, value);
  };

  const handleMintA = () => {
    mintCallbackA?.();
  };

  const handleMintB = () => {
    mintCallbackB?.();
  };

  // temporarily use currencies from provide (dependent on pool in future?)
  const { data } = useDammData(
    currencies[Field.CURRENCY_A],
    currencies[Field.CURRENCY_B],
    DAMM_LP[ChainId.ETHEREUM_GOERLI]
  );

  //////////////////////////////////////////////////////////

  const { callback: arbiCallback } = useSyncL2(ChainId.ARBITRUM_GOERLI);
  const { callback: polygonCallback } = useSyncL2(ChainId.POLYGON_MUMBAI);

  const handleArbiSync = () => {
    arbiCallback?.();
  };

  const handlePolygonSync = () => {
    polygonCallback?.();
  };

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
      <Tabs.Content value="tab2">
        <InputWithBalance
          currency={withdrawCurrency[Field.CURRENCY_A]}
          balance={withdrawBalance[Field.CURRENCY_A]}
          onUserInput={handleTypeWithdraw}
          showMaxButton={true}
          onMax={handleMaxWithdraw}
          value={withdrawFields[Field.CURRENCY_A]}
        />
        <p className="mb-2 text-white">You receive</p>
        <div className="mb-1 flex w-full items-start justify-between rounded-sm py-2">
          <p className="text-sm text-white/50">USDC</p>
          {/* <p className="text-sm text-white">{expectedUSDCWithdrawn}</p> */}
        </div>
        <div className="mb-4 flex w-full items-start justify-between rounded-sm py-2">
          <p className="text-sm text-white/50">USDT</p>
          {/* <p className="text-sm text-white">{expectedUSDTWithdrawn}</p> */}
        </div>
        <InteractButton
          onConfirm={handleWithdraw}
          expectedChainId={chain.goerli.id}
          text="Withdraw"
        />
      </Tabs.Content>
      <Tabs.Content value="tab3">
        <div className="flex w-full flex-col items-start">
          <p className="mb-2 font-thin tracking-widest text-white">
            Reserve 1 <span className="text-white/50">(USDC)</span>
          </p>
          <h3 className="mb-8 text-white">
            {data?.[0] && formatCurrencyAmount(data[0], 6)}
          </h3>
        </div>
        <div className="flex w-full flex-col items-start">
          <div className="mb-8 h-px w-full bg-white/5" />
          <p className="mb-2 font-thin tracking-widest text-white">
            Reserve 2 <span className="text-white/50">(USDT)</span>
          </p>
          <h3 className="mb-8 text-white">
            {data?.[1] && formatCurrencyAmount(data[1], 6)}
          </h3>
        </div>
        <div className="flex w-full flex-col items-start">
          <div className="mb-8 h-px w-full bg-white/5" />
          <p className="mb-2 font-thin tracking-widest text-white">
            Total Supply <span className="text-white/50">(DAMM-LP)</span>
          </p>
          <h3 className="mb-2 text-white">
            {data?.[2] && data?.[2].toExact()}
          </h3>
        </div>
      </Tabs.Content>
      <Tabs.Content value="tab4">
        <InputWithBalance
          currency={mintCurrency[Field.CURRENCY_A]}
          balance={mintBalance[Field.CURRENCY_A]}
          onUserInput={handleTypeMintA}
          showMaxButton={false}
          value={mintFields[Field.CURRENCY_A]}
        />
        <div className="relative mb-4">
          <InteractButton
            onConfirm={handleMintA}
            expectedChainId={chain.goerli.id}
            text="Mint"
          />
        </div>
        <InputWithBalance
          currency={mintCurrency[Field.CURRENCY_B]}
          balance={mintBalance[Field.CURRENCY_B]}
          onUserInput={handleTypeMintB}
          showMaxButton={false}
          value={mintFields[Field.CURRENCY_B]}
        />
        <InteractButton
          onConfirm={handleMintB}
          expectedChainId={chain.goerli.id}
          text="Mint"
        />
      </Tabs.Content>
      <Tabs.Content value="tab5">
        <div className="relative mb-4">
          <InteractButton
            expectedChainId={chain.goerli.id}
            onConfirm={handleArbiSync}
            text="Sync to Arbitrum AMM"
          />
        </div>
        <div className="relative">
          <InteractButton
            expectedChainId={chain.goerli.id}
            onConfirm={handlePolygonSync}
            text="Sync to Polygon AMM"
          />
        </div>
      </Tabs.Content>
    </TabSlider>
  );
};

export default DammTabContent;
