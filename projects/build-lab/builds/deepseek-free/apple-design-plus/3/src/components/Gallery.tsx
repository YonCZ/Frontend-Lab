import { useEffect, useMemo, useRef, useState } from "react";
import type { Project } from "../types";
import { Icon } from "./Icon";
import { ModelMark } from "./ModelMark";

function plural(count: number, noun: string) {
  return `${count} ${noun}${count === 1 ? "" : "s"}`;
}

function firstLine(brief: string) {
  const line = brief.split("\n").find((part) => part.trim().length > 0) ?? "";
  return line.replace(/^#+\s*/, "");
}

export function Gallery({
  projects,
  failed,
  promptPath,
  prompt,
  onOpen,
}: {
  projects: Project[];
  failed: string[];
  promptPath: string;
  prompt: string;
  onOpen: (id: string) => void;
}) {
  const previewProject = projects.find((project) => project.preview) ?? null;
  const [search, setSearch] = useState("");
  const [activeId, setActiveId] = useState<string | null>(projects[0]?.id ?? null);
  const dialog = useRef<HTMLDialogElement>(null);
  const searchInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "/" && document.activeElement?.tagName !== "INPUT") {
        event.preventDefault();
        searchInput.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const visible = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return projects;
    return projects.filter((item) => {
      const haystack = [
        item.name,
        item.brief,
        ...item.builds.map((build) => `${build.model} ${build.skill}`),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(query);
    });
  }, [projects, search]);

  const active = visible.find((project) => project.id === activeId) ?? visible[0] ?? null;
  const buildCount = projects.reduce((count, item) => count + item.builds.length, 0);
  const modelCount = new Set(projects.flatMap((item) => item.builds.map((build) => build.model))).size;

  return (
    <>
      <a className="skip" href="#projects-title">
        Skip to projects
      </a>

      <header className="bar">
        <span className="brand">
          <span className="brand-glyph mono" aria-hidden="true">
            FL
          </span>
          <span className="brand-word">Frontend Lab</span>
        </span>
        <span className="bar-divider" aria-hidden="true" />
        <span className="bar-crumb">Workspace</span>
        <span className="bar-count mono">{projects.length}</span>
        <div className="bar-actions">
          <a className="bar-link" href="/iterators" title="Iterator workspaces">
            <Icon name="panel" /> <span>Iterator</span>
          </a>
          {previewProject ? (
            <a className="bar-link" href="/previews" title="Client preview">
              <Icon name="external" /> <span>Client preview</span>
            </a>
          ) : null}
          <button type="button" className="bar-link" onClick={() => dialog.current?.showModal()}>
            <Icon name="folder" /> <span>Project files</span>
          </button>
        </div>
      </header>

      <main className="gallery">
        <header className="masthead">
          <h1>Frontend Lab</h1>
          <span className="masthead-meta mono">
            {plural(projects.length, "project")} · {plural(buildCount, "build")} ·{" "}
            {plural(modelCount, "model")}
          </span>
          <button type="button" className="button" onClick={() => dialog.current?.showModal()}>
            <Icon name="plus" /> New project
          </button>
        </header>

        <div className="workspace">
          <aside className="shelf" aria-label="Projects">
            <div className="shelf-head">
              <h2 id="projects-title" tabIndex={-1}>
                Projects
              </h2>
              <span className="mono shelf-count">{visible.length}</span>
            </div>
            <label className="search shelf-search">
              <Icon name="search" />
              <input
                ref={searchInput}
                type="search"
                id="project-search"
                aria-label="Search projects, models and skills"
                placeholder="Search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              <kbd aria-hidden="true">/</kbd>
            </label>

            <ul className="shelf-list">
              {visible.map((project) => {
                const models = [...new Set(project.builds.map((build) => build.model))];
                const running = project.runs
                  ? Object.values(project.runs).filter((job) => job.status === "running").length
                  : 0;
                return (
                  <li key={project.id}>
                    <a
                      className="shelf-item"
                      href={`?project=${encodeURIComponent(project.id)}`}
                      aria-current={project.id === active?.id ? "true" : undefined}
                      onMouseEnter={() => setActiveId(project.id)}
                      onFocus={() => setActiveId(project.id)}
                      onClick={(event) => {
                        event.preventDefault();
                        onOpen(project.id);
                      }}
                    >
                      <span className={`shelf-thumb${project.cover ? "" : " is-empty"}`}>
                        {project.cover ? (
                          <img src={`/${project.cover}`} alt="" loading="lazy" />
                        ) : (
                          <span aria-hidden="true">{[...project.name][0]?.toUpperCase() || "?"}</span>
                        )}
                      </span>
                      <span className="shelf-copy">
                        <span className="shelf-name">
                          {project.name}
                          {project.demo ? <span className="shelf-tag">Demo</span> : null}
                          {running > 0 ? (
                            <span className="shelf-tag is-live">Working</span>
                          ) : null}
                        </span>
                        <span className="shelf-meta mono">
                          {project.builds.length} builds · {plural(models.length, "model")}
                        </span>
                      </span>
                      <Icon name="arrow" className="icon shelf-arrow" />
                    </a>
                  </li>
                );
              })}
            </ul>

            {!visible.length ? (
              <div className="shelf-empty">
                <p>No project, model or skill matches that search.</p>
                <button type="button" className="button" onClick={() => setSearch("")}>
                  Clear search
                </button>
              </div>
            ) : null}

            <div className="shelf-foot">
              <a href={`/${promptPath}`} target="_blank" rel="noopener" className="mono">
                <Icon name="external" /> Shared prompt
              </a>
              <span className="mono">{prompt.trim().length} chars</span>
            </div>
          </aside>

          <section className="showcase" aria-labelledby="showcase-title">
            {active ? (
              <>
                <div className={`showcase-cover${active.cover ? "" : " is-empty"}`}>
                  {active.cover ? (
                    <img src={`/${active.cover}`} alt="" />
                  ) : (
                    <span className="showcase-initial" aria-hidden="true">
                      {[...active.name][0]?.toUpperCase() || "?"}
                    </span>
                  )}
                  {active.demo ? (
                    <span className="badge">
                      <span /> Demo
                    </span>
                  ) : null}
                  <span className="badge badge-count mono">
                    {active.builds.length} {active.builds.length === 1 ? "build" : "builds"}
                  </span>
                </div>

                <div className="showcase-body">
                  <div className="showcase-title-row">
                    <h2 id="showcase-title">{active.name}</h2>
                    <a
                      className="open-button"
                      href={`?project=${encodeURIComponent(active.id)}`}
                      onClick={(event) => {
                        event.preventDefault();
                        onOpen(active.id);
                      }}
                    >
                      Open project <Icon name="arrow" />
                    </a>
                  </div>
                  <p className="showcase-brief">{firstLine(active.brief)}</p>

                  <dl className="showcase-facts">
                    <div>
                      <dt className="mono">Builds</dt>
                      <dd className="mono">{active.builds.length}</dd>
                    </div>
                    <div>
                      <dt className="mono">Models</dt>
                      <dd className="mono">
                        {new Set(active.builds.map((build) => build.model)).size}
                      </dd>
                    </div>
                    <div>
                      <dt className="mono">Skills</dt>
                      <dd className="mono">
                        {new Set(active.builds.map((build) => build.skill)).size}
                      </dd>
                    </div>
                  </dl>

                  <div className="showcase-models">
                    {[...new Set(active.builds.map((build) => build.model))].map((model) => (
                      <span key={model} className="model-chip">
                        <ModelMark model={model} />
                        {model}
                      </span>
                    ))}
                    {!active.builds.length ? (
                      <span className="model-chip mono">Awaiting first build</span>
                    ) : null}
                  </div>
                </div>
              </>
            ) : (
              <div className="showcase-empty">
                <h2 id="showcase-title">No matching projects</h2>
                <p>Try a different project, model or skill.</p>
                <button type="button" className="button" onClick={() => setSearch("")}>
                  Clear search
                </button>
              </div>
            )}
          </section>
        </div>

        {failed.length ? (
          <p className="notice">Could not read {failed.join(", ")}. Check the project manifests.</p>
        ) : null}
      </main>

      <dialog id="workspace-dialog" ref={dialog} aria-labelledby="workspace-title">
        <div className="dialog-header">
          <h2 id="workspace-title">Add a project</h2>
          <button
            type="button"
            className="icon-button"
            aria-label="Close"
            onClick={() => dialog.current?.close()}
          >
            <Icon name="close" />
          </button>
        </div>
        <p>
          Put each runnable build in its own folder under <code>projects/</code>. Add its entry file,
          model, skill, and variant to that project's <code>project.json</code>.
        </p>
        <p>
          For a new project, add its folder name to <code>projects/catalog.json</code> and reload the
          gallery. The shared prompt at <code>{promptPath}</code> is composed with each project's brief
          before a build runs.
        </p>
        <a className="button" href="/README.md" target="_blank" rel="noopener">
          Workspace instructions <Icon name="external" />
        </a>
      </dialog>
    </>
  );
}
