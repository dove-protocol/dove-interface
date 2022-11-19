import {
  BiPlus,
  BiMinus,
  BiStats,
  BiDollar,
  BiDownload,
  BiRefresh,
  BiCog,
  BiReceipt,
  BiCreditCardFront,
  BiShuffle,
} from "react-icons/bi";

export const ammTabsData = [
  {
    id: "tab1",
    title: "Swap",
    icon: <BiShuffle className=" rounded-sm p-px" />,
  },
  {
    id: "tab4",
    title: "Vouchers",
    icon: <BiCreditCardFront className=" rounded-sm  p-px" />,
  },
  {
    id: "tab5",
    title: "Reserves",
    icon: <BiStats className=" rounded-sm  p-px" />,
  },
  {
    id: "tab2",
    title: "Mint",
    icon: <BiDollar className=" rounded-sm  p-px" />,
  },
  {
    id: "tab3",
    title: "Sync",
    icon: <BiRefresh className=" rounded-sm p-px" />,
  },
];

export const dammTabsData = [
  {
    id: "tab1",
    title: "Provide",
    icon: <BiPlus className=" rounded-sm p-px" />,
  },
  {
    id: "tab2",
    title: "Withdraw",
    icon: <BiMinus className=" rounded-sm p-px" />,
  },
  {
    id: "tab3",
    title: "Reserves",
    icon: <BiStats className=" rounded-sm p-px" />,
  },
  {
    id: "tab4",
    title: "Mint",
    icon: <BiDollar className=" rounded-sm p-px" />,
  },
  {
    id: "tab5",
    title: "Sync",
    icon: <BiRefresh className=" rounded-sm p-px" />,
  },
];
