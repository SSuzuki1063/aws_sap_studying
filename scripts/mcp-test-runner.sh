#!/usr/bin/env bash
# mcp-test-runner.sh — convenience wrapper for Playwright E2E tests
#
# Usage:
#   bash scripts/mcp-test-runner.sh                        # run all tests (chromium)
#   bash scripts/mcp-test-runner.sh navigation             # run one spec by name fragment
#   bash scripts/mcp-test-runner.sh --grep "aria-expanded" # grep filter
#   bash scripts/mcp-test-runner.sh --update-snapshots     # regenerate DOM snapshots
#
# The script starts python3 server.py if it is not already listening on :8080,
# and registers an EXIT trap to kill it on exit.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

# ── WSL2/local: ensure Chromium shared libraries are findable ─────────────────
# On WSL2 Ubuntu, Playwright's Chromium needs NSS/NSPR libs which may need to
# be extracted from .deb packages. Auto-extract if the libs dir exists.
PW_LIBS_DIR="/tmp/pw-extract/usr/lib/x86_64-linux-gnu"
if [ -d "$PW_LIBS_DIR" ]; then
  export LD_LIBRARY_PATH="${PW_LIBS_DIR}:${LD_LIBRARY_PATH:-}"
elif ! ldconfig -p 2>/dev/null | grep -q libnspr4; then
  echo "[mcp-test-runner] INFO: libnspr4 not found. Run: npx playwright install chromium --with-deps" >&2
fi

SERVER_PID=""

# ── server management ─────────────────────────────────────────────────────────

is_server_running() {
  curl -sf http://localhost:8080/ -o /dev/null 2>&1
}

start_server() {
  echo "[mcp-test-runner] Starting python3 server.py ..."
  python3 server.py &
  SERVER_PID=$!
  # Wait up to 10 s for the server to respond
  local i=0
  while ! is_server_running; do
    sleep 0.5
    i=$((i + 1))
    if [ $i -ge 20 ]; then
      echo "[mcp-test-runner] ERROR: server did not start within 10 s" >&2
      exit 1
    fi
  done
  echo "[mcp-test-runner] Server ready at http://localhost:8080/"
}

cleanup() {
  if [ -n "$SERVER_PID" ]; then
    echo "[mcp-test-runner] Stopping server (PID $SERVER_PID) ..."
    kill "$SERVER_PID" 2>/dev/null || true
  fi
}
trap cleanup EXIT

# ── parse arguments ───────────────────────────────────────────────────────────

SPEC_FILTER=""
EXTRA_ARGS=()

for arg in "$@"; do
  case "$arg" in
    --grep=*|--grep|-g)
      EXTRA_ARGS+=("$arg")
      ;;
    --update-snapshots|-u)
      EXTRA_ARGS+=("--update-snapshots")
      ;;
    --headed)
      EXTRA_ARGS+=("--headed")
      ;;
    -*)
      EXTRA_ARGS+=("$arg")
      ;;
    *)
      # Treat as spec filename fragment
      SPEC_FILTER="$arg"
      ;;
  esac
done

# ── ensure server is running ──────────────────────────────────────────────────

if ! is_server_running; then
  start_server
else
  echo "[mcp-test-runner] Server already running at http://localhost:8080/"
fi

# ── run Playwright ────────────────────────────────────────────────────────────

PLAYWRIGHT_CMD=(npx playwright test --project=chromium)

if [ -n "$SPEC_FILTER" ]; then
  PLAYWRIGHT_CMD+=("tests/e2e/concept-map/${SPEC_FILTER}.spec.ts")
fi

if [ ${#EXTRA_ARGS[@]} -gt 0 ]; then
  PLAYWRIGHT_CMD+=("${EXTRA_ARGS[@]}")
fi

echo "[mcp-test-runner] Running: ${PLAYWRIGHT_CMD[*]}"
"${PLAYWRIGHT_CMD[@]}"
