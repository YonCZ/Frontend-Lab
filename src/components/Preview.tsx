import { useEffect, useState } from "react";
import type { Build, Project } from "../types";
import { buildLabel } from "../api";
import { Icon } from "./Icon";
import { MenuBar } from "./MenuBar";

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
            <div className={`pane${against && index === 1 ? " pane-pinned" : ""}`} key={`${build.entry}-${version}`}>
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
      </main>

      {immersive ? (
        <button type="button" className="exit-full" onClick={() => setImmersive(false)}>
          Exit full window <kbd>Esc</kbd>
        </button>
      ) : null}
    </div>
  );
}
