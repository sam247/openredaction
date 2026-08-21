"use client";

import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { analytics } from "@/lib/analytics";

export const GITHUB_REPO_URL = "https://github.com/sam247/openredaction";
export const DOCS_GETTING_STARTED_PATH = "/docs/getting-started";

type TrackedGitHubLinkProps = Omit<
  ComponentPropsWithoutRef<"a">,
  "href" | "onClick"
> & {
  location: string;
  children: ReactNode;
};

/** Conversion: click to the OpenRedaction GitHub repo root. */
export function TrackedGitHubLink({
  location,
  children,
  ...props
}: TrackedGitHubLinkProps) {
  return (
    <a
      href={GITHUB_REPO_URL}
      target="_blank"
      rel="noopener noreferrer"
      {...props}
      onClick={() => {
        analytics.githubRepoClick(location);
      }}
    >
      {children}
    </a>
  );
}

type TrackedDocsGettingStartedLinkProps = {
  location: string;
  className?: string;
  children: ReactNode;
  prefetch?: boolean;
};

/** Conversion: click through to Getting Started docs. */
export function TrackedDocsGettingStartedLink({
  location,
  className,
  children,
  prefetch,
}: TrackedDocsGettingStartedLinkProps) {
  return (
    <Link
      href={DOCS_GETTING_STARTED_PATH}
      className={className}
      prefetch={prefetch}
      onClick={() => {
        analytics.docsGettingStartedClick(location);
      }}
    >
      {children}
    </Link>
  );
}
