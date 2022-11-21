import React, { useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../Navbar";
import { GiPeaceDove } from "react-icons/gi";
import * as Toast from "@radix-ui/react-toast";
import { BiCheck, BiLinkExternal, BiX } from "react-icons/bi";
import { useNetwork } from "wagmi";
import { transitionAnimation } from "../../lib/utils/transitionAnimation";
import { useUserStore } from "../../state/user/useUserStore";

const Article = ({ children }: { children: React.ReactNode }) => {
  const { isOpen, setOpen, toastContent } = useUserStore();
  const { chain } = useNetwork();

  return (
    <motion.article
      variants={transitionAnimation}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="relative w-full"
    >
      <div className="mx-auto flex min-h-screen w-full max-w-xl flex-col items-center overflow-hidden">
        <Toast.Provider>
          <Toast.Root
            className="group relative z-[9999] flex items-center rounded-sm border border-white/5 bg-pita p-2 shadow-damn rdx-state-closed:animate-hide rdx-state-open:animate-slideIn"
            open={isOpen}
            onOpenChange={setOpen}
          >
            <div className="background-gradient pointer-events-none absolute h-full w-full opacity-20">
              <div className="background-gradient-pattern" />
            </div>
            <div className="pointer-events-none absolute h-full w-full overflow-hidden">
              <GiPeaceDove className="absolute right-2 -bottom-6 -rotate-45 text-7xl text-white/10" />
            </div>
            <div>
              {toastContent.type === "success" ? (
                <BiCheck className="mr-4 rounded-sm bg-green-500/5 p-px text-xl text-green-500" />
              ) : (
                <BiX className="mr-4 rounded-sm bg-red-500/5 p-px text-xl text-red-500" />
              )}
            </div>

            <div className="mr-4 flex w-64 flex-col">
              <Toast.Title asChild>
                <p className=" text-sm font-normal text-white">
                  {toastContent.title}
                </p>
              </Toast.Title>
              <Toast.Description asChild>
                <p className=" text-sm text-white/50">
                  {toastContent.description}
                </p>
              </Toast.Description>
            </div>
            {toastContent.txid && (
              <a
                className="mr-2"
                target="_blank"
                href={`${chain?.blockExplorers?.default.url}/tx/${toastContent.txid}`}
              >
                <BiLinkExternal className="text-white/50 hover:text-white" />
              </a>
            )}
            {/* <Toast.Action altText="" /> */}
            <Toast.Close asChild>
              <button className="absolute -top-2 -right-2 translate-x-1/2 opacity-0 transition ease-in group-hover:opacity-100">
                <BiX className="cur mr-4 rounded-sm border border-white/5 bg-white/5 p-px text-xl text-white" />
              </button>
            </Toast.Close>
          </Toast.Root>

          <Toast.Viewport className="fixed top-0 left-1/2 z-[9000] -translate-x-1/2 p-6" />
        </Toast.Provider>
        <Navbar />
        {children}
        <div className="absolute bottom-0 flex w-full items-center justify-center p-8"></div>
        {/* <div className="absolute bottom-0 flex w-full items-center justify-end space-x-2 p-8">
          <div className="h-2 w-2 rounded-full bg-green-400">
            <div className="h-2 w-2 animate-ping rounded-full bg-green-400"></div>
          </div>
          <p className="text-green-400">25ms</p>
        </div> */}
      </div>
    </motion.article>
  );
};

export default Article;
