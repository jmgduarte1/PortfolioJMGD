#!/usr/bin/env bash
set -euo pipefail

for name in SSH_HOST SSH_PORT SSH_USER DEPLOY_PATH SSH_PRIVATE_KEY SSH_KNOWN_HOSTS SITE_URL GITHUB_SHA; do
  if [[ -z "${!name:-}" ]]; then
    printf 'Missing deployment setting: %s\n' "$name" >&2
    exit 1
  fi
done

# Restrict values that cross the remote shell boundary.
[[ "$SSH_HOST" =~ ^[a-zA-Z0-9][a-zA-Z0-9.-]*$ ]] || exit 1
[[ "$SSH_USER" =~ ^[a-zA-Z0-9_][a-zA-Z0-9_-]*$ ]] || exit 1
[[ "$SSH_PORT" =~ ^[0-9]{1,5}$ ]] && (( 10#$SSH_PORT > 0 && 10#$SSH_PORT <= 65535 )) || exit 1
[[ "$DEPLOY_PATH" =~ ^/home/[a-zA-Z0-9_-]+/domains/[a-zA-Z0-9.-]+/public_html(/[a-zA-Z0-9_-]+)*$ ]] || {
  echo 'DEPLOY_PATH must be an absolute Hostinger domain public_html path, without a trailing slash.' >&2
  exit 1
}
[[ "$DEPLOY_PATH" != *'/../'* && "$DEPLOY_PATH" != *'/./'* ]] || exit 1
[[ "$GITHUB_SHA" =~ ^[a-f0-9]{40}$ ]] || exit 1

source_dir=dist/portfolio-jmgd/browser
for file in index.html .htaccess version.json; do
  test -s "$source_dir/$file"
done

ssh_dir=$(mktemp -d)
trap 'rm -f -- "$ssh_dir/key" "$ssh_dir/known_hosts" "$ssh_dir/config"; rmdir -- "$ssh_dir"' EXIT
printf '%s\n' "$SSH_PRIVATE_KEY" | tr -d '\r' > "$ssh_dir/key"
printf '%s\n' "$SSH_KNOWN_HOSTS" | tr -d '\r' > "$ssh_dir/known_hosts"
chmod 600 "$ssh_dir/key" "$ssh_dir/known_hosts"
cat > "$ssh_dir/config" <<CONFIG
Host hostinger-deploy
  HostName $SSH_HOST
  Port $SSH_PORT
  User $SSH_USER
  IdentityFile $ssh_dir/key
  UserKnownHostsFile $ssh_dir/known_hosts
  StrictHostKeyChecking yes
  IdentitiesOnly yes
  BatchMode yes
  ConnectTimeout 20
CONFIG

# Require an explicitly prepared frontend directory, not an existing WordPress site.
ssh -F "$ssh_dir/config" hostinger-deploy \
  "test -d '$DEPLOY_PATH' && test -f '$DEPLOY_PATH/.portfolio-deploy-target' && test ! -e '$DEPLOY_PATH/wp-config.php'"

# Keep previous hashed assets for open browser sessions. No remote deletion.
# Publish index last, after its referenced assets and configuration exist.
rsync -rlz --delay-updates --chmod=D755,F644 \
  --exclude=index.html --exclude=version.json \
  -e "ssh -F $ssh_dir/config" "$source_dir/" "hostinger-deploy:$DEPLOY_PATH/"
rsync -lz --chmod=F644 -e "ssh -F $ssh_dir/config" \
  "$source_dir/index.html" "hostinger-deploy:$DEPLOY_PATH/"
rsync -lz --chmod=F644 -e "ssh -F $ssh_dir/config" \
  "$source_dir/version.json" "hostinger-deploy:$DEPLOY_PATH/"

# Confirm the domain exposes this commit, not a cached previous release.
for attempt in 1 2 3 4 5; do
  if curl --fail --silent --show-error --max-time 20 \
    "${SITE_URL%/}/version.json?release=$GITHUB_SHA" |
    node -e 'let s=""; process.stdin.on("data", c => s += c); process.stdin.on("end", () => { try { if (JSON.parse(s).commit !== process.env.GITHUB_SHA) process.exit(1); } catch { process.exit(1); } });'; then
    curl --fail --silent --show-error --max-time 20 "${SITE_URL%/}/" -o /dev/null
    echo 'Hostinger release verified.'
    exit 0
  fi
  sleep 5
done
echo 'Upload finished, but the public release could not be verified. Check DNS/CDN and the document root.' >&2
exit 1
