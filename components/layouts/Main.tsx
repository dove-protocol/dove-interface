import { useRouter } from "next/router";

const Main = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const path = router.asPath;

  return <div className="mx-auto">{children}</div>;
};

export default Main;
