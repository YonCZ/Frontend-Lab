import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchState, subscribe } from "./api";
import type { Build, State } from "./types";
import { Gallery } from "./components/Gallery";
import { Preview } from "./components/Preview";

function readQuery() {
  const query = new URLSearchParams(location.search);
  return {
    projectId: query.get("project"),
    build: query.get("build"),
    against: query.get("against"),
  };
}

export default function App() {
  const [state, setState] = useState<State | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selection, setSelection] = useState(readQuery);

  useEffect(() => {
    const controller = new AbortController();
    fetchState(controller.signal)
      .then(setState)
      .catch((cause) => {
        if (!controller.signal.aborted) setError(String(cause));
      });
    const unsubscribe = subscribe(setState);
    return () => {
      controller.abort();
      unsubscribe();
    };
  }, []);

  const project = useMemo(
    () => state?.projects.find((item) => item.id === selection.projectId) ?? null,
    [state, selection.projectId],
  );

  const current: Build | null = useMemo(() => {
    if (!project) return null;
    return project.builds.find((build) => build.entry === selection.build) ?? project.builds[0] ?? null;
  }, [project, selection.build]);

  const against: Build | null = useMemo(() => {
    if (!project || !selection.against || selection.against === current?.entry) return null;
    return project.builds.find((build) => build.entry === selection.against) ?? null;
  }, [project, selection.against, current]);

  useEffect(() => {
    document.title = project ? `${project.name} · Frontend Lab` : "Frontend Lab";
  }, [project]);

  const syncUrl = useCallback((next: { projectId: string | null; build?: string | null; against?: string | null }) => {
    if (!next.projectId) {
      history.replaceState(null, "", "./");
      return;
    }
    const query = new URLSearchParams({ project: next.projectId });
    if (next.build) query.set("build", next.build);
    if (next.against) query.set("against", next.against);
    history.replaceState(null, "", `?${query}`);
  }, []);

  const openProject = (id: string) => {
    setSelection({ projectId: id, build: null, against: null });
    history.pushState(null, "", `?project=${encodeURIComponent(id)}`);
  };

  const selectBuild = (build: Build) => {
    if (!project) return;
    const nextAgainst = against?.entry === build.entry ? null : against?.entry ?? null;
    setSelection({ projectId: project.id, build: build.entry, against: nextAgainst });
    syncUrl({ projectId: project.id, build: build.entry, against: nextAgainst });
  };

  const setAgainst = (build: Build | null) => {
    if (!project) return;
    const entry = build?.entry ?? null;
    setSelection({ projectId: project.id, build: current?.entry ?? null, against: entry });
    syncUrl({ projectId: project.id, build: current?.entry, against: entry });
  };

  if (error) {
    return (
      <main className="gallery">
        <h1>Frontend Lab</h1>
        <p>Could not load the project catalog. Start the server with `npm run dev` and check projects/catalog.json.</p>
      </main>
    );
  }

  if (!state) {
    return (
      <main className="gallery">
        <p role="status">Loading projects…</p>
      </main>
    );
  }

  if (project) {
    return (
      <Preview
        project={project}
        current={current}
        against={against}
        version={state.revision}
        onBack={() => {
          setSelection({ projectId: null, build: null, against: null });
          history.pushState(null, "", "./");
        }}
        onSelect={selectBuild}
        onSetAgainst={setAgainst}
      />
    );
  }

  return (
    <Gallery
      projects={state.projects}
      failed={state.failed}
      promptPath={state.promptPath}
      prompt={state.prompt}
      onOpen={openProject}
    />
  );
}
