#!/usr/bin/env bash
set -euo pipefail

# The lockfile references the renderer via git+ssh. Use HTTPS on CI, with an
# optional read-only token if the renderer repository is private.
export GIT_CONFIG_COUNT=2
export GIT_CONFIG_KEY_0=url.https://github.com/.insteadOf
export GIT_CONFIG_VALUE_0=ssh://git@github.com/
export GIT_CONFIG_KEY_1=url.https://github.com/.insteadOf
export GIT_CONFIG_VALUE_1=git@github.com:
export GIT_TERMINAL_PROMPT=0
askpass=$(mktemp)
trap 'rm -f -- "$askpass"' EXIT
cat > "$askpass" <<'ASKPASS'
#!/usr/bin/env bash
case "$1" in
  *Username*) printf '%s\n' 'x-access-token' ;;
  *Password*) printf '%s\n' "${RENDERER_READ_TOKEN:-}" ;;
esac
ASKPASS
chmod 700 "$askpass"
export GIT_ASKPASS="$askpass"
npm ci --no-audit --no-fund
