import create from "zustand";
import produce from "immer";
import { ToastContent } from "../types";

interface SwapStoreState {}

export const useStore = create<SwapStoreState>((set, get) => ({}));
