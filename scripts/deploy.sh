#!/usr/bin/env bash
# ---------------------------------------------------------------------------
#  deploy.sh — ship the committed code to the Hostinger VPS.
#
#  You only need this for CODE changes. Prices, photos and sarees are edited
#  in the admin (/studio) and reach the live site on their own within
#  five minutes.
#
#  How it stays safe:
#    - deploys what is COMMITTED, never half-edited files or local secrets
#    - builds each release in its own folder while the current one keeps
#      serving, so a failed build never takes the shop down
#    - switches over by repointing a symlink, then restarts the app
#    - keeps the last 3 releases; `npm run deploy -- --rollback` goes back one
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

if [[ "${1:-}" == "--rollback" ]]; then
  ssh_run "
    set -e
    cd $BASE/releases
    current=\$(basename \$(readlink -f $BASE/app))
    previous=\$(ls -1t | grep -vx \"\$current\" | head -1)
    [ -n \"\$previous\" ] || { echo 'No earlier release to roll back to.'; exit 1; }
    ln -sfn $BASE/releases/\$previous $BASE/app
    systemctl restart kanchi-vastra
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
  cp $BASE/shared/.env.local \$STAGE/.env.local
  chmod 600 \$STAGE/.env.local
  chown -R kanchi:kanchi \$STAGE

  RUN='runuser -u kanchi -- env PATH=/opt/node/bin:/usr/bin:/bin HOME=$BASE NEXT_TELEMETRY_DISABLED=1'
  cd \$STAGE
  echo '  installing dependencies...'
  \$RUN npm ci --no-audit --no-fund > \$STAGE/.deploy-install.log 2>&1 \
    || { echo '  install FAILED — live site untouched. See' \$STAGE/.deploy-install.log; exit 1; }
  echo '  building...'
  \$RUN npm run build > \$STAGE/.deploy-build.log 2>&1 \
    || { echo '  build FAILED — live site untouched. See' \$STAGE/.deploy-build.log; exit 1; }

  ln -sfn \$STAGE $BASE/app
  systemctl restart kanchi-vastra

  # keep the three most recent releases
  cd $BASE/releases && ls -1t | tail -n +4 | xargs -r rm -rf
  echo '  switched to' $REL
"

for i in 1 2 3 4 5 6 7 8 9 10; do
  code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 10 "$SITE/" || true)
  [[ "$code" == "200" ]] && { echo "Live: $SITE"; exit 0; }
  sleep 3
done
echo "The site did not answer 200 after deploy. Roll back with:  npm run deploy -- --rollback"
exit 1
