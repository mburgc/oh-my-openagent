/// <reference types="bun-types" />

import { describe, expect, test } from "bun:test"
import { KIMI_TOOL_LOOP_GUARD } from "./kimi-tool-loop-guard"
import { buildKimiK26SisyphusJuniorPrompt } from "./sisyphus-junior/kimi-k2-6"

describe("Kimi tool-call loop guardrails", () => {
  test("#given Kimi Sisyphus-Junior prompt #when built #then the shared tool-loop guard artifact is embedded", () => {
    const prompt = buildKimiK26SisyphusJuniorPrompt(false)

    expect(prompt).toContain(KIMI_TOOL_LOOP_GUARD)
  })
})
