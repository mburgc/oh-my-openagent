import { describe, it, expect } from "bun:test"
import { AGENT_DISPLAY_NAMES, getAgentConfigKey, getAgentDisplayName, getAgentListDisplayName, normalizeAgentForPrompt, normalizeAgentForPromptKey, stripAgentListSortPrefix } from "./agent-display-names"

describe("getAgentDisplayName", () => {
  it("returns display name for lowercase config key (new format)", () => {
    // given config key "sisyphus"
    const configKey = "sisyphus"

    // when getAgentDisplayName called
    const result = getAgentDisplayName(configKey)

    // then returns "Arthas - ultraworker"
    expect(result).toBe("Arthas - ultraworker")
  })

  it("returns display name for uppercase config key (old format - case-insensitive)", () => {
    // given config key "Sisyphus" (old format)
    const configKey = "Sisyphus"

    // when getAgentDisplayName called
    const result = getAgentDisplayName(configKey)

    // then returns "Arthas - ultraworker" (case-insensitive lookup)
    expect(result).toBe("Arthas - ultraworker")
  })

  it("returns original key for unknown agents (fallback)", () => {
    // given config key "custom-agent"
    const configKey = "custom-agent"

    // when getAgentDisplayName called
    const result = getAgentDisplayName(configKey)

    // then returns "custom-agent" (original key unchanged)
    expect(result).toBe("custom-agent")
  })

  it("returns display name for atlas", () => {
    // given config key "atlas"
    const configKey = "atlas"

    // when getAgentDisplayName called
    const result = getAgentDisplayName(configKey)

     // then returns "Saurfang - Plan Executor"
    expect(result).toBe("Saurfang - Plan Executor")
  })

  it("returns display name for prometheus", () => {
    // given config key "prometheus"
    const configKey = "prometheus"

    // when getAgentDisplayName called
    const result = getAgentDisplayName(configKey)

    // then returns "Khadgar - Plan Builder"
    expect(result).toBe("Khadgar - Plan Builder")
  })

  it("returns display name for sisyphus-junior", () => {
    // given config key "sisyphus-junior"
    const configKey = "sisyphus-junior"

    // when getAgentDisplayName called
    const result = getAgentDisplayName(configKey)

    // then returns "Anduin"
    expect(result).toBe("Anduin")
  })

  it("returns display name for metis", () => {
    // given config key "metis"
    const configKey = "metis"

    // when getAgentDisplayName called
    const result = getAgentDisplayName(configKey)

    // then returns "Jaina - Plan Consultant"
    expect(result).toBe("Jaina - Plan Consultant")
  })

  it("returns display name for momus", () => {
    // given config key "momus"
    const configKey = "momus"

    // when getAgentDisplayName called
    const result = getAgentDisplayName(configKey)

     // then returns "Gallywix - Plan Critic"
    expect(result).toBe("Gallywix - Plan Critic")
  })

  it("returns display name for oracle", () => {
    // given config key "oracle"
    const configKey = "oracle"

    // when getAgentDisplayName called
    const result = getAgentDisplayName(configKey)

    // then returns "Medivh"
    expect(result).toBe("Medivh")
  })

  it("returns display name for librarian", () => {
    // given config key "librarian"
    const configKey = "librarian"

    // when getAgentDisplayName called
    const result = getAgentDisplayName(configKey)

    // then returns "Chromie"
    expect(result).toBe("Chromie")
  })

  it("returns display name for explore", () => {
    // given config key "explore"
    const configKey = "explore"

    // when getAgentDisplayName called
    const result = getAgentDisplayName(configKey)

    // then returns "Brann"
    expect(result).toBe("Brann")
  })

  it("returns display name for multimodal-looker", () => {
    // given config key "multimodal-looker"
    const configKey = "multimodal-looker"

    // when getAgentDisplayName called
    const result = getAgentDisplayName(configKey)

    // then returns "Alleria"
    expect(result).toBe("Alleria")
  })

  it("preserves CJK display-name overrides verbatim", () => {
    expect(getAgentDisplayName("sisyphus", { sisyphus: { displayName: "Arthas - 主脑" } })).toBe("Arthas - 主脑")
    expect(getAgentDisplayName("hephaestus", { hephaestus: { displayName: "일리단" } })).toBe("일리단")
    expect(getAgentDisplayName("atlas", { atlas: { displayName: "사울팽" } })).toBe("사울팽")
  })
})

describe("getAgentConfigKey", () => {
  it("resolves display name to config key", () => {
    // given display name "Arthas - ultraworker"
    // when getAgentConfigKey called
    // then returns "sisyphus"
    expect(getAgentConfigKey("Arthas - ultraworker")).toBe("sisyphus")
  })

  it("resolves display name case-insensitively", () => {
    // given display name in different case
    // when getAgentConfigKey called
    // then returns "atlas"
    expect(getAgentConfigKey("saurfang - plan executor")).toBe("atlas")
  })

  it("resolves legacy parenthesized display names", () => {
    // given legacy parenthesized display name from old configs/sessions
    // when getAgentConfigKey called
    // then resolves to canonical config key
    expect(getAgentConfigKey("Sisyphus (Ultraworker)")).toBe("sisyphus")
    expect(getAgentConfigKey("Atlas (Plan Executor)")).toBe("atlas")
  })

  it("passes through lowercase config keys unchanged", () => {
    // given lowercase config key "prometheus"
    // when getAgentConfigKey called
    // then returns "prometheus"
    expect(getAgentConfigKey("prometheus")).toBe("prometheus")
  })

  it("returns lowercased unknown agents", () => {
    // given unknown agent name
    // when getAgentConfigKey called
    // then returns lowercased
    expect(getAgentConfigKey("Custom-Agent")).toBe("custom-agent")
  })

  it("resolves all core agent display names", () => {
    // given all core display names
    // when/then each resolves to its config key
    expect(getAgentConfigKey("Illidan - Deep Agent")).toBe("hephaestus")
    expect(getAgentConfigKey("Khadgar - Plan Builder")).toBe("prometheus")
    expect(getAgentConfigKey("Saurfang - Plan Executor")).toBe("atlas")
    expect(getAgentConfigKey("Jaina - Plan Consultant")).toBe("metis")
    expect(getAgentConfigKey("Gallywix - Plan Critic")).toBe("momus")
    expect(getAgentConfigKey("Anduin")).toBe("sisyphus-junior")
  })

  it("resolves atlas even when the UI ordering prefix is present", () => {
    expect(getAgentConfigKey(getAgentListDisplayName("atlas"))).toBe("atlas")
  })

  it("resolves display names even when zero-width characters are embedded", () => {
    expect(getAgentConfigKey("Arthas\u200B - ultraworker")).toBe("sisyphus")
    expect(getAgentConfigKey("\uFEFFSaurfang - Plan Executor")).toBe("atlas")
  })
})

describe("getAgentListDisplayName", () => {
  it("returns the canonical display name for the core agent list", () => {
    expect(getAgentListDisplayName("sisyphus")).toBe("Arthas - ultraworker")
    expect(getAgentListDisplayName("hephaestus")).toBe("Illidan - Deep Agent")
    expect(getAgentListDisplayName("prometheus")).toBe("Khadgar - Plan Builder")
    expect(getAgentListDisplayName("atlas")).toBe("Saurfang - Plan Executor")
  })

  it("keeps non-core agents unchanged for list display", () => {
    expect(getAgentListDisplayName("oracle")).toBe("Medivh")
  })

  it("is a thin alias for getAgentDisplayName", () => {
    expect(getAgentListDisplayName("sisyphus")).toBe(getAgentDisplayName("sisyphus"))
  })
})

describe("stripAgentListSortPrefix", () => {
  it("strips legacy zero-width sort prefixes baked into v3.14.0–v3.16.0 sessions", () => {
    expect(stripAgentListSortPrefix("\u200B\u200BIllidan - Deep Agent")).toBe("Illidan - Deep Agent")
  })

  it("strips leading and trailing wrapper characters after sort prefix removal", () => {
    expect(stripAgentListSortPrefix("\\Illidan - Deep Agent\\")).toBe("Illidan - Deep Agent")
  })
})

describe("normalizeAgentForPrompt", () => {
  it("strips core UI ordering prefixes back to canonical display names", () => {
    expect(normalizeAgentForPrompt(getAgentListDisplayName("sisyphus"))).toBe("Arthas - ultraworker")
    expect(normalizeAgentForPrompt(getAgentListDisplayName("hephaestus"))).toBe("Illidan - Deep Agent")
    expect(normalizeAgentForPrompt(getAgentListDisplayName("prometheus"))).toBe("Khadgar - Plan Builder")
    expect(normalizeAgentForPrompt(getAgentListDisplayName("atlas"))).toBe("Saurfang - Plan Executor")
  })

  it("removes zero-width characters before returning canonical names", () => {
    expect(normalizeAgentForPrompt("Arthas\u200B - Ultraworker")).toBe("Arthas - ultraworker")
  })

  it("converts legacy parenthesized names to canonical display names", () => {
    expect(normalizeAgentForPrompt("Saurfang (Plan Executor)")).toBe("Saurfang - Plan Executor")
  })
})

describe("normalizeAgentForPromptKey", () => {
  it("converts built-in display names to config keys", () => {
    expect(normalizeAgentForPromptKey("Arthas (Ultraworker)")).toBe("sisyphus")
  })

  it("strips UI ordering prefixes before returning config keys", () => {
    expect(normalizeAgentForPromptKey(getAgentListDisplayName("atlas"))).toBe("atlas")
  })

  it("preserves custom agents", () => {
    expect(normalizeAgentForPromptKey("MyCustomAgent")).toBe("MyCustomAgent")
  })
})

describe("AGENT_DISPLAY_NAMES", () => {
  it("contains all expected agent mappings", () => {
    // given expected mappings
    const expectedMappings = {
      sisyphus: "Arthas - ultraworker",
      hephaestus: "Illidan - Deep Agent",
      prometheus: "Khadgar - Plan Builder",
      atlas: "Saurfang - Plan Executor",
      "sisyphus-junior": "Anduin",
      metis: "Jaina - Plan Consultant",
      momus: "Gallywix - Plan Critic",
      athena: "KirinTor - Council",
      "athena-junior": "Kael - Council",
      oracle: "Medivh",
      librarian: "Chromie",
      explore: "Brann",
      "multimodal-looker": "Alleria",
      "council-member": "Rhonin",
    }

    // when checking the constant
    // then contains all expected mappings
    expect(AGENT_DISPLAY_NAMES).toEqual(expectedMappings)
  })

  it("all display names must be HTTP-header-safe (no parentheses)", () => {
    // given all agent display names
    const httpHeaderUnsafe = /[()]/

    // when checking each display name
    for (const [, displayName] of Object.entries(AGENT_DISPLAY_NAMES)) {
      // then none should contain parentheses
      expect(httpHeaderUnsafe.test(displayName)).toBe(false)
    }
  })
})
