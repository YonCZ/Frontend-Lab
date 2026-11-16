import { useEffect, useMemo, useState } from "react";
import type { IteratorProject, Project } from "../types";
import { fetchIterators } from "../api";
import { AppBar } from "./AppBar";
import { Icon } from "./Icon";
import { ModelMark } from "./ModelMark";
import { ProjectFilesDialog } from "./ProjectFilesDialog";

function plural(count: number, noun: string) {
  return `${count} ${noun}${count === 1 ? "" : "s"}`;
}

export function Iterators({ projects, promptPath }: { projects: Project[]; promptPath: string }) {
  const [items, setItems] = useState<IteratorProject[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filesOpen, setFilesOpen] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetchIterators(controller.signal)
      .then(setItems)
      .catch((cause) => {
        if (!controller.signal.aborted) setError(String(cause));
      });
    return () => controller.abort();
  }, []);

  const visible = useMemo(() => {
    const query = search.trim().toLowerCase();
    const list = items ?? [];
    if (!query) return list;
    return list.filter((item) =>
      [item.name, item.brief, ...item.sources.map((source) => `${source.model} ${source.skill}`)]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [items, search]);

  const hasPreview = projects.some((project) => project.preview);
  const sourceCount = (items ?? []).reduce((count, item) => count + item.sources.length, 0);
  const buildCount = (items ?? []).reduce((count, item) => count + item.builds.length, 0);

  return (
    <>
      <AppBar
        crumb="Iterator"
        count={items?.length}
        hasPreview={hasPreview}
        current="iterators"
        onProjectFiles={() => setFilesOpen(true)}
      />

      <main className="gallery">
        <section className="intro">
          <div className="intro-copy">
            <h1>Iterator</h1>
            <p className="lead">
              Pick the designs worth keeping, then edit or merge them into one. Sources are copied, so
              iterating never touches the generator output.
            </p>
            <dl className="intro-stats">
              <div>
                <dt className="mono">Workspaces</dt>
                <dd className="mono">{items?.length ?? 0}</dd>
              </div>
              <div>
                <dt className="mono">Sources</dt>
                <dd className="mono">{sourceCount}</dd>
              </div>
              <div>
                <dt className="mono">Builds</dt>
                <dd className="mono">{buildCount}</dd>
              </div>
            </dl>
          </div>

          <aside className="prompt" aria-label="How iteration works">
            <div className="prompt-head">
              <h2>How iteration works</h2>
              <span className="mono">copied, not linked</span>
            </div>
            <div className="prompt-body prompt-text">
              <p>Choose builds from any generator project.</p>
              <p>
                Each one is copied into a workspace under <code>iterators/</code>.
              </p>
              <p>Edit or merge the copies. The original builds never change.</p>
            </div>
            <p className="prompt-foot mono">the generator stays untouched</p>
          </aside>
        </section>

        <div className="toolbar">
          <label className="search">
            <Icon name="search" />
            <input
              type="search"
              aria-label="Search workspaces"
              placeholder="Search workspaces"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>
          <div className="toolbar-end">
            <span className="mono result-count" role="status">
              {search
                ? `${visible.length} of ${items?.length ?? 0}`
                : plural(items?.length ?? 0, "workspace")}
            </span>
            <a className="button" href="/iterators/new">
              <Icon name="plus" /> New iterator
            </a>
          </div>
        </div>

        <section className="projects" aria-labelledby="iterators-title">
          <h2 id="iterators-title" tabIndex={-1} className="sr-only">
            Iterator workspaces
          </h2>
          {items === null ? (
            <p className="group-empty" role="status">
              Loading workspaces…
            </p>
          ) : (
            <div className="project-grid">
              {visible.map((item) => {
                const models = [
                  ...new Set(
                    [...item.sources.map((source) => source.model), ...item.builds.map((build) => build.model)].filter(
                      Boolean,
                    ),
                  ),
                ];
                return (
                  <article className="card" key={item.id}>
                    <a
                      className="card-hit"
                      href={`/iterator/${encodeURIComponent(item.id)}`}
                      aria-label={`Open ${item.name}`}
                    />
                    <div className="card-cover is-empty">
                      <span className="card-initial" aria-hidden="true">
                        {[...item.name][0]?.toUpperCase() || "?"}
                      </span>
                      <span className="badge">
                        <span /> Iterator
                      </span>
                      <span className="card-count mono">
                        <strong>{item.sources.length}</strong>{" "}
                        {item.sources.length === 1 ? "source" : "sources"}
                      </span>
                      <span className="card-open" aria-hidden="true">
                        <Icon name="arrow" />
                      </span>
                    </div>
                    <div className="card-copy">
                      <h3>{item.name}</h3>
                      <p>{item.brief || `${item.sources.length} sources copied from generator builds.`}</p>
                    </div>
                    <div className="card-meta">
                      <span className="marks">
                        {models.slice(0, 4).map((model) => (
                          <ModelMark key={model} model={model} />
                        ))}
                      </span>
                      <span className="mono meta-line">
                        {plural(item.sources.length, "source")} · {plural(item.builds.length, "build")}
                      </span>
                    </div>
                  </article>
                );
              })}
              {!visible.length ? (
                <div className="empty-gallery">
                  <h3>{search ? "No matching workspaces" : "No iterators yet"}</h3>
                  <p>
                    {search
                      ? "Try a different workspace name or skill."
                      : "Pick designs from a generator project to start one."}
                  </p>
                  <a className="button" href="/iterators/new">
                    <Icon name="plus" /> New iterator
                  </a>
                </div>
              ) : null}
            </div>
          )}
          {error ? <p className="notice">Could not load iterators: {error}</p> : null}
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
