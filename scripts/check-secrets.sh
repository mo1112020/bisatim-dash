#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

fail=0

# Block env files from being committed (except .env.example)
while IFS= read -r file; do
  [[ -z "$file" ]] && continue
  base="$(basename "$file")"
  if [[ "$base" == .env.example ]]; then
    continue
  fi
  if [[ "$base" == .env* ]] || [[ "$file" == *"/.env"* ]]; then
    echo "ERROR: env file staged for commit: $file"
    fail=1
  fi
done < <(git diff --cached --name-only --diff-filter=ACMR 2>/dev/null || true)

# Block JWT / service role patterns in staged content
if git diff --cached --quiet 2>/dev/null; then
  :
else
  if git diff --cached | grep -qE 'SUPABASE_SERVICE_ROLE_KEY=[^[:space:]"'\''`]+'; then
    echo "ERROR: SUPABASE_SERVICE_ROLE_KEY value found in staged changes"
    fail=1
  fi
  if git diff --cached | grep -qE 'eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}'; then
    echo "ERROR: JWT-like token found in staged changes"
    fail=1
  fi
fi

# Warn if .env.local exists and is not ignored
if [[ -f .env.local ]] && ! git check-ignore -q .env.local; then
  echo "ERROR: .env.local is not gitignored"
  fail=1
fi

if [[ "$fail" -ne 0 ]]; then
  echo ""
  echo "Push/commit blocked. Remove secrets from staging:"
  echo "  git reset HEAD -- <file>"
  exit 1
fi

echo "Secret check passed."
