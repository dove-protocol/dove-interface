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
        <div className="background-gradient absolute h-full w-[100vw]">
          <div className="background-gradient-pattern" />
        </div>
        <div className="relative flex h-screen w-full items-start justify-center pt-48">
          <div className="relative flex w-full flex-col items-start px-4 py-4">
            <div className="flex w-full flex-row space-x-4">
              <Tabs.Root className="w-full">
                <Tabs.List className="flex flex-row">
                  <Tabs.Trigger
                    value="tab1"
                    className="cursor-pointer rounded-sm rounded-b-none border border-b-0 border-white/5 px-12 py-2 transition duration-300 ease-linear hover:text-white rdx-state-active:bg-[#313135] rdx-state-active:text-white rdx-state-inactive:text-white/50"
                  >
                    <p className="">dAMM</p>
                  </Tabs.Trigger>
                  <Tabs.Trigger
                    value="tab2"
                    className="cursor-pointer rounded-sm rounded-b-none border border-b-0 border-white/5 px-12 py-2 transition duration-300 ease-linear hover:text-white rdx-state-active:bg-[#313135] rdx-state-active:text-white rdx-state-inactive:text-white/50"
                  >
                    <p className="">Fuji AMM</p>
                  </Tabs.Trigger>
                  <Tabs.Trigger
                    value="tab3"
                    className="cursor-pointer rounded-sm rounded-b-none border border-b-0 border-white/5 px-12 py-2 transition duration-300 ease-linear hover:text-white rdx-state-active:bg-[#313135] rdx-state-active:text-white rdx-state-inactive:text-white/50"
                  >
                    <p className="">Arbitrum AMM</p>
                  </Tabs.Trigger>
                </Tabs.List>
                <Tabs.Content value="tab1">
                  <div className="bg relative flex w-full flex-col space-y-1 rounded-sm rounded-tl-none p-8 shadow-damn">
                    <div className="background-gradient pointer-events-none absolute h-full w-[100vw]">
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
                              activeTab === "tab1" && "drop-shadow-soju"
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
                              activeTab === "tab2" && "drop-shadow-soju"
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
                              activeTab === "tab3" && "drop-shadow-soju"
                            }`}
                          >
                            Stats
                          </p>
                        </Tabs.Trigger>
                      </Tabs.List>
                      <Tabs.Content value="tab1">
                        <div className="mb-4 flex h-20 w-full items-start justify-between rounded-sm border border-white/5 p-4">
                          <input
                            className="bg-transparent font-wagmi text-xl text-white  placeholder:text-white/50 focus:outline-none"
                            placeholder="0.00"
                          />
                          <p className="h-fit rounded-sm border border-sky-400 bg-sky-400/10 px-2 py-0.5 text-sky-400 ">
                            EXP
                          </p>
                        </div>
                        <div className="mb-4 flex h-20 w-full items-start justify-between rounded-sm border border-white/5 p-4">
                          <input
                            className="bg-transparent font-wagmi text-xl text-white  placeholder:text-white/50 focus:outline-none"
                            placeholder="0.00"
                          />

                          <p className="h-fit rounded-sm border border-white bg-white/10 px-2 py-0.5 text-white ">
                            ETH
                          </p>
                        </div>
                        <div className="flex h-16 w-full items-center justify-center rounded-sm border border-white/5 shadow-damn">
                          <p className="text-white drop-shadow-soju">
                            Add Liquidity
                          </p>
                        </div>
                      </Tabs.Content>
                      <Tabs.Content value="tab2">
                        <div className="mb-4 flex h-20 w-full items-start justify-between rounded-sm bg-white/5 p-4">
                          <input
                            className="bg-transparent font-wagmi text-xl text-white  placeholder:text-white/50 focus:outline-none"
                            placeholder="0.00"
                          />

                          <p className="h-fit rounded-sm border border-primary bg-primary/10 px-2 py-0.5 text-primary ">
                            ETH
                          </p>
                        </div>
                        <div className="flex h-16 w-full items-center justify-center rounded-sm bg-primary">
                          <p className="text-secondary">Withdraw</p>
                        </div>
                      </Tabs.Content>
                      <Tabs.Content value="tab3">
                        <p className="text-white">Stats</p>
                      </Tabs.Content>
                    </Tabs.Root>
                  </div>
                </Tabs.Content>
                <Tabs.Content value="tab2">
                  <div className="bg flex w-full flex-col rounded-sm p-8 shadow-damn">
                    <h3 className="mb-4 text-white">Swap</h3>
                    <div className="mb-4 flex h-20 w-full items-start justify-between rounded-sm bg-white/5 p-4">
                      <input
                        className="bg-transparent font-wagmi text-xl text-white  placeholder:text-white/50 focus:outline-none"
                        placeholder="0.00"
                      />
                      <p className="h-fit rounded-sm border border-white bg-white/10 px-2 py-0.5 text-white">
                        EXP
                      </p>
                    </div>
                    <div className="mb-4 flex h-20 w-full items-start justify-between rounded-sm bg-white/5 p-4">
                      <input
                        className="bg-transparent font-wagmi text-xl text-white  placeholder:text-white/50 focus:outline-none"
                        placeholder="0.00"
                      />

                      <p className="h-fit rounded-sm border border-white bg-white/10 px-2 py-0.5 text-white ">
                        ETH
                      </p>
                    </div>
                    <div className="flex h-16 w-full items-center justify-center rounded-sm bg-primary">
                      <p className="text-secondary">Swap</p>
                    </div>
                    <button className="glow-button">
                      <span>Button</span>
                    </button>
                  </div>
                </Tabs.Content>
                <Tabs.Content value="tab3"></Tabs.Content>
              </Tabs.Root>
            </div>
          </div>
        </div>
      </Article>
    </Main>
  );
}
