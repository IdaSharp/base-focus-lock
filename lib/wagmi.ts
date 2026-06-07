import { injected } from "@wagmi/core";
import { coinbaseWallet } from "@wagmi/connectors";
import { createConfig, http } from "wagmi";
import { base } from "viem/chains";

export const BASE_APP_ID = "basefocuslock";

export const BUILDER_CODE = "bc_1n8qd3n9";

export const dataSuffix =
  "0x62635f316e387164336e390b0080218021802180218021802180218021";

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
