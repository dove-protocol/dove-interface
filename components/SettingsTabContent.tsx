import React from "react";
import { useState } from "react";
import * as Switch from "@radix-ui/react-switch";
import { useStore } from "../lib/store";

const SettingsTabContent = () => {
  const isAutoSwitch = useStore((state) => state.isAutoSwitch);
  const setAutoSwitch = useStore((state) => state.setAutoSwitch);

  return (
    <>
      <p className="mb-4 font-normal text-white">Settings</p>

      <p className="mb-2 text-white/50">Automatically Switch Networks</p>
      <Switch.Root
        className="relative mb-2 h-8 w-16 rounded-sm border border-white/5 bg-black/10"
        checked={isAutoSwitch}
        onCheckedChange={(v) => setAutoSwitch(v)}
      >
        <Switch.Thumb className="block h-6 w-6 translate-x-[34px] rounded-sm border border-white/5 transition ease-in-out rdx-state-checked:translate-x-1 rdx-state-checked:bg-white rdx-state-checked:drop-shadow-soju rdx-state-unchecked:bg-white/10" />
      </Switch.Root>

      {/* <p className="text-white/50">Slippage Tolerance</p> */}
    </>
  );
};

export default SettingsTabContent;
