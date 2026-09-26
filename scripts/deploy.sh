#!/usr/bin/env bash
# ---------------------------------------------------------------------------
#  deploy.sh — ship the committed code to the Hostinger VPS (Docker Compose).
#
#  You only need this for CODE changes. Prices, photos and sarees are edited
#  in the admin (/studio) and reach the live site on their own within
#  about a minute.
#
#  How it stays safe:
#    - deploys what is COMMITTED, never half-edited files or local secrets
#    - builds a new image (kanchi-vastra:<commit>) while the current container
#      keeps serving, so a failed build never takes the shop down
#    - swaps the app container to the new image, then waits for it to report
#      healthy
#    - keeps the last 3 images; `npm run deploy -- --rollback` goes back one
#
#  Usage (from Git Bash, in the project folder):
#    npm run deploy
#    npm run deploy -- --rollback
# ---------------------------------------------------------------------------
set -euo pipefail

HOST="${DEPLOY_HOST:-root@72.61.146.146}"
KEY="${DEPLOY_KEY:-$HOME/.ssh/kanchi_vastra_vps}"
BASE=/srv/kanchi-vastra
SITE=https://srv1396079.hstgr.cloud

ssh_run() { ssh -i "$KEY" -o BatchMode=yes "$HOST" "$@"; }

cd "$(dirname "$0")/.."

# Runs on the server: wait for the app container to report healthy.
WAIT_HEALTHY='
wait_healthy() {
  for i in $(seq 1 40); do
    s=$(docker inspect -f "{{.State.Health.Status}}" "$(docker compose ps -q app)" 2>/dev/null || true)
    [ "$s" = healthy ] && return 0
    sleep 3
  done
  echo "  the app did not become healthy — see: docker compose logs app"; return 1
}
'

if [[ "${1:-}" == "--rollback" ]]; then
  ssh_run "
    set -e
    cd $BASE/stack
    current=\$(sed -n 's/^APP_TAG=//p' .env)
    previous=\$(docker image ls kanchi-vastra --format '{{.Tag}}' | grep -vx \"\$current\" | head -1)
    [ -n \"\$previous\" ] || { echo 'No earlier image to roll back to.'; exit 1; }
    sed -i \"s/^APP_TAG=.*/APP_TAG=\$previous/\" .env
    $WAIT_HEALTHY
    docker compose up -d app
    wait_healthy
    echo \"Rolled back: \$current -> \$previous\"
  "
  exit 0
fi

if [[ -n "$(git status --porcelain)" ]]; then
  echo "You have uncommitted changes. Commit them first — deploy only ships what is committed."
  exit 1
fi

REL="$(git rev-parse --short HEAD)"
echo "Deploying $REL to $SITE"

git archive --format=tar HEAD | ssh_run "
  set -e
  STAGE=$BASE/releases/$REL
  rm -rf \$STAGE && mkdir -p \$STAGE
  tar -xf - -C \$STAGE

  echo '  building image kanchi-vastra:$REL ...'
  docker build --secret id=appenv,src=$BASE/shared/app.env -t kanchi-vastra:$REL \$STAGE \
      > \$STAGE/.deploy-build.log 2>&1 \
    || { echo '  build FAILED — live site untouched. See' \$STAGE/.deploy-build.log; exit 1; }
  docker build --secret id=appenv,src=$BASE/shared/app.env --target tools -t kanchi-vastra-tools:$REL \$STAGE \
      >> \$STAGE/.deploy-build.log 2>&1 \
    || { echo '  tools build FAILED — live site untouched. See' \$STAGE/.deploy-build.log; exit 1; }

  # server layout and the backup job travel with the code
  mkdir -p $BASE/stack/caddy
  cp \$STAGE/infra/docker/compose.yaml $BASE/stack/compose.yaml
  cp \$STAGE/infra/docker/caddy/Caddyfile $BASE/stack/caddy/Caddyfile
  install -m 700 \$STAGE/infra/docker/backup.sh /usr/local/sbin/kanchi-backup

  cd $BASE/stack
  PREV=\$(sed -n 's/^APP_TAG=//p' .env)
  sed -i 's/^APP_TAG=.*/APP_TAG=$REL/' .env

  # Database changes first. Migrations are written to be backward compatible
  # (add, then remove in a later release), so the running site keeps working.
  echo '  applying database migrations...'
  docker compose run --rm -T tools > \$STAGE/.deploy-migrate.log 2>&1 \
    || { sed -i \"s/^APP_TAG=.*/APP_TAG=\$PREV/\" .env; echo '  migration FAILED — live site untouched. See' \$STAGE/.deploy-migrate.log; exit 1; }

  docker compose up -d
  docker compose exec -T caddy caddy reload --config /etc/caddy/Caddyfile >/dev/null
  $WAIT_HEALTHY
  wait_healthy
  echo '  switched to' $REL

  # keep the three most recent releases and images
  cd $BASE/releases && ls -1t | tail -n +4 | xargs -r rm -rf
  for repo in kanchi-vastra kanchi-vastra-tools; do
    docker image ls \$repo --format '{{.Tag}}' | tail -n +4 | sed \"s/^/\$repo:/\" | xargs -r docker image rm >/dev/null
  done
  docker builder prune -f --filter until=168h >/dev/null
"

for i in 1 2 3 4 5 6 7 8 9 10; do
  code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 10 "$SITE/" || true)
  [[ "$code" == "200" ]] && { echo "Live: $SITE"; exit 0; }
  sleep 3
done
echo "The site did not answer 200 after deploy. Roll back with:  npm run deploy -- --rollback"
exit 1
