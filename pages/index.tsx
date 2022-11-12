import Main from "../components/layouts/Main";
import Article from "../components/layouts/Article";
import * as Tabs from "@radix-ui/react-tabs";
import { useState, useEffect } from "react";
import { chain, useSwitchNetwork } from "wagmi";
import Button from "../components/InteractButton";
import InteractButton from "../components/InteractButton";
import { useIsMounted } from "../hooks/useIsMounted";
import { BiPlus, BiMinus, BiStats } from "react-icons/bi";

export default function Home() {
  const [activeTab, setActiveTab] = useState("tab1");
  const [activeNetworkTab, setActiveNetworkTab] = useState("damm");

  const { chains, error, isLoading, pendingChainId, switchNetwork } =
    useSwitchNetwork();

  useEffect(() => {
    if (activeNetworkTab === "damm") {
      switchNetwork?.(chain.goerli.id);
    }
    if (activeNetworkTab === "fuji") {
      switchNetwork?.(43113);
    }
    if (activeNetworkTab === "arbi") {
      switchNetwork?.(chain.arbitrumGoerli.id);
    }
  }, [activeNetworkTab]);

  const isMounted = useIsMounted();

  if (!isMounted) return null;

  return (
    <Main>
      <Article>
        <div className="radial absolute h-screen w-full"></div>
        <div className="background-gradient absolute h-full w-[100vw] opacity-20">
          <div className="background-gradient-pattern" />
        </div>
        <div className="relative flex h-screen w-full items-start justify-center pt-48">
          <div className="relative flex w-full flex-col items-start px-4 py-4">
            <div className="flex w-full flex-row space-x-4">
              <Tabs.Root
                value={activeNetworkTab}
                onValueChange={(v) => setActiveNetworkTab(v)}
                defaultValue="damm"
                className="w-full"
              >
                <Tabs.List className="relative z-10 flex flex-row">
                  <Tabs.Trigger
                    value="damm"
                    className="w-full cursor-pointer rounded-sm rounded-b-none border border-b-0 border-white/5 px-4 py-2 text-left transition duration-300 ease-linear hover:text-white rdx-state-active:bg-[#313135] rdx-state-active:text-white rdx-state-inactive:text-white/50"
                  >
                    <p className="">dAMM</p>
                  </Tabs.Trigger>
                  <Tabs.Trigger
                    value="fuji"
                    className="w-full cursor-pointer rounded-sm rounded-b-none border border-b-0 border-white/5 px-4 py-2 text-left transition duration-300 ease-linear hover:text-white rdx-state-active:bg-[#313135] rdx-state-active:text-white rdx-state-inactive:text-white/50"
                  >
                    <p className="">Fuji AMM</p>
                  </Tabs.Trigger>
                  <Tabs.Trigger
                    value="arbi"
                    className="w-full cursor-pointer rounded-sm rounded-b-none border border-b-0 border-white/5 px-4 py-2 text-left transition duration-300 ease-linear hover:text-white rdx-state-active:bg-[#313135] rdx-state-active:text-white rdx-state-inactive:text-white/50"
                  >
                    <p className="">Arbitrum AMM</p>
                  </Tabs.Trigger>
                </Tabs.List>
                <Tabs.Content value="damm">
                  <div className="bg relative flex w-full flex-col space-y-1 rounded-sm rounded-tl-none p-8 shadow-damn">
                    <div className="background-gradient pointer-events-none absolute h-full w-[36rem] opacity-20">
                      <div className="background-gradient-pattern" />
                    </div>

                    <Tabs.Root
                      defaultValue="tab1"
                      value={activeTab}
                      onValueChange={(v) => setActiveTab(v)}
                      className="w-full"
                    >
                      <Tabs.List className="mb-8 flex flex-row space-x-4">
                        <Tabs.Trigger
                          value="tab1"
                          className="flex cursor-pointer flex-row items-center rounded-sm border border-white/5 px-2 py-0.5 backdrop-blur-lg transition duration-300 ease-linear hover:text-white rdx-state-active:border rdx-state-active:text-white rdx-state-active:shadow-damn rdx-state-inactive:text-white/50"
                        >
                          <BiPlus className="mr-2" />
                          <p
                            className={`font-light ${
                              activeTab === "tab1" && ""
                            }`}
                          >
                            Provide
                          </p>
                        </Tabs.Trigger>
                        <Tabs.Trigger
                          value="tab2"
                          className="flex cursor-pointer flex-row items-center rounded-sm border border-white/5 px-2 py-0.5 backdrop-blur-lg transition duration-300 ease-linear hover:text-white rdx-state-active:text-white rdx-state-active:shadow-damn rdx-state-inactive:text-white/50"
                        >
                          <BiMinus className="mr-2" />
                          <p
                            className={`font-light ${
                              activeTab === "tab2" && ""
                            }`}
                          >
                            Withdraw
                          </p>
                        </Tabs.Trigger>
                        <Tabs.Trigger
                          value="tab3"
                          className="flex cursor-pointer items-center rounded-sm border border-white/5 px-2 py-0.5 backdrop-blur-lg transition duration-300 ease-linear hover:text-white rdx-state-active:text-white rdx-state-active:shadow-damn rdx-state-inactive:text-white/50"
                        >
                          <BiStats className="mr-2" />

                          <p
                            className={`font-light ${
                              activeTab === "tab3" && ""
                            }`}
                          >
                            Reserves
                          </p>
                        </Tabs.Trigger>
                      </Tabs.List>
                      <Tabs.Content value="tab1">
                        <div className="mb-4 flex h-20 w-full items-start justify-between rounded-sm border border-white/5 bg-black/10 p-4">
                          <input
                            className="bg-transparent font-wagmi text-xl text-white  placeholder:text-white/50 focus:outline-none"
                            placeholder="0.00"
                          />
                          <h4 className="h-fit rounded-sm border border-white/5 px-2 py-0.5 text-white/50 ">
                            USDT
                          </h4>
                        </div>
                        <div className="mb-4 flex h-20 w-full items-start justify-between rounded-sm border border-white/5 bg-black/10 p-4">
                          <input
                            className="bg-transparent font-wagmi text-xl text-white  placeholder:text-white/50 focus:outline-none"
                            placeholder="0.00"
                          />

                          <h4 className="h-fit rounded-sm border border-white/5 px-2 py-0.5 text-white/50 ">
                            USDC
                          </h4>
                        </div>
                        <InteractButton
                          onClick={() => {}}
                          text="Add Liquidity"
                        />
                      </Tabs.Content>
                      <Tabs.Content value="tab2">
                        <p className="mb-2 font-thin tracking-widest text-white/50">
                          <span className="text-white">Total Balance</span>{" "}
                          (ETH)
                        </p>
                        <h3 className="mb-8 text-white">39.93</h3>
                        <div className="mb-4 flex h-20 w-full items-start justify-between rounded-sm border border-white/5 bg-black/10 p-4">
                          <input
                            className="bg-transparent font-wagmi text-xl text-white  placeholder:text-white/50 focus:outline-none"
                            placeholder="0.00"
                          />
                          <h4 className="h-fit rounded-sm border border-white/5 px-2 py-0.5 text-white/50 ">
                            USDT
                          </h4>
                        </div>
                        <InteractButton text="Withdraw" onClick={() => {}} />
                      </Tabs.Content>
                      <Tabs.Content value="tab3">
                        <p className="mb-2 font-thin tracking-widest text-white">
                          Reserve 1{" "}
                          <span className="text-white/50">(USDT)</span>
                        </p>
                        <h3 className="mb-8 text-white">139.14</h3>
                        <div className="mb-8 h-px w-full bg-white/5" />
                        <p className="mb-2 font-thin tracking-widest text-white">
                          Reserve 2{" "}
                          <span className="text-white/50">(USDC)</span>
                        </p>
                        <h3 className="mb-2 text-white">23.64</h3>
                      </Tabs.Content>
                    </Tabs.Root>
                  </div>
                </Tabs.Content>
                <Tabs.Content value="fuji">
                  <div className="bg flex w-full flex-col rounded-sm p-8 shadow-damn">
                    <div className="background-gradient pointer-events-none absolute h-full w-[36rem] opacity-20">
                      <div className="background-gradient-pattern" />
                    </div>

                    <p className="mb-4 font-thin text-white">Swap</p>
                    <div className="mb-4 flex h-20 w-full items-start justify-between rounded-sm border border-white/5 bg-black/10 p-4">
                      <input
                        className="bg-transparent font-wagmi text-xl text-white  placeholder:text-white/50 focus:outline-none"
                        placeholder="0.00"
                      />
                      <h4 className="h-fit rounded-sm border border-white/5 px-2 py-0.5 text-white/50 ">
                        USDT
                      </h4>
                    </div>
                    <div className="relative mb-4 flex h-20 w-full items-start justify-between rounded-sm border border-white/5 bg-black/10 p-4">
                      <input
                        className="bg-transparent font-wagmi text-xl text-white  placeholder:text-white/50 focus:outline-none"
                        placeholder="0.00"
                      />
                      <h4 className="h-fit rounded-sm border border-white/5 px-2 py-0.5 text-white/50 ">
                        USDC
                      </h4>
                    </div>
                    <InteractButton text="Swap" onClick={() => {}} />
                  </div>
                </Tabs.Content>
                <Tabs.Content value="arbi">
                  <div className="bg flex w-full flex-col rounded-sm p-8 shadow-damn">
                    <div className="background-gradient pointer-events-none absolute h-full w-[36rem] opacity-20">
                      <div className="background-gradient-pattern" />
                    </div>

                    <p className="mb-4 font-thin text-white">Swap</p>
                    <div className="mb-4 flex h-20 w-full items-start justify-between rounded-sm border border-white/5 bg-black/10 p-4">
                      <input
                        className="bg-transparent font-wagmi text-xl text-white  placeholder:text-white/50 focus:outline-none"
                        placeholder="0.00"
                      />
                      <h4 className="h-fit rounded-sm border border-white/5 px-2 py-0.5 text-white/50 ">
                        USDT
                      </h4>
                    </div>
                    <div className="relative mb-4 flex h-20 w-full items-start justify-between rounded-sm border border-white/5 bg-black/10 p-4">
                      <input
                        className="bg-transparent font-wagmi text-xl text-white  placeholder:text-white/50 focus:outline-none"
                        placeholder="0.00"
                      />
                      <h4 className="h-fit rounded-sm border border-white/5 px-2 py-0.5 text-white/50 ">
                        USDC
                      </h4>
                    </div>
                    <InteractButton text="Swap" onClick={() => {}} />
                  </div>
                </Tabs.Content>
              </Tabs.Root>
            </div>
          </div>
        </div>
      </Article>
    </Main>
  );
}
