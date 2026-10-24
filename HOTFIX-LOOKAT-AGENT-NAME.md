# RESUELTO: look_at "Agent not found" (fix de raíz)

## Síntoma original

`look_at` fallaba con `Agent not found: "multimodal-looker"`, esperaba 120s a una
sesión hija que nunca arrancaba y terminaba con `Unexpected error ... {}`.
`task(subagent_type="Alleria")` sí funcionaba.

## Causa raíz

`remapAgentKeysToDisplayNames()` registra cada agente SOLO bajo su display name
(`multimodal-looker` -> `Alleria`), a propósito, para evitar filas duplicadas en
la UI. El tool `look_at` spawneaba la sesión hija con la config key cruda, que a
ese punto ya no existe.

Segundo fallo, silencioso: `resolveRegisteredAgentMetadata()` comparaba
`agent.name` contra la misma key cruda, así que nunca encontraba al agente y caía
a resolución dinámica de modelo (funcionaba por casualidad, ignorando el modelo y
variant configurados).

## Fix aplicado (source, sobrevive a los rebuilds)

- `packages/omo-opencode/src/tools/look-at/constants.ts`
  agrega `MULTIMODAL_LOOKER_RUNTIME_AGENT`, resuelto con
  `normalizeAgentForPrompt(MULTIMODAL_LOOKER_AGENT)` (misma tabla que usa el
  remapper). La config key cruda se mantiene para config y elegibilidad.
- `look-at-session-runner.ts` usa el nombre resuelto en `agent:`.
- `multimodal-agent-metadata.ts` compara contra el nombre resuelto.
- Tests: los mocks de `app.agents()` ahora usan `Alleria` y se agregó una
  aserción de que el prompt sale con `agent: "Alleria"`.

## Por qué ya no hay que parchear dist a mano

`dist/index.js` se regenera desde source. El parche manual anterior se perdió en
el rebuild del 8 de septiembre; este fix no se pierde.

## Verificación

```bash
bun test packages/omo-opencode/src/tools/look-at
# 123 pass
```

En el log (`oh-my-opencode.log`), tras un `look_at` real:

```
[look_at] Created session: ...
[look_at] Sending prompt with N file(s) ...
[look_at] Got response, length: N
```

Sin `Agent not found`.

## Caveat

Si se define un `displayName` custom para `multimodal-looker` en la config, el
nombre resuelto estático no lo verá y habría que pasar los overrides del plugin a
la resolución del nombre.
