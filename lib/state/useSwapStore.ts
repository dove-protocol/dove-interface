import create from "zustand";
import produce from "immer";
import { ToastContent } from "../types";

interface SwapStoreState {}

export const useSwapStore = create<SwapStoreState>((set, get) => ({}));
