import { dequal } from "@openredaction/core";
import { useRef } from "react";

function depsDeepEqual(
  prev: React.DependencyList,
  next: React.DependencyList,
): boolean {
  if (prev.length !== next.length) {
    return false;
  }

  for (let i = 0; i < prev.length; i++) {
    if (!dequal(prev[i], next[i])) {
      return false;
    }
  }

  return true;
}

export function useDeepMemo<T>(value: T, deps: React.DependencyList): T {
  const ref = useRef<{ value: T; deps: React.DependencyList } | null>(null);

  if (ref.current === null || !depsDeepEqual(ref.current.deps, deps)) {
    ref.current = { value, deps };
  }

  return ref.current.value;
}
