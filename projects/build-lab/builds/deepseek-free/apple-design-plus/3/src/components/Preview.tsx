import { useEffect, useMemo, useState } from "react";
import type { Build, Project } from "../types";
import { buildLabel } from "../api";
import { Icon } from "./Icon";
import { MenuBar } from "./MenuBar";
import { ModelMark } from "./ModelMark";

export function Preview({
  project,
  current,
  against,
  version,
  onBack,
  onSelect,
  onSetAgainst,
}: {
  project: Project;
  current: Build | null;
  against: Build | null;
  version: number;
  onBack: () => void;
  onSelect: (build: Build) => void;
  onSetAgainst: (build: Build | null) => void;
}) {
  const [immersive, setImmersive] = useState(false);
  const [briefOpen, setBriefOpen] = useState(false);

  useEffect(() => {
    document.body.classList.add("viewing");
    return () => document.body.classList.remove("viewing");
  }, []);

  useEffect(() => {
    if (!immersive) return;
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setImmersive(false);
    };
    document.addEventListener("keydown", escape);
    return () => document.removeEventListener("keydown", escape);
  }, [immersive]);

  const groups = useMemo(() => {
    const byKey = new Map<string, { key: string; model: string; skill: string; builds: Build[] }>();
    for (const build of project.builds) {
      const key = `${build.model}\u0000${build.skill}`;
      const group = byKey.get(key) ?? { key, model: build.model, skill: build.skill, builds: [] };
      group.builds.push(build);
      byKey.set(key, group);
    }
    return [...byKey.values()].map((group) => ({
      ...group,
      builds: [...group.builds].sort((a, b) => a.variant - b.variant),
    }));
  }, [project.builds]);

  const panes = [current, against].filter(Boolean) as Build[];

  return (
    <div className={`viewer${immersive ? " is-immersive" : ""}${against ? " is-compare" : ""}`}>
      <MenuBar
        project={project}
        current={current}
        against={against}
        immersive={immersive}
        onBack={onBack}
        onSelect={onSelect}
        onSetAgainst={onSetAgainst}
        onToggleImmersive={() => setImmersive((value) => !value)}
      />

      <main className="stage" id="stage" aria-label={`${project.name} preview`}>
        <aside className="side" aria-label="Project and builds">
          <div className="side-project">
            <p className="side-kicker mono">
              Project · {project.builds.length} {project.builds.length === 1 ? "build" : "builds"}
            </p>
            <h1>{project.name}</h1>
            {project.brief ? (
              <>
                <p className={`side-brief${briefOpen ? " is-open" : ""}`}>{project.brief.trim()}</p>
                <button
                  type="button"
                  className="side-more"
                  aria-expanded={briefOpen}
                  onClick={() => setBriefOpen((open) => !open)}
                >
                  {briefOpen ? "Show less" : "Read brief"}
                </button>
              </>
            ) : null}
          </div>

          <div className="side-builds">
            <div className="side-head">
              <h2>Builds</h2>
              <span className="mono">{project.builds.length}</span>
            </div>

            {groups.map((group) => (
              <section className="side-group" key={group.key}>
                <h3>
                  <ModelMark model={group.model} />
                  <span>{group.model}</span>
                  <em className="mono">{group.skill}</em>
                </h3>
                <ul className="side-list">
                  {group.builds.map((build) => {
                    const isCurrent = build.entry === current?.entry;
                    const isPinned = build.entry === against?.entry;
                    return (
                      <li
                        className="side-item"
                        key={build.entry}
                        data-current={isCurrent ? "true" : undefined}
                        data-pinned={isPinned ? "true" : undefined}
                      >
                        <button
                          type="button"
                          className="side-select"
                          aria-current={isCurrent ? "true" : undefined}
                          onClick={() => onSelect(build)}
                          title={labelFor(build)}
                        >
                          <span className="side-variant mono">V{build.variant}</span>
                          <span className="side-state mono">
                            {isCurrent ? "open" : isPinned ? "pinned" : ""}
                          </span>
                        </button>
                        <button
                          type="button"
                          className="side-pin"
                          aria-pressed={isPinned}
                          aria-label={
                            isCurrent
                              ? "This build is open; pick another to compare"
                              : `Pin variant ${build.variant} for comparison`
                          }
                          title={isCurrent ? "Open build" : isPinned ? "Unpin comparison" : "Pin for compare"}
                          disabled={isCurrent}
                          onClick={() => onSetAgainst(isPinned ? null : build)}
                        >
                          <Icon name="pin" />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}

            {!project.builds.length ? <p className="side-none">No builds yet.</p> : null}
          </div>
        </aside>

        <div className="stage-body">
          {!current ? (
            project.experiment ? (
              <section className="empty-preview">
                <p className="empty-kicker mono">Experiment</p>
                <h1>{project.name}</h1>
                <p className="empty-lead">
                  {project.experiment.status === "draft"
                    ? "Draft"
                    : project.experiment.status === "running"
                      ? "Generating"
                      : "No builds ready"}{" "}
                  ·{" "}
                  {project.experiment.presets?.reduce((count, preset) => count + preset.variants, 0) ?? 0}{" "}
                  planned builds · {project.experiment.model} via {project.experiment.runner}
                </p>
                <ul className="preset-list">
                  {project.experiment.presets?.map((preset) => (
                    <li key={preset.id}>
                      <strong>{preset.name}</strong>
                      <span className="mono">
                        {preset.variants} build{preset.variants === 1 ? "" : "s"}
                      </span>
                      {preset.focus ? <p>{preset.focus}</p> : null}
                    </li>
                  ))}
                </ul>
              </section>
            ) : (
              <section className="empty-preview">
                <p className="empty-kicker mono">No builds</p>
                <h1>{project.name}</h1>
                <p className="empty-lead">This project has no builds yet.</p>
              </section>
            )
          ) : (
            panes.map((build, index) => (
              <div
                className={`pane${against && index === 1 ? " pane-pinned" : ""}`}
                key={`${build.entry}-${version}`}
              >
                <iframe src={`/${build.entry}`} title={buildLabel(build)} />
                {against ? (
                  <div className="pane-label">
                    <span className="mono">
                      {build.model} / {build.skill} / V{build.variant}
                    </span>
                    {index === 1 ? (
                      <button type="button" onClick={() => onSetAgainst(null)}>
                        <Icon name="close" /> Unpin
                      </button>
                    ) : (
                      <span className="pane-role mono">open</span>
                    )}
                  </div>
                ) : null}
              </div>
            ))
          )}
        </div>
      </main>

      {immersive ? (
        <button type="button" className="exit-full" onClick={() => setImmersive(false)}>
          Exit full window <kbd>Esc</kbd>
        </button>
      ) : null}
    </div>
  );
}

function labelFor(build: Build) {
  return `${build.model} / ${build.skill} / Variant ${build.variant}`;
}
