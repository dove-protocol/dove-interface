import React from "react";
import { motion } from "framer-motion";
import { transitionAnimation } from "../../lib/utils";
import Navbar from "../Navbar";
import { GiPeaceDove } from "react-icons/gi";

const Article = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.article
      variants={transitionAnimation}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="relative w-full"
    >
      <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col items-center overflow-hidden">
        <Navbar />
        {children}
        <div className="absolute bottom-0 flex w-full items-center justify-center p-8">
          <GiPeaceDove className="text-4xl text-white/10" />
        </div>
        <div className="absolute bottom-0 flex w-full items-center justify-end space-x-2 p-8">
          <div className="h-2 w-2 rounded-full bg-green-400">
            <div className="h-2 w-2 animate-ping rounded-full bg-green-400"></div>
          </div>
          <p className="text-green-400">25ms</p>
        </div>
      </div>
    </motion.article>
  );
};

export default Article;
