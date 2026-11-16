import type { IteratorProject, State } from "./types";

export async function fetchState(signal?: AbortSignal): Promise<State> {
  const response = await fetch("/api/state", { cache: "no-store", signal });
  if (!response.ok) throw new Error(`State request failed: ${response.status}`);
  return response.json();
}

export function subscribe(onState: (state: State) => void): () => void {
  const source = new EventSource("/api/events");
  source.addEventListener("state", (event) => {
    try {
      onState(JSON.parse((event as MessageEvent).data) as State);
    } catch {
      /* ignore malformed frames */
    }
  });
  return () => source.close();
}

export function buildLabel(build: { model: string; skill: string; variant: number }) {
  return `${build.model} / ${build.skill} / Variant ${build.variant}`;
}

export async function setProjectStatus(id: string, status: "working" | "settled") {
  const response = await fetch(`/api/projects/${encodeURIComponent(id)}/status`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) throw new Error(`Status update failed: ${response.status}`);
}

export async function fetchIterators(signal?: AbortSignal): Promise<IteratorProject[]> {
  const response = await fetch("/api/iterators", { cache: "no-store", signal });
  if (!response.ok) throw new Error(`Iterator request failed: ${response.status}`);
  const data = (await response.json()) as { iterators?: IteratorProject[] };
  return Array.isArray(data.iterators) ? data.iterators : [];
}
