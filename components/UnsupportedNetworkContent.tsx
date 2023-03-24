import { GiPeaceDove } from "react-icons/gi";
import { useAccount, useSwitchNetwork } from "wagmi";
import { ChainId } from "../sdk";
import { SUPPORTED_CHAIN_NAMES } from "../sdk/constants/chains";
import { InteractConnectButton } from "./CustomConnectButton";
import TabContentContainer from "./TabContentContainer";

const UnsupportedNetworkContent = () => {
  const { switchNetwork } = useSwitchNetwork();
  const { address } = useAccount();

  const handleSwitchNetwork = (chainId: number) => {
    switchNetwork?.(chainId);
  };

  const supportedChainIds = Object.values(ChainId)
    .filter((x) => typeof x === "number")
    .filter((values) => values !== ChainId.ETHEREUM_GOERLI) as number[];

  const chainImage = (chainId: number) => {
    switch (chainId) {
      case ChainId.POLYGON_MUMBAI:
        return "/polygon.png";
      case ChainId.ARBITRUM_GOERLI:
        return "/arbitrum.png";
      case ChainId.AVALANCHE_FUJI:
        return "/avalanche.png";
      default:
        return "";
    }
  };

  return (
    <TabContentContainer>
      <div className="flex flex-col">
        <div className="mb-4 flex flex-col items-start justify-start">
          <GiPeaceDove className="mb-2 rounded-sm border border-white/10 p-2 text-4xl text-white" />
          <div className="flex flex-col">
            <h4 className="text-white">Dove Protocol</h4>
            <p className=" text-xs text-white/50">
              {address ? "Select a supported network" : "Connect your wallet"}
            </p>
          </div>
        </div>
        {address ? (
          supportedChainIds.map((chainId) => {
            return (
              <button
                onClick={() => handleSwitchNetwork(chainId)}
                className="group relative mb-2 flex h-16 w-full items-center justify-between overflow-hidden rounded-sm border-y border-sky-400 bg-gradient-to-t from-sky-400/5 p-4 shadow-damn transition duration-500 ease-in-out hover:shadow-none"
              >
                <div className="background-gradient-pattern absolute top-0 h-16 w-full opacity-50 gradient-mask-t-0" />
                <div className="flex items-center">
                  <p className="text-white transition duration-500 ease-in-out group-hover:drop-shadow-tabler">
                    {SUPPORTED_CHAIN_NAMES[chainId as ChainId]}
                  </p>
                </div>
                <img
                  className="absolute right-0 h-24 w-24 opacity-5"
                  src={chainImage(chainId)}
                />
              </button>
            );
          })
        ) : (
          <InteractConnectButton />
        )}
      </div>
    </TabContentContainer>
  );
};

export default UnsupportedNetworkContent;
