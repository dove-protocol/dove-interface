import React from "react";
import { useState } from "react";
import * as Switch from "@radix-ui/react-switch";
import { useUserStore } from "../state/user/useUserStore";
import TabContentContainer from "./TabContentContainer";
import { BiCog, BiHistory, BiLinkExternal, BiShuffle } from "react-icons/bi";
import { useNetwork } from "wagmi";

const HistoryTabContent = () => {
  const allToastContents = useUserStore((state) => state.allToastContents);
  const { chain } = useNetwork();

  return (
    <TabContentContainer>
      <div className="mb-4 flex items-center">
        <BiHistory className="mr-4 rounded-sm border border-white/10 p-2 text-4xl text-white" />
        <div className="flex flex-col">
          <h4 className="text-white">History</h4>
          <p className="text-xs text-white/50">Review previous transactions</p>
        </div>
      </div>
      {allToastContents.length > 0 ? (
        allToastContents.map((toastContent) => (
          <div className="mb-2 flex w-full items-center justify-between rounded-sm border-l-2 border-sky-400 bg-gradient-to-r from-sky-400/5 to-transparent py-2 px-4">
            <div className="flex items-center">
              <BiShuffle className="mr-4 rounded-sm border border-white/10 p-1 text-2xl text-white" />
              <p className="text-xs uppercase tracking-widest text-white">
                {toastContent.title}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <p className="text-sm text-white">{toastContent.description}</p>\
              {toastContent.txid && (
                <a
                  className="mr-2"
                  target="_blank"
                  href={`${chain?.blockExplorers?.default.url}/tx/${toastContent.txid}`}
                >
                  <BiLinkExternal className="text-white/50 hover:text-white" />
                </a>
              )}
            </div>
          </div>
        ))
      ) : (
        <div className="flex h-40 w-full items-center justify-center">
          <p className="text-white">No previous transactions</p>
        </div>
      )}

      {/* <p className="text-white/50">Slippage Tolerance</p> */}
    </TabContentContainer>
  );
};

export default HistoryTabContent;
