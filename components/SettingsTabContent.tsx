import React from "react";
import { useState } from "react";
import * as Switch from "@radix-ui/react-switch";
import { useUserStore } from "../state/user/useUserStore";
import TabContentContainer from "./TabContentContainer";
import { BiCog } from "react-icons/bi";

const SettingsTabContent = () => {
  const isAutoSwitch = useUserStore((state) => state.isAutoSwitch);
  const setAutoSwitch = useUserStore((state) => state.setAutoSwitch);
  const showAdvanced = useUserStore((state) => state.showAdvanced);
  const setShowAdvanced = useUserStore((state) => state.setShowAdvanced);

  return (
    <TabContentContainer>
      <div className="mb-4 flex items-center">
        <BiCog className="mr-4 rounded-sm border border-white/10 p-2 text-4xl text-white" />
        <div className="flex flex-col">
          <h4 className="text-white">Settings</h4>
          <p className="text-xs text-white/50">Adjust advanced settings</p>
        </div>
      </div>
      <div className="mb-2 flex w-full items-center justify-between rounded-sm border border-white/5 p-4">
        <p className="text-white">Show Advanced</p>
        <Switch.Root
          className="relative h-8 w-16 rounded-sm border border-white/5 bg-black/10"
          checked={showAdvanced}
          onCheckedChange={(v) => setShowAdvanced(v)}
        >
          <Switch.Thumb className="block h-6 w-6 translate-x-[34px] rounded-sm border border-white/5 transition ease-in-out rdx-state-checked:translate-x-1 rdx-state-checked:bg-white rdx-state-unchecked:bg-white/10" />
        </Switch.Root>
      </div>
      <div className="flex w-full items-center justify-between rounded-sm border border-white/5 p-4">
        <p className="text-white">Automatically Switch Networks</p>
        <Switch.Root
          className="relative h-8 w-16 rounded-sm border border-white/5 bg-black/10"
          checked={isAutoSwitch}
          onCheckedChange={(v) => setAutoSwitch(v)}
        >
          <Switch.Thumb className="block h-6 w-6 translate-x-[34px] rounded-sm border border-white/5 transition ease-in-out rdx-state-checked:translate-x-1 rdx-state-checked:bg-white rdx-state-unchecked:bg-white/10" />
        </Switch.Root>
      </div>

      {/* <p className="text-white/50">Slippage Tolerance</p> */}
    </TabContentContainer>
  );
};

export default SettingsTabContent;
