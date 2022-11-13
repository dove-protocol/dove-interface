import React from "react";

const TabContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg flex w-full flex-col rounded-sm p-8 shadow-damn">
      {/* <div className="background-gradient pointer-events-none absolute h-full w-[36rem] opacity-20">
        <div className="background-gradient-pattern" />
      </div> */}
      {children}
    </div>
  );
};

export default TabContainer;
