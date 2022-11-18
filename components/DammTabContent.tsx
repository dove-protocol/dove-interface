import React from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { useState, useRef, useCallback, useMemo } from "react";
import { chain } from "wagmi";
import InteractButton, { Button } from "./InteractButton";
import InputWithBalance from "./InputWithBalance";
import useProvideLiquidity from "../lib/hooks/provide/useProvideLiquidity";
import { ChainId, Currency, CurrencyAmount, DAMM_LP, MaxUint256 } from "../sdk";
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
import useTokenApproval from "../lib/hooks/useTokenApproval";
import { ApprovalState } from "../lib/hooks/useApproval";
import JSBI from "jsbi";
import { ammTabsData, dammTabsData } from "../constants/tabs";
import { currencyAmountToPreciseFloat } from "../lib/utils/formatNumbers";

const DammTabContent = () => {
  // load up default tokens for chain
  useChainDefaults();

  // load up state
  const [fields, onUserInput, independentField] = useProvideStore((state) => [
    state.fields,
    state.onUserInput,
    state.independentField,
  ]);

  // load up token info
  const { parsedAmounts, currencies, currencyBalances } =
    useDerivedProvideInfo();

  const dependentField =
    independentField === Field.CURRENCY_A ? Field.CURRENCY_B : Field.CURRENCY_A;

  const formattedAmounts = {
    [independentField]: fields[independentField],
    [dependentField]:
      currencyAmountToPreciseFloat(parsedAmounts[dependentField])?.toString() ??
      "",
  };

  const { callback: approveCallbackA, state: approveStateA } = useTokenApproval(
    parsedAmounts[Field.CURRENCY_A]
  );

  const { callback: approveCallbackB, state: approveStateB } = useTokenApproval(
    parsedAmounts[Field.CURRENCY_B]
  );

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

  const handleApproveA = () => {
    approveCallbackA?.();
  };

  const handleApproveB = () => {
    approveCallbackB?.();
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
    <TabSlider tabsData={dammTabsData}>
      <Tabs.Content value="tab1">
        <InputWithBalance
          currency={currencies[Field.CURRENCY_A]}
          balance={currencyBalances[Field.CURRENCY_A]}
          onUserInput={handleTypeA}
          showMaxButton={true}
          onMax={handleMax}
          value={formattedAmounts[Field.CURRENCY_A]}
          expectedChainId={ChainId.ETHEREUM_GOERLI}
        />
        <InputWithBalance
          currency={currencies[Field.CURRENCY_B]}
          balance={currencyBalances[Field.CURRENCY_B]}
          onUserInput={handleTypeB}
          showMaxButton={false}
          value={formattedAmounts[Field.CURRENCY_B]}
          expectedChainId={ChainId.ETHEREUM_GOERLI}
        />
        <InteractButton
          onConfirm={handleProvideLiquidity}
          expectedChainId={chain.goerli.id}
          text="Add Liquidity"
        >
          {(() => {
            if (
              !parsedAmounts[Field.CURRENCY_A] ||
              !parsedAmounts[Field.CURRENCY_B]
            ) {
              return <Button disabled text="Enter an amount" />;
            }
            if (
              currencyBalances[Field.CURRENCY_A] &&
              currencyBalances[Field.CURRENCY_B] &&
              (parsedAmounts[Field.CURRENCY_A].greaterThan(
                currencyBalances[Field.CURRENCY_A]
              ) ||
                parsedAmounts[Field.CURRENCY_B].greaterThan(
                  currencyBalances[Field.CURRENCY_B]
                ))
            ) {
              return <Button disabled text="Insufficient balance" />;
            }
            if (approveStateA !== ApprovalState.APPROVED) {
              return (
                <Button
                  onClick={handleApproveA}
                  text={`Approve ${currencies[Field.CURRENCY_A]?.symbol}`}
                />
              );
            }
            if (approveStateB !== ApprovalState.APPROVED) {
              return (
                <Button
                  onClick={handleApproveB}
                  text={`Approve ${currencies[Field.CURRENCY_B]?.symbol}`}
                />
              );
            }
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
          value={fields[Field.CURRENCY_A]}
          expectedChainId={ChainId.ETHEREUM_GOERLI}
        />
        <p className="mb-2 text-white">You receive</p>
        <div className="mb-1 flex w-full items-start justify-between rounded-sm py-2">
          <p className="text-sm text-white/50">
            {currencies[Field.CURRENCY_A]?.symbol}
          </p>
          <p className="text-sm text-white">
            {data?.reserve0 &&
              data?.totalSupply &&
              currencies[Field.CURRENCY_A] &&
              withdrawAmounts[Field.CURRENCY_A] &&
              formatCurrencyAmount(
                CurrencyAmount.fromRawAmount(
                  currencies[Field.CURRENCY_A],
                  JSBI.divide(
                    JSBI.multiply(
                      withdrawAmounts[Field.CURRENCY_A]?.numerator,
                      data.reserve0.numerator
                    ),
                    data?.totalSupply.numerator
                  )
                ),
                6
              )}
          </p>
        </div>
        <div className="mb-4 flex w-full items-start justify-between rounded-sm py-2">
          <p className="text-sm text-white/50">
            {currencies[Field.CURRENCY_B]?.symbol}
          </p>
          <p className="text-sm text-white">
            {data?.reserve1 &&
              data?.totalSupply &&
              currencies[Field.CURRENCY_B] &&
              withdrawAmounts[Field.CURRENCY_A] &&
              formatCurrencyAmount(
                CurrencyAmount.fromRawAmount(
                  currencies[Field.CURRENCY_B],
                  JSBI.divide(
                    JSBI.multiply(
                      withdrawAmounts[Field.CURRENCY_A]?.numerator,
                      data.reserve1.numerator
                    ),
                    data?.totalSupply.numerator
                  )
                ),
                6
              )}
          </p>
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
            {data?.reserve0 && formatCurrencyAmount(data.reserve0, 6)}
          </h3>
        </div>
        <div className="flex w-full flex-col items-start">
          <div className="mb-8 h-px w-full bg-white/5" />
          <p className="mb-2 font-thin tracking-widest text-white">
            Reserve 2 <span className="text-white/50">(USDT)</span>
          </p>
          <h3 className="mb-8 text-white">
            {data?.reserve1 && formatCurrencyAmount(data.reserve1, 6)}
          </h3>
        </div>
        <div className="flex w-full flex-col items-start">
          <div className="mb-8 h-px w-full bg-white/5" />
          <p className="mb-2 font-thin tracking-widest text-white">
            Total Supply <span className="text-white/50">(DAMM-LP)</span>
          </p>
          <h3 className="mb-2 text-white">
            {data?.totalSupply && data.totalSupply.toExact()}
          </h3>
        </div>
      </Tabs.Content>
      <Tabs.Content value="tab4">
        <InputWithBalance
          currency={mintCurrency[Field.CURRENCY_A]}
          balance={mintBalance[Field.CURRENCY_A]}
          onUserInput={handleTypeMintA}
          showMaxButton={false}
          value={fields[Field.CURRENCY_A]}
          expectedChainId={ChainId.ETHEREUM_GOERLI}
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
          value={fields[Field.CURRENCY_B]}
          expectedChainId={ChainId.ETHEREUM_GOERLI}
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
