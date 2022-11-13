import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Button } from "./InteractButton";
import { BiChevronDown, BiError } from "react-icons/bi";

export const CustomConnectButton = () => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted;
        const connected = ready && account && chain;

        return (
          <div className={`${!ready && "hidden"}`}>
            {(() => {
              if (!connected) {
                return (
                  <button onClick={openConnectModal} className="text-white">
                    Connect Wallet
                  </button>
                );
              }
              if (chain.unsupported) {
                return (
                  <button
                    onClick={openChainModal}
                    className="flex items-center text-white"
                    type="button"
                  >
                    Wrong network
                    <BiError className="ml-1" />
                  </button>
                );
              }
              return (
                <div style={{ display: "flex", gap: 12, color: "white" }}>
                  <button
                    onClick={openChainModal}
                    style={{ display: "flex", alignItems: "center" }}
                    type="button"
                  >
                    {chain.hasIcon && (
                      <div
                        style={{
                          background: chain.iconBackground,
                          width: 12,
                          height: 12,
                          borderRadius: 999,
                          overflow: "hidden",
                          marginRight: 4,
                        }}
                      >
                        {chain.iconUrl && (
                          <img
                            alt={chain.name ?? "Chain icon"}
                            src={chain.iconUrl}
                            style={{ width: 12, height: 12 }}
                          />
                        )}
                      </div>
                    )}
                    {chain.name}
                    <BiChevronDown className="ml-1" />
                  </button>
                  <button
                    onClick={openAccountModal}
                    className="flex items-center"
                    type="button"
                  >
                    {account.displayName}
                    <BiChevronDown className="ml-1" />
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};

export const InteractConnectButton = () => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted;
        const connected = ready && account && chain;

        return (
          <div className={`${!ready && "hidden"}`}>
            {(() => {
              if (!connected) {
                return (
                  <Button onClick={openConnectModal} text="Connect Wallet" />
                );
              }
              if (chain.unsupported) {
                return (
                  <Button onClick={openConnectModal} text="Connect Wallet" />
                );
              }
              return (
                <div style={{ display: "flex", gap: 12, color: "white" }}>
                  <button
                    onClick={openChainModal}
                    style={{ display: "flex", alignItems: "center" }}
                    type="button"
                  >
                    {chain.hasIcon && (
                      <div
                        style={{
                          background: chain.iconBackground,
                          width: 12,
                          height: 12,
                          borderRadius: 999,
                          overflow: "hidden",
                          marginRight: 4,
                        }}
                      >
                        {chain.iconUrl && (
                          <img
                            alt={chain.name ?? "Chain icon"}
                            src={chain.iconUrl}
                            style={{ width: 12, height: 12 }}
                          />
                        )}
                      </div>
                    )}
                    {chain.name}
                    <BiChevronDown className="ml-1" />
                  </button>
                  <button
                    onClick={openAccountModal}
                    className="flex items-center"
                    type="button"
                  >
                    {account.displayName}
                    <BiChevronDown className="ml-1" />
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};
