# Base Focus Lock

Minimal onchain focus intent Mini App for Base.

## Configure

Deploy `contracts/BaseFocusLock.sol`, then set the contract address:

```bash
NEXT_PUBLIC_BASE_FOCUS_LOCK_ADDRESS=0xYourContractAddress
```

`app/layout.tsx` hardcodes:

```html
<meta name="base:app_id" content="basefocuslock" />
```

Replace `basefocuslock` with the base.dev verify token before production verification.

`lib/wagmi.ts` defines the ERC-8021 attribution suffix:

```ts
export const BUILDER_CODE = "";
```

Leave it blank for the first deployment, then set the builder code after base.dev verification. Every `lockFocus()` write explicitly includes `dataSuffix`.

## Wallets

This app uses Wagmi directly with only:

- `injected()` for Base App, MetaMask, OKX, and browser-injected wallets
- `coinbaseWallet()` for external Coinbase Wallet

It does not use RainbowKit, WalletConnect, token rewards, points, invites, payments, or leaderboards.
