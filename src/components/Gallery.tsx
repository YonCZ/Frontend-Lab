import type { Project } from "../types";
import { Icon } from "./Icon";

function plural(count: number, noun: string) {
  return `${count} ${noun}${count === 1 ? "" : "s"}`;
}

export function Gallery({
  projects,
  failed,
  onOpen,
}: {
  projects: Project[];
  failed: string[];
  onOpen: (id: string) => void;
}) {
  return (
    <main className="gallery">
      <a className="skip" href="#projects-title">
        Skip to projects
      </a>
      <nav className="gallery-nav" aria-label="Workspace">
        <a className="nav-home" href="./" aria-label="Frontend Lab home" aria-current="page">
          <Icon name="home" />
        </a>
      </nav>
      <header className="intro">
        <h1>Frontend Lab</h1>
        <p>Browse your frontend projects and see how different models and skills approach the same brief.</p>
      </header>
      <section className="project-section" aria-labelledby="projects-title">
        <div className="toolbar">
          <h2 id="projects-title">Projects</h2>
          <div className="filters" />
        </div>
        <div className="project-grid" id="project-grid">
          {projects.map((project) => {
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
                        : `${plural(project.builds.length, "build")} · ${plural(models.length, "model")}`}
                    </p>
                    <span className="card-open">
                      <Icon name="arrow" />
                    </span>
                  </div>
                </a>
              </article>
            );
          })}
          {!projects.length ? (
            <div className="empty-gallery">
              <h3>No projects here yet</h3>
              <p>Add a project folder and a slug to projects/catalog.json to see it here.</p>
            </div>
          ) : null}
        </div>
        {failed.length ? <p className="notice">Could not load: {failed.join(", ")}</p> : null}
      </section>
    </main>
  );
}
