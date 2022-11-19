import React from "react";

const TabContentContainer = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex w-full flex-col p-2">{children}</div>;
};

export default TabContentContainer;
