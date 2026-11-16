import { useMemo, useState } from "react";
import type { Project } from "../types";
import { AppBar } from "./AppBar";
import { Icon } from "./Icon";
import { ProjectFilesDialog } from "./ProjectFilesDialog";

export function NewIterator({ projects, promptPath }: { projects: Project[]; promptPath: string }) {
  const [name, setName] = useState("");
  const [chosen, setChosen] = useState<Set<string>>(new Set());
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [filesOpen, setFilesOpen] = useState(false);

  const groups = useMemo(
    () => projects.filter((project) => project.kind !== "iterator" && project.builds.length > 0),
    [projects],
  );
  const hasPreview = projects.some((project) => project.preview);
  const ready = name.trim().length > 0 && chosen.size > 0 && !submitting;

  const toggle = (entry: string) => {
    setChosen((current) => {
      const next = new Set(current);
      if (next.has(entry)) next.delete(entry);
      else next.add(entry);
      return next;
    });
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!ready) return;
    setSubmitting(true);
    setError("");
    const sources = [...chosen].map((entry) => {
      const project = groups.find((item) => item.builds.some((build) => build.entry === entry));
      const build = project?.builds.find((item) => item.entry === entry);
      return {
        entry,
        label: project && build ? `${project.name} · ${build.model} · V${build.variant}` : entry,
        project: project?.id ?? "",
      };
    });
    try {
      const response = await fetch("/api/iterators", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), sources }),
      });
      const data = (await response.json()) as { id?: string; error?: string };
      if (!response.ok || !data.id) throw new Error(data.error || "Could not create the iterator");
      location.href = `/iterator/${encodeURIComponent(data.id)}`;
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause));
      setSubmitting(false);
    }
  };

  return (
    <>
      <AppBar
        crumb="Iterator / New"
        hasPreview={hasPreview}
        current="iterators"
        onProjectFiles={() => setFilesOpen(true)}
      />

      <main className="gallery">
        <header className="intro is-single">
          <div className="intro-copy">
            <h1>New iterator</h1>
            <p className="lead">
              Choose the designs to keep. Each one is copied into the workspace, so editing and merging
              never changes the original build.
            </p>
          </div>
        </header>

        {groups.length ? (
          <form className="iterator-form" onSubmit={submit}>
            <label className="field">
              <span className="field-label mono">Workspace name</span>
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Trio merge"
                autoComplete="off"
              />
            </label>

            <div className="pick-list">
              {groups.map((project) => (
                <section className="pick-group" key={project.id}>
                  <h2>{project.name}</h2>
                  {project.builds.map((build) => (
                    <label className="pick-row" key={build.entry}>
                      <input
                        type="checkbox"
                        checked={chosen.has(build.entry)}
                        onChange={() => toggle(build.entry)}
                      />
                      <span className="pick-text">
                        <strong>{build.model}</strong>
                        <span className="mono">
                          {build.skill} · variant {build.variant}
                        </span>
                      </span>
                    </label>
                  ))}
                </section>
              ))}
            </div>

            <div className="form-actions">
              <button type="submit" className="button is-primary" disabled={!ready}>
                <Icon name="plus" /> {submitting ? "Creating…" : "Create iterator"}
              </button>
              <span className="mono result-count">{chosen.size} selected</span>
              {error ? <span className="form-error">{error}</span> : null}
            </div>
          </form>
        ) : (
          <div className="empty-gallery">
            <h3>No generator builds yet</h3>
            <p>Add a project and a few builds before starting an iterator.</p>
            <a className="button" href="/">
              Back to projects
            </a>
          </div>
        )}
      </main>

      <ProjectFilesDialog
        open={filesOpen}
        onClose={() => setFilesOpen(false)}
        promptPath={promptPath}
      />
    </>
  );
}
