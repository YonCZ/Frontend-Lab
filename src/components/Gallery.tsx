import { useEffect, useMemo, useRef, useState } from "react";
import type { Project } from "../types";
import { AppBar } from "./AppBar";
import { Icon } from "./Icon";
import { ModelMark } from "./ModelMark";
import { ProjectFilesDialog } from "./ProjectFilesDialog";

function plural(count: number, noun: string) {
  return `${count} ${noun}${count === 1 ? "" : "s"}`;
}

function oneLine(brief: string) {
  const line = brief.split("\n").find((part) => part.trim().length > 0) ?? "";
  return line.replace(/^#+\s*/, "");
}

const groupsKey = "frontend-lab.project-groups";

function readCollapsed() {
  try {
    const saved = JSON.parse(localStorage.getItem(groupsKey) || "{}") as Record<string, unknown>;
    return { working: Boolean(saved.working), settled: Boolean(saved.settled) };
  } catch {
    return { working: false, settled: false };
  }
}

export function Gallery({
  projects,
  failed,
  promptPath,
  prompt,
  onOpen,
  onStatus,
}: {
  projects: Project[];
  failed: string[];
  promptPath: string;
  prompt: string;
  onOpen: (id: string) => void;
  onStatus: (id: string, status: "working" | "settled") => void;
}) {
  const previewProject = projects.find((project) => project.preview) ?? null;
  const [search, setSearch] = useState("");
  const [filesOpen, setFilesOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(readCollapsed);
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

  useEffect(() => {
    localStorage.setItem(groupsKey, JSON.stringify(collapsed));
  }, [collapsed]);

  const visible = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return projects;
    return projects.filter((item) =>
      [
        item.name,
        item.brief,
        ...item.builds.map((build) => `${build.model} ${build.skill}`),
      ]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [projects, search]);

  const working = visible.filter((project) => project.status !== "settled");
  const settled = visible.filter((project) => project.status === "settled");
  const settledCount = projects.filter((project) => project.status === "settled").length;
  const buildCount = projects.reduce((count, item) => count + item.builds.length, 0);
  const modelCount = new Set(projects.flatMap((item) => item.builds.map((build) => build.model))).size;

  const toggleGroup = (key: "working" | "settled") =>
    setCollapsed((current) => ({ ...current, [key]: !current[key] }));

  const renderCard = (project: Project) => {
    const builds = project.builds;
    const models = [...new Set(builds.map((build) => build.model))];
    const skills = new Set(builds.map((build) => build.skill)).size;
    const running = project.runs
      ? Object.values(project.runs).filter((job) => job.status === "running").length
      : 0;
    const summary =
      project.experiment && !builds.length
        ? `${project.experiment.status === "draft" ? "Draft" : project.experiment.status === "running" ? "Generating" : "No builds ready"} · ${plural(project.experiment.presets?.length ?? 0, "preset")}`
        : oneLine(project.brief);
    const isSettled = project.status === "settled";

    return (
      <article className={`card${isSettled ? " is-settled" : ""}`} key={project.id}>
        <a
          className="card-hit"
          href={`?project=${encodeURIComponent(project.id)}`}
          aria-label={`Open ${project.name}`}
          onClick={(event) => {
            event.preventDefault();
            onOpen(project.id);
          }}
        />
        <div className={`card-cover${project.cover || project.builds.length ? "" : " is-empty"}`}>
          {project.cover ? (
            <img src={`/${project.cover}`} alt="" loading="lazy" />
          ) : project.builds[0] ? (
            <div className="card-preview" aria-hidden="true">
              <iframe
                src={`/${project.builds[0].entry}`}
                title="First build preview"
                tabIndex={-1}
                loading="lazy"
              />
            </div>
          ) : (
            <span className="card-initial" aria-hidden="true">
              {[...project.name][0]?.toUpperCase() || "?"}
            </span>
          )}
          {project.demo ? (
            <span className="badge">
              <span /> Demo
            </span>
          ) : null}
          {running > 0 ? (
            <span className="badge badge-live">
              <span /> Working {running}
            </span>
          ) : null}
          <span className="card-count mono">
            <strong>{builds.length}</strong> {builds.length === 1 ? "build" : "builds"}
          </span>
          {isSettled ? (
            <button
              type="button"
              className="cover-action is-restore"
              title="Move back to Working"
              aria-label={`Move ${project.name} back to Working`}
              onClick={() => onStatus(project.id, "working")}
            >
              <Icon name="arrow-up" />
            </button>
          ) : (
            <button
              type="button"
              className="cover-action is-check"
              title="Move to Settled"
              aria-label={`Move ${project.name} to Settled`}
              onClick={() => onStatus(project.id, "settled")}
            >
              <Icon name="check" />
            </button>
          )}
        </div>
        <div className="card-copy">
          <h3>{project.name}</h3>
          <p>{summary}</p>
        </div>
        <div className="card-meta">
          <span className="marks">
            {models.slice(0, 4).map((model) => (
              <ModelMark key={model} model={model} />
            ))}
          </span>
          <span className="mono meta-line">
            {builds.length
              ? `${plural(models.length, "model")} · ${plural(skills, "skill")}`
              : "Awaiting first build"}
          </span>
        </div>
      </article>
    );
  };

  const renderGroup = (key: "working" | "settled", title: string, items: Project[]) => {
    const isCollapsed = collapsed[key];
    const bodyId = `group-${key}-body`;
    return (
      <section
        className={`project-group${isCollapsed ? " is-collapsed" : ""}`}
        aria-labelledby={`group-${key}-title`}
      >
        <button
          type="button"
          className="group-toggle"
          aria-expanded={!isCollapsed}
          aria-controls={bodyId}
          onClick={() => toggleGroup(key)}
        >
          <Icon name="chevron" className="icon group-chevron" />
          <Icon name="folder" className="icon group-folder" />
          <span id={`group-${key}-title`} className="group-title">
            {title}
          </span>
          <span className="mono">{items.length}</span>
        </button>
        <div id={bodyId} hidden={isCollapsed}>
          {items.length ? (
            <div className="project-grid">{items.map(renderCard)}</div>
          ) : (
            <p className="group-empty">
              {search
                ? "No matches."
                : key === "settled"
                  ? "Check a project to move it here."
                  : "Nothing in progress."}
            </p>
          )}
        </div>
      </section>
    );
  };

  return (
    <>
      <a className="skip" href="#projects-title">
        Skip to projects
      </a>

      <AppBar
        crumb="All projects"
        count={projects.length}
        hasPreview={Boolean(previewProject)}
        onProjectFiles={() => setFilesOpen(true)}
      />

      <main className="gallery">
        <section className="intro">
          <div className="intro-copy">
            <h1>Frontend Lab</h1>
            <p className="lead">
              See how different models and skills answer the same brief. Every build runs from disk, in
              place, and updates as files land.
            </p>
            <dl className="intro-stats">
              <div>
                <dt className="mono">Projects</dt>
                <dd className="mono">{projects.length}</dd>
              </div>
              <div>
                <dt className="mono">Builds</dt>
                <dd className="mono">{buildCount}</dd>
              </div>
              <div>
                <dt className="mono">Models</dt>
                <dd className="mono">{modelCount}</dd>
              </div>
              <div>
                <dt className="mono">Settled</dt>
                <dd className="mono">{settledCount}</dd>
              </div>
            </dl>
          </div>

          <aside className="prompt" aria-label="Shared prompt">
            <div className="prompt-head">
              <h2>Shared prompt</h2>
              <a href={`/${promptPath}`} target="_blank" rel="noopener" className="mono">
                {promptPath} <Icon name="external" />
              </a>
            </div>
            <pre className="prompt-body" tabIndex={0} aria-label="Shared base prompt">
              {prompt.trim()}
            </pre>
            <p className="prompt-foot mono">
              {prompt.trim().length} chars · composed with each project brief
            </p>
          </aside>
        </section>

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
          <div className="toolbar-end">
            <span className="mono result-count" role="status">
              {search ? `${visible.length} of ${projects.length}` : plural(projects.length, "project")}
            </span>
            <button type="button" className="button" onClick={() => setFilesOpen(true)}>
              <Icon name="plus" /> New project
            </button>
          </div>
        </div>

        <section className="projects" aria-labelledby="projects-title">
          <h2 id="projects-title" tabIndex={-1} className="sr-only">
            Projects
          </h2>
          {visible.length ? (
            <div className="project-groups">
              {renderGroup("working", "Working", working)}
              {renderGroup("settled", "Settled", settled)}
            </div>
          ) : (
            <div className="empty-gallery">
              <h3>{search ? "No matching projects" : "No projects here yet"}</h3>
              <p>
                {search
                  ? "Try a different project name or brief."
                  : "Add a project folder to your workspace to see it here."}
              </p>
              <button
                type="button"
                className="button"
                onClick={() => (search ? setSearch("") : setFilesOpen(true))}
              >
                {search ? "Clear search" : "Project files"}
              </button>
            </div>
          )}
          <p className="sr-only" role="status">
            {plural(visible.length, "matching project")}
          </p>
          {failed.length ? (
            <p className="notice">Could not read {failed.join(", ")}. Check the project manifests.</p>
          ) : null}
        </section>
      </main>

      <ProjectFilesDialog
        open={filesOpen}
        onClose={() => setFilesOpen(false)}
        promptPath={promptPath}
      />
    </>
  );
}
