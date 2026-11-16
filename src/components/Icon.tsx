const icons: Record<string, string> = {
  home: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Z"/><path d="M9 21v-7h6v7"/>',
  folder:
    '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4 4"/>',
  palette:
    '<path d="M12 3a9 9 0 1 0 0 18h1.5a2 2 0 0 0 1.6-3.2 1.5 1.5 0 0 1 1.2-2.4h1.2c2.1 0 3.5-1.6 3.5-3.7C21 6.9 17 3 12 3Z"/><path d="M7.5 12h.01M9.5 8h.01M14 7.5h.01M17 10.5h.01" stroke-width="2.7"/>',
  off: '<path d="M12 3a9 9 0 1 0 0 18h1.5a2 2 0 0 0 1.6-3.2 1.5 1.5 0 0 1 1.2-2.4h1.2c2.1 0 3.5-1.6 3.5-3.7C21 6.9 17 3 12 3ZM3 21 21 3"/><path d="M7.5 12h.01M9.5 8h.01M14 7.5h.01M17 10.5h.01" stroke-width="2.5"/>',
  panel: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  arrow: '<path d="M5 12h14m-5-5 5 5-5 5"/>',
  external:
    '<path d="M13 5h6v6m0-6-9 9m0-8H6a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4"/>',
  close: '<path d="m6 6 12 12M18 6 6 18"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',
  chevron: '<path d="m6 9 6 6 6-6"/>',
  expand: '<path d="M9 4H4v5M15 4h5v5M20 15v5h-5M4 15v5h5"/>',
  shrink: '<path d="M4 9h5V4M20 9h-5V4M15 20v-5h5M9 20v-5H4"/>',
  pin: '<path d="M9 4h6l-.8 4.8L17 11v2H7v-2l2.8-2.2L9 4Z"/><path d="M12 13v7"/>',
  loader: '<path d="M20 12a8 8 0 1 1-2.34-5.66"/><path d="M20 4v5h-5"/>',
  "arrow-up": '<path d="M12 19V5m-5 5 5-5 5 5"/>',
};

export function Icon({ name, className = "icon" }: { name: keyof typeof icons | string; className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.65}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: icons[name] ?? "" }}
    />
  );
}
