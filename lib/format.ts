export function formatCount(value?: bigint) {
  if (value === undefined) {
    return "--";
  }

  return new Intl.NumberFormat("en-US").format(value);
}

export function formatAddress(address?: string) {
  if (!address) {
    return "Not connected";
  }

  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatTimestamp(timestamp?: bigint) {
  if (!timestamp) {
    return "No lock yet";
  }

  const date = new Date(Number(timestamp) * 1000);

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function formatHash(hash?: string) {
  if (!hash) {
    return "No transaction yet";
  }

  return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
}
