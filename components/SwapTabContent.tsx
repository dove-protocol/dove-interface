import React, { useMemo } from "react";
import InteractButton, { Button } from "./InteractButton";
import {
  BiCreditCardFront,
  BiDollar,
  BiDownArrowAlt,
  BiExpandAlt,
  BiStats,
} from "react-icons/bi";
import * as Tabs from "@radix-ui/react-tabs";
import InputWithBalance from "./InputWithBalance";
import { ApprovalState } from "../lib/hooks/useApproval";
import useTriggerToast from "../lib/hooks/useTriggerToast";
import { ChainId } from "../sdk";
import { DAMM_LP } from "../sdk/constants";
import TabSlider from "./TabSlider";
import { Field, useSwapStore } from "../state/swap/useSwapStore";
import { useDerivedSwapInfo } from "../state/swap/useDerivedSwapInfo";
import { useDerivedMintInfo } from "../state/mint/useDerivedMintInfo";
import { useMintStore } from "../state/mint/useMintStore";
import useMint from "../lib/hooks/mint/useMint";
import useSyncL1 from "../lib/hooks/sync/useSyncL1";
import useSwap from "../lib/hooks/swap/useSwap";
import { useBurnStore } from "../state/burn/useBurnStore";
import useBurn from "../lib/hooks/burn/useBurn";
import { useDerivedBurnInfo } from "../state/burn/useDerivedBurnInfo";
import useDammData from "../lib/hooks/data/useDammData";
import useAmmData from "../lib/hooks/data/useAmmData";
import { formatCurrencyAmount } from "../lib/utils/formatCurrencyAmount";
import useTokenApproval from "../lib/hooks/useTokenApproval";
import { useChainDefaults } from "../lib/hooks/useDefaults";
import { ammTabsData } from "../constants/tabs";
import {
  currencyAmountToPreciseFloat,
  formatTransactionAmount,
} from "../lib/utils/formatNumbers";
import { useNetwork } from "wagmi";
import TabContentContainer from "./TabContentContainer";

const SwapTabContent = () => {
  const { chain } = useNetwork();

  let expectedChainId = useMemo(() => {
    if (!chain) return;
    switch (chain.id) {
      case ChainId.ETHEREUM_GOERLI:
        return;
      case ChainId.POLYGON_MUMBAI:
        return ChainId.POLYGON_MUMBAI;
      case ChainId.ARBITRUM_GOERLI:
        return ChainId.ARBITRUM_GOERLI;
      default:
        return;
    }
  }, [chain]);

  useChainDefaults();

  const { callback: toastCallback } = useTriggerToast();

  const [swapCurrencies, fields, onUserInput, independentField] = useSwapStore(
    (state) => [
      state.swapCurrencies,
      state.fields,
      state.onUserInput,
      state.independentField,
    ]
  );

  const dependentField =
    independentField === Field.CURRENCY_A ? Field.CURRENCY_B : Field.CURRENCY_A;

  const { parsedAmounts, currencies, currencyBalances } = useDerivedSwapInfo();

  const formattedAmounts = {
    [independentField]: fields[independentField],
    [dependentField]: formatTransactionAmount(
      currencyAmountToPreciseFloat(parsedAmounts[dependentField])
    ),
  };

  const { callback: approveCallback, state: approveState } = useTokenApproval(
    parsedAmounts[Field.CURRENCY_A]
  );

  const { callback: swapCallback } = useSwap(parsedAmounts[Field.CURRENCY_A]);

  const handleTypeInput = (value: string) => {
    onUserInput(Field.CURRENCY_A, value);
  };

  const handleTypeOutput = (value: string) => {
    onUserInput(Field.CURRENCY_B, value);
  };

  const handleMax = () => {
    currencyBalances[Field.CURRENCY_A] &&
      onUserInput(
        Field.CURRENCY_A,
        currencyBalances[Field.CURRENCY_A].toExact()
      );
  };

  const handleApprove = () => {
    approveCallback?.()
      .then((tx) => {
        if (!parsedAmounts[Field.CURRENCY_A] || !tx) return;
        toastCallback?.({
          title: "Approved",
          description: `${formatCurrencyAmount(
            parsedAmounts[Field.CURRENCY_A],
            6
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

  const handleSwap = () => {
    swapCallback?.()
      .then((tx) => {
        tx &&
          toastCallback?.({
            title: "Swap",
            description: `${formatCurrencyAmount(
              parsedAmounts[Field.CURRENCY_A],
              6
            )} ${
              currencies[Field.CURRENCY_A]?.symbol
            } for ${formatCurrencyAmount(parsedAmounts[Field.CURRENCY_B], 6)} ${
              currencies[Field.CURRENCY_B]?.symbol
            }`,
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

  const handleSwapCurrency = () => {
    swapCurrencies();
  };

  /////////////////////////////

  const [mintFields, onUserInputMint] = useMintStore((state) => [
    state.fields,
    state.onUserInput,
  ]);

  const {
    parsedAmounts: mintAmounts,
    currencies: mintCurrency,
    currencyBalances: mintBalance,
  } = useDerivedMintInfo();

  const { callback: mintCallbackA } = useMint(mintAmounts[Field.CURRENCY_A]);

  const { callback: mintCallbackB } = useMint(mintAmounts[Field.CURRENCY_B]);

  const handleTypeMintA = (value: string) => {
    onUserInputMint(Field.CURRENCY_A, value);
  };

  const handleTypeMintB = (value: string) => {
    onUserInputMint(Field.CURRENCY_B, value);
  };

  const handleMintA = () => {
    mintCallbackA?.()
      .then((tx) => {
        if (!mintAmounts[Field.CURRENCY_A] || !mintCurrency[Field.CURRENCY_A])
          return;
        toastCallback?.({
          title: "Minted",
          description: `${formatCurrencyAmount(
            mintAmounts[Field.CURRENCY_A],
            6
          )} ${mintCurrency[Field.CURRENCY_A]?.symbol}`,
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

  const handleMintB = () => {
    mintCallbackB?.()
      .then((txid) => {
        if (!mintAmounts[Field.CURRENCY_B] || !mintCurrency[Field.CURRENCY_B])
          return;
        toastCallback?.({
          title: "Minted",
          description: `${formatCurrencyAmount(
            mintAmounts[Field.CURRENCY_B],
            6
          )} ${mintCurrency[Field.CURRENCY_B]?.symbol}`,
          txid: txid.hash,
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

  /////////////////////////////

  const { callback: syncCallback } = useSyncL1();

  const handleSync = () => {
    syncCallback?.();
  };

  /////////////////////////////

  const [burnFields, onUserInputBurn] = useBurnStore((state) => [
    state.fields,
    state.onUserInput,
  ]);

  const {
    parsedAmounts: burnAmounts,
    currencies: burnCurrencies,
    currencyBalances: burnBalances,
  } = useDerivedBurnInfo();

  const { callback: approveCallbackVoucherA, state: approveVoucherStateA } =
    useTokenApproval(burnAmounts[Field.CURRENCY_A]);

  const { callback: approveCallbackVoucherB, state: approveVoucherStateB } =
    useTokenApproval(burnAmounts[Field.CURRENCY_B]);

  const { callback: burnCallback } = useBurn(
    burnAmounts[Field.CURRENCY_A],
    burnAmounts[Field.CURRENCY_B]
  );

  const handleTypeBurnA = (value: string) => {
    onUserInputBurn(Field.CURRENCY_A, value);
  };

  const handleTypeBurnB = (value: string) => {
    onUserInputBurn(Field.CURRENCY_B, value);
  };

  const handleMaxBurnA = () => {
    burnBalances[Field.CURRENCY_A] &&
      onUserInputBurn(
        Field.CURRENCY_A,
        burnBalances[Field.CURRENCY_A].toExact()
      );
  };

  const handleMaxBurnB = () => {
    burnBalances[Field.CURRENCY_B] &&
      onUserInputBurn(
        Field.CURRENCY_B,
        burnBalances[Field.CURRENCY_B].toExact()
      );
  };

  const handleApproveVoucherA = () => {
    approveCallbackVoucherA?.()
      .then((tx) => {
        if (!burnAmounts[Field.CURRENCY_A] || !burnCurrencies[Field.CURRENCY_A])
          return;
        toastCallback?.({
          title: "Approved",
          description: `${formatCurrencyAmount(
            burnAmounts[Field.CURRENCY_A],
            6
          )} ${burnCurrencies[Field.CURRENCY_A]?.symbol}`,
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

  const handleApproveVoucherB = () => {
    approveCallbackVoucherB?.()
      .then((tx) => {
        if (!burnAmounts[Field.CURRENCY_B] || !burnCurrencies[Field.CURRENCY_B])
          return;
        toastCallback?.({
          title: "Approved",
          description: `${formatCurrencyAmount(
            burnAmounts[Field.CURRENCY_B],
            6
          )} ${burnCurrencies[Field.CURRENCY_B]?.symbol}`,
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

  const handleBurn = () => {
    burnCallback?.()
      .then((tx) => {
        if (!burnAmounts[Field.CURRENCY_A] || !burnCurrencies[Field.CURRENCY_A])
          return;
        toastCallback?.({
          title: "Burned",
          description: `${formatCurrencyAmount(
            burnAmounts[Field.CURRENCY_A],
            6
          )} ${burnCurrencies[Field.CURRENCY_A]?.symbol}`,
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

  /////////////////////////////

  const { data } = useDammData(
    currencies[Field.CURRENCY_A],
    currencies[Field.CURRENCY_B],
    DAMM_LP[ChainId.ETHEREUM_GOERLI]
  );

  const { data: ammData } = useAmmData(
    currencies[Field.CURRENCY_A],
    currencies[Field.CURRENCY_B],
    expectedChainId
  );

  return (
    <TabSlider tabsData={ammTabsData}>
      <Tabs.Content value="tab1">
        <TabContentContainer>
          <InputWithBalance
            currency={currencies[Field.CURRENCY_A]}
            balance={currencyBalances[Field.CURRENCY_A]}
            onUserInput={handleTypeInput}
            showMaxButton={true}
            onMax={handleMax}
            value={formattedAmounts[Field.CURRENCY_A]}
            expectedChainId={expectedChainId}
          />
          <div className="relative  left-1/2 z-10 -mt-[44px] -mb-[36px] flex h-20 w-fit -translate-x-1/2 items-center justify-center">
            <button
              onClick={handleSwapCurrency}
              className="group absolute flex h-6 w-6 -rotate-45 cursor-pointer items-center justify-center border border-white/10 bg-pita outline outline-4 outline-pita transition duration-500 ease-in-out hover:scale-110"
            >
              <BiExpandAlt className="relative text-2xl text-white/50 transition duration-500 ease-in-out group-hover:text-sky-400" />
            </button>
          </div>
          <InputWithBalance
            currency={currencies[Field.CURRENCY_B]}
            balance={currencyBalances[Field.CURRENCY_B]}
            showMaxButton={false}
            value={formattedAmounts[Field.CURRENCY_B]}
            onUserInput={handleTypeOutput}
            expectedChainId={expectedChainId}
          />
          <InteractButton
            onConfirm={handleSwap}
            expectedChainId={expectedChainId}
            text="Swap"
          >
            {(() => {
              if (
                !parsedAmounts[Field.CURRENCY_A] ||
                !parsedAmounts[Field.CURRENCY_B]
              ) {
                return <Button disabled text="Enter an amount" />;
              }

              if (approveState === ApprovalState.NOT_APPROVED) {
                return (
                  <Button
                    onClick={handleApprove}
                    text={`Approve ${currencies[Field.CURRENCY_A]?.symbol}`}
                  />
                );
              }

              if (
                currencyBalances[Field.CURRENCY_A] &&
                parsedAmounts[Field.CURRENCY_A].greaterThan(
                  currencyBalances[Field.CURRENCY_A]
                )
              ) {
                return <Button disabled text="Insufficient balance" />;
              }
            })()}
          </InteractButton>
        </TabContentContainer>
      </Tabs.Content>
      <Tabs.Content value="tab2">
        <TabContentContainer>
          <InputWithBalance
            currency={mintCurrency[Field.CURRENCY_A]}
            balance={mintBalance[Field.CURRENCY_A]}
            onUserInput={handleTypeMintA}
            showMaxButton={false}
            value={mintFields[Field.CURRENCY_A]}
            expectedChainId={expectedChainId}
          />
          <div className="relative mb-4">
            <InteractButton
              onConfirm={handleMintA}
              expectedChainId={expectedChainId}
              text="Mint"
            />
          </div>
          <InputWithBalance
            currency={mintCurrency[Field.CURRENCY_B]}
            balance={mintBalance[Field.CURRENCY_B]}
            onUserInput={handleTypeMintB}
            showMaxButton={false}
            value={mintFields[Field.CURRENCY_B]}
            expectedChainId={expectedChainId}
          />
          <InteractButton
            onConfirm={handleMintB}
            expectedChainId={expectedChainId}
            text="Mint"
          />
        </TabContentContainer>
      </Tabs.Content>
      <Tabs.Content value="tab3">
        <TabContentContainer>
          <div className="mb-4 flex items-center">
            <BiStats className="mr-4 rounded-sm bg-sky-400/10 p-2 text-4xl text-sky-400" />
            <div className="flex flex-col">
              <h4 className="text-white">Sync to L1</h4>
              <p className="text-xs text-white/50">Sync L2 balances to L1</p>
            </div>
          </div>
          <InteractButton
            expectedChainId={expectedChainId}
            onConfirm={handleSync}
            text="Sync"
          />
        </TabContentContainer>
      </Tabs.Content>

      <Tabs.Content value="tab4">
        <TabContentContainer>
          <p className="mb-2 text-xs uppercase tracking-widest text-white/50">
            Available Claims
          </p>
          <div className="mb-2 flex w-full items-center justify-between rounded-sm border-l-2 border-sky-400 bg-gradient-to-r from-sky-400/5 to-transparent p-4 py-2">
            <div className="flex items-center">
              <BiDollar className="mr-4 rounded-sm bg-black/20 p-1 text-2xl text-white" />
              <p className="text-xs uppercase tracking-widest text-white">
                {currencies[Field.CURRENCY_A]?.symbol}
              </p>
            </div>
            <p className="text-sm text-white">
              {data?.marked0 && formatCurrencyAmount(data.marked0, 6)}
            </p>
          </div>
          <div className="mb-2 flex w-full items-center justify-between rounded-sm border-l-2 border-sky-400 bg-gradient-to-r from-sky-400/5 to-transparent p-4 py-2">
            <div className="flex items-center">
              <BiDollar className="mr-4 rounded-sm bg-black/20 p-1 text-2xl text-white" />
              <p className="text-xs uppercase tracking-widest text-white">
                {currencies[Field.CURRENCY_B]?.symbol}
              </p>
            </div>
            <p className="text-sm text-white">
              {data?.marked1 && formatCurrencyAmount(data.marked1, 6)}
            </p>
          </div>
          <div className="mb-2 mt-2 h-px w-full bg-white/5" />
          <InputWithBalance
            currency={burnCurrencies[Field.CURRENCY_A]}
            balance={burnBalances[Field.CURRENCY_A]}
            onUserInput={handleTypeBurnA}
            showMaxButton={true}
            onMax={handleMaxBurnA}
            value={burnFields[Field.CURRENCY_A]}
            expectedChainId={expectedChainId}
          />
          <InputWithBalance
            currency={burnCurrencies[Field.CURRENCY_B]}
            balance={burnBalances[Field.CURRENCY_B]}
            onUserInput={handleTypeBurnB}
            showMaxButton={true}
            onMax={handleMaxBurnB}
            value={burnFields[Field.CURRENCY_B]}
            expectedChainId={expectedChainId}
          />
          <InteractButton
            expectedChainId={expectedChainId}
            onConfirm={handleBurn}
            text="Burn Vouchers"
          >
            {(() => {
              if (
                !data?.marked0 ||
                !data?.marked1 ||
                !burnAmounts[Field.CURRENCY_A] ||
                !burnAmounts[Field.CURRENCY_B]
              ) {
                return <Button disabled text="Enter an amount" />;
              }
              if (
                burnAmounts[Field.CURRENCY_A].greaterThan(data.marked0) ||
                burnAmounts[Field.CURRENCY_B].greaterThan(data.marked1)
              ) {
                return <Button disabled text="Sync before" />;
              }
              if (approveVoucherStateA === ApprovalState.NOT_APPROVED) {
                return (
                  <Button
                    onClick={handleApproveVoucherA}
                    text={`Approve ${burnCurrencies[Field.CURRENCY_A]?.symbol}`}
                  />
                );
              }
              if (approveVoucherStateB === ApprovalState.NOT_APPROVED) {
                return (
                  <Button
                    onClick={handleApproveVoucherB}
                    text={`Approve ${burnCurrencies[Field.CURRENCY_B]?.symbol}`}
                  />
                );
              }
            })()}
          </InteractButton>
        </TabContentContainer>
      </Tabs.Content>
      <Tabs.Content value="tab5">
        <TabContentContainer>
          <div className="mb-4 flex items-center">
            <BiStats className="mr-4 rounded-sm bg-sky-400/10 p-2 text-4xl text-sky-400" />
            <div className="flex flex-col">
              <h4 className="text-white">Virtual Reserves</h4>
              <p className="text-xs text-white/50">Synced reserve balances</p>
            </div>
          </div>
          <div className="relative mb-2 flex w-full items-center justify-between rounded-sm  border-l-2 border-sky-400  bg-gradient-to-r from-sky-400/5 to-transparent p-4">
            <div className="flex items-center">
              <BiDollar className="mr-4 rounded-sm bg-black/20 p-1 text-2xl text-white" />
              <p className="text-xs uppercase tracking-widest text-white">
                USDC
              </p>
            </div>
            <p className="text-sm text-white">
              {ammData?.reserve0 && formatCurrencyAmount(ammData.reserve0, 12)}
            </p>
          </div>
          <div className="flex w-full items-center justify-between rounded-sm border-l-2 border-sky-400  bg-gradient-to-r from-sky-400/5 to-transparent p-4">
            <div className="flex items-center">
              <BiDollar className="mr-4 rounded-sm bg-black/20 p-1 text-2xl text-white" />
              <p className="text-xs uppercase tracking-widest text-white">
                USDT
              </p>
            </div>
            <p className="text-sm text-white">
              {ammData?.reserve1 && formatCurrencyAmount(ammData.reserve1, 12)}
            </p>
          </div>
        </TabContentContainer>
      </Tabs.Content>
    </TabSlider>
  );
};

export default SwapTabContent;
