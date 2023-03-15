import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import {
  RainbowKitProvider,
  getDefaultWallets,
  midnightTheme,
} from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { AnimatePresence } from "framer-motion";
import { AppProps } from "next/app";
import { WagmiConfig, configureChains, createClient, goerli } from "wagmi";
import { arbitrumGoerli, polygonMumbai } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import "../styles/globals.css";
import "../styles/tailwind.css";

const { chains, provider } = configureChains(
  [goerli, arbitrumGoerli, polygonMumbai],
  [alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API ?? "" })]
);

const { connectors } = getDefaultWallets({
  appName: "Dove Protocol",
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
