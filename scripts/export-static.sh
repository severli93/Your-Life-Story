#!/usr/bin/env bash
# Static export for moonland.cc/lifestory.
# The /api/chat route handler is incompatible with `output: 'export'`, so it is
# moved aside for the duration of the build and restored afterwards (even on failure).
set -euo pipefail
cd "$(dirname "$0")/.."
STASH=".api-stash"
trap 'if [ -d "$STASH" ]; then rm -rf app/api; mv "$STASH" app/api; fi' EXIT
mv app/api "$STASH"
rm -rf out .next
STATIC_EXPORT=1 npx next build
echo "✓ static export in ./out (basePath /lifestory)"
