import { ChainId } from "../enums";

export const LZ_CHAIN: { [chainId in ChainId]: number } = {
  [ChainId.ETHEREUM_GOERLI]: 10121,
  [ChainId.ARBITRUM_GOERLI]: 10143,
  [ChainId.POLYGON_MUMBAI]: 10109,
};
