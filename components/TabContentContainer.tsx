import Image from "next/image";
import React from "react";
import { BiCheckDouble } from "react-icons/bi";

const TabContentContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="relative flex w-full flex-col p-2">{children}</div>
      <div className="mb-2 h-px w-full bg-white/5" />
      <div className="mb-2 flex  w-full items-start justify-between px-4 py-1">
        <div className="relative h-4 w-4">
          <Image src="/logo.png" fill alt="" className="object-cover" />
        </div>
        <div className="flex items-center">
          <BiCheckDouble className="mr-2 text-sky-400" />
          <p className="text-xs text-white/50">Health Factor</p>
        </div>
      </div>
    </>
  );
};

export default TabContentContainer;
