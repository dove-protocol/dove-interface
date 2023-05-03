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

      {children}
    </div>
  );
};

export default Main;
