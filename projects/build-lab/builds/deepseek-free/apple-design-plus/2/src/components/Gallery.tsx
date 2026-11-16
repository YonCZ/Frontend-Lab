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

const barClass = ["dist-a", "dist-b", "dist-c"];

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
        <span className="bar-crumb">Index</span>
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
          <div className="masthead-copy">
            <h1>Frontend Lab</h1>
            <p>Every project and build on disk, in one index.</p>
          </div>
          <label className="search">
            <Icon name="search" />
            <input
              ref={searchInput}
              type="search"
              id="project-search"
              aria-label="Search projects, models and skills"
              placeholder="Search projects, models, skills"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <kbd aria-hidden="true">/</kbd>
          </label>
        </header>

        <div className="index-meta">
          <span className="watch">
            <i aria-hidden="true" /> Watching projects/
          </span>
          <span className="meta-counts mono">
            {plural(projects.length, "project")} · {plural(buildCount, "build")} ·{" "}
            {plural(modelCount, "model")}
          </span>
          {search ? (
            <span className="meta-counts mono">
              {visible.length} of {projects.length} shown
            </span>
          ) : null}
          <button type="button" className="button" onClick={() => dialog.current?.showModal()}>
            <Icon name="plus" /> New project
          </button>
        </div>

        <section className="index-section" aria-labelledby="projects-title">
          <h2 id="projects-title" tabIndex={-1} className="sr-only">
            Projects
          </h2>

          <div className="index-head mono" aria-hidden="true">
            <span />
            <span>Project</span>
            <span>Builds</span>
            <span>Models</span>
            <span>Skills</span>
            <span />
          </div>

          <ul className="index-list">
            {visible.map((project) => {
              const builds = project.builds;
              const modelCounts = new Map<string, number>();
              for (const build of builds) {
                modelCounts.set(build.model, (modelCounts.get(build.model) ?? 0) + 1);
              }
              const models = [...modelCounts.keys()];
              const skills = [...new Set(builds.map((build) => build.skill))];
              const running = project.runs
                ? Object.values(project.runs).filter((job) => job.status === "running").length
                : 0;
              const summary =
                project.experiment && !builds.length
                  ? `${project.experiment.status === "draft" ? "Draft" : project.experiment.status === "running" ? "Generating" : "No builds ready"} · ${plural(project.experiment.presets?.length ?? 0, "preset")}`
                  : firstLine(project.brief);

              return (
                <li className="index-row" key={project.id}>
                  <a
                    className="row-link"
                    href={`?project=${encodeURIComponent(project.id)}`}
                    aria-label={`Open ${project.name}, ${plural(builds.length, "build")}`}
                    onClick={(event) => {
                      event.preventDefault();
                      onOpen(project.id);
                    }}
                  >
                    <div className={`row-thumb${project.cover ? "" : " is-empty"}`}>
                      {project.cover ? (
                        <img src={`/${project.cover}`} alt="" loading="lazy" />
                      ) : (
                        <span aria-hidden="true">{[...project.name][0]?.toUpperCase() || "?"}</span>
                      )}
                    </div>

                    <div className="row-main">
                      <h3>
                        {project.name}
                        {project.demo ? (
                          <span className="tag">
                            <i aria-hidden="true" /> Demo
                          </span>
                        ) : null}
                        {running > 0 ? (
                          <span className="tag tag-live">
                            <i aria-hidden="true" /> Working {running}
                          </span>
                        ) : null}
                      </h3>
                      <p title={project.brief}>{summary}</p>
                    </div>

                    <div className="row-builds">
                      <span className="row-number mono">{builds.length}</span>
                      {builds.length ? (
                        <span className="dist" aria-hidden="true">
                          {models.map((model, index) => (
                            <span
                              key={model}
                              className={barClass[Math.min(index, barClass.length - 1)]}
                              style={{ width: `${((modelCounts.get(model) ?? 0) / builds.length) * 100}%` }}
                            />
                          ))}
                        </span>
                      ) : null}
                    </div>

                    <div className="row-models">
                      {models.length ? (
                        <ul className="model-list">
                          {models.slice(0, 3).map((model) => (
                            <li key={model}>
                              <ModelMark model={model} />
                              <span title={model}>{model}</span>
                            </li>
                          ))}
                          {models.length > 3 ? (
                            <li className="model-more mono">+{models.length - 3}</li>
                          ) : null}
                        </ul>
                      ) : (
                        <span className="model-more mono">none</span>
                      )}
                    </div>

                    <div className="row-skills mono" title={skills.join(", ")}>
                      {builds.length ? skills.length : "—"}
                    </div>

                    <span className="row-arrow" aria-hidden="true">
                      <Icon name="arrow" />
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>

          {!visible.length ? (
            <div className="empty-gallery">
              <h3>{search ? "No matching projects" : "No projects here yet"}</h3>
              <p>
                {search
                  ? "No project, model or skill matches that search."
                  : "Add a project folder to your workspace to see it here."}
              </p>
              <button
                type="button"
                className="button"
                onClick={() => (search ? setSearch("") : dialog.current?.showModal())}
              >
                {search ? "Clear search" : "Project files"}
              </button>
            </div>
          ) : null}

          <p className="sr-only" role="status">
            {plural(visible.length, "matching project")}
          </p>
        </section>

        <details className="prompt-details">
          <summary>
            <span className="mono prompt-label">Shared prompt</span>
            <a href={`/${promptPath}`} target="_blank" rel="noopener" onClick={(event) => event.stopPropagation()}>
              {promptPath} <Icon name="external" />
            </a>
            <span className="mono prompt-size">{prompt.trim().length} chars</span>
          </summary>
          <pre className="mono" tabIndex={0} aria-label="Shared base prompt">
            {prompt.trim()}
          </pre>
        </details>

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
