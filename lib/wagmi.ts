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
          return getOkxProvider(window) as never;
        },
      },
      unstable_shimAsyncInject: 2_000,
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

function getOkxProvider(window?: {
  ethereum?: {
    providers?: unknown[];
  };
  okxwallet?: unknown;
  okxWallet?: unknown;
}) {
  const directProvider = window?.okxwallet ?? window?.okxWallet;

  if (isOkxProvider(directProvider)) {
    return directProvider;
  }

  const ethereum = window?.ethereum;
  const okxProvider = ethereum?.providers?.find(isOkxProvider);

  if (okxProvider) {
    return okxProvider;
  }

  return isOkxProvider(ethereum) ? ethereum : undefined;
}

function isOkxProvider(provider: unknown) {
  return Boolean(
    provider &&
      typeof provider === "object" &&
      ("isOkxWallet" in provider || "isOKExWallet" in provider),
  );
}
