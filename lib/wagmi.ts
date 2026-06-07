import { injected } from "@wagmi/core";
import { coinbaseWallet } from "@wagmi/connectors";
import { Attribution } from "ox/erc8021";
import { createConfig, http } from "wagmi";
import { base } from "viem/chains";

export const BASE_APP_ID = "basefocuslock";

export const BUILDER_CODE = "";

export const dataSuffix = Attribution.toDataSuffix({
  codes: [BUILDER_CODE || BASE_APP_ID],
}) as `0x${string}`;

export const config = createConfig({
  chains: [base],
  connectors: [
    injected({
      shimDisconnect: true,
      target: "metaMask",
      unstable_shimAsyncInject: 1_500,
    }),
    injected({
      shimDisconnect: true,
      target: {
        id: "okxWallet",
        name: "OKX Wallet",
        provider(window) {
          return window?.ethereum?.providers?.find(
            (provider) => provider.isOkxWallet || provider.isOKExWallet,
          ) ?? (window?.ethereum?.isOkxWallet || window?.ethereum?.isOKExWallet
            ? window.ethereum
            : undefined);
        },
      },
    }),
    injected({
      shimDisconnect: true,
      target: {
        id: "browserWallet",
        name: "Base App / Browser Wallet",
        provider(window) {
          return window?.ethereum;
        },
      },
    }),
    coinbaseWallet({
      appName: "Base Focus Lock",
      preference: "all",
    }),
  ],
  transports: {
    [base.id]: http(),
  },
  ssr: true,
});
