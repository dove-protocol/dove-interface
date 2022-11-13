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
import { publicProvider } from "wagmi/providers/public";
import {
  getDefaultWallets,
  darkTheme,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";

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
  [chain.goerli, chain.arbitrumGoerli, avalancheChain],
  [alchemyProvider({ apiKey: process.env.ALCHEMY_ID }), publicProvider()]
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

function MyApp({ Component, pageProps }) {
  return (
    <ApolloProvider client={apolloClient}>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider
          chains={chains}
          modalSize="compact"
          theme={darkTheme({
            accentColor: "#FFFFFF",
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
