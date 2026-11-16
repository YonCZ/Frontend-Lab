import { useEffect, useRef } from "react";
import { Icon } from "./Icon";

export function ProjectFilesDialog({
  open,
  onClose,
  promptPath,
}: {
  open: boolean;
  onClose: () => void;
  promptPath: string;
}) {
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const node = dialog.current;
    if (!node) return;
    if (open && !node.open) node.showModal();
    if (!open && node.open) node.close();
  }, [open]);

  return (
    <dialog
      id="workspace-dialog"
      ref={dialog}
      aria-labelledby="workspace-title"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="dialog-header">
        <h2 id="workspace-title">Add a project</h2>
        <button type="button" className="icon-button" aria-label="Close" onClick={onClose}>
          <Icon name="close" />
        </button>
      </div>
      <p>
        Put each runnable build in its own folder under <code>projects/</code>. Add its entry file,
        model, skill, variant and build type to that project's <code>project.json</code>.
      </p>
      <p>
        For a new project, add its folder name to <code>projects/catalog.json</code> and reload the
        gallery. The shared prompt at <code>{promptPath}</code> is composed with each project's brief
        before a build runs.
      </p>
      <a className="button" href="/README.md" target="_blank" rel="noopener">
        Open workspace instructions <Icon name="external" />
      </a>
    </dialog>
  );
}
