import React from "react";
import InteractButton, { Button } from "./InteractButton";
import { BiExpandAlt } from "react-icons/bi";
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

const SwapTabContent = ({ expectedChainId }: { expectedChainId: ChainId }) => {
  useChainDefaults();

  const { callback: toastCallback } = useTriggerToast();

  const [isSwapped, toggleSwap, fields, onUserInput, independentField] =
    useSwapStore((state) => [
      state.isSwapped,
      state.toggleSwap,
      state.fields,
      state.onUserInput,
      state.independentField,
    ]);

  const dependentField =
    independentField === Field.CURRENCY_A ? Field.CURRENCY_B : Field.CURRENCY_A;

  const { parsedAmounts, currencies, currencyBalances } = useDerivedSwapInfo();

  const formattedAmounts = {
    [independentField]: fields[independentField],
    [dependentField]: formatTransactionAmount(
      currencyAmountToPreciseFloat(parsedAmounts[dependentField])
    ),
  };

  const { callback: approveCallbackA, state: approveStateA } = useTokenApproval(
    parsedAmounts[Field.CURRENCY_A]
  );

  const { callback: swapCallback } = useSwap(
    parsedAmounts[Field.CURRENCY_A],
    parsedAmounts[Field.CURRENCY_B]
  );

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

  const handleApproveA = () => {
    approveCallbackA?.();
  };

  const handleSwap = () => {
    swapCallback?.().then((tx) => {
      tx &&
        toastCallback?.({
          title: "Swap",
          description: `Swap ${formatCurrencyAmount(
            parsedAmounts[Field.CURRENCY_A],
            6
          )} ${currencies[Field.CURRENCY_A]?.symbol} for ${formatCurrencyAmount(
            parsedAmounts[Field.CURRENCY_B],
            6
          )} ${currencies[Field.CURRENCY_B]?.symbol}`,
          txid: tx.hash,
          type: "success",
        });
    });
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
    mintCallbackA?.().then((tx) => {
      if (!mintAmounts[Field.CURRENCY_A] || !mintCurrency[Field.CURRENCY_A])
        return;
      toastCallback?.({
        title: "Minted",
        description: `You minted ${formatCurrencyAmount(
          mintAmounts[Field.CURRENCY_A],
          6
        )} ${mintCurrency[Field.CURRENCY_A]?.symbol}`,
        txid: tx.hash,
        type: "success",
      });
    });
  };

  const handleMintB = () => {
    mintCallbackB?.().then((txid) => {
      if (!mintAmounts[Field.CURRENCY_B] || !mintCurrency[Field.CURRENCY_B])
        return;
      toastCallback?.({
        title: "Minted",
        description: `You minted ${formatCurrencyAmount(
          mintAmounts[Field.CURRENCY_B],
          6
        )} ${mintCurrency[Field.CURRENCY_B]?.symbol}`,
        txid: txid.hash,
        type: "success",
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

  const handleApproveVoucherA = () => {
    approveCallbackVoucherA?.();
  };

  const handleApproveVoucherB = () => {
    approveCallbackVoucherB?.();
  };

  const handleBurn = () => {
    burnCallback?.();
  };

  /////////////////////////////

  const { data } = useDammData(
    currencies[Field.CURRENCY_A],
    currencies[Field.CURRENCY_B],
    DAMM_LP[ChainId.ETHEREUM_GOERLI]
  );

  const { data: ammData } = useAmmData(
    currencies[Field.CURRENCY_A],
    currencies[Field.CURRENCY_B]
  );

  return (
    <TabSlider tabsData={ammTabsData}>
      <Tabs.Content value="tab1">
        <InputWithBalance
          currency={currencies[Field.CURRENCY_A]}
          balance={currencyBalances[Field.CURRENCY_A]}
          onUserInput={handleTypeInput}
          showMaxButton={true}
          onMax={handleMax}
          value={formattedAmounts[Field.CURRENCY_A]}
          expectedChainId={expectedChainId}
        />
        <div className="relative left-1/2 z-10 -my-12 -mb-8 flex h-20 w-fit -translate-x-1/2 items-center justify-center">
          <button className="group" onClick={toggleSwap}>
            <BiExpandAlt className="-rotate-45 border border-white/10 bg-[#26272b] text-2xl text-white/50 transition ease-in-out group-hover:scale-110 group-hover:text-white" />
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

            if (approveStateA === ApprovalState.NOT_APPROVED) {
              return (
                <Button
                  onClick={handleApproveA}
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
      </Tabs.Content>
      <Tabs.Content value="tab2">
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
      </Tabs.Content>
      <Tabs.Content value="tab3">
        <InteractButton
          expectedChainId={expectedChainId}
          onConfirm={handleSync}
          text="Sync to L1"
        />
      </Tabs.Content>
      <Tabs.Content value="tab4">
        <p className="mb-2 text-white ">dAMM Available Claims</p>
        <div className="mb-1 flex w-full items-start justify-between rounded-sm py-2">
          <p className="text-sm text-white/50">USDC</p>
          <p className="text-sm text-white">
            {data?.marked0 && formatCurrencyAmount(data.marked0, 6)}
          </p>
        </div>
        <div className="mb-4 flex w-full items-start justify-between rounded-sm py-2">
          <p className="text-sm text-white/50">USDT</p>
          <p className="text-sm text-white">
            {data?.marked1 && formatCurrencyAmount(data.marked1, 6)}
          </p>
        </div>
        <InputWithBalance
          currency={burnCurrencies[Field.CURRENCY_A]}
          balance={burnBalances[Field.CURRENCY_A]}
          onUserInput={handleTypeBurnA}
          showMaxButton={false}
          value={burnFields[Field.CURRENCY_A]}
          expectedChainId={expectedChainId}
        />
        <InputWithBalance
          currency={burnCurrencies[Field.CURRENCY_B]}
          balance={burnBalances[Field.CURRENCY_B]}
          onUserInput={handleTypeBurnB}
          showMaxButton={false}
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
      </Tabs.Content>

      <Tabs.Content value="tab5">
        <div className="flex w-full flex-col items-start">
          <p className="mb-2 font-thin tracking-widest text-white">
            Virtual Reserve 1 <span className="text-white/50">(USDT)</span>
          </p>
          <h3 className="mb-8 text-white">
            {ammData?.reserve0 && formatCurrencyAmount(ammData.reserve0, 6)}
          </h3>
        </div>
        <div className="flex w-full flex-col items-start">
          <div className="mb-8 h-px w-full bg-white/5" />
          <p className="mb-2 font-thin tracking-widest text-white">
            Virtual Reserve 2 <span className="text-white/50">(USDC)</span>
          </p>
          <h3 className="mb-2 text-white">
            {ammData?.reserve1 && formatCurrencyAmount(ammData.reserve1, 6)}
          </h3>
        </div>
      </Tabs.Content>
    </TabSlider>
  );
};

export default SwapTabContent;
