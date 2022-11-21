import React from "react";

const TabContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex w-full flex-col rounded-sm border border-white/5 bg-[#000612] shadow-damn">
      {/* <div className="background-gradient pointer-events-none absolute h-full w-[36rem] opacity-20">
        <div className="background-gradient-pattern" />
      </div> */}
      {children}
    </div>
  );
};

export default TabContainer;
