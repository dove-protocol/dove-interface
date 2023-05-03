import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import {
  RainbowKitProvider,
  getDefaultWallets,
  midnightTheme,
} from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { AnimatePresence } from "framer-motion";
import { NextSeo } from "next-seo";
import { AppProps } from "next/app";
import { WagmiConfig, configureChains, createClient } from "wagmi";
import {
  arbitrumGoerli,
  avalancheFuji,
  goerli,
  polygonMumbai,
} from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { ChainId } from "../sdk";
import "../styles/globals.css";
import "../styles/tailwind.css";

const { chains, provider } = configureChains(
  [goerli, arbitrumGoerli, polygonMumbai, avalancheFuji],
  [
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY ?? "" }),
    jsonRpcProvider({
      rpc: (chain) => {
        if (chain.id !== ChainId.AVALANCHE_FUJI) return null;
        return {
          http: `https://api.avax-test.network/ext/bc/C/rpc`,
        };
      },
    }),
  ]
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
  uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
  cache: new InMemoryCache(),
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <NextSeo
        title="Dove Interface"
        description="Experience the power of Dove, our innovative solution that eliminates liquidity fragmentation and bridges gaps across Layer 2 networks."
        openGraph={{
          type: "website",
          description:
            "Experience the power of Dove, our innovative solution that eliminates liquidity fragmentation and bridges gaps across Layer 2 networks.",
          title: "Dove Interface",
          images: [
            {
              url: "https://i.imgur.com/6fGh6n4.png",
            },
          ],
        }}
        twitter={{ cardType: "summary_large_image", handle: "@doveprotocol" }}
      />
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
    </>
  );
}

export default MyApp;
