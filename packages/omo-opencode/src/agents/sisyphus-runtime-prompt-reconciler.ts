/**
 * Context captured at Arthas registration so the per-request system-transform
 * hook can rebuild the prompt for the model actually selected at runtime.
 *
 * - `bakedPrompt` is the exact prompt string registered (body + overrides + env),
 *   used to locate the entry to replace in the runtime system array.
 * - `rebuildPromptForModel` re-runs the same registration pipeline with a
 *   different model, so overrides / prompt_append / env context are preserved.
 */
export type SisyphusRuntimePromptContext = {
  configuredModel: string;
  bakedPrompt: string;
  rebuildPromptForModel: (runtimeModel: string) => string;
};

let context: SisyphusRuntimePromptContext | undefined;

export function setSisyphusRuntimePromptContext(ctx: SisyphusRuntimePromptContext): void {
  context = ctx;
}

export function clearSisyphusRuntimePromptContext(): void {
  context = undefined;
}

/**
 * Lightweight fork: always uses the unified dynamic prompt for all models.
 * No prompt-family reconciliation needed — the baked body is always correct.
 */
export function reconcileSisyphusRuntimePrompt(
  _system: string[],
  _runtimeModel: string | undefined,
): boolean {
  return false;
}
