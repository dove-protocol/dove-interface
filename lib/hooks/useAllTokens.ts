import { useNetwork } from "wagmi";
import { useMemo } from "react";
import { ChainId, Token } from "../../sdk";
import { DAMM_LP, USDC, USDT, vUSDC, vUSDT } from "../../sdk/constants";

export default function useAllTokens(): Token[] {
  const { chain } = useNetwork();

  return useMemo(() => {
    if (!chain) return [];

    let tokens: Token[] = [];

    tokens.push(USDC[chain.id], USDT[chain.id]);
    if (chain.id === ChainId.ETHEREUM_GOERLI) {
      tokens.push(DAMM_LP[chain.id]);
    }
    if (
      chain.id === ChainId.POLYGON_MUMBAI ||
      chain.id === ChainId.ARBITRUM_GOERLI
    ) {
      tokens.push(vUSDC[chain.id], vUSDT[chain.id]);
    }

    return tokens;
  }, [chain]);
}
