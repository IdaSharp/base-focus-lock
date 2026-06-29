# BaseFocusLock

BaseFocusLock is a minimal onchain focus intent Mini App for Base.

The project includes a smart contract and a web app configured to write focus-lock actions to Base.

Repository: https://github.com/IdaSharp/base-focus-lock.git

## Overview

BaseFocusLock is designed to keep the app small and direct.

It uses Wagmi for wallet connections and contract writes.

The main onchain action is `lockFocus()`.

Each `lockFocus()` write includes an ERC-8021 attribution suffix through `dataSuffix`.

## Features

- Minimal Base Mini App experience
- Onchain focus intent contract
- Direct Wagmi integration
- Support for injected wallets
- Support for external Coinbase Wallet
- ERC-8021 attribution suffix support
- No RainbowKit dependency
- No WalletConnect dependency
- No rewards, points, invites, payments, or leaderboards

## Repository

Clone the repository:

```bash
git clone https://github.com/IdaSharp/base-focus-lock.git
cd base-focus-lock
```

Install dependencies using the package manager used by the project.

For example:

```bash
npm install
```

## Contract Setup

Deploy the contract located at:

```text
contracts/BaseFocusLock.sol
```

After deployment, set the deployed contract address in your environment configuration:

```bash
NEXT_PUBLIC_BASE_FOCUS_LOCK_ADDRESS=0xYourContractAddress
```

Replace `0xYourContractAddress` with the actual deployed contract address.

## Base App Configuration

The app metadata is defined in:

```text
app/layout.tsx
```

The file currently includes:

```html
<meta name="base:app_id" content="basefocuslock" />
```

Before production verification, replace `basefocuslock` with the value provided by base.dev.

## ERC-8021 Attribution

The ERC-8021 attribution suffix is configured in:

```text
lib/wagmi.ts
```

The project defines:

```ts
export const BUILDER_CODE = "";
```

Leave this value blank for the first deployment.

After base.dev verification, set the builder code in `BUILDER_CODE`.

Every `lockFocus()` write explicitly includes `dataSuffix`.

## Wallet Support

This app uses Wagmi directly.

Supported connectors are:

- `injected()` for Base App, MetaMask, OKX, and browser-injected wallets
- `coinbaseWallet()` for external Coinbase Wallet

The app intentionally avoids additional wallet UI frameworks.

## Running the App

After installing dependencies and configuring the contract address, start the development server with the project鈥檚 configured script.

For example:

```bash
npm run dev
```

Then open the local development URL shown in your terminal.

## Usage

1. Deploy `contracts/BaseFocusLock.sol`.
2. Set `NEXT_PUBLIC_BASE_FOCUS_LOCK_ADDRESS`.
3. Start the web app.
4. Connect a supported wallet.
5. Use the app to call `lockFocus()`.

## Production Checklist

Before publishing the Mini App:

- Confirm the contract is deployed on the intended Base network.
- Confirm `NEXT_PUBLIC_BASE_FOCUS_LOCK_ADDRESS` points to the deployed contract.
- Update the `base:app_id` metadata value in `app/layout.tsx`.
- Complete base.dev verification.
- Set `BUILDER_CODE` in `lib/wagmi.ts` after verification.
- Confirm `lockFocus()` writes include the expected `dataSuffix`.

## Notes

BaseFocusLock is intentionally minimal.

Keep configuration values explicit and review them before deployment.

If the contract address changes, update the environment configuration and redeploy the web app.

If the Base app identifier changes, update the metadata in `app/layout.tsx`.

If the builder code changes, update `lib/wagmi.ts` before publishing.
