export function ModelMark({ model }: { model: string }) {
  if (/claude|opus|sonnet|haiku|fable/i.test(model)) {
    return (
      <svg className="model-mark claude" viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M12 2v20M2 12h20M5 5l14 14M5 19 19 5M8 3l8 18M3 8l18 8M3 16l18-8M8 21l8-18"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  if (/sol|gemini/i.test(model)) return <span className="model-mark spark" aria-hidden="true" />;
  return (
    <span className="model-mark model-letter" aria-hidden="true">
      {[...model][0]?.toUpperCase() || "?"}
    </span>
  );
}
