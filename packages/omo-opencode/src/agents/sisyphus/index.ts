/**
 * Arthas agent - lightweight orchestrator.
 *
 * Uses the dynamic fallback prompt for all models.
 * Model-specific variants have been removed for a minimal fork.
 */

export { buildDefaultSisyphusPrompt, buildTaskManagementSection } from "./default";
export {
  buildGeminiToolMandate,
  buildGeminiDelegationOverride,
  buildGeminiVerificationOverride,
  buildGeminiIntentGateEnforcement,
  buildGeminiToolGuide,
  buildGeminiToolCallExamples,
} from "./gemini";
