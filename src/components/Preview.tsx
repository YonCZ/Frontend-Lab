import { useEffect, useMemo, useRef, useState } from "react";
import type { Build, Project } from "../types";
import { buildLabel } from "../api";
import { Icon } from "./Icon";
import { ModelMark } from "./ModelMark";

type Menu = "models" | "skills" | "compare" | "files" | null;

const menuNames: Record<Exclude<Menu, null>, string> = {
  models: "Switch model",
  skills: "Switch skill",
  compare: "Compare builds",
  files: "Build files",
};

function RailButton({
  action,
  label,
  children,
  expanded,
  disabled,
  onClick,
}: {
  action: string;
  label: string;
  children: React.ReactNode;
  expanded?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className="rail-control"
      data-action={action}
      title={label}
      aria-label={label}
      aria-expanded={expanded ? "true" : undefined}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

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
  const [menu, setMenu] = useState<Menu>(null);
  const [modelQuery, setModelQuery] = useState("");
  const [copied, setCopied] = useState(false);
  const modelSearch = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.body.classList.add("viewing");
    return () => document.body.classList.remove("viewing");
  }, []);

  useEffect(() => {
    if (menu === "models") modelSearch.current?.focus();
  }, [menu]);

  useEffect(() => {
    const shortcut = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey) && !event.altKey) {
        event.preventDefault();
        setMenu("models");
      }
    };
    window.addEventListener("keydown", shortcut);
    return () => window.removeEventListener("keydown", shortcut);
  }, []);

  useEffect(() => {
    if (!menu) return;
    const close = (event: PointerEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".preview-tools")) setMenu(null);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenu(null);
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", escape);
    };
  }, [menu]);

  const models = useMemo(
    () => [...new Set(project.builds.map((build) => build.model))].filter(Boolean),
    [project.builds],
  );
  const skills = useMemo(() => {
    const all = [...new Set(project.builds.map((build) => build.skill))];
    return all.includes("No skill") ? ["No skill", ...all.filter((s) => s !== "No skill")] : all;
  }, [project.builds]);
  const variants = useMemo(() => {
    if (!current) return [];
    return project.builds
      .filter((build) => build.model === current.model && build.skill === current.skill)
      .sort((a, b) => a.variant - b.variant);
  }, [project.builds, current]);

  const findBuild = (model: string, skill: string) =>
    project.builds.find((build) => build.model === model && build.skill === skill) ?? null;

  const pickModel = (model: string) => {
    const firstSkill = project.builds.find((build) => build.model === model)?.skill;
    const target =
      findBuild(model, current?.skill ?? "No skill") ??
      (firstSkill ? findBuild(model, firstSkill) : null);
    if (target) onSelect(target);
    setMenu(null);
  };

  const pickSkill = (skill: string) => {
    if (!current) return;
    const target = findBuild(current.model, skill);
    if (target) onSelect(target);
    setMenu(null);
  };

  const panes = [current, against].filter(Boolean) as Build[];

  return (
    <>
      <aside className="preview-tools" aria-label="Project controls">
        <nav className="rail" id="rail" aria-label="Preview tools">
          <a
            className="rail-control"
            href="./"
            aria-label="Back to projects"
            title="Back to projects"
            onClick={(event) => {
              event.preventDefault();
              onBack();
            }}
          >
            <Icon name="home" />
          </a>
          <div className="rail-rule" />
          <RailButton
            action="compare"
            label="Compare builds"
            onClick={() => setMenu(menu === "compare" ? null : "compare")}
            expanded={menu === "compare"}
            disabled={project.builds.length < 2}
          >
            <span className="versus">VS</span>
          </RailButton>
          <div className="rail-rule" />
          {current ? (
            <>
              <RailButton
                action="models"
                label={`Switch model (current: ${current.model})`}
                onClick={() => setMenu(menu === "models" ? null : "models")}
                expanded={menu === "models"}
              >
                <ModelMark model={current.model} />
              </RailButton>
              <RailButton
                action="skills"
                label={`Switch skill (current: ${current.skill})`}
                onClick={() => setMenu(menu === "skills" ? null : "skills")}
                expanded={menu === "skills"}
              >
                <Icon name={current.skill === "No skill" ? "off" : "palette"} />
              </RailButton>
              <div className="rail-rule" />
              {variants.map((build) => (
                <button
                  type="button"
                  className="rail-control"
                  key={build.entry}
                  title={`Variant ${build.variant}`}
                  aria-label={`Variant ${build.variant}`}
                  aria-current={build.entry === current.entry ? "true" : undefined}
                  onClick={() => onSelect(build)}
                >
                  {build.variant}
                </button>
              ))}
              <div className="rail-rule" />
            </>
          ) : null}
          <RailButton
            action="files"
            label="Build files"
            onClick={() => setMenu(menu === "files" ? null : "files")}
            expanded={menu === "files"}
          >
            <Icon name="panel" />
          </RailButton>
        </nav>

        <section
          className="popover"
          id="popover"
          aria-label={menu ? menuNames[menu] : undefined}
          hidden={!menu}
        >
          {menu === "models" ? (
            <>
              <label className="search model-search">
                <Icon name="search" />
                <input
                  ref={modelSearch}
                  type="search"
                  aria-label="Search models"
                  placeholder="Search models"
                  value={modelQuery}
                  onChange={(event) => setModelQuery(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key !== "Enter") return;
                    event.preventDefault();
                    const filtered = models.filter((model) =>
                      model.toLowerCase().includes(modelQuery.trim().toLowerCase()),
                    );
                    if (filtered[0]) pickModel(filtered[0]);
                  }}
                />
                <kbd aria-hidden="true">{/Mac|iPhone/.test(navigator.platform) ? "⌘" : "Ctrl"} + K</kbd>
              </label>
              <div className="option-list">
                {models
                  .filter((model) => model.toLowerCase().includes(modelQuery.trim().toLowerCase()))
                  .map((model, index) => {
                    const firstSkill = project.builds.find((build) => build.model === model)?.skill;
                    const target =
                      findBuild(model, current?.skill ?? "No skill") ??
                      (firstSkill ? findBuild(model, firstSkill) : null);
                    const selected = model === current?.model;
                    return (
                      <button
                        className="option"
                        type="button"
                        key={model}
                        disabled={!target}
                        aria-current={selected ? "true" : undefined}
                        onClick={() => pickModel(model)}
                      >
                        <ModelMark model={model} />
                        <span>{model}</span>
                        {index === 0 ? (
                          <kbd className="option-end" aria-hidden="true">
                            Enter
                          </kbd>
                        ) : selected ? (
                          <span className="option-end">
                            <Icon name="check" />
                          </span>
                        ) : null}
                      </button>
                    );
                  })}
                {!models.some((model) =>
                  model.toLowerCase().includes(modelQuery.trim().toLowerCase()),
                ) ? (
                  <p className="no-options">No models match that search.</p>
                ) : null}
              </div>
            </>
          ) : null}

          {menu === "skills" ? (
            <div className="option-list">
              {skills.map((skill) => {
                const target = current ? findBuild(current.model, skill) : null;
                const selected = skill === current?.skill;
                return (
                  <button
                    className="option"
                    type="button"
                    key={skill}
                    disabled={!target}
                    aria-current={selected ? "true" : undefined}
                    onClick={() => pickSkill(skill)}
                  >
                    <span className="option-icon">
                      <Icon name={skill === "No skill" ? "off" : "palette"} />
                    </span>
                    <span>
                      {skill === "No skill" ? "Without skill" : `With ${skill}`}
                      {target ? null : <small>No {current?.model} build</small>}
                    </span>
                    {selected ? (
                      <span className="option-end">
                        <Icon name="check" />
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          ) : null}

          {menu === "compare" ? (
            <>
              <h2>Compare with</h2>
              {against ? (
                <button
                  type="button"
                  className="option stop-compare"
                  onClick={() => {
                    onSetAgainst(null);
                    setMenu(null);
                  }}
                >
                  Return to single preview
                </button>
              ) : null}
              <div className="option-list">
                {project.builds
                  .filter((build) => build.entry !== current?.entry)
                  .map((build) => (
                    <button
                      className="option"
                      type="button"
                      key={build.entry}
                      aria-current={build.entry === against?.entry ? "true" : undefined}
                      onClick={() => {
                        onSetAgainst(build);
                        setMenu(null);
                      }}
                    >
                      <ModelMark model={build.model} />
                      <span>
                        {build.model}
                        <small>
                          {build.skill} · Variant {build.variant}
                        </small>
                      </span>
                      {build.entry === against?.entry ? (
                        <span className="option-end">
                          <Icon name="check" />
                        </span>
                      ) : null}
                    </button>
                  ))}
              </div>
            </>
          ) : null}

          {menu === "files" ? (
            <div className="file-details">
              <h2>{project.name}</h2>
              {project.brief ? <p>{project.brief}</p> : null}
              <span className="file-caption">{current ? "Build entry" : "Project manifest"}</span>
              <code>{current?.entry ?? `projects/${project.id}/project.json`}</code>
              <div className="file-actions">
                <button
                  type="button"
                  className="soft-button"
                  onClick={() => {
                    const value = current?.entry ?? `projects/${project.id}/project.json`;
                    navigator.clipboard?.writeText(value);
                    setCopied(true);
                    window.setTimeout(() => setCopied(false), 1500);
                  }}
                >
                  <Icon name="copy" /> Copy path
                </button>
                {current ? (
                  <a className="soft-button" href={current.entry} target="_blank" rel="noopener">
                    <Icon name="external" /> Open build
                  </a>
                ) : null}
              </div>
              <p className="sr-only" role="status">
                {copied ? "Copied" : ""}
              </p>
            </div>
          ) : null}

        </section>
      </aside>

      <main className="stage" id="stage" aria-label={`${project.name} preview`}>
        {!current ? (
          project.experiment ? (
            <section className="empty-preview experiment-preview">
              <h1>{project.name}</h1>
              <p>
                {project.experiment.status === "draft"
                  ? "Draft"
                  : project.experiment.status === "running"
                    ? "Generating"
                    : "No builds ready"}{" "}
                · {project.experiment.presets?.reduce((count, preset) => count + preset.variants, 0) ?? 0}{" "}
                planned builds · {project.experiment.model} via {project.experiment.runner}
              </p>
              <ul className="experiment-presets">
                {project.experiment.presets?.map((preset) => (
                  <li key={preset.id}>
                    <strong>{preset.name}</strong>
                    <span>
                      {preset.variants} build{preset.variants === 1 ? "" : "s"}
                    </span>
                    {preset.focus ? <p>{preset.focus}</p> : null}
                  </li>
                ))}
              </ul>
            </section>
          ) : (
            <div className="empty-preview">
              <h1>{project.name}</h1>
              <p>This project has no builds yet.</p>
            </div>
          )
        ) : (
          panes.map((build) => (
            <div className="preview-pane" key={`${build.entry}-${version}`}>
              <iframe src={`/${build.entry}`} title={buildLabel(build)} />
              {against ? <span className="pane-label">{buildLabel(build)}</span> : null}
            </div>
          ))
        )}
      </main>
    </>
  );
}
