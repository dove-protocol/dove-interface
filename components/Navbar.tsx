import Image from "next/image";
import { FaGithub, FaTwitter } from "react-icons/fa";
import { CustomConnectButton } from "./CustomConnectButton";

const Navbar = () => {
  return (
    <div className="fixed z-50 flex w-full justify-center">
      <div className="flex w-full items-center justify-between px-8 py-8">
        <div className="relative h-12 w-24">
          <Image src="/logo_text.png" fill alt="" className="object-contain" />
        </div>
        <div className="flex items-center space-x-4">
          <CustomConnectButton />
          <a href="https://github.com/whitenois3" target="_blank">
            <FaGithub className="text-white/50" />
          </a>
          <a href="https://twitter.com/exp_table" target="_blank">
            <FaTwitter className="text-white/50" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
