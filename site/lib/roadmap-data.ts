/**
 * Public roadmap copy — direction, not commitments. Edit here to update /roadmap.
 * Planned tracks open GitHub issues/discussions; Recently shipped tracks recent merges.
 */

export type RoadmapItem = {
  label: string;
  href?: string;
};

/** Grounded in open issue #75 (help wanted) and the related contributor discussion. */
export const roadmapPlanned: readonly RoadmapItem[] = [
  {
    label: "Improve and expand PII pattern coverage — help wanted (#75)",
    href: "https://github.com/sam247/openredaction/issues/75",
  },
  {
    label:
      "Harden existing patterns with fixtures, false-positive/negative checks, and regression tests",
    href: "https://github.com/sam247/openredaction/issues/75",
  },
  {
    label:
      "Contributor-friendly path for missing regional identifiers (spec reference, examples, tests)",
    href: "https://github.com/sam247/openredaction/issues/75",
  },
  {
    label:
      "Pattern metadata (country / family / examples) as a source of truth for tests, docs, and coverage",
    href: "https://github.com/sam247/openredaction/issues/75",
  },
  {
    label:
      "Split that work into smaller country / region / family help-wanted issues once the format settles",
    href: "https://github.com/sam247/openredaction/issues/75",
  },
];

export const roadmapInProgress: readonly RoadmapItem[] = [
  {
    label:
      "Agreeing the contributor workflow and test harness for pattern work (#75)",
    href: "https://github.com/sam247/openredaction/issues/75",
  },
  {
    label: "Docs and site polish",
  },
  {
    label: "Community feedback triage via GitHub Discussions and Issues",
    href: "https://github.com/sam247/openredaction/issues",
  },
];

/** Summaries of recent merged PRs — not every chore commit. */
export const roadmapRecentlyShipped: readonly RoadmapItem[] = [
  {
    label: "npm OIDC Trusted Publishing — token-free releases with provenance",
    href: "https://github.com/sam247/openredaction/pull/99",
  },
  {
    label: "Dependency management and monorepo package updates",
    href: "https://github.com/sam247/openredaction/pull/97",
  },
  {
    label: "Elysia plugin",
    href: "https://github.com/sam247/openredaction/pull/64",
  },
  {
    label: "Monorepo packaging layout",
    href: "https://github.com/sam247/openredaction/pull/62",
  },
  {
    label: "React hook fixes and integration tests",
    href: "https://github.com/sam247/openredaction/pull/60",
  },
];
