import { Icon } from "./Icon";

export function AppBar({
  crumb,
  count,
  hasPreview,
  current = "projects",
  onProjectFiles,
}: {
  crumb: string;
  count?: number;
  hasPreview: boolean;
  current?: "projects" | "iterators";
  onProjectFiles: () => void;
}) {
  return (
    <header className="bar">
      <a className="brand" href="/" title="All projects">
        <span className="brand-glyph mono" aria-hidden="true">
          FL
        </span>
        <span className="brand-word">Frontend Lab</span>
      </a>
      <span className="bar-divider" aria-hidden="true" />
      <span className="bar-crumb">{crumb}</span>
      {count === undefined ? null : <span className="bar-count mono">{count}</span>}
      <div className="bar-actions">
        <a
          className="bar-link"
          href="/iterators"
          title="Iterator workspaces"
          aria-current={current === "iterators" ? "page" : undefined}
        >
          <Icon name="loader" className="icon spin" /> Iterator
        </a>
        {hasPreview ? (
          <a className="bar-link" href="/previews" title="Client preview">
            <Icon name="external" /> Client preview
          </a>
        ) : null}
        <button type="button" className="bar-link" onClick={onProjectFiles}>
          <Icon name="folder" /> Project files
        </button>
      </div>
    </header>
  );
}
