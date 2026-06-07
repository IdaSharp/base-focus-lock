import { zeroAddress, type Address } from "viem";

const deployedAddress = "0x1bFc24D94830fe3b2C9c9321af7352ecEA5BeF43";
const configuredAddress = process.env.NEXT_PUBLIC_BASE_FOCUS_LOCK_ADDRESS;

export const baseFocusLockAddress = (configuredAddress ??
  deployedAddress) as Address;

export const isContractConfigured =
  baseFocusLockAddress !== zeroAddress;
