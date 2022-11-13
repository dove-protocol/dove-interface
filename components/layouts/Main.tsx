import Head from "next/head";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import { ConnectKitButton } from "connectkit";
import Navbar from "../Navbar";

const Main = ({ children }) => {
  const router = useRouter();
  const path = router.asPath;

  return (
    <div className="mx-auto">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Dove Interface</title>
      </Head>
      <NextSeo
        title="Dove Interface"
        description="Dove Interface"
        openGraph={{
          url: "",
          title: "Wagmi",
          description: "Wagmi",
        }}
        twitter={{ handle: "@wagmi" }}
      />
      {children}
    </div>
  );
};

export default Main;
