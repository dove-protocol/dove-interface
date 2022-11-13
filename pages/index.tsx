import Main from "../components/layouts/Main";
import Article from "../components/layouts/Article";
import * as Tabs from "@radix-ui/react-tabs";
import { useState, useEffect } from "react";
import { chain, useSwitchNetwork } from "wagmi";
import { useIsMounted } from "../hooks/useIsMounted";
import { avalancheChain } from "./_app";
import { BiCog } from "react-icons/bi";
import TabContainer from "../components/TabContainer";
import SwapTabContent from "../components/SwapTabContent";
import DammTabContent from "../components/DammTabContent";
import SettingsTabContent from "../components/SettingsTabContent";
import { useStore } from "../lib/store";

export default function Home() {
  const isAutoSwitch = useStore((state) => state.isAutoSwitch);
  const [activeNetworkTab, setActiveNetworkTab] = useState("damm");

  const { chains, error, isLoading, pendingChainId, switchNetwork } =
    useSwitchNetwork();

  useEffect(() => {
    if (isAutoSwitch) {
      if (activeNetworkTab === "damm") {
        switchNetwork?.(chain.goerli.id);
      }
      if (activeNetworkTab === "fuji") {
        switchNetwork?.(43113);
      }
      if (activeNetworkTab === "arbi") {
        switchNetwork?.(chain.arbitrumGoerli.id);
      }
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
                    className="w-full cursor-pointer rounded-sm rounded-b-none border border-b-0 border-white/5 bg-black/10 px-4 py-2 text-left transition duration-300 ease-linear hover:text-white focus:outline-none rdx-state-active:bg-[#313135] rdx-state-active:text-white rdx-state-inactive:text-white/50"
                  >
                    <p className="font-normal">dAMM</p>
                  </Tabs.Trigger>
                  <Tabs.Trigger
                    value="fuji"
                    className="w-full cursor-pointer rounded-sm rounded-b-none border border-b-0 border-white/5 bg-black/10 px-4 py-2 text-left transition duration-300 ease-linear hover:text-white focus:outline-none rdx-state-active:bg-[#313135] rdx-state-active:text-white rdx-state-inactive:text-white/50"
                  >
                    <p className="font-normal">Fuji AMM</p>
                  </Tabs.Trigger>
                  <Tabs.Trigger
                    value="arbi"
                    className="w-full cursor-pointer rounded-sm rounded-b-none border border-b-0 border-white/5 bg-black/10 px-4 py-2 text-left transition duration-300 ease-linear hover:text-white focus:outline-none rdx-state-active:bg-[#313135] rdx-state-active:text-white rdx-state-inactive:text-white/50"
                  >
                    <p className="font-normal">Arbitrum AMM</p>
                  </Tabs.Trigger>
                  <Tabs.Trigger
                    value="settings"
                    className="w-12 cursor-pointer rounded-sm rounded-b-none border border-b-0 border-white/5 bg-black/10 px-4 py-2 text-left transition duration-300 ease-linear hover:text-white focus:outline-none rdx-state-active:bg-[#313135] rdx-state-active:text-white rdx-state-inactive:text-white/50"
                  >
                    <BiCog className="" />
                  </Tabs.Trigger>
                </Tabs.List>
                <Tabs.Content value="damm">
                  <TabContainer>
                    <DammTabContent />
                  </TabContainer>
                </Tabs.Content>
                <Tabs.Content value="fuji">
                  <TabContainer>
                    <SwapTabContent expectedChainId={avalancheChain.id} />
                  </TabContainer>
                </Tabs.Content>
                <Tabs.Content value="arbi">
                  <TabContainer>
                    <SwapTabContent expectedChainId={chain.arbitrumGoerli.id} />
                  </TabContainer>
                </Tabs.Content>
                <Tabs.Content value="settings">
                  <TabContainer>
                    <SettingsTabContent />
                  </TabContainer>
                </Tabs.Content>
              </Tabs.Root>
            </div>
          </div>
        </div>
      </Article>
    </Main>
  );
}
