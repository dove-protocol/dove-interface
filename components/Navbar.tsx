import { ConnectButton } from "@rainbow-me/rainbowkit";
import React from "react";
import { CustomConnectButton } from "./CustomConnectButton";
import { FaGithub, FaTwitter } from "react-icons/fa";

const Navbar = () => {
  return (
    <div className="fixed z-50 w-full">
      <div className="flex w-full items-center justify-end space-x-4 px-8 py-8">
        {/* <p className="text-white">dAmm</p> */}
        <CustomConnectButton />
        <FaGithub className="text-white/10" />
        <FaTwitter className="text-white/10" />
      </div>
    </div>
  );
};

export default Navbar;
