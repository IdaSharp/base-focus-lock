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
