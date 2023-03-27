import { ChainId } from "../enums";

export const SUPPORTED_CHAIN_NAMES: { [chainId in ChainId]: string } = {
  [ChainId.ETHEREUM_GOERLI]: "Ethereum Goerli",
  [ChainId.POLYGON_MUMBAI]: "Polygon Mumbai",
  [ChainId.ARBITRUM_GOERLI]: "Arbitrum Goerli",
  [ChainId.AVALANCHE_FUJI]: "Avalanche Fuji",
};

export const SUPPORTED_CHAIN_IMAGES: { [chainId in ChainId]: string } = {
  [ChainId.ETHEREUM_GOERLI]: "",
  [ChainId.POLYGON_MUMBAI]: "/polygon_chain.png",
  [ChainId.ARBITRUM_GOERLI]: "/arbitrum_chain.png",
  [ChainId.AVALANCHE_FUJI]: "/avalanche_chain.png",
};
