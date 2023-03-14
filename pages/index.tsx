import * as Tabs from "@radix-ui/react-tabs";
import { useEffect, useRef, useState } from "react";
import { BiArrowToRight, BiCog, BiHistory } from "react-icons/bi";
import { GiPeaceDove } from "react-icons/gi";
import { chain, useNetwork, useSwitchNetwork } from "wagmi";
import DammTabContent from "../components/DammTabContent";
import TabContainer from "../components/TabContainer";
import Article from "../components/layouts/Article";
import Main from "../components/layouts/Main";
import { useIsMounted } from "../lib/hooks/useIsMounted";
import { ChainId } from "../sdk";
import { useUserStore } from "../state/user/useUserStore";
import AmmTabContent from "../components/AmmTabContent";
import UnsupportedNetworkContent from "../components/UnsupportedNetworkContent";

export default function Home() {
  const isAutoSwitch = useUserStore((state) => state.isAutoSwitch);
  const toastContent = useUserStore((state) => state.toastContent);
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
    }
  }, [activeNetworkTab]);

  const isMounted = useIsMounted();

  if (!isMounted) return null;

  const isSupportedNetwork = currentChain
    ? Object.values(ChainId).includes(currentChain.id) &&
      currentChain.id !== ChainId.ETHEREUM_GOERLI
    : false;

  return (
    <Main>
      <Article>
        <div className="radial absolute h-screen w-full"></div>
        <div className="background-gradient absolute h-full w-[100vw] opacity-20">
          <div className="background-gradient-pattern" />
        </div>
        <div className="relative flex min-h-screen w-full flex-col items-start justify-start pb-36 pt-48">
          <div className="relative mb-4 flex w-full flex-col items-start">
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
                    className="relative w-full cursor-pointer overflow-hidden rounded-sm rounded-b-none border border-b-0 border-white/5 bg-pita/10 px-4 py-2 text-left transition duration-300 ease-linear hover:text-white focus:outline-none rdx-state-active:bg-pita rdx-state-active:text-white rdx-state-inactive:text-white/50"
                  >
                    {activeNetworkTab === "amm" && (
                      <GiPeaceDove className="absolute right-0 -rotate-45 text-6xl text-white/10" />
                    )}
                    <p className="font-normal">AMM</p>
                  </Tabs.Trigger>
                  <Tabs.Trigger
                    value="damm"
                    className="relative w-full cursor-pointer overflow-hidden rounded-sm rounded-b-none border border-b-0 border-white/5 bg-pita/10 px-4 py-2 text-left transition duration-300 ease-linear hover:text-white focus:outline-none rdx-state-active:bg-pita rdx-state-active:text-white rdx-state-inactive:text-white/50"
                  >
                    {activeNetworkTab === "damm" && (
                      <GiPeaceDove className="absolute right-0 -rotate-45 text-6xl text-white/5" />
                    )}
                    <p className="font-normal">dAMM</p>
                  </Tabs.Trigger>
                  <Tabs.Trigger
                    value="history"
                    className="relative w-12 cursor-pointer rounded-sm rounded-b-none border border-b-0 border-white/5 bg-black/10 px-4 py-2 text-left transition duration-300 ease-linear hover:text-white focus:outline-none rdx-state-active:bg-pita rdx-state-active:text-white rdx-state-inactive:text-white/50"
                  >
                    {toastContent.title !== "" && (
                      <div className="absolute top-0 right-0 h-1 w-1 bg-sky-400 drop-shadow-soju" />
                    )}
                    <BiHistory className="" />
                  </Tabs.Trigger>
                  <Tabs.Trigger
                    value="settings"
                    className="w-12 cursor-pointer rounded-sm rounded-b-none border border-b-0 border-white/5 bg-black/10 px-4 py-2 text-left transition duration-300 ease-linear hover:text-white focus:outline-none rdx-state-active:bg-pita rdx-state-active:text-white rdx-state-inactive:text-white/50"
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
                    {isSupportedNetwork ? (
                      <AmmTabContent />
                    ) : (
                      <UnsupportedNetworkContent />
                    )}
                  </TabContainer>
                </Tabs.Content>
                {/* <Tabs.Content value="history">
                  <TabContainer>
                    <HistoryTabContent />
                  </TabContainer>
                </Tabs.Content>
                <Tabs.Content value="settings">
                  <TabContainer>
                    <SettingsTabContent />
                  </TabContainer>
                </Tabs.Content> */}
              </Tabs.Root>
            </div>
          </div>
          <div className="flex w-full flex-row justify-between px-4 pt-1">
            <div className="flex flex-row items-center space-x-1">
              <p className="text-sm text-white/50">Need help? </p>{" "}
              <a
                href="https://0xst.notion.site/Dove-Protocol-5a174626e63f4c26a30e753fc7460714"
                target="_blank"
                className="text-sm font-thin text-white"
              >
                Read the guide
              </a>
              <BiArrowToRight className="text-white" />
            </div>
          </div>
        </div>
      </Article>
    </Main>
  );
}
