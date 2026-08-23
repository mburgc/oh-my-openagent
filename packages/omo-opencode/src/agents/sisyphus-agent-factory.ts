import type { AgentConfig } from "@opencode-ai/sdk";
import { categorizeTools } from "./dynamic-agent-prompt-builder";
import type {
  AvailableAgent,
  AvailableCategory,
  AvailableSkill,
} from "./dynamic-agent-prompt-builder";
import {
  buildClaudeSisyphusAgentConfig,
  buildGlmSisyphusAgentConfig,
  buildGptSisyphusAgentConfig,
} from "./sisyphus-agent-config";
import { buildFallbackSisyphusPrompt } from "./sisyphus-dynamic-prompt";
import type { AgentMode } from "./types";
import { isGlmModel, isGptModel } from "./types";

const MODE: AgentMode = "primary";

/**
 * Lightweight Arthas prompt — always uses the dynamic fallback prompt.
 * Model-specific variants (gpt-5-4, gpt-5-5, claude-opus-4-7, etc.) have been
 * removed for a minimal fork. All models get the unified dynamic prompt.
 */
export function createSisyphusAgent(
  model: string,
  availableAgents?: AvailableAgent[],
  availableToolNames?: string[],
  availableSkills?: AvailableSkill[],
  availableCategories?: AvailableCategory[],
  useTaskSystem = false,
): AgentConfig {
  const tools = availableToolNames ? categorizeTools(availableToolNames) : [];
  const skills = availableSkills ?? [];
  const categories = availableCategories ?? [];
  const agents = availableAgents ?? [];

  const prompt = buildFallbackSisyphusPrompt(
    model,
    agents,
    tools,
    skills,
    categories,
    useTaskSystem,
  );

  return isGptModel(model)
    ? buildGptSisyphusAgentConfig(MODE, model, prompt)
    : buildClaudeSisyphusAgentConfig(MODE, model, prompt);
}
createSisyphusAgent.mode = MODE;
