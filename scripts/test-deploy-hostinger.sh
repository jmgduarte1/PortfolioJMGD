#!/usr/bin/env bash
set -euo pipefail

# Exercise the real deployment script with offline stand-ins for network tools.
repo=$(pwd)
fixture=$(mktemp -d)
export DEPLOY_TEST_LOG="$fixture/commands.log"
export SSH_HOST=host.example.com SSH_PORT=65002 SSH_USER=u123456789
export DEPLOY_PATH=/home/u123456789/domains/example.com/public_html
export SSH_PRIVATE_KEY=fake-key SSH_KNOWN_HOSTS=fake-host-key
export SITE_URL=https://example.com GITHUB_SHA=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
mkdir -p "$fixture/bin" "$fixture/dist/portfolio-jmgd/browser"
for file in index.html .htaccess app-config.json version.json; do
  printf 'fixture\n' > "$fixture/dist/portfolio-jmgd/browser/$file"
done
cat > "$fixture/bin/ssh" <<'MOCK'
#!/usr/bin/env bash
printf 'ssh %s\n' "$*" >> "$DEPLOY_TEST_LOG"
exit "${MOCK_SSH_STATUS:-0}"
MOCK
cat > "$fixture/bin/rsync" <<'MOCK'
#!/usr/bin/env bash
printf 'rsync %s\n' "$*" >> "$DEPLOY_TEST_LOG"
exit "${MOCK_RSYNC_STATUS:-0}"
MOCK
cat > "$fixture/bin/curl" <<'MOCK'
#!/usr/bin/env bash
printf 'curl %s\n' "$*" >> "$DEPLOY_TEST_LOG"
printf '{"commit":"%s"}\n' "$GITHUB_SHA"
MOCK
chmod +x "$fixture/bin/ssh" "$fixture/bin/rsync" "$fixture/bin/curl"
export PATH="$fixture/bin:$PATH"
cd "$fixture"

expect_failure() {
  if bash "$repo/scripts/deploy-hostinger.sh" > /dev/null 2>&1; then
    echo 'Expected deployment to fail.' >&2
    exit 1
  fi
}

DEPLOY_PATH=/ expect_failure
DEPLOY_PATH=/home/u123456789/domains/../public_html expect_failure
SSH_PORT=not-a-port expect_failure
test ! -e "$DEPLOY_TEST_LOG"

MOCK_SSH_STATUS=1 expect_failure
! grep -q '^rsync ' "$DEPLOY_TEST_LOG"
printf '' > "$DEPLOY_TEST_LOG"

MOCK_RSYNC_STATUS=1 expect_failure
! grep -q '^curl ' "$DEPLOY_TEST_LOG"
test "$(grep -c '^rsync ' "$DEPLOY_TEST_LOG")" = 1
printf '' > "$DEPLOY_TEST_LOG"

bash "$repo/scripts/deploy-hostinger.sh" > /dev/null
test "$(grep -c '^rsync ' "$DEPLOY_TEST_LOG")" = 3
! grep -q -- '--delete' "$DEPLOY_TEST_LOG"
grep '^rsync ' "$DEPLOY_TEST_LOG" | sed -n '2p' | grep -q 'index.html'
grep '^rsync ' "$DEPLOY_TEST_LOG" | sed -n '3p' | grep -q 'version.json'
grep -q '.portfolio-deploy-target' "$DEPLOY_TEST_LOG"
grep -q 'wp-config.php' "$DEPLOY_TEST_LOG"
echo 'PASS: invalid targets, SSH/transfer failures, publication order and release verification (offline).'

# Explicit fixture cleanup; never traverse an arbitrary recursive delete target.
rm -f "$fixture/bin/ssh" "$fixture/bin/rsync" "$fixture/bin/curl" "$DEPLOY_TEST_LOG"
for file in index.html .htaccess app-config.json version.json; do
  rm -f "$fixture/dist/portfolio-jmgd/browser/$file"
done
cd "$repo"
rmdir "$fixture/bin" "$fixture/dist/portfolio-jmgd/browser" "$fixture/dist/portfolio-jmgd" "$fixture/dist" "$fixture"
