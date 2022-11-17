import React from "react";
import { chain, useAccount } from "wagmi";
import InteractButton, { Button } from "./InteractButton";
import {
  BiExpandAlt,
  BiRefresh,
  BiCog,
  BiDollar,
  BiDownload,
  BiReceipt,
  BiCreditCardFront,
} from "react-icons/bi";
import * as Tabs from "@radix-ui/react-tabs";
import { useState, useRef } from "react";
import { validateNumber } from "../lib/utils";
import InputWithBalance from "./InputWithBalance";
import Tab from "./Tab";
import useApproveToken from "../lib/hooks/useApproval";
import { BigNumber } from "ethers";
import useTriggerToast from "../hooks/useTriggerToast";
import JSBI from "jsbi";
import { CurrencyAmount } from "../sdk";
import { USDC } from "../sdk/constants";
import { useTokenBalances } from "../lib/hooks/useTokenBalance";

const SwapTabContent = ({ expectedChainId }: { expectedChainId: number }) => {
  // const { address } = useAccount();
  // const [activeTab, setActiveTab] = useState("tab1");
  // const [isSwapped, setIsSwapped] = useState(false);
  // // used exclusively for constructor swap calldata
  // const [amount0In, setAmount0In] = useState<string>("");
  // const [amount1In, setAmount1In] = useState<string>("");
  // const [amount0, setAmount0] = useState<string>("");
  // const [amount1, setAmount1] = useState<string>("");
  // const [vUSDCToBurn, setvUSDCToBurn] = useState<string>("");
  // const [vUSDTToBurn, setvUSDTToBurn] = useState<string>("");
  // const [USDCToMint, setUSDCToMint] = useState<string>("");
  // const [USDTToMint, setUSDTToMint] = useState<string>("");
  // const [swapError, setSwapError] = useState<string | undefined>();
  // const { trigger } = useTriggerToast();
  // const { approve: approveAmount0, isApproved: isApprovedAmount0 } =
  //   useApproveToken({
  //     token: getTokenAddress(false),
  //     spender: getDammAddress(),
  //     amountRequested:
  //       amount0 === "" ? 0 : BigNumber.from(parseFloat(amount0) * 10 ** 6),
  //   });
  // const { approve: approveAmount1, isApproved: isApprovedAmount1 } =
  //   useApproveToken({
  //     token: getTokenAddress(true),
  //     spender: getDammAddress(),
  //     amountRequested:
  //       amount1 === "" ? 0 : BigNumber.from(parseFloat(amount0) * 10 ** 6),
  //   });
  // const { sync } = useSyncToL1();
  // useTokenBalances([], address);
  // const { mint: mintUSDC } = useMint({
  //   amount: USDCToMint === "" ? "0" : USDCToMint,
  //   isUSDC: true,
  // });
  // const { mint: mintUSDT } = useMint({
  //   amount: USDTToMint === "" ? "0" : USDTToMint,
  //   isUSDC: false,
  // });
  // const vUSDCData = useVoucherBalance({ isvUSDC: true });
  // const vUSDTData = useVoucherBalance({ isvUSDC: false });
  // const { swap } = useAMMSwap({
  //   amountIn: CurrencyAmount.fromFractionalAmount(
  //     USDC[expectedChainId],
  //     JSBI.BigInt(parseFloat(amount0) * 10 ** 6),
  //     JSBI.BigInt(10 ** 6)
  //   ),
  //   amountOut: CurrencyAmount.fromFractionalAmount(
  //     USDC[expectedChainId],
  //     JSBI.BigInt(parseFloat(amount0) * 10 ** 6),
  //     JSBI.BigInt(10 ** 6)
  //   ),
  // });
  // const { burn } = useBurnVouchers({ vUSDCToBurn, vUSDTToBurn });
  // const { reserve0, reserve1 } = useAMMReserves();
  // const wrapperRef = useRef<HTMLDivElement>(null);
  // const highlightRef = useRef<HTMLDivElement>(null);
  // const reactiveSetAmount0 = (value: string) => {
  //   setAmount0(value);
  //   if (reserve0 && reserve1) {
  //     const amountIn =
  //       value == ""
  //         ? BigNumber.from(0)
  //         : BigNumber.from(parseFloat(value) * 10 ** 6);
  //     const amountOut = amountIn.mul(reserve1).div(reserve0.add(amountIn));
  //     setAmount1((amountOut.toNumber() / 10 ** 6).toString());
  //     setAmount0In(amountIn.toString());
  //     setAmount1In("0");
  //   }
  // };
  // const reactiveSetAmount1 = (value: string) => {
  //   setAmount1(value);
  //   if (reserve0 && reserve1) {
  //     const amountIn =
  //       value == ""
  //         ? BigNumber.from(0)
  //         : BigNumber.from(parseFloat(value) * 10 ** 6);
  //     const amountOut = amountIn.mul(reserve0).div(reserve1.add(amountIn));
  //     setAmount0((amountOut.toNumber() / 10 ** 6).toString());
  //     setAmount1In(amountIn.toString());
  //     setAmount0In("0");
  //   }
  // };
  // const [tabBoundingBox, setTabBoundingBox] = useState<DOMRect | null>(null);
  // const [wrapperBoundingBox, setWrapperBoundingBox] = useState<DOMRect | null>(
  //   null
  // );
  // const [highlightedTab, setHighlightedTab] = useState<string | null>(null);
  // const [isHoveredFromNull, setIsHoveredFromNull] = useState(true);
  // const repositionHighlight = (e: any, id: string) => {
  //   if (wrapperRef.current) {
  //     setTabBoundingBox(e.target.getBoundingClientRect());
  //     setWrapperBoundingBox(wrapperRef.current.getBoundingClientRect());
  //     setIsHoveredFromNull(!highlightedTab);
  //     setHighlightedTab(id);
  //   }
  // };
  // const highlightStyles: any = {};
  // if (tabBoundingBox && wrapperBoundingBox) {
  //   highlightStyles.transitionDuration = isHoveredFromNull ? "0ms" : "150ms";
  //   highlightStyles.opacity = highlightedTab ? 1 : 0;
  //   highlightStyles.width = `${tabBoundingBox.width - 1}px`;
  //   highlightStyles.transform = `translate(${
  //     tabBoundingBox.left - wrapperBoundingBox.left + 1
  //   }px)`;
  // }
  // const tabsData = [
  //   {
  //     id: "tab1",
  //     label: "Swap",
  //     content: <BiRefresh className="ml-2 rounded-sm bg-white/5 p-px" />,
  //   },
  //   {
  //     id: "tab2",
  //     label: "Mint",
  //     content: <BiDollar className="ml-2 rounded-sm bg-white/5 p-px" />,
  //   },
  //   {
  //     id: "tab3",
  //     label: "Sync",
  //     content: <BiDownload className="ml-2 rounded-sm bg-white/5 p-px" />,
  //   },
  //   {
  //     id: "tab4",
  //     label: "Vouchers",
  //     content: (
  //       <BiCreditCardFront className="ml-2 rounded-sm bg-white/5 p-px" />
  //     ),
  //   },
  // ];
  // return (
  //   <Tabs.Root
  //     defaultValue="tab1"
  //     value={activeTab}
  //     onValueChange={(v) => setActiveTab(v)}
  //     className="w-full"
  //   >
  //     <Tabs.List
  //       ref={wrapperRef}
  //       onMouseLeave={() => setHighlightedTab(null)}
  //       className="relative mb-4 flex w-full flex-row rounded-sm bg-black/10 p-1"
  //     >
  //       <div
  //         className="absolute -left-px h-[34px] translate-y-[4px] rounded-sm bg-white/5 transition"
  //         ref={highlightRef}
  //         style={highlightStyles}
  //       />
  //       {tabsData.map((tab) => (
  //         <Tab
  //           key={tab.id}
  //           id={tab.id}
  //           label={tab.label}
  //           repositionHighlight={repositionHighlight}
  //         >
  //           {tab.content}
  //         </Tab>
  //       ))}
  //     </Tabs.List>
  //     <Tabs.Content value="tab1">
  //       {!isSwapped ? (
  //         <InputWithBalance
  //           label="USDT"
  //           expectedChainId={expectedChainId}
  //           value={amount1}
  //           setValue={reactiveSetAmount1}
  //           setError={setSwapError}
  //           balance={usdtData}
  //           maxEnabled
  //         />
  //       ) : (
  //         <InputWithBalance
  //           label="USDC"
  //           expectedChainId={expectedChainId}
  //           value={amount0}
  //           setValue={reactiveSetAmount0}
  //           setError={setSwapError}
  //           balance={usdcData}
  //           maxEnabled
  //         />
  //       )}
  //       <div className="relative left-1/2 z-10 -my-12 -mb-8 flex h-20 w-fit -translate-x-1/2 items-center justify-center">
  //         <button className="group" onClick={() => setIsSwapped(!isSwapped)}>
  //           <BiExpandAlt className="-rotate-45 border border-white/10 bg-[#26272b] text-2xl text-white/50 transition ease-in-out group-hover:scale-110 group-hover:text-white" />
  //         </button>
  //       </div>
  //       {!isSwapped ? (
  //         <InputWithBalance
  //           label="USDC"
  //           expectedChainId={expectedChainId}
  //           value={amount0}
  //           setValue={reactiveSetAmount0}
  //           setError={setSwapError}
  //           balance={usdcData}
  //         />
  //       ) : (
  //         <InputWithBalance
  //           label="USDT"
  //           expectedChainId={expectedChainId}
  //           value={amount1}
  //           setValue={reactiveSetAmount1}
  //           setError={setSwapError}
  //           balance={usdtData}
  //         />
  //       )}
  //       <InteractButton
  //         expectedChainId={expectedChainId}
  //         text="Swap"
  //         error={swapError}
  //         onClick={swap}
  //       >
  //         {(() => {
  //           if (amount0 === "" || amount1 === "") {
  //             return <Button disabled text="Enter an amount" />;
  //           }
  //           if (!isSwapped) {
  //             if (!isApprovedAmount0) {
  //               return <Button onClick={approveAmount0} text="Approve USDT" />;
  //             }
  //           } else {
  //             if (!isApprovedAmount1) {
  //               return <Button onClick={approveAmount1} text="Approve USDC" />;
  //             }
  //           }
  //         })()}
  //       </InteractButton>
  //     </Tabs.Content>
  //     <Tabs.Content value="tab2">
  //       <InputWithBalance
  //         label="USDT"
  //         expectedChainId={expectedChainId}
  //         value={USDTToMint}
  //         setValue={setUSDTToMint}
  //         balance={usdtData}
  //       />
  //       <div className="relative mb-4">
  //         <InteractButton
  //           expectedChainId={expectedChainId}
  //           onClick={mintUSDT}
  //           text="Mint USDT"
  //         />
  //       </div>
  //       <InputWithBalance
  //         label="USDC"
  //         expectedChainId={expectedChainId}
  //         value={USDCToMint}
  //         setValue={setUSDCToMint}
  //         balance={usdcData}
  //       />
  //       <InteractButton
  //         expectedChainId={expectedChainId}
  //         onClick={mintUSDC}
  //         text="Mint USDC"
  //       />
  //     </Tabs.Content>
  //     <Tabs.Content value="tab3">
  //       <div className="relative">
  //         <InteractButton
  //           expectedChainId={expectedChainId}
  //           onClick={() => sync()}
  //           text="Sync to L1"
  //         />
  //       </div>
  //     </Tabs.Content>
  //     <Tabs.Content value="tab4">
  //       <div className="relative">
  //         <InputWithBalance
  //           label="vUSDC"
  //           expectedChainId={expectedChainId}
  //           value={vUSDCToBurn}
  //           setValue={setvUSDCToBurn}
  //           balance={vUSDCData}
  //         />
  //         <InputWithBalance
  //           label="vUSDT"
  //           expectedChainId={expectedChainId}
  //           value={vUSDTToBurn}
  //           setValue={setvUSDTToBurn}
  //           balance={vUSDTData}
  //         />
  //         <InteractButton
  //           expectedChainId={expectedChainId}
  //           onClick={burn}
  //           text="Burn Vouchers"
  //         >
  //           {/* {(() => {
  //             if (amount0 === "" || amount1 === "") {
  //               return <Button disabled text="Enter an amount" />;
  //             }
  //             if (!isSwapped) {
  //               if (!isApprovedAmount0) {
  //                 return (
  //                   <Button onClick={approveAmount0} text="Approve USDT" />
  //                 );
  //               }
  //             } else {
  //               if (!isApprovedAmount1) {
  //                 return (
  //                   <Button onClick={approveAmount1} text="Approve USDC" />
  //                 );
  //               }
  //             }
  //           })()} */}
  //         </InteractButton>
  //       </div>
  //     </Tabs.Content>
  //   </Tabs.Root>
  // );
};

export default SwapTabContent;
