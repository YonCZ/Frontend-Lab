import { useEffect, useMemo, useRef, useState } from "react";
import type { Project } from "../types";
import { Icon } from "./Icon";

function plural(count: number, noun: string) {
  return `${count} ${noun}${count === 1 ? "" : "s"}`;
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
  const [search, setSearch] = useState("");
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
    return projects.filter((item) => `${item.name} ${item.brief}`.toLowerCase().includes(query));
  }, [projects, search]);

  const buildCount = projects.reduce((count, item) => count + item.builds.length, 0);

  return (
    <>
      <main className="gallery">
        <a className="skip" href="#projects-title">
          Skip to projects
        </a>
        <nav className="gallery-nav" aria-label="Workspace">
          <a className="nav-home" href="./" aria-label="Frontend Lab home" aria-current="page">
            <Icon name="home" />
          </a>
          <button type="button" onClick={() => dialog.current?.showModal()}>
            <Icon name="folder" /> Project files
          </button>
        </nav>
        <header className="intro">
          <h1>Frontend Lab</h1>
          <p>Browse your frontend projects and see how different models and skills approach the same brief.</p>
          <div className="intro-note intro-prompt">
            <div className="intro-prompt-head">
              <span>Shared prompt</span>
              <a href={promptPath} target="_blank" rel="noopener">
                {promptPath} <Icon name="external" />
              </a>
            </div>
            <pre className="intro-prompt-body" tabIndex={0} aria-label="Shared base prompt">
              {prompt.trim()}
            </pre>
          </div>
          <div className="intro-meta">
            <span>
              <Icon name="folder" /> {plural(projects.length, "project")}
            </span>
            <span>
              <Icon name="panel" /> {plural(buildCount, "build")}
            </span>
          </div>
        </header>
        <div className="toolbar">
          <label className="search">
            <Icon name="search" />
            <input
              ref={searchInput}
              type="search"
              id="project-search"
              aria-label="Search projects"
              placeholder="Search projects"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <kbd aria-hidden="true">/</kbd>
          </label>
          <button type="button" className="new-project" onClick={() => dialog.current?.showModal()}>
            <Icon name="plus" /> New project
          </button>
        </div>
        <section className="project-section" aria-labelledby="projects-title">
          <h2 id="projects-title" tabIndex={-1}>
            Projects
          </h2>
          <div className="project-grid" id="project-grid">
            {visible.map((project) => {
              const models = [...new Set(project.builds.map((build) => build.model))];
              const running = project.runs
                ? Object.values(project.runs).filter((job) => job.status === "running").length
                : 0;
              return (
                <article className="project-card" key={project.id}>
                  <a
                    href={`?project=${encodeURIComponent(project.id)}`}
                    aria-label={`Open ${project.name}`}
                    onClick={(event) => {
                      event.preventDefault();
                      onOpen(project.id);
                    }}
                  >
                    <div className="project-cover">
                      <span className="cover-fallback" hidden={Boolean(project.cover)}>
                        <Icon name="folder" />
                      </span>
                      {project.cover ? <img src={project.cover} alt="" /> : null}
                      {project.demo ? (
                        <span className="sample">
                          <span /> Demo
                        </span>
                      ) : null}
                      {running > 0 ? (
                        <span className="sample">
                          <span /> Working {running}
                        </span>
                      ) : null}
                    </div>
                    <div className="card-body">
                      <h3>{project.name}</h3>
                      <p>
                        {project.experiment && !project.builds.length
                          ? `${project.experiment.status === "draft" ? "Draft" : project.experiment.status === "running" ? "Generating" : "No builds ready"} · ${plural(project.experiment.presets?.length ?? 0, "preset")}`
                          : (
                              <>
                                {plural(project.builds.length, "build")}{" "}
                                <span aria-hidden="true">·</span> {plural(models.length, "model")}
                              </>
                            )}
                      </p>
                      <span className="card-open">
                        <Icon name="arrow" />
                      </span>
                    </div>
                  </a>
                </article>
              );
            })}
            {!visible.length ? (
              <div className="empty-gallery">
                <h3>{search ? "No matching projects" : "No projects here yet"}</h3>
                <p>
                  {search
                    ? "Try a different project name or brief."
                    : "Add a project folder to your workspace to see it here."}
                </p>
                <button type="button" onClick={() => (search ? setSearch("") : dialog.current?.showModal())}>
                  {search ? "Clear search" : "Project files"}
                </button>
              </div>
            ) : null}
          </div>
          <p className="sr-only" id="gallery-status" role="status">
            {plural(visible.length, "matching project")}
          </p>
          {failed.length ? (
            <p className="notice">
              Could not read {failed.join(", ")}. Check the project manifests.
            </p>
          ) : null}
        </section>
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
        <a className="dialog-link" href="README.md" target="_blank" rel="noopener">
          Open workspace instructions <Icon name="external" />
        </a>
      </dialog>
    </>
  );
}
