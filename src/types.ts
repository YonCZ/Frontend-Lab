export type Build = {
  model: string;
  skill: string;
  variant: number;
  entry: string;
  build: "static" | "vite";
  special: boolean;
};

export type Preset = {
  id: string;
  name: string;
  variants: number;
  focus?: string;
};

export type Experiment = {
  model?: string;
  runner?: string;
  maxConcurrent?: number;
  basePrompt?: string;
  status?: string;
  presets?: Preset[];
};

export type JobStatus = { status: string };

export type Project = {
  id: string;
  name: string;
  brief: string;
  demo: boolean;
  cover: string | null;
  builds: Build[];
  experiment: Experiment | null;
  runs: Record<string, JobStatus> | null;
  preview: boolean;
  kind: "generator" | "iterator";
  status: "working" | "settled";
};

export type IteratorBuild = {
  model: string;
  skill: string;
  variant: number;
  entry: string;
  url: string;
};

export type IteratorSource = {
  label: string;
  project: string;
  model: string;
  skill: string;
  copy: string;
  url: string;
};

export type IteratorProject = {
  id: string;
  name: string;
  brief: string;
  builds: IteratorBuild[];
  sources: IteratorSource[];
};

export type State = {
  projects: Project[];
  failed: string[];
  promptPath: string;
  prompt: string;
  revision: number;
};
