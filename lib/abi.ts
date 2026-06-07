export const baseFocusLockAbi = [
  {
    type: "function",
    name: "focusLocks",
    stateMutability: "view",
    inputs: [{ name: "", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "lastLock",
    stateMutability: "view",
    inputs: [{ name: "", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "totalLocks",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "lockFocus",
    stateMutability: "nonpayable",
    inputs: [],
    outputs: [],
  },
  {
    type: "event",
    name: "FocusLocked",
    inputs: [
      { indexed: true, name: "user", type: "address" },
      { indexed: false, name: "timestamp", type: "uint256" },
      { indexed: false, name: "userLocks", type: "uint256" },
      { indexed: false, name: "totalLocks", type: "uint256" },
    ],
  },
] as const;
