import { DAMM_ADDRESS, USDC_ADDRESS, USDT_ADDRESS } from "./addresses";

import { ChainId } from "../enums";
import { Token } from "../entities/token";
import { TokenMap } from "../types/tokenMap";

export const USDC: TokenMap = {
  [ChainId.ETHEREUM_GOERLI]: new Token(
    ChainId.ETHEREUM_GOERLI,
    USDC_ADDRESS[ChainId.ETHEREUM_GOERLI],
    6,
    "USDC",
    "USD Coin"
  ),
  [ChainId.POLYGON_MUMBAI]: new Token(
    ChainId.POLYGON_MUMBAI,
    USDC_ADDRESS[ChainId.POLYGON_MUMBAI],
    6,
    "USDC",
    "USD Coin"
  ),
  [ChainId.ARBITRUM_GOERLI]: new Token(
    ChainId.ARBITRUM_GOERLI,
    USDC_ADDRESS[ChainId.ARBITRUM_GOERLI],
    6,
    "USDC",
    "USD Coin"
  ),
};

export const USDT: TokenMap = {
  [ChainId.ETHEREUM_GOERLI]: new Token(
    ChainId.ETHEREUM_GOERLI,
    USDT_ADDRESS[ChainId.ETHEREUM_GOERLI],
    6,
    "USDT",
    "Tether USD"
  ),
  [ChainId.POLYGON_MUMBAI]: new Token(
    ChainId.POLYGON_MUMBAI,
    USDT_ADDRESS[ChainId.POLYGON_MUMBAI],
    6,
    "USDT",
    "Tether USD"
  ),
  [ChainId.ARBITRUM_GOERLI]: new Token(
    ChainId.ARBITRUM_GOERLI,
    USDT_ADDRESS[ChainId.ARBITRUM_GOERLI],
    6,
    "USDT",
    "Tether USD"
  ),
};

export const DAMM_LP: TokenMap = {
  [ChainId.ETHEREUM_GOERLI]: new Token(
    ChainId.ETHEREUM_GOERLI,
    DAMM_ADDRESS[ChainId.ETHEREUM_GOERLI],
    6,
    "DAMM-LP",
    "DAMM LP"
  ),
};
