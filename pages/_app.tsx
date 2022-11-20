import "../styles/globals.css";
import "../styles/tailwind.css";
import "@rainbow-me/rainbowkit/styles.css";
import {
  Chain,
  chain,
  configureChains,
  createClient,
  WagmiConfig,
} from "wagmi";
import { providers } from "ethers";
import { AnimatePresence } from "framer-motion";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import {
  getDefaultWallets,
  darkTheme,
  RainbowKitProvider,
  midnightTheme,
} from "@rainbow-me/rainbowkit";
import { AppProps } from "next/app";

export const avalancheChain: Chain = {
  id: 43113,
  name: "Avalanche",
  network: "avalanche",
  nativeCurrency: {
    decimals: 18,
    name: "Avalanche",
    symbol: "AVAX",
  },
  rpcUrls: {
    default: "https://api.avax-test.network/ext/bc/C/rpc",
  },
  blockExplorers: {
    default: { name: "SnowTrace", url: "https:/testnet.snowtrace.io" },
  },
  testnet: true,
};

const { chains, provider } = configureChains(
  [chain.goerli, chain.arbitrumGoerli, chain.polygonMumbai],
  [
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID ?? "" }),
    jsonRpcProvider({
      rpc: (chain) => {
        if (chain.id !== avalancheChain.id) return null;
        return { http: chain.rpcUrls.default };
      },
    }),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "My RainbowKit App",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});
const apolloClient = new ApolloClient({
  uri: process.env.GRAPHQL_URI,
  cache: new InMemoryCache(),
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={apolloClient}>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider
          chains={chains}
          modalSize="compact"
          theme={midnightTheme({
            accentColor: "#1da7eb",
            accentColorForeground: "white",
            borderRadius: "small",
          })}
        >
          <AnimatePresence>
            <Component {...pageProps} />
          </AnimatePresence>
        </RainbowKitProvider>
      </WagmiConfig>
    </ApolloProvider>
  );
}

export default MyApp;
