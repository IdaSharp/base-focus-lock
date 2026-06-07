"use client";

import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  CircleGauge,
  Clock3,
  ExternalLink,
  Hash,
  Loader2,
  LockKeyhole,
  PlugZap,
  Power,
  RefreshCw,
  Wallet,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useReadContract,
  useSwitchChain,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { base } from "viem/chains";
import { baseFocusLockAbi } from "@/lib/abi";
import { baseFocusLockAddress, isContractConfigured } from "@/lib/contract";
import {
  formatAddress,
  formatCount,
  formatHash,
  formatTimestamp,
} from "@/lib/format";
import { dataSuffix } from "@/lib/wagmi";

type ActionStatus = "idle" | "pending" | "success" | "failed";

export function FocusDashboard() {
  const [walletMenuOpen, setWalletMenuOpen] = useState(false);
  const { address, chainId, connector, isConnected } = useAccount();
  const {
    connect,
    connectors,
    error: connectError,
    isPending: isConnectPending,
  } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain, isPending: isSwitchPending } = useSwitchChain();
  const {
    data: hash,
    error: writeError,
    isPending: isWalletPending,
    writeContract,
  } = useWriteContract();

  const isOnBase = chainId === base.id;
  const readsEnabled = isContractConfigured && isConnected && isOnBase;

  const userLocks = useReadContract({
    address: baseFocusLockAddress,
    abi: baseFocusLockAbi,
    functionName: "focusLocks",
    args: address ? [address] : undefined,
    query: {
      enabled: readsEnabled && Boolean(address),
    },
  });

  const lastLock = useReadContract({
    address: baseFocusLockAddress,
    abi: baseFocusLockAbi,
    functionName: "lastLock",
    args: address ? [address] : undefined,
    query: {
      enabled: readsEnabled && Boolean(address),
    },
  });

  const totalLocks = useReadContract({
    address: baseFocusLockAddress,
    abi: baseFocusLockAbi,
    functionName: "totalLocks",
    query: {
      enabled: isContractConfigured,
    },
  });

  const receipt = useWaitForTransactionReceipt({
    hash,
    chainId: base.id,
    query: {
      enabled: Boolean(hash),
    },
  });

  const actionStatus: ActionStatus = useMemo(() => {
    if (writeError || receipt.isError || receipt.data?.status === "reverted") {
      return "failed";
    }

    if (receipt.data?.status === "success") {
      return "success";
    }

    if (isWalletPending || receipt.isLoading) {
      return "pending";
    }

    return "idle";
  }, [
    isWalletPending,
    receipt.data?.status,
    receipt.isError,
    receipt.isLoading,
    writeError,
  ]);

  const refreshReads = () => {
    void userLocks.refetch();
    void lastLock.refetch();
    void totalLocks.refetch();
  };

  useEffect(() => {
    if (receipt.data?.status === "success") {
      refreshReads();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [receipt.data?.status]);

  const isBusy =
    isConnectPending || isSwitchPending || isWalletPending || receipt.isLoading;

  const lockFocus = () => {
    if (!isConnected) {
      setWalletMenuOpen(true);
      return;
    }

    if (!isOnBase) {
      switchChain({ chainId: base.id });
      return;
    }

    writeContract({
      address: baseFocusLockAddress,
      abi: baseFocusLockAbi,
      functionName: "lockFocus",
      dataSuffix,
    });
  };

  const statusText = getStatusText({
    actionStatus,
    connectError,
    isConnected,
    isContractConfigured,
    isOnBase,
    hash,
    writeError,
  });

  return (
    <section
      className="mx-auto flex min-h-dvh w-full max-w-[960px] flex-col px-4 py-4 text-base-ink sm:px-6 sm:py-8"
      aria-label="Base Focus Lock dashboard"
    >
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="mb-1 text-[11px] font-bold uppercase leading-none text-base-blue">
            Onchain Focus Intent
          </p>
          <h1 className="text-[24px] font-extrabold leading-tight tracking-normal sm:text-[30px]">
            Base Focus Lock
          </h1>
        </div>

        <div className="relative shrink-0">
          <button
            className="flex min-h-10 items-center gap-2 rounded-dashboard border border-base-line bg-white px-3 text-sm font-bold text-base-ink shadow-sm transition hover:border-base-blue hover:text-base-blue"
            type="button"
            onClick={() => setWalletMenuOpen((open) => !open)}
            aria-expanded={walletMenuOpen}
          >
            <Wallet aria-hidden="true" size={16} />
            <span className="hidden sm:inline">
              {isConnected ? formatAddress(address) : "Connect Wallet"}
            </span>
            <span className="sm:hidden">
              {isConnected ? "Wallet" : "Connect"}
            </span>
            <ChevronDown aria-hidden="true" size={15} />
          </button>

          {walletMenuOpen ? (
            <WalletMenu
              connectors={connectors}
              isConnected={isConnected}
              activeConnectorName={connector?.name}
              isPending={isConnectPending}
              connectError={connectError}
              onConnect={(selectedConnector) => {
                connect({ connector: selectedConnector });
              }}
              onDisconnect={() => {
                disconnect();
                setWalletMenuOpen(false);
              }}
              onClose={() => setWalletMenuOpen(false)}
            />
          ) : null}
        </div>
      </header>

      <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section className="rounded-dashboard border border-base-line bg-base-panel p-3 shadow-panel sm:p-4">
          <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
            <button
              className="flex min-h-14 items-center justify-center gap-2 rounded-dashboard bg-base-blue px-4 text-base font-extrabold text-white transition hover:bg-[#003bb8] disabled:cursor-not-allowed disabled:opacity-55"
              type="button"
              onClick={lockFocus}
              disabled={isBusy || !isContractConfigured}
            >
              {isBusy ? (
                <Loader2 aria-hidden="true" className="animate-spin" size={19} />
              ) : (
                <LockKeyhole aria-hidden="true" size={19} />
              )}
              {getPrimaryButtonLabel({
                isConnected,
                isContractConfigured,
                isOnBase,
                isBusy,
              })}
            </button>

            <button
              className="flex min-h-12 items-center justify-center gap-2 rounded-dashboard border border-base-line bg-white px-4 text-sm font-bold text-base-ink transition hover:border-base-blue hover:text-base-blue disabled:cursor-not-allowed disabled:opacity-55 sm:min-h-14"
              type="button"
              onClick={refreshReads}
              disabled={!isContractConfigured || totalLocks.isFetching}
              title="Refresh onchain reads"
            >
              <RefreshCw
                aria-hidden="true"
                className={totalLocks.isFetching ? "animate-spin" : undefined}
                size={17}
              />
              Refresh
            </button>
          </div>

          <div
            className={`mt-3 flex min-h-[52px] items-center gap-3 rounded-dashboard border bg-white px-3 py-2 ${getStatusTone(
              actionStatus,
              isContractConfigured,
            )}`}
          >
            {getStatusIcon(actionStatus)}
            <div className="min-w-0">
              <p className="m-0 text-xs font-extrabold uppercase leading-tight">
                {statusText.label}
              </p>
              <p className="mt-1 break-words text-xs leading-snug text-base-muted">
                {statusText.detail}
              </p>
            </div>
          </div>

          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <Metric
              icon={<LockKeyhole aria-hidden="true" size={16} />}
              label="My Focus Locks"
              value={formatCount(userLocks.data)}
            />
            <Metric
              icon={<CircleGauge aria-hidden="true" size={16} />}
              label="Total Locks"
              value={formatCount(totalLocks.data)}
            />
            <Metric
              icon={<Clock3 aria-hidden="true" size={16} />}
              label="Last Lock"
              value={formatTimestamp(lastLock.data)}
              small
            />
            <Metric
              icon={<Wallet aria-hidden="true" size={16} />}
              label="Wallet Status"
              value={
                isConnected
                  ? isOnBase
                    ? `Connected via ${connector?.name ?? "wallet"}`
                    : "Wrong network"
                  : "Disconnected"
              }
              small
            />
          </div>
        </section>

        <aside className="grid content-start gap-2">
          <LineItem
            icon={<Hash aria-hidden="true" size={18} />}
            label="Last Transaction"
            value={formatHash(hash)}
            href={hash ? `${base.blockExplorers.default.url}/tx/${hash}` : undefined}
          />
          <LineItem
            icon={<PlugZap aria-hidden="true" size={18} />}
            label="Contract"
            value={
              isContractConfigured
                ? formatAddress(baseFocusLockAddress)
                : "Set NEXT_PUBLIC_BASE_FOCUS_LOCK_ADDRESS"
            }
            href={
              isContractConfigured
                ? `${base.blockExplorers.default.url}/address/${baseFocusLockAddress}`
                : undefined
            }
          />
          <LineItem
            icon={<CircleGauge aria-hidden="true" size={18} />}
            label="Cost Model"
            value="No token purchase, no fee, Base gas only"
          />
        </aside>
      </div>
    </section>
  );
}

function WalletMenu({
  connectors,
  isConnected,
  activeConnectorName,
  isPending,
  connectError,
  onConnect,
  onDisconnect,
  onClose,
}: {
  connectors: ReturnType<typeof useConnect>["connectors"];
  isConnected: boolean;
  activeConnectorName?: string;
  isPending: boolean;
  connectError: Error | null;
  onConnect: (connector: ReturnType<typeof useConnect>["connectors"][number]) => void;
  onDisconnect: () => void;
  onClose: () => void;
}) {
  return (
    <div className="absolute right-0 z-20 mt-2 w-[min(88vw,320px)] rounded-dashboard border border-base-line bg-white p-2 shadow-panel">
      <div className="mb-2 flex items-center justify-between px-2 pt-1">
        <p className="text-xs font-extrabold uppercase text-base-muted">
          Choose Wallet
        </p>
        <button
          className="grid size-7 place-items-center rounded-dashboard text-base-muted transition hover:bg-base-panel hover:text-base-ink"
          type="button"
          onClick={onClose}
          aria-label="Close wallet menu"
        >
          <X aria-hidden="true" size={15} />
        </button>
      </div>

      <div className="grid gap-1">
        {connectors.map((availableConnector) => (
          <button
            key={availableConnector.uid}
            className="flex min-h-11 items-center justify-between gap-3 rounded-dashboard px-3 text-left text-sm font-bold text-base-ink transition hover:bg-base-panel disabled:cursor-not-allowed disabled:opacity-55"
            type="button"
            disabled={isPending}
            onClick={() => onConnect(availableConnector)}
          >
            <span>{getConnectorLabel(availableConnector.name)}</span>
            {activeConnectorName === availableConnector.name ? (
              <CheckCircle2 aria-hidden="true" color="#14884f" size={16} />
            ) : null}
          </button>
        ))}
      </div>

      {connectError ? (
        <p className="mt-2 rounded-dashboard bg-[#fff1f1] px-3 py-2 text-xs font-semibold leading-snug text-base-red">
          {connectError.message}
        </p>
      ) : null}

      {isConnected ? (
        <button
          className="mt-2 flex min-h-10 w-full items-center justify-center gap-2 rounded-dashboard border border-base-line bg-white px-3 text-sm font-bold text-base-red transition hover:bg-[#fff1f1]"
          type="button"
          onClick={onDisconnect}
        >
          <Power aria-hidden="true" size={16} />
          Disconnect
        </button>
      ) : null}
    </div>
  );
}

function Metric({
  icon,
  label,
  value,
  small = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  small?: boolean;
}) {
  return (
    <div className="min-h-[84px] rounded-dashboard border border-base-line bg-white p-3">
      <div className="mb-2 flex items-center gap-2 text-xs font-extrabold text-base-muted">
        {icon}
        {label}
      </div>
      <div
        className={`break-words font-extrabold leading-tight text-base-ink ${
          small ? "text-sm" : "text-[26px]"
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function LineItem({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <>
      <div className="mt-[2px] text-base-muted">{icon}</div>
      <div className="min-w-0">
        <p className="m-0 text-xs font-extrabold text-base-muted">{label}</p>
        <p className="mt-1 break-words text-sm font-semibold leading-snug text-base-ink">
          {value}
        </p>
      </div>
      {href ? (
        <ExternalLink
          aria-hidden="true"
          className="ml-auto shrink-0 text-base-muted"
          size={15}
        />
      ) : null}
    </>
  );

  if (href) {
    return (
      <a
        className="grid min-h-[58px] grid-cols-[20px_minmax(0,1fr)_16px] gap-3 rounded-dashboard border border-base-line bg-base-panel p-3 no-underline transition hover:border-base-blue"
        href={href}
        target="_blank"
        rel="noreferrer"
      >
        {content}
      </a>
    );
  }

  return (
    <div className="grid min-h-[58px] grid-cols-[20px_minmax(0,1fr)] gap-3 rounded-dashboard border border-base-line bg-base-panel p-3">
      {content}
    </div>
  );
}

function getPrimaryButtonLabel({
  isConnected,
  isContractConfigured,
  isOnBase,
  isBusy,
}: {
  isConnected: boolean;
  isContractConfigured: boolean;
  isOnBase: boolean;
  isBusy: boolean;
}) {
  if (!isContractConfigured) {
    return "Contract Missing";
  }

  if (isBusy) {
    return "Working";
  }

  if (!isConnected) {
    return "Connect Wallet";
  }

  if (!isOnBase) {
    return "Switch to Base";
  }

  return "Lock Focus";
}

function getStatusText({
  actionStatus,
  connectError,
  isConnected,
  isContractConfigured,
  isOnBase,
  hash,
  writeError,
}: {
  actionStatus: ActionStatus;
  connectError: Error | null;
  isConnected: boolean;
  isContractConfigured: boolean;
  isOnBase: boolean;
  hash?: `0x${string}`;
  writeError: Error | null;
}) {
  if (!isContractConfigured) {
    return {
      label: "Configuration Required",
      detail: "Deploy the contract and set NEXT_PUBLIC_BASE_FOCUS_LOCK_ADDRESS.",
    };
  }

  if (connectError) {
    return {
      label: "Wallet Error",
      detail: connectError.message,
    };
  }

  if (actionStatus === "pending") {
    return {
      label: "Pending",
      detail: hash
        ? `Waiting for Base confirmation: ${formatHash(hash)}`
        : "Confirm the transaction in your wallet.",
    };
  }

  if (actionStatus === "success") {
    return {
      label: "Success",
      detail: `Focus lock recorded onchain: ${formatHash(hash)}`,
    };
  }

  if (actionStatus === "failed") {
    return {
      label: "Failed",
      detail: writeError?.message ?? "The transaction did not complete.",
    };
  }

  if (!isConnected) {
    return {
      label: "Wallet Disconnected",
      detail: "Choose a wallet, then record a focus intent with Base gas only.",
    };
  }

  if (!isOnBase) {
    return {
      label: "Wrong Network",
      detail: "Switch to Base before locking focus.",
    };
  }

  return {
    label: "Ready",
    detail: "Click Lock Focus to record one onchain focus intent.",
  };
}

function getStatusIcon(actionStatus: ActionStatus) {
  if (actionStatus === "pending") {
    return <Loader2 aria-hidden="true" className="animate-spin" size={18} />;
  }

  if (actionStatus === "success") {
    return <CheckCircle2 aria-hidden="true" color="#14884f" size={18} />;
  }

  if (actionStatus === "failed") {
    return <AlertCircle aria-hidden="true" color="#c93636" size={18} />;
  }

  return <CircleGauge aria-hidden="true" color="#667085" size={18} />;
}

function getStatusTone(
  actionStatus: ActionStatus,
  isContractConfigured: boolean,
) {
  if (!isContractConfigured || actionStatus === "failed") {
    return "border-red-200 bg-[#fff1f1]";
  }

  if (actionStatus === "success") {
    return "border-green-200";
  }

  return "border-base-line";
}

function getConnectorLabel(name: string) {
  if (name.toLowerCase().includes("coinbase")) {
    return "Coinbase Wallet";
  }

  return name;
}
