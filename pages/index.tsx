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
                    className="rdx-state-active:border-1 cursor-pointer rounded-sm border border-white/5 px-2 py-0.5 text-white backdrop-blur-lg transition duration-300 ease-linear hover:text-white rdx-state-active:bg-white/10 rdx-state-inactive:text-white/50"
                  >
                    <p className="">dAMM</p>
                  </Tabs.Trigger>
                  <Tabs.Trigger
                    value="tab2"
                    className="rdx-state-active:border-1 cursor-pointer rounded-sm border border-white/5 px-2 py-0.5 text-white backdrop-blur-lg transition duration-300 ease-linear hover:text-white rdx-state-active:bg-white/10 rdx-state-inactive:text-white/50"
                  >
                    <p className="">Fuji AMM</p>
                  </Tabs.Trigger>
                  <Tabs.Trigger
                    value="tab3"
                    className="rdx-state-active:border-1 cursor-pointer rounded-sm border border-white/5 px-2 py-0.5 text-white backdrop-blur-lg transition duration-300 ease-linear hover:text-white rdx-state-active:bg-white/10 rdx-state-inactive:text-white/50"
                  >
                    <p className="">Arbi AMM</p>
                  </Tabs.Trigger>
                </Tabs.List>
                <div className="h-px w-full bg-black/10" />
                <Tabs.Content value="tab1">
                  <div className="mt-8 flex h-96 w-full flex-col border border-white/5 p-8">
                    <h3 className="text-white">Provide</h3>
                    <h3 className="text-white">Withdraw</h3>
                  </div>
                </Tabs.Content>
                <Tabs.Content value="tab2">
                  <div className="mt-8 flex h-96 w-full flex-col border border-white/5 p-8">
                    <h3 className="text-white">Swap</h3>
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
