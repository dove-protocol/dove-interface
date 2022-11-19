export type DAMM = {
  reserve0: number;
  reserve1: number;
  totalSupply: number;
};

export type ToastContent = {
  title: string;
  description: string;
  txid?: string;
  type: "success" | "error";
};
