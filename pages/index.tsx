import Main from "../components/layouts/Main";
import Article from "../components/layouts/Article";
import * as Tabs from "@radix-ui/react-tabs";
import { useState, useEffect, useRef } from "react";
import { chain, useNetwork, useSwitchNetwork } from "wagmi";
import { useIsMounted } from "../lib/hooks/useIsMounted";
import { BiCog } from "react-icons/bi";
import TabContainer from "../components/TabContainer";
import SwapTabContent from "../components/SwapTabContent";
import DammTabContent from "../components/DammTabContent";
import SettingsTabContent from "../components/SettingsTabContent";
import { GiPeaceDove } from "react-icons/gi";
import { useUserStore } from "../state/user/useUserStore";
import { ChainId } from "../sdk";

export default function Home() {
  const isAutoSwitch = useUserStore((state) => state.isAutoSwitch);
  const [activeNetworkTab, setActiveNetworkTab] = useState("damm");
  const timerRef = useRef(0);

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  const { chains, error, isLoading, pendingChainId, switchNetwork } =
    useSwitchNetwork();

  const { chain: currentChain } = useNetwork();

  useEffect(() => {
    if (isAutoSwitch) {
      if (activeNetworkTab === "damm") {
        switchNetwork?.(chain.goerli.id);
      }
      if (activeNetworkTab === "polygon") {
        switchNetwork?.(chain.polygonMumbai.id);
      }
      if (activeNetworkTab === "arbi") {
        switchNetwork?.(chain.arbitrumGoerli.id);
      }
    }
  }, [activeNetworkTab]);

  const isMounted = useIsMounted();

  if (!isMounted) return null;

  let expectedChainId: ChainId | undefined;

  if (currentChain?.id === ChainId.ETHEREUM_GOERLI) {
    expectedChainId = ChainId.ETHEREUM_GOERLI;
  } else if (currentChain?.id === ChainId.POLYGON_MUMBAI) {
    expectedChainId = ChainId.POLYGON_MUMBAI;
  } else if (currentChain?.id === ChainId.ARBITRUM_GOERLI) {
    expectedChainId = ChainId.ARBITRUM_GOERLI;
  }

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
                    value="amm"
                    className="relative w-full cursor-pointer overflow-hidden rounded-sm rounded-b-none border border-b-0 border-white/5 bg-black/10 px-4 py-2 text-left transition duration-300 ease-linear hover:text-white focus:outline-none rdx-state-active:bg-[#313135] rdx-state-active:text-white rdx-state-inactive:text-white/50"
                  >
                    {activeNetworkTab === "amm" && (
                      <GiPeaceDove className="absolute right-0 -rotate-45 text-6xl text-white/5" />
                    )}
                    <p className="font-normal">AMM</p>
                  </Tabs.Trigger>
                  <Tabs.Trigger
                    value="damm"
                    className="relative w-full cursor-pointer overflow-hidden rounded-sm rounded-b-none border border-b-0 border-white/5 bg-black/10 px-4 py-2 text-left transition duration-300 ease-linear hover:text-white focus:outline-none rdx-state-active:bg-[#313135] rdx-state-active:text-white rdx-state-inactive:text-white/50"
                  >
                    {activeNetworkTab === "damm" && (
                      <GiPeaceDove className="absolute right-0 -rotate-45 text-6xl text-white/5" />
                    )}
                    <p className="font-normal">dAMM</p>
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
                <Tabs.Content value="amm">
                  <TabContainer>
                    {expectedChainId && (
                      <SwapTabContent expectedChainId={expectedChainId} />
                    )}
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
