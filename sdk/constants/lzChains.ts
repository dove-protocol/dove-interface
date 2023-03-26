import { ChainId } from "../enums";

export const LZ_CHAIN: { [chainId in ChainId]: number } = {
  [ChainId.ETHEREUM_GOERLI]: 10121,
  [ChainId.ARBITRUM_GOERLI]: 10143,
  [ChainId.POLYGON_MUMBAI]: 10109,
  [ChainId.AVALANCHE_FUJI]: 10106,
};

export const HL_DOMAIN: { [chainId in ChainId]: number } = {
  [ChainId.ETHEREUM_GOERLI]: 5,
  [ChainId.ARBITRUM_GOERLI]: 421613,
  [ChainId.POLYGON_MUMBAI]: 80001,
  [ChainId.AVALANCHE_FUJI]: 43113,
}