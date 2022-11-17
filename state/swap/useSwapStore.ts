import create from "zustand";
import produce from "immer";

interface SwapStoreState {}

export const useSwapStore = create<SwapStoreState>((set, get) => ({}));
