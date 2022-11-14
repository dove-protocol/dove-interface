import React from "react";
import * as Tabs from "@radix-ui/react-tabs";

const Tab = ({
  id,
  children,
  label,
  repositionHighlight,
}: {
  id: string;
  children: React.ReactNode;
  label: string;
  repositionHighlight: (e: any, id: any) => void;
}) => {
  return (
    <Tabs.Trigger
      value={id}
      className="relative flex cursor-pointer flex-row items-center justify-center rounded-sm border border-transparent px-4 py-1 transition duration-300 ease-linear hover:text-white focus:outline-none rdx-state-active:border-white/5 rdx-state-active:bg-black/10 rdx-state-active:text-white rdx-state-inactive:text-white/50"
      onMouseEnter={(e) => repositionHighlight(e, id)}
    >
      <p>{label}</p>
      {children}
    </Tabs.Trigger>
  );
};

export default Tab;
