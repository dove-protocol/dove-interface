import React, { useState, useRef } from "react";
import * as Tabs from "@radix-ui/react-tabs";

const TabSlider = ({
  children,
  tabsData,
}: {
  children: React.ReactNode;
  tabsData: {
    id: string;
    title: string;
    icon: React.ReactNode;
  }[];
}) => {
  const [activeTab, setActiveTab] = useState("tab1");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const [tabBoundingBox, setTabBoundingBox] = useState<DOMRect | null>(null);
  const [wrapperBoundingBox, setWrapperBoundingBox] = useState<DOMRect | null>(
    null
  );
  const [highlightedTab, setHighlightedTab] = useState<string | null>(null);
  const [isHoveredFromNull, setIsHoveredFromNull] = useState(true);

  const repositionHighlight = (e: any, id: string) => {
    if (wrapperRef.current) {
      setTabBoundingBox(e.target.getBoundingClientRect());
      setWrapperBoundingBox(wrapperRef.current.getBoundingClientRect());
      setIsHoveredFromNull(!highlightedTab);
      setHighlightedTab(id);
    }
  };

  const highlightStyles: any = {};

  if (tabBoundingBox && wrapperBoundingBox) {
    highlightStyles.transitionDuration = isHoveredFromNull ? "0ms" : "150ms";
    highlightStyles.opacity = highlightedTab ? 1 : 0;
    highlightStyles.width = `${tabBoundingBox.width - 1}px`;
    highlightStyles.transform = `translate(${
      tabBoundingBox.left - wrapperBoundingBox.left + 1
    }px)`;
  }

  return (
    <Tabs.Root
      defaultValue="tab1"
      value={activeTab}
      onValueChange={(v) => setActiveTab(v)}
      className="w-full"
    >
      <Tabs.List
        ref={wrapperRef}
        onMouseLeave={() => setHighlightedTab(null)}
        className="relative mb-4 flex w-full flex-row rounded-sm bg-black/10 p-1"
      >
        <div
          className="absolute -left-px h-[34px] translate-y-[4px] rounded-sm bg-white/5 transition"
          ref={highlightRef}
          style={highlightStyles}
        />
        {tabsData.map((tab) => (
          <Tab
            key={tab.id}
            id={tab.id}
            label={tab.title}
            repositionHighlight={repositionHighlight}
          >
            {tab.icon}
          </Tab>
        ))}
      </Tabs.List>
      {children}
    </Tabs.Root>
  );
};

export default TabSlider;

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
      className="relative flex w-full cursor-pointer flex-row items-center justify-center rounded-sm border border-transparent px-4 py-1 transition duration-300 ease-linear hover:text-white focus:outline-none rdx-state-active:border-white/5 rdx-state-active:bg-black/10 rdx-state-active:text-white rdx-state-inactive:text-white/50"
      onMouseEnter={(e) => repositionHighlight(e, id)}
    >
      <p>{label}</p>
      {children}
    </Tabs.Trigger>
  );
};
