#!/usr/bin/env bash
# ---------------------------------------------------------------------------
#  media-demo-photos.sh — put the homepage's demo photos into Garage.
#
#  Reads the "editorial" list in src/content/demo-photos.json, and on the
#  server downloads each photo from Unsplash (Unsplash License) straight into
#  the kanchi-media bucket as editorial/<name>.jpg, served at /media/editorial/.
#  Existing files are skipped, so it is safe to re-run; --force re-downloads.
#
#    bash scripts/media-demo-photos.sh [--force]
# ---------------------------------------------------------------------------
set -euo pipefail

HOST="${DEPLOY_HOST:-root@72.61.146.146}"
KEY="${DEPLOY_KEY:-$HOME/.ssh/kanchi_vastra_vps}"
FORCE="${1:-}"
cd "$(dirname "$0")/.."

# name id width, one per line
LIST=$(node -e '
  const m = require("./src/content/demo-photos.json");
  for (const [name, e] of Object.entries(m.editorial))
    console.log(name, m.photos[e.photo].id, e.width);
')

printf '%s\n' "$LIST" | ssh -i "$KEY" -o BatchMode=yes "$HOST" "FORCE='$FORCE' bash -c '
  set -euo pipefail
  set -a; . /srv/kanchi-vastra/shared/app.env; set +a
  export RCLONE_CONFIG_G_TYPE=s3 RCLONE_CONFIG_G_PROVIDER=Other \
         RCLONE_CONFIG_G_ENDPOINT=http://127.0.0.1:3900 RCLONE_CONFIG_G_REGION=\"\$S3_REGION\" \
         RCLONE_CONFIG_G_ACCESS_KEY_ID=\"\$S3_ACCESS_KEY_ID\" RCLONE_CONFIG_G_SECRET_ACCESS_KEY=\"\$S3_SECRET_ACCESS_KEY\" \
         RCLONE_CONFIG_G_FORCE_PATH_STYLE=true
  have=\$(rclone -q lsf G:\"\$S3_BUCKET\"/editorial/ 2>/dev/null || true)
  new=0
  while read -r name id width; do
    # The original (JPEG, for sharing previews) plus WebP renditions at the
    # widths src/lib/image-loader.ts asks for.
    if [ -z \"\$FORCE\" ] && grep -qx \"\$name-2400.webp\" <<<\"\$have\"; then continue; fi
    curl -fsS \"https://images.unsplash.com/\$id?w=\$width&q=80&fm=jpg&fit=max\" \
      | rclone -q rcat --header-upload \"Content-Type: image/jpeg\" G:\"\$S3_BUCKET\"/editorial/\$name.jpg
    for w in 640 1080 1600 2400; do
      curl -fsS \"https://images.unsplash.com/\$id?w=\$w&q=78&fm=webp&fit=max\" \
        | rclone -q rcat --header-upload \"Content-Type: image/webp\" G:\"\$S3_BUCKET\"/editorial/\$name-\$w.webp
    done
    new=\$((new+1))
  done
  echo \"  uploaded \$new, total \$(rclone -q lsf G:\"\$S3_BUCKET\"/editorial/ | wc -l) editorial photos\"
'"
