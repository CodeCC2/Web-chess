#!/usr/bin/env bash
# Commit all changes and push to main in one step.
# Usage: npm run ship -- "your commit message"
set -euo pipefail

MSG="${1:-update}"

if ! git rev-parse --git-dir >/dev/null 2>&1; then
  echo "Error: not a git repository"
  exit 1
fi

BRANCH="$(git branch --show-current)"
if [[ "$BRANCH" != "main" ]]; then
  echo "→ Switching to main..."
  git checkout main
fi

git pull origin main

if git diff --quiet && git diff --cached --quiet; then
  echo "Nothing to commit."
  exit 0
fi

git add -A
git commit -m "$MSG"
git push origin main

echo ""
echo "✓ Pushed to main."
echo "→ Render: Manual Deploy → Deploy latest commit (if auto-deploy is off)"
