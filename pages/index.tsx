import Head from "next/head";
import Main from "../components/layouts/Main";
import { FaGithub } from "react-icons/fa";
import { ConnectKitButton } from "connectkit";
import Image from "next/image";
import Article from "../components/layouts/Article";
import * as Tabs from "@radix-ui/react-tabs";

export default function Home() {
  return (
    <Main>
      <Article>
        {/* <div className="absolute h-screen w-full"></div> */}
        <div className="relative z-10 flex h-screen w-full items-start justify-center pt-24">
          <div className="flex w-full flex-col items-start px-4 py-4">
            <div className="flex w-full flex-row space-x-4">
              <Tabs.Root defaultValue="tab1" className="w-full">
                <Tabs.List className="flex flex-row space-x-4">
                  <Tabs.Trigger
                    value="tab1"
                    className="cursor-pointer rounded-sm border border-white/5 px-2 py-0.5 backdrop-blur-lg transition duration-300 ease-linear hover:text-white rdx-state-active:border rdx-state-active:text-white rdx-state-active:shadow-damn rdx-state-inactive:text-white/50"
                  >
                    <p className="">dAMM</p>
                  </Tabs.Trigger>
                  <Tabs.Trigger
                    value="tab2"
                    className="cursor-pointer rounded-sm border border-white/5 px-2 py-0.5 backdrop-blur-lg transition duration-300 ease-linear hover:text-white rdx-state-active:text-white rdx-state-active:shadow-damn rdx-state-inactive:text-white/50"
                  >
                    <p className="">Fuji AMM</p>
                  </Tabs.Trigger>
                  <Tabs.Trigger
                    value="tab3"
                    className="cursor-pointer rounded-sm border border-white/5 px-2 py-0.5 backdrop-blur-lg transition duration-300 ease-linear hover:text-white rdx-state-active:text-white rdx-state-active:shadow-damn rdx-state-inactive:text-white/50"
                  >
                    <p className="">Arbitrum AMM</p>
                  </Tabs.Trigger>
                </Tabs.List>

                <Tabs.Content value="tab1">
                  <div className="bg mt-8 flex w-full flex-col space-y-1 rounded-lg p-8 shadow-damn">
                    <Tabs.Root defaultValue="tab1" className="w-full">
                      <Tabs.List className="mb-8 flex flex-row space-x-4">
                        <Tabs.Trigger
                          value="tab1"
                          className="cursor-pointer rounded-sm border border-white/5 px-2 py-0.5 backdrop-blur-lg transition duration-300 ease-linear hover:text-white rdx-state-active:border rdx-state-active:text-white rdx-state-active:shadow-damn rdx-state-inactive:text-white/50"
                        >
                          <p className="">Provide</p>
                        </Tabs.Trigger>
                        <Tabs.Trigger
                          value="tab2"
                          className="cursor-pointer rounded-sm border border-white/5 px-2 py-0.5 backdrop-blur-lg transition duration-300 ease-linear hover:text-white rdx-state-active:text-white rdx-state-active:shadow-damn rdx-state-inactive:text-white/50"
                        >
                          <p className="">Withdraw</p>
                        </Tabs.Trigger>
                        <Tabs.Trigger
                          value="tab3"
                          className="cursor-pointer rounded-sm border border-white/5 px-2 py-0.5 backdrop-blur-lg transition duration-300 ease-linear hover:text-white rdx-state-active:text-white rdx-state-active:shadow-damn rdx-state-inactive:text-white/50"
                        >
                          <p className="">Stats</p>
                        </Tabs.Trigger>
                      </Tabs.List>
                      <Tabs.Content value="tab1">
                        <div className="mb-4 flex h-20 w-full items-start justify-between rounded-sm bg-white/5 p-4">
                          <input
                            className="bg-transparent font-wagmi text-xl text-white  placeholder:text-white/50 focus:outline-none"
                            placeholder="0.00"
                          />
                          <p className="h-fit rounded-sm border border-primary bg-primary/10 px-2 py-0.5 text-primary ">
                            EXP
                          </p>
                        </div>
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
                          <p className="text-secondary">Add Liquidity</p>
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
                  <div className="mt-8 flex h-96 w-full flex-col rounded-sm border border-white/5 p-8 shadow-md">
                    <p className="">Swap</p>
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
