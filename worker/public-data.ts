// Explicit publication contract. Packaging verifies tracked files against this list.
// Add generic CDN resources only after the Vercel owners confirm their live contract.
export const PUBLIC_DATA: Record<string, string> = {
  'vaults/1.json': 'vaults/1.json',
  'vaults/137.json': 'vaults/137.json',
  'vaults/146.json': 'vaults/146.json',
  'vaults/42161.json': 'vaults/42161.json',
  'vaults/747474.json': 'vaults/747474.json',
  'vaults/8453.json': 'vaults/8453.json',
  'vaults/RISK_FRAMEWORK.md': 'vaults/RISK_FRAMEWORK.md',
  'vaults/VAULT.md': 'vaults/VAULT.md',
};
