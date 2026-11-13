export type Build = {
  model: string;
  skill: string;
  variant: number;
  entry: string;
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
};

export type State = {
  projects: Project[];
  failed: string[];
  promptPath: string;
  prompt: string;
  revision: number;
};
