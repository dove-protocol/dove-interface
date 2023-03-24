import { ChainId } from "../enums/chainId";

export const L1_ROUTER_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.ETHEREUM_GOERLI]: "0x42Ddc2f8495b650Dd6e25E39d6f1cE276dADDA95",
  [ChainId.POLYGON_MUMBAI]: "",
  [ChainId.ARBITRUM_GOERLI]: "",
  [ChainId.AVALANCHE_FUJI]: "",
};

export const L2_ROUTER_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.ETHEREUM_GOERLI]: "",
  [ChainId.POLYGON_MUMBAI]: "0x4F256198A1403D71e73671737cD73041CbaC0FBa",
  [ChainId.ARBITRUM_GOERLI]: "0x65Ccaa2EC04BdcC1EC55819339f4C3cd3a2bD09a",
  [ChainId.AVALANCHE_FUJI]: "0x324384c8016005956c6982CB82c3Cf0216Ad3aE3",
};

export const DOVE_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.ETHEREUM_GOERLI]: "0x309EffB54b31C278Ed1c6F4bf85C6145b63Ee97f",
  [ChainId.POLYGON_MUMBAI]: "",
  [ChainId.ARBITRUM_GOERLI]: "",
  [ChainId.AVALANCHE_FUJI]: "",
};

export const PAIR_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.ETHEREUM_GOERLI]: "",
  [ChainId.POLYGON_MUMBAI]: "0xccBf25F63db94B8215A18deAe0ca717c7B2817ca",
  [ChainId.ARBITRUM_GOERLI]: "0x7De0Ca730B756a8953AA28D284069B8B2Db8C420",
  [ChainId.AVALANCHE_FUJI]: "0x67C2e796dd93Cc711277164481ADD7baefF34184",
};

export const USDC_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.ETHEREUM_GOERLI]: "0xDf0360Ad8C5ccf25095Aa97ee5F2785c8d848620",
  [ChainId.POLYGON_MUMBAI]: "0x742DfA5Aa70a8212857966D491D67B09Ce7D6ec7",
  [ChainId.ARBITRUM_GOERLI]: "0x6aAd876244E7A1Ad44Ec4824Ce813729E5B6C291",
  [ChainId.AVALANCHE_FUJI]: "0x4A0D1092E9df255cf95D72834Ea9255132782318",
};

export const USDT_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.ETHEREUM_GOERLI]: "0x5BCc22abEC37337630C0E0dd41D64fd86CaeE951",
  [ChainId.POLYGON_MUMBAI]: "0x6Fc340be8e378c2fF56476409eF48dA9a3B781a0",
  [ChainId.ARBITRUM_GOERLI]: "0x533046F316590C19d99c74eE661c6d541b64471C",
  [ChainId.AVALANCHE_FUJI]: "0x134Dc38AE8C853D1aa2103d5047591acDAA16682",
};

export const vUSDC_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.ETHEREUM_GOERLI]: "",
  [ChainId.POLYGON_MUMBAI]: "",
  [ChainId.ARBITRUM_GOERLI]: "",
  [ChainId.AVALANCHE_FUJI]: "",
};

export const vUSDT_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.ETHEREUM_GOERLI]: "",
  [ChainId.POLYGON_MUMBAI]: "",
  [ChainId.ARBITRUM_GOERLI]: "",
  [ChainId.AVALANCHE_FUJI]: "",
};
