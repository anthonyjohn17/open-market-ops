const ROLE_PATTERNS: Array<{ cluster: string; patterns: RegExp[] }> = [
  {
    cluster: "customer_support",
    patterns: [/customer support/i, /client support/i, /support specialist/i, /help desk/i],
  },
  {
    cluster: "claims_processing",
    patterns: [/claims/i, /insurance processor/i],
  },
  {
    cluster: "data_entry",
    patterns: [/data entry/i, /processing clerk/i],
  },
  {
    cluster: "virtual_assistant",
    patterns: [/virtual assistant/i, /va\b/i],
  },
];

export function normalizeRoleCluster(title: string, description: string): string {
  const text = `${title} ${description}`;
  for (const { cluster, patterns } of ROLE_PATTERNS) {
    if (patterns.some((p) => p.test(text))) return cluster;
  }
  return "other";
}
