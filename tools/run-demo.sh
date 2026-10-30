#!/bin/sh
# The hackathon demo backend: real open-weight AI on this Mac, simulated neighbours (ADR-015).
# Needs Docker Desktop running and Ollama serving the model (see DEMO.md). Ctrl+C to stop.
set -eu
cd "$(dirname "$0")/.."
model="${PLUG_OLLAMA_MODEL:-qwen3:4b}"
url="${PLUG_OLLAMA_URL:-http://127.0.0.1:11434}"
container=plug-phase2-validation

if ! curl -sf -m 3 "$url/api/tags" | grep -q "\"$model\""; then
    echo "Ollama is not serving $model. Open the Ollama app, then run: ollama pull $model" >&2
    exit 1
fi
if ! docker ps --format '{{.Names}}' | grep -qx "$container"; then
    docker run --detach --rm --name "$container" --platform linux/amd64 \
        -v plug-phase2-data:/var/lib/postgresql/data \
        -e POSTGRES_DB=plug_phase2_tests -e POSTGRES_USER=plug -e POSTGRES_PASSWORD=phase2-local-validation-only \
        -p 127.0.0.1:55433:5432 postgis/postgis:16-3.5 >/dev/null
fi
until docker exec "$container" pg_isready -U plug -d plug_phase2_tests >/dev/null 2>&1; do sleep 1; done
docker exec "$container" createdb -U plug plug_phase2_live 2>/dev/null || true

# Load the model now, so the first ask on stage is as fast as the rest.
echo "Warming up $model..."
curl -sf -m 120 "$url/api/chat" -d "{\"model\":\"$model\",\"stream\":false,\"think\":false,\"keep_alive\":\"2h\",\"messages\":[{\"role\":\"user\",\"content\":\"Reply with ok\"}]}" >/dev/null
echo "$model is ready."

export PLUG_DEMO_MODE=true PLUG_OLLAMA_MODEL="$model" PLUG_OLLAMA_URL="$url" PLUG_INTENT_TIMEOUT="${PLUG_INTENT_TIMEOUT:-15s}"
exec sh tools/run-phase2-local.sh
