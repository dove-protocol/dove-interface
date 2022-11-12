import Head from "next/head";
import Main from "../components/layouts/Main";
import { FaGithub } from "react-icons/fa";
import { ConnectKitButton } from "connectkit";
import Image from "next/image";
import Article from "../components/layouts/Article";
import * as Tabs from "@radix-ui/react-tabs";
import { useState } from "react";

export default function Home() {
  const [activeTab, setActiveTab] = useState("tab1");

  return (
    <Main>
      <Article>
        {/* <div className="absolute h-screen w-full"></div> */}
        <div className="background-gradient absolute h-full w-[100vw] opacity-20">
          <div className="background-gradient-pattern" />
        </div>
        <div className="relative flex h-screen w-full items-start justify-center pt-48">
          <div className="relative flex w-full flex-col items-start px-4 py-4">
            <div className="flex w-full flex-row space-x-4">
              <Tabs.Root className="w-full">
                <Tabs.List className="relative z-10 flex flex-row">
                  <Tabs.Trigger
                    value="tab1"
                    className="w-full cursor-pointer rounded-sm rounded-b-none border border-b-0 border-white/5 px-4 py-2 text-left transition duration-300 ease-linear hover:text-white rdx-state-active:bg-[#313135] rdx-state-active:text-white rdx-state-inactive:text-white/50"
                  >
                    <p className="">dAMM</p>
                  </Tabs.Trigger>
                  <Tabs.Trigger
                    value="tab2"
                    className="w-full cursor-pointer rounded-sm rounded-b-none border border-b-0 border-white/5 px-4 py-2 text-left transition duration-300 ease-linear hover:text-white rdx-state-active:bg-[#313135] rdx-state-active:text-white rdx-state-inactive:text-white/50"
                  >
                    <p className="">Fuji AMM</p>
                  </Tabs.Trigger>
                  <Tabs.Trigger
                    value="tab3"
                    className="w-full cursor-pointer rounded-sm rounded-b-none border border-b-0 border-white/5 px-4 py-2 text-left transition duration-300 ease-linear hover:text-white rdx-state-active:bg-[#313135] rdx-state-active:text-white rdx-state-inactive:text-white/50"
                  >
                    <p className="">Arbitrum AMM</p>
                  </Tabs.Trigger>
                </Tabs.List>
                <Tabs.Content value="tab1">
                  <div className="bg relative flex w-full flex-col space-y-1 rounded-sm rounded-tl-none p-8 shadow-damn">
                    <div className="background-gradient pointer-events-none absolute h-full w-[36rem] opacity-20">
                      <div className="background-gradient-pattern" />
                    </div>
                    <Tabs.Root
                      value={activeTab}
                      onValueChange={(v) => setActiveTab(v)}
                      className="w-full"
                    >
                      <Tabs.List className="mb-8 flex flex-row space-x-4">
                        <Tabs.Trigger
                          value="tab1"
                          className="cursor-pointer rounded-sm border border-white/5 px-2 py-0.5 backdrop-blur-lg transition duration-300 ease-linear hover:text-white rdx-state-active:border rdx-state-active:text-white rdx-state-active:shadow-damn rdx-state-inactive:text-white/50"
                        >
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
                          className="cursor-pointer rounded-sm border border-white/5 px-2 py-0.5 backdrop-blur-lg transition duration-300 ease-linear hover:text-white rdx-state-active:text-white rdx-state-active:shadow-damn rdx-state-inactive:text-white/50"
                        >
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
                          className="cursor-pointer rounded-sm border border-white/5 px-2 py-0.5 backdrop-blur-lg transition duration-300 ease-linear hover:text-white rdx-state-active:text-white rdx-state-active:shadow-damn rdx-state-inactive:text-white/50"
                        >
                          <p
                            className={`font-light ${
                              activeTab === "tab3" && ""
                            }`}
                          >
                            Stats
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
                            EXP
                          </h4>
                        </div>
                        <div className="mb-4 flex h-20 w-full items-start justify-between rounded-sm border border-white/5 bg-black/10 p-4">
                          <input
                            className="bg-transparent font-wagmi text-xl text-white  placeholder:text-white/50 focus:outline-none"
                            placeholder="0.00"
                          />

                          <h4 className="h-fit rounded-sm border border-white/5 px-2 py-0.5 text-white/50 ">
                            SOJU
                          </h4>
                        </div>
                        <div className="flex h-16 w-full items-center justify-center rounded-sm border border-white/5 shadow-damn">
                          <p className="text-white drop-shadow-soju">
                            Add Liquidity
                          </p>
                        </div>
                      </Tabs.Content>
                      <Tabs.Content value="tab2">
                        <h3 className="mb-2 text-white">39.93</h3>
                        <p className="mb-8 font-thin uppercase tracking-widest text-white/50">
                          Total balance (ETH)
                        </p>
                        <div className="mb-4 flex h-20 w-full items-start justify-between rounded-sm border border-white/5 bg-black/10 p-4">
                          <input
                            className="bg-transparent font-wagmi text-xl text-white  placeholder:text-white/50 focus:outline-none"
                            placeholder="0.00"
                          />
                          <h4 className="h-fit rounded-sm border border-white/5 px-2 py-0.5 text-white/50 ">
                            EXP
                          </h4>
                        </div>
                        <div className="flex h-16 w-full items-center justify-center rounded-sm border border-white/5 shadow-damn">
                          <p className="text-white drop-shadow-soju">
                            Withdraw
                          </p>
                        </div>
                      </Tabs.Content>
                      <Tabs.Content value="tab3">
                        <p className="mb-2 font-thin uppercase tracking-widest text-white">
                          Reserve 1 <span className="text-white/50">(EXP)</span>
                        </p>
                        <h3 className="mb-8 text-white">139.14</h3>
                        <div className="mb-8 h-px w-full bg-white/5" />
                        <p className="mb-2 font-thin uppercase tracking-widest text-white">
                          Reserve 1{" "}
                          <span className="text-white/50">(SOJU)</span>
                        </p>
                        <h3 className="mb-2 text-white">23.64</h3>
                      </Tabs.Content>
                    </Tabs.Root>
                  </div>
                </Tabs.Content>
                <Tabs.Content value="tab2">
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
                        EXP
                      </h4>
                    </div>
                    <div className="relative mb-4 flex h-20 w-full items-start justify-between rounded-sm border border-white/5 bg-black/10 p-4">
                      <input
                        className="bg-transparent font-wagmi text-xl text-white  placeholder:text-white/50 focus:outline-none"
                        placeholder="0.00"
                      />
                      <h4 className="h-fit rounded-sm border border-white/5 px-2 py-0.5 text-white/50 ">
                        EXP
                      </h4>
                    </div>
                    <div className="flex h-16 w-full items-center justify-center rounded-sm border border-white/5 shadow-damn">
                      <p className="text-white drop-shadow-soju">Swap</p>
                    </div>
                  </div>
                </Tabs.Content>
                <Tabs.Content value="tab3">
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
                        EXP
                      </h4>
                    </div>
                    <div className="relative mb-4 flex h-20 w-full items-start justify-between rounded-sm border border-white/5 bg-black/10 p-4">
                      <input
                        className="bg-transparent font-wagmi text-xl text-white  placeholder:text-white/50 focus:outline-none"
                        placeholder="0.00"
                      />
                      <h4 className="h-fit rounded-sm border border-white/5 px-2 py-0.5 text-white/50 ">
                        EXP
                      </h4>
                    </div>
                    <div className="flex h-16 w-full items-center justify-center rounded-sm border border-white/5 shadow-damn">
                      <p className="text-white drop-shadow-soju">Swap</p>
                    </div>
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
