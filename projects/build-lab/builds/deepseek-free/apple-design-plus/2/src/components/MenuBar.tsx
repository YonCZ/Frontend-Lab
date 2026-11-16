import { useEffect, useMemo, useRef, useState } from "react";
import type { Build, Project } from "../types";
import { Icon } from "./Icon";
import { ModelMark } from "./ModelMark";

type Panel = "builds" | "compare" | "files" | null;

const panelNames: Record<Exclude<Panel, null>, string> = {
  builds: "Builds",
  compare: "Compare",
  files: "Build files",
};

function labelFor(build: Build) {
  return `${build.model} / ${build.skill} / Variant ${build.variant}`;
}

export function MenuBar({
  project,
  current,
  against,
  onBack,
  onSelect,
  onSetAgainst,
  immersive,
  onToggleImmersive,
}: {
  project: Project;
  current: Build | null;
  against: Build | null;
  onBack: () => void;
  onSelect: (build: Build) => void;
  onSetAgainst: (build: Build | null) => void;
  immersive: boolean;
  onToggleImmersive: () => void;
}) {
  const [panel, setPanel] = useState<Panel>(null);
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const currentTile = useRef<HTMLButtonElement>(null);
  const copiedTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const shortcut = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey) && !event.altKey) {
        event.preventDefault();
        setPanel((open) => (open === "builds" ? null : "builds"));
      }
    };
    window.addEventListener("keydown", shortcut);
    return () => window.removeEventListener("keydown", shortcut);
  }, []);

  useEffect(() => {
    if (!panel) return;
    const outside = (event: PointerEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".bar") && !target.closest(".menu")) setPanel(null);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.stopPropagation();
      setPanel(null);
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape, true);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape, true);
    };
  }, [panel]);

  useEffect(() => {
    if (panel !== "builds") return;
    searchRef.current?.focus();
    window.requestAnimationFrame(() => currentTile.current?.scrollIntoView({ block: "nearest" }));
  }, [panel]);

  useEffect(() => () => window.clearTimeout(copiedTimer.current), []);

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

  const variants = useMemo(() => {
    if (!current) return [];
    return project.builds
      .filter((build) => build.model === current.model && build.skill === current.skill)
      .sort((a, b) => a.variant - b.variant);
  }, [project.builds, current]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return groups;
    return groups
      .map((group) => ({
        ...group,
        builds: group.builds.filter((build) =>
          `${group.model} ${group.skill} variant ${build.variant} ${build.entry}`
            .toLowerCase()
            .includes(needle),
        ),
      }))
      .filter((group) => group.builds.length > 0);
  }, [groups, query]);

  const toggle = (next: Exclude<Panel, null>) => setPanel((open) => (open === next ? null : next));

  const pick = (build: Build) => {
    onSelect(build);
    setPanel(null);
  };

  const copyPath = () => {
    const value = current?.entry ?? `projects/${project.id}/project.json`;
    navigator.clipboard?.writeText(value);
    setCopied(true);
    window.clearTimeout(copiedTimer.current);
    copiedTimer.current = window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <>
      <header className="bar">
        <button
          type="button"
          className="brand"
          onClick={onBack}
          aria-label="Back to all projects"
          title="All projects"
        >
          <span className="brand-glyph mono" aria-hidden="true">
            FL
          </span>
          <span className="brand-word">Frontend Lab</span>
        </button>
        <span className="bar-divider" aria-hidden="true" />
        <span className="bar-crumb">{project.name}</span>
        <span className="bar-count mono" aria-label={`${project.builds.length} builds`}>
          {project.builds.length}
        </span>

        <div className="bar-actions">
          <button
            type="button"
            className="bar-control build-trigger"
            aria-expanded={panel === "builds"}
            aria-controls="bar-menu"
            onClick={() => toggle("builds")}
            title="Choose model, skill and variant"
          >
            {current ? <ModelMark model={current.model} /> : null}
            <span className="build-trigger-text">
              <span className="build-trigger-model">{current?.model ?? "No build"}</span>
              <span className="build-trigger-meta mono">
                {current ? `${current.skill} · V${current.variant}` : "—"}
              </span>
            </span>
            <Icon name="chevron" className="icon chevron" />
          </button>

          {variants.length > 1 ? (
            <div className="variant-seg" role="group" aria-label="Variants for this build group">
              {variants.map((build) => (
                <button
                  type="button"
                  className="seg mono"
                  key={build.entry}
                  aria-current={build.entry === current?.entry ? "true" : undefined}
                  aria-label={`Variant ${build.variant}`}
                  title={labelFor(build)}
                  onClick={() => onSelect(build)}
                >
                  {build.variant}
                </button>
              ))}
            </div>
          ) : null}

          <button
            type="button"
            className="bar-control compare-trigger"
            data-active={against ? "true" : undefined}
            aria-expanded={panel === "compare"}
            aria-controls="bar-menu"
            onClick={() => toggle("compare")}
            title={against ? `Comparing with ${labelFor(against)}` : "Pin a second build to compare"}
          >
            <span className="vs mono" aria-hidden="true">
              VS
            </span>
            <span className="compare-word">{against ? "Comparing" : "Compare"}</span>
          </button>

          <button
            type="button"
            className="bar-icon"
            aria-label={immersive ? "Exit full window" : "Full window"}
            aria-pressed={immersive}
            title={immersive ? "Exit full window (Esc)" : "Full window"}
            onClick={onToggleImmersive}
          >
            <Icon name={immersive ? "shrink" : "expand"} />
          </button>
          <button
            type="button"
            className="bar-icon"
            aria-label="Build files"
            aria-expanded={panel === "files"}
            aria-controls="bar-menu"
            title="Build files"
            onClick={() => toggle("files")}
          >
            <Icon name="panel" />
          </button>
        </div>
      </header>

      {panel ? (
        <section className="menu" id="bar-menu" aria-label={panelNames[panel]}>
          {panel === "builds" ? (
            <>
              <div className="menu-head">
                <h2>Builds</h2>
                <span className="mono menu-count">
                  {project.builds.length} total · {filtered.reduce((sum, group) => sum + group.builds.length, 0)} shown
                </span>
              </div>
              <label className="menu-search">
                <Icon name="search" />
                <input
                  ref={searchRef}
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Filter model, skill or variant"
                  aria-label="Filter builds"
                />
                <kbd aria-hidden="true">⌘K</kbd>
              </label>
              <div className="menu-scroll">
                {filtered.map((group) => {
                  const selectedHere = current?.model === group.model && current?.skill === group.skill;
                  return (
                    <section className="build-group" key={group.key}>
                      <div className="build-group-head">
                        <ModelMark model={group.model} />
                        <span className="build-group-model">{group.model}</span>
                        <span className="build-group-skill mono">
                          {group.skill === "No skill" ? "No skill" : group.skill}
                        </span>
                      </div>
                      <div className="variant-grid">
                        {group.builds.map((build) => (
                          <button
                            type="button"
                            ref={selectedHere && build.entry === current?.entry ? currentTile : undefined}
                            className="variant-tile"
                            key={build.entry}
                            aria-current={build.entry === current?.entry ? "true" : undefined}
                            data-pinned={build.entry === against?.entry ? "true" : undefined}
                            title={labelFor(build)}
                            onClick={() => pick(build)}
                          >
                            <span className="mono tile-number">
                              {String(build.variant).padStart(2, "0")}
                            </span>
                            <span className="tile-meta">
                              {build.entry === against?.entry
                                ? "pinned"
                                : build.entry === current?.entry
                                  ? "open"
                                  : "build"}
                            </span>
                          </button>
                        ))}
                      </div>
                    </section>
                  );
                })}
                {!filtered.length ? <p className="menu-empty">No builds match that filter.</p> : null}
              </div>
            </>
          ) : null}

          {panel === "compare" ? (
            <>
              <div className="menu-head">
                <h2>Compare</h2>
                <span className="mono menu-count">{against ? "2 panes" : "1 pane"}</span>
              </div>
              <p className="menu-note">
                Pin a build beside the open one. The pin stays while you switch builds.
              </p>
              {against ? (
                <button
                  type="button"
                  className="menu-action"
                  onClick={() => {
                    onSetAgainst(null);
                    setPanel(null);
                  }}
                >
                  <Icon name="close" /> Return to single preview
                </button>
              ) : null}
              <div className="menu-scroll menu-list">
                {project.builds
                  .filter((build) => build.entry !== current?.entry)
                  .map((build) => (
                    <button
                      type="button"
                      className="build-row"
                      key={build.entry}
                      aria-current={build.entry === against?.entry ? "true" : undefined}
                      onClick={() => {
                        onSetAgainst(build);
                        setPanel(null);
                      }}
                    >
                      <ModelMark model={build.model} />
                      <span className="build-row-text">
                        <strong>{build.model}</strong>
                        <small className="mono">
                          {build.skill} · V{build.variant}
                        </small>
                      </span>
                      <span className="build-row-end">
                        {build.entry === against?.entry ? <Icon name="check" /> : <Icon name="pin" />}
                      </span>
                    </button>
                  ))}
              </div>
            </>
          ) : null}

          {panel === "files" ? (
            <>
              <div className="menu-head">
                <h2>{project.name}</h2>
                <span className="mono menu-count">{current ? `V${current.variant}` : "manifest"}</span>
              </div>
              {project.brief ? <p className="file-brief">{project.brief}</p> : null}
              <span className="file-caption mono">{current ? "Build entry" : "Project manifest"}</span>
              <code>{current?.entry ?? `projects/${project.id}/project.json`}</code>
              <div className="file-actions">
                <button type="button" className="menu-action" onClick={copyPath}>
                  <Icon name={copied ? "check" : "copy"} /> {copied ? "Copied" : "Copy path"}
                </button>
                {current ? (
                  <a className="menu-action" href={`/${current.entry}`} target="_blank" rel="noopener">
                    <Icon name="external" /> Open build
                  </a>
                ) : null}
              </div>
              <p className="sr-only" role="status">
                {copied ? "Copied" : ""}
              </p>
            </>
          ) : null}
        </section>
      ) : null}
    </>
  );
}
