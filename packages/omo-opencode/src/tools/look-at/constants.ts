import { normalizeAgentForPrompt } from "../../shared/agent-display-names"

export const MULTIMODAL_LOOKER_AGENT = "multimodal-looker" as const

export const MULTIMODAL_LOOKER_RUNTIME_AGENT =
  normalizeAgentForPrompt(MULTIMODAL_LOOKER_AGENT) ?? MULTIMODAL_LOOKER_AGENT

export const LOOK_AT_DESCRIPTION = `Extract basic information from media files (PDFs, images, diagrams) when a quick summary suffices over precise reading. Good for simple text-based content extraction without using the Read tool. NEVER use for visual precision, aesthetic evaluation, or exact accuracy - use Read tool instead for those cases.`
