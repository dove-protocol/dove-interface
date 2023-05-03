import { NextSeo } from "next-seo";
import Head from "next/head";
import { useRouter } from "next/router";

const Main = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const path = router.asPath;

  return (
    <div className="mx-auto">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Dove Interface</title>
      </Head>
      <NextSeo
        useAppDir
        title="Dove Interface"
        description="Experience the power of Dove, our innovative solution that eliminates liquidity fragmentation and bridges gaps across Layer 2 networks. Focus on the technical merits of your chosen L2, while Dove unlocks boundless liquidity for executing advanced leveraged LSD strategies on any L2."
        openGraph={{
          type: "website",
          description:
            "Experience the power of Dove, our innovative solution that eliminates liquidity fragmentation and bridges gaps across Layer 2 networks. Focus on the technical merits of your chosen L2, while Dove unlocks boundless liquidity for executing advanced leveraged LSD strategies on any L2.",
          title: "Dove Interface",
          images: [
            {
              url: "https://i.imgur.com/6fGh6n4.png",
            },
          ],
        }}
        twitter={{ cardType: "summary_large_image", handle: "@doveprotocol" }}
      />
      {children}
    </div>
  );
};

export default Main;
