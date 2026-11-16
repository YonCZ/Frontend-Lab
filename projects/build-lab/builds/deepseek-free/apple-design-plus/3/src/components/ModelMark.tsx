const providers: Array<[RegExp, string]> = [
  [/claude|opus|sonnet|haiku|fable|anthropic/i, "anthropic.webp"],
  [/gpt|openai|codex|sol/i, "openai.svg"],
  [/gemini|google/i, "gemini.webp"],
  [/deepseek/i, "deepseek.svg"],
  [/kimi|moonshot/i, "kimi.webp"],
  [/glm|zhipu/i, "glm.webp"],
  [/grok|xai/i, "xai.svg"],
  [/mistral/i, "mistral.svg"],
  [/meta|llama/i, "meta.svg"],
];

export function ModelMark({ model }: { model: string }) {
  const match = providers.find(([pattern]) => pattern.test(model));
  if (match) {
    return (
      <img
        className="model-mark provider"
        src={`/assets/providers/${match[1]}`}
        alt=""
        aria-hidden="true"
      />
    );
  }
  return (
    <span className="model-mark model-letter" aria-hidden="true">
      {[...model][0]?.toUpperCase() || "?"}
    </span>
  );
}
