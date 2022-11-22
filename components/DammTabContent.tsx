import React from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { useState, useRef, useCallback, useMemo } from "react";
import { chain } from "wagmi";
import InteractButton, { Button } from "./InteractButton";
import InputWithBalance from "./InputWithBalance";
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
import { formatCurrencyAmount } from "../lib/utils/formatCurrencyAmount";
import useSyncL2 from "../lib/hooks/sync/useSyncL2";
import useTokenApproval from "../lib/hooks/useTokenApproval";
import { ApprovalState } from "../lib/hooks/useApproval";
import JSBI from "jsbi";
import { ammTabsData, dammTabsData } from "../constants/tabs";
import {
  currencyAmountToPreciseFloat,
  formatTransactionAmount,
} from "../lib/utils/formatNumbers";
import useTriggerToast from "../lib/hooks/useTriggerToast";
import {
  BiDollar,
  BiDownArrowAlt,
  BiExpandAlt,
  BiPlus,
  BiRefresh,
  BiStats,
} from "react-icons/bi";
import TabContentContainer from "./TabContentContainer";
import useMint from "../lib/hooks/mint/useMint";
import useDammData from "../lib/hooks/data/useDammData";
import useProvideLiquidity from "../lib/hooks/provide/useProvideLiquidity";
import shallow from "zustand/shallow";

const DammTabContent = () => {
  // load up default tokens for chain
  useChainDefaults();

  const { callback: toastCallback } = useTriggerToast();

  // load up state
  const [fields, onUserInput, independentField, clearFields] = useProvideStore(
    (state) => [
      state.fields,
      state.onUserInput,
      state.independentField,
      state.clearFields,
    ],
    shallow
  );

  // load up token info
  const { parsedAmounts, currencies, currencyBalances } =
    useDerivedProvideInfo();

  const dependentField =
    independentField === Field.CURRENCY_A ? Field.CURRENCY_B : Field.CURRENCY_A;

  const formattedAmounts = {
    [independentField]: fields[independentField],
    [dependentField]: parsedAmounts[dependentField]?.toExact() ?? "",
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
    parsedAmounts[Field.CURRENCY_B],
    approveStateA,
    approveStateB
  );

  const handleTypeA = (value: string) => {
    onUserInput(Field.CURRENCY_A, value);
  };

  const handleTypeB = (value: string) => {
    onUserInput(Field.CURRENCY_B, value);
  };

  const handleProvideLiquidity = () => {
    callback?.()
      .then((tx) => {
        parsedAmounts[Field.CURRENCY_A] && parsedAmounts[Field.CURRENCY_B];
        toastCallback?.({
          title: "Liquidity Added",
          description: `${formatTransactionAmount(
            currencyAmountToPreciseFloat(parsedAmounts[Field.CURRENCY_A])
          )} ${
            currencies[Field.CURRENCY_A]?.symbol
          } and ${formatTransactionAmount(
            currencyAmountToPreciseFloat(parsedAmounts[Field.CURRENCY_B])
          )} ${currencies[Field.CURRENCY_B]?.symbol}`,
          txid: tx.hash,
          type: "success",
        });
        clearFields();
      })
      .catch((e) => {
        toastCallback?.({
          title: "Error",
          description: "",
          type: "error",
        });
      });
  };

  const handleApproveA = () => {
    approveCallbackA?.()
      .then((tx) => {
        parsedAmounts[Field.CURRENCY_A] &&
          toastCallback?.({
            title: "Token Approved",
            description: `${formatTransactionAmount(
              currencyAmountToPreciseFloat(parsedAmounts[Field.CURRENCY_A])
            )} ${currencies[Field.CURRENCY_A]?.symbol}`,
            txid: tx.hash,
            type: "success",
          });
      })
      .catch((e) => {
        toastCallback?.({
          title: "Error",
          description: "",
          type: "error",
        });
      });
  };

  const handleApproveB = () => {
    approveCallbackB?.()
      .then((tx) => {
        parsedAmounts[Field.CURRENCY_B] &&
          toastCallback?.({
            title: "Token Approved",
            description: `${formatTransactionAmount(
              currencyAmountToPreciseFloat(parsedAmounts[Field.CURRENCY_B])
            )} ${currencies[Field.CURRENCY_B]?.symbol}`,
            txid: tx.hash,
            type: "success",
          });
      })
      .catch((e) => {
        toastCallback?.({
          title: "Error",
          description: "",
          type: "error",
        });
      });
  };

  const handleMax = () => {
    currencyBalances[Field.CURRENCY_A] &&
      onUserInput(
        Field.CURRENCY_A,
        currencyBalances[Field.CURRENCY_A].toExact()
      );
  };

  //////////////////////////////////////////////////////////

  const [withdrawFields, onUserInputWithdraw, clearWithdrawFields] =
    useWithdrawStore(
      (state) => [state.fields, state.onUserInput, state.clearFields],
      shallow
    );

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
    withdrawCallback?.()
      .then((tx) => {
        withdrawAmounts[Field.CURRENCY_A] &&
          toastCallback?.({
            title: "Liquidity Removed",
            description: `${formatTransactionAmount(
              currencyAmountToPreciseFloat(withdrawAmounts[Field.CURRENCY_A])
            )} ${withdrawCurrency[Field.CURRENCY_A]?.symbol}`,
            txid: tx.hash,
            type: "success",
          });
        clearWithdrawFields();
      })
      .catch((e) => {
        toastCallback?.({
          title: "Error",
          description: "",
          type: "error",
        });
      });
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

  const [mintFields, onUserInputMint, clearMintField] = useMintStore(
    (state) => [state.fields, state.onUserInput, state.clearField],
    shallow
  );

  const { callback: mintCallbackA } = useMint(mintAmounts[Field.CURRENCY_A]);

  const { callback: mintCallbackB } = useMint(mintAmounts[Field.CURRENCY_B]);

  const handleTypeMintA = (value: string) => {
    onUserInputMint(MintField.CURRENCY_A, value);
  };

  const handleTypeMintB = (value: string) => {
    onUserInputMint(MintField.CURRENCY_B, value);
  };

  const handleMintA = () => {
    mintCallbackA?.()
      .then((tx) => {
        toastCallback?.({
          title: "Minted",
          description: `${formatTransactionAmount(
            currencyAmountToPreciseFloat(mintAmounts[Field.CURRENCY_A])
          )} ${mintCurrency[Field.CURRENCY_A]?.symbol}`,
          txid: tx.hash,
          type: "success",
        });
        clearMintField(Field.CURRENCY_A);
      })
      .catch((e) => {
        toastCallback?.({
          title: "Error",
          description: "",
          type: "error",
        });
      });
  };

  const handleMintB = () => {
    mintCallbackB?.()
      .then((tx) => {
        tx &&
          toastCallback?.({
            title: "Minted",
            description: `${formatTransactionAmount(
              currencyAmountToPreciseFloat(mintAmounts[Field.CURRENCY_B])
            )} ${mintCurrency[Field.CURRENCY_B]?.symbol}`,
            txid: tx.hash,
            type: "success",
          });
        clearMintField(Field.CURRENCY_B);
      })
      .catch((e) => {
        toastCallback?.({
          title: "Error",
          description: "",
          type: "error",
        });
      });
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
    arbiCallback?.()
      .then((tx) => {
        tx &&
          toastCallback?.({
            title: "Synced",
            description: `Synced Arbitrum with Ethereum`,
            txid: tx.hash,
            type: "success",
          });
      })
      .catch((e) => {
        console.log("");
        toastCallback?.({
          title: "Error",
          description: "",
          type: "error",
        });
      });
  };

  const handlePolygonSync = () => {
    polygonCallback?.()
      .then((tx) => {
        tx &&
          toastCallback?.({
            title: "Synced",
            description: `Synced Polygon with Ethereum`,
            txid: tx.hash,
            type: "success",
          });
      })
      .catch((e) => {
        toastCallback?.({
          title: "Error",
          description: "",
          type: "error",
        });
      });
  };

  return (
    <TabSlider tabsData={dammTabsData}>
      <Tabs.Content value="tab1">
        <TabContentContainer>
          <InputWithBalance
            currency={currencies[Field.CURRENCY_A]}
            balance={currencyBalances[Field.CURRENCY_A]}
            onUserInput={handleTypeA}
            showMaxButton={true}
            onMax={handleMax}
            value={formattedAmounts[Field.CURRENCY_A]}
            expectedChainId={ChainId.ETHEREUM_GOERLI}
          />
          <div className="relative  left-1/2 z-10 -mt-[44px] -mb-[36px] flex h-20 w-fit -translate-x-1/2 items-center justify-center">
            <div className="group absolute flex h-6 w-6 -rotate-45 items-center justify-center border border-white/10 bg-pita outline outline-4 outline-pita">
              <BiPlus className="relative -rotate-45 text-2xl text-white/50" />
            </div>
          </div>
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
        </TabContentContainer>
      </Tabs.Content>
      <Tabs.Content value="tab2">
        <TabContentContainer>
          <InputWithBalance
            currency={withdrawCurrency[Field.CURRENCY_A]}
            balance={withdrawBalance[Field.CURRENCY_A]}
            onUserInput={handleTypeWithdraw}
            showMaxButton={true}
            onMax={handleMaxWithdraw}
            value={withdrawFields[Field.CURRENCY_A]}
            expectedChainId={ChainId.ETHEREUM_GOERLI}
          />
          <InteractButton
            onConfirm={handleWithdraw}
            expectedChainId={chain.goerli.id}
            text="Remove Liquidity"
          />
          <div className="mb-4 mt-8 h-px w-full bg-white/5" />
          <div className="relative left-1/2 -my-14 -mb-6 flex h-20 w-fit -translate-x-1/2 items-center justify-center">
            <div className="group absolute flex h-6 w-6 -rotate-45 cursor-pointer items-center justify-center border border-white/10 bg-pita outline outline-4 outline-pita transition duration-500 ease-in-out hover:scale-110">
              <BiDownArrowAlt className="relative rotate-45 text-2xl text-white/50 transition duration-500 ease-in-out group-hover:text-sky-400" />
            </div>
          </div>
          <div className="mb-2 flex w-full items-center justify-between rounded-sm border-l-2 border-sky-400 bg-gradient-to-r from-sky-400/5 to-transparent py-2 px-4">
            <div className="flex items-center">
              <BiDollar className="mr-4 rounded-sm border border-white/10 p-1 text-2xl text-white" />
              <p className="text-xs uppercase tracking-widest text-white">
                {currencies[Field.CURRENCY_A]?.symbol}
              </p>
            </div>
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
          <div className="flex w-full items-center justify-between rounded-sm border-l-2 border-sky-400  bg-gradient-to-r from-sky-400/5 to-transparent py-2 px-4">
            <div className="flex items-center">
              <BiDollar className="mr-4 rounded-sm border border-white/10 p-1 text-2xl text-white" />
              <p className="text-xs uppercase tracking-widest text-white">
                {currencies[Field.CURRENCY_B]?.symbol}
              </p>
            </div>
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
        </TabContentContainer>
      </Tabs.Content>
      <Tabs.Content value="tab3">
        <TabContentContainer>
          <div className="mb-4 flex items-center">
            <BiStats className="mr-4 rounded-sm border border-white/10 p-2 text-4xl text-white" />
            <div className="flex flex-col">
              <h4 className="text-white">Primary Reserves</h4>
              <p className="text-xs text-white/50">Main reserve balances</p>
            </div>
          </div>
          <div className="mb-2 flex w-full items-center justify-between rounded-sm border-l-2 border-sky-400  bg-gradient-to-r from-sky-400/5 to-transparent p-4">
            <div className="flex w-full items-center">
              <BiDollar className="mr-4 rounded-sm border border-white/10 p-1 text-2xl text-white" />
              <p className="text-xs uppercase tracking-widest text-white">
                USDC
              </p>
            </div>
            <p className="text-sm text-white">
              {data?.reserve0 && formatCurrencyAmount(data.reserve0, 12)}
            </p>
          </div>

          <div className="mb-2 flex w-full items-center justify-between rounded-sm border-l-2 border-sky-400  bg-gradient-to-r from-sky-400/5 to-transparent p-4">
            <div className="flex items-center">
              <BiDollar className="mr-4 rounded-sm border border-white/10 p-1 text-2xl text-white" />
              <p className="text-xs uppercase tracking-widest text-white">
                USDT
              </p>
            </div>
            <p className="text-sm text-white">
              {data?.reserve1 && formatCurrencyAmount(data.reserve1, 12)}
            </p>
          </div>
          <div className="mb-2 flex w-full items-center justify-between rounded-sm border-l-2 border-sky-400  bg-gradient-to-r from-sky-400/5 to-transparent p-4">
            <div className="flex items-center">
              <BiDollar className="mr-4 rounded-sm border border-white/10 p-1 text-2xl text-white" />
              <p className="text-xs uppercase tracking-widest text-white">
                DAMM-LP
              </p>
            </div>
            <p className="text-sm text-white">
              {data?.totalSupply && data.totalSupply.toExact()}
            </p>
          </div>
        </TabContentContainer>
      </Tabs.Content>
      <Tabs.Content value="tab4">
        <TabContentContainer>
          <InputWithBalance
            currency={mintCurrency[Field.CURRENCY_A]}
            balance={mintBalance[Field.CURRENCY_A]}
            onUserInput={handleTypeMintA}
            showMaxButton={false}
            value={mintFields[Field.CURRENCY_A]}
            expectedChainId={ChainId.ETHEREUM_GOERLI}
          />
          <div className="relative mb-2">
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
            expectedChainId={ChainId.ETHEREUM_GOERLI}
          />
          <InteractButton
            onConfirm={handleMintB}
            expectedChainId={chain.goerli.id}
            text="Mint"
          />
        </TabContentContainer>
      </Tabs.Content>
      <Tabs.Content value="tab5">
        <TabContentContainer>
          <div className="mb-4 flex items-center">
            <BiRefresh className="mr-4 rounded-sm border border-white/10 p-2 text-4xl text-white" />
            <div className="flex flex-col">
              <h4 className="text-white">Sync to L2</h4>
              <p className="text-xs text-white/50">
                Update Reserves with L2 AMM
              </p>
            </div>
          </div>
          <div className="relative mb-2">
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
        </TabContentContainer>
      </Tabs.Content>
    </TabSlider>
  );
};

export default DammTabContent;
