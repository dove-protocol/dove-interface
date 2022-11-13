import { ConnectButton } from "@rainbow-me/rainbowkit";
import React from "react";
import { CustomConnectButton } from "./CustomConnectButton";
import { FaGithub, FaTwitter } from "react-icons/fa";

const Navbar = () => {
  return (
    <div className="fixed z-50 w-full">
      <div className="flex w-full space-x-4 items-center justify-end px-8 py-4">
        {/* <p className="text-white">dAmm</p> */}
        {/* <CustomConnectButton /> */}
        <FaGithub className="text-white/50" />
        <FaTwitter className="text-white/50" />
      </div>
    </div>
  );
};

export default Navbar;
