import * as Tabs from "@radix-ui/react-tabs";
import JSBI from "jsbi";
import Image from "next/image";
import {
  BiCheckCircle,
  BiDownArrowAlt,
  BiLoader,
  BiLock,
  BiPlus,
  BiRefresh,
  BiStats,
} from "react-icons/bi";
import { goerli } from "wagmi";
import shallow from "zustand/shallow";
import { dammTabsData } from "../constants/tabs";
import useDammData from "../lib/hooks/data/useDammData";
import useMint from "../lib/hooks/mint/useMint";
import useProvideLiquidity from "../lib/hooks/provide/useProvideLiquidity";
import useFinalizeSyncL1 from "../lib/hooks/sync/useFinalizeSyncL1";
import useSyncL2 from "../lib/hooks/sync/useSyncL2";
import { ApprovalState } from "../lib/hooks/useApproval";
import { useChainDefaults } from "../lib/hooks/useDefaults";
import useLiquidityLocked from "../lib/hooks/useLiquidityLocked";
import useTokenApproval from "../lib/hooks/useTokenApproval";
import useWithdrawLiquidity from "../lib/hooks/withdraw/useWithdrawLiquidity";
import { formatCurrencyAmount } from "../lib/utils/formatCurrencyAmount";
import { ChainId, CurrencyAmount, DVE_LP } from "../sdk";
import {
  SUPPORTED_CHAIN_IMAGES,
  SUPPORTED_CHAIN_NAMES,
} from "../sdk/constants/chains";
import { useDerivedMintInfo } from "../state/mint/useDerivedMintInfo";
import { Field as MintField, useMintStore } from "../state/mint/useMintStore";
import { useDerivedProvideInfo } from "../state/provide/useDerivedProvideInfo";
import { Field, useProvideStore } from "../state/provide/useProvideStore";
import { useDerivedWithdrawInfo } from "../state/withdraw/useDerivedWithdrawInfo";
import {
  Field as WithdrawField,
  useWithdrawStore,
} from "../state/withdraw/useWithdrawStore";
import InputWithBalance from "./InputWithBalance";
import InteractButton, { Button } from "./InteractButton";
import TabContentContainer from "./TabContentContainer";
import TabSlider from "./TabSlider";

const DammTabContent = () => {
  // load up default tokens for chain
  useChainDefaults();

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

  const { approve: approveA, state: approveStateA } = useTokenApproval(
    parsedAmounts[Field.CURRENCY_A]
  );

  const { approve: approveB, state: approveStateB } = useTokenApproval(
    parsedAmounts[Field.CURRENCY_B]
  );

  // load up liquidity callback
  const { provide } = useProvideLiquidity(
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
    provide?.();
  };

  const handleApproveA = () => {
    approveA?.();
  };

  const handleApproveB = () => {
    approveB?.();
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

  const { withdraw } = useWithdrawLiquidity(withdrawAmounts[Field.CURRENCY_A]);

  const handleTypeWithdraw = (value: string) => {
    onUserInputWithdraw(WithdrawField.CURRENCY_A, value);
  };

  const handleWithdraw = () => {
    withdraw?.();
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

  const { mint: mintA } = useMint(mintAmounts[Field.CURRENCY_A]);

  const { mint: mintB } = useMint(mintAmounts[Field.CURRENCY_B]);

  const handleTypeMintA = (value: string) => {
    onUserInputMint(MintField.CURRENCY_A, value);
  };

  const handleTypeMintB = (value: string) => {
    onUserInputMint(MintField.CURRENCY_B, value);
  };

  const handleMintA = () => {
    mintA?.();
  };

  const handleMintB = () => {
    mintB?.();
  };

  // temporarily use currencies from provide (dependent on pool in future?)
  const { data } = useDammData(
    currencies[Field.CURRENCY_A],
    currencies[Field.CURRENCY_B],
    DVE_LP[ChainId.ETHEREUM_GOERLI]
  );

  //////////////////////////////////////////////////////////

  const { sync: syncArbi } = useSyncL2(ChainId.ARBITRUM_GOERLI);
  const { sync: syncPoly } = useSyncL2(ChainId.POLYGON_MUMBAI);
  const { sync: syncAvax } = useSyncL2(ChainId.AVALANCHE_FUJI);
  const { finalizeSync: finalizeSyncArbi, status: statusArbi } =
    useFinalizeSyncL1(ChainId.ARBITRUM_GOERLI);
  const { finalizeSync: finalizeSyncPoly, status: statusPoly } =
    useFinalizeSyncL1(ChainId.POLYGON_MUMBAI);
  const { finalizeSync: finalizeSyncAvax, status: statusAvax } =
    useFinalizeSyncL1(ChainId.AVALANCHE_FUJI);

  const handleSync = (chainId: ChainId) => {
    if (chainId === ChainId.ARBITRUM_GOERLI) {
      syncArbi?.();
    } else if (chainId === ChainId.POLYGON_MUMBAI) {
      syncPoly?.();
    } else if (chainId === ChainId.AVALANCHE_FUJI) {
      syncAvax?.();
    }
  };

  const handleFinalizeIncomingSync = (chainId: ChainId) => {
    if (chainId === ChainId.ARBITRUM_GOERLI) {
      finalizeSyncArbi?.();
    } else if (chainId === ChainId.POLYGON_MUMBAI) {
      finalizeSyncPoly?.();
    } else if (chainId === ChainId.AVALANCHE_FUJI) {
      finalizeSyncAvax?.();
    }
  };

  const getStatus = (chainId: ChainId) => {
    if (chainId === ChainId.ARBITRUM_GOERLI) {
      return statusArbi;
    } else if (chainId === ChainId.POLYGON_MUMBAI) {
      return statusPoly;
    } else if (chainId === ChainId.AVALANCHE_FUJI) {
      return statusAvax;
    }
  };

  const { isLocked } = useLiquidityLocked();

  const supportedChainIds = Object.values(ChainId)
    .filter((x) => typeof x === "number")
    .filter((values) => values !== ChainId.ETHEREUM_GOERLI) as number[];

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
          <div className="relative left-1/2 z-10 -mt-[44px] -mb-[36px] flex h-20 w-fit -translate-x-1/2 items-center justify-center">
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
          <div className="mb-2 flex h-12 w-full items-center justify-start rounded-sm bg-yellow-400/5 px-4">
            {isLocked ? (
              <>
                <BiLock className="text-yellow-400" />
                <div className="ml-2 text-sm text-white">
                  You must wait 24 hours before removing liquidity
                </div>
              </>
            ) : (
              <>
                <BiCheckCircle className="text-yellow-400" />
                <div className="ml-2 text-sm text-white">
                  You can remove liquidity at any time
                </div>
              </>
            )}
          </div>
          <InteractButton
            onConfirm={handleProvideLiquidity}
            expectedChainId={goerli.id}
            text="Add Liquidity"
          >
            {(() => {
              if (isLocked) {
                return <Button disabled text="Liquidity locked" />;
              }
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
          <div className="mb-2 flex h-12 w-full items-center justify-start rounded-sm bg-yellow-400/5 px-4">
            {isLocked ? (
              <>
                <BiLock className="text-yellow-400" />
                <div className="ml-2 text-sm text-white">
                  You can only remove liquidity after 24 hours
                </div>
              </>
            ) : (
              <>
                <BiCheckCircle className="text-yellow-400" />
                <div className="ml-2 text-sm text-white">
                  You can remove liquidity at any time
                </div>
              </>
            )}
          </div>
          <InteractButton
            onConfirm={handleWithdraw}
            expectedChainId={goerli.id}
            text="Remove Liquidity"
          >
            {(() => {
              if (isLocked) {
                return <Button disabled text="Liquidity locked" />;
              }
              if (!withdrawAmounts[Field.CURRENCY_A]) {
                return <Button disabled text="Enter an amount" />;
              }
              if (
                withdrawBalance[Field.CURRENCY_A] &&
                withdrawAmounts[Field.CURRENCY_A].greaterThan(
                  withdrawBalance[Field.CURRENCY_A]
                )
              ) {
                return <Button disabled text="Insufficient balance" />;
              }
            })()}
          </InteractButton>
          {!isLocked && (
            <>
              <div className="mb-4 mt-8 h-px w-full bg-white/5" />
              <div className="relative left-1/2 -my-14 -mb-6 flex h-20 w-fit -translate-x-1/2 items-center justify-center">
                <div className="group absolute flex h-6 w-6 -rotate-45 cursor-pointer items-center justify-center border border-white/10 bg-pita outline outline-4 outline-pita transition duration-500 ease-in-out hover:scale-110">
                  <BiDownArrowAlt className="relative rotate-45 text-2xl text-white/50 transition duration-500 ease-in-out group-hover:text-sky-400" />
                </div>
              </div>
              <div className="mb-2 flex w-full items-center justify-between rounded-sm border-l-2 border-sky-400 bg-gradient-to-r from-sky-400/5 to-transparent py-2 px-4">
                <div className="flex items-center">
                  <div className="relative mr-4 h-4 w-4">
                    <Image
                      src="/usdc.png"
                      alt=""
                      fill
                      className="object-contain"
                    />
                  </div>
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
                        data?.reserve0.equalTo("0") ||
                          data?.totalSupply.equalTo("0")
                          ? JSBI.BigInt(0)
                          : JSBI.divide(
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
                  <div className="relative mr-4 h-4 w-4">
                    <Image
                      src="/usdt.png"
                      alt=""
                      fill
                      className="object-contain"
                    />
                  </div>
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
                        data?.reserve1.equalTo("0") ||
                          data?.totalSupply.equalTo("0")
                          ? JSBI.BigInt(0)
                          : JSBI.divide(
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
            </>
          )}
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
              <div className="relative mr-4 h-4 w-4">
                <Image src="/usdc.png" alt="" fill className="object-contain" />
              </div>
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
              <div className="relative mr-4 h-4 w-4">
                <Image src="/usdt.png" alt="" fill className="object-contain" />
              </div>
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
              <div className="relative mr-4 h-4 w-4">
                <Image src="/dove.png" alt="" fill className="object-contain" />
              </div>
              <p className="text-xs uppercase tracking-widest text-white">
                DVE-LP
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
              expectedChainId={goerli.id}
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
            expectedChainId={goerli.id}
            text="Mint"
          />
        </TabContentContainer>
      </Tabs.Content>
      <Tabs.Content value="tab5">
        <TabContentContainer>
          <div className="mb-4 flex items-center">
            <BiRefresh className="mr-4 rounded-sm border border-white/10 p-2 text-4xl text-white" />
            <div className="flex flex-col">
              <h4 className="text-white">Syncs Incoming</h4>
              <p className="text-xs text-white/50">
                Update reserves with L2 AMM
              </p>
            </div>
          </div>
          {supportedChainIds.map((chainId) => (
            <div className="mb-2 flex w-full items-center justify-between rounded-sm border-l-2 border-sky-400  bg-gradient-to-r from-sky-400/5 to-transparent p-4">
              <div className="flex w-full items-center">
                <div className="relative mr-4 h-4 w-4">
                  <Image
                    src={SUPPORTED_CHAIN_IMAGES[chainId as ChainId]}
                    alt=""
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="flex">
                  <div className="flex flex-col">
                    <p className="mb-2 text-white">
                      {SUPPORTED_CHAIN_NAMES[chainId as ChainId]}
                    </p>
                    {(() => {
                      const status = getStatus(chainId);

                      switch (status) {
                        case "PENDING_FINALIZE":
                          return (
                            <p className="flex w-24 items-center justify-center rounded-sm bg-yellow-400/5 py-1 text-xs uppercase tracking-widest text-yellow-400">
                              <BiLoader className="mr-2" />
                              Pending
                            </p>
                          );
                        default:
                          return (
                            <p className="flex w-24 items-center justify-center rounded-sm bg-green-400/5 py-1 text-xs uppercase tracking-widest text-green-400">
                              <BiCheckCircle className="mr-2" />
                              Synced
                            </p>
                          );
                      }
                    })()}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {(() => {
                  const status = getStatus(chainId);

                  if (status === "PENDING_FINALIZE") {
                    return (
                      <button
                        className="group flex  w-36 items-center justify-center rounded-sm border border-white/10 py-3"
                        onClick={() => handleFinalizeIncomingSync(chainId)}
                      >
                        <p className="text-xs uppercase tracking-widest text-sky-400 transition group-hover:drop-shadow-soju">
                          Finalize Sync
                        </p>
                      </button>
                    );
                  }
                })()}
                <button
                  className="group flex  w-36 items-center justify-center rounded-sm border border-sky-400 bg-sky-400/5 py-3"
                  onClick={() => handleSync(chainId)}
                >
                  <p className="text-xs uppercase tracking-widest text-white transition duration-500 ease-in-out group-hover:drop-shadow-tabler">
                    Sync To L2
                  </p>
                </button>
              </div>
            </div>
          ))}
        </TabContentContainer>
      </Tabs.Content>
    </TabSlider>
  );
};

export default DammTabContent;
