import type { State } from "./types";

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
