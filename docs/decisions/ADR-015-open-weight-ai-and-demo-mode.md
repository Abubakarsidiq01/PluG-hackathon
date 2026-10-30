# ADR-015: Open-weight AI on the device, and a labelled demo mode

Status: accepted, 2026-10-30

## Context

The hackathon requires open-source or open-weight AI as an important part of the project, and PLUG's only model was Claude. Real providers and nearby people arrive in Phases 3 and 4, so a live demo of Phase 2 ended every ask at an honest Unknown.

## Decision

1. **Open-weight model.** `OllamaIntentProvider` reads each ask with a model served by Ollama on the same machine. It uses the same instructions and output shape as the Claude provider, and `IntentAdapter` validates its output the same way. The default is `qwen3:4b`. The client refuses any address that is not loopback. When `PLUG_OLLAMA_MODEL` is set it takes priority over Claude.
2. **Demo mode.** `PLUG_DEMO_MODE=true` adds a simulated neighbourhood: three sample providers for each service ask, and three simulated neighbours for each place question. The open-weight model writes the neighbours' reports and the summary, with fixed wording if it is unavailable. The server refuses to start in demo mode outside a local environment.
3. **The iOS demo layer.** `PLUG_DEMO_MODE=YES` in a Debug build adds the reading screen, the understood card, the radar and the result burst. Release builds cannot turn it on.

## What stays true

- The restricted-intent policy still runs first, so a refused ask stays refused.
- Every demo answer shows "Live demo: AI is real, neighbours are simulated".
- Offers in demo mode stay Estimated. Place answers show Confirmed to demonstrate the designed state, and the notice above says the people behind them are simulated.
- With both flags off, the product behaves exactly as Phase 2 does.
