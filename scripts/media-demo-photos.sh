#!/usr/bin/env bash
# ---------------------------------------------------------------------------
#  media-demo-photos.sh — put the demo photos into the photo storage (Garage).
#
#  Reads src/content/demo-photos.json and, on the server, downloads each photo
#  from Unsplash (Unsplash License) straight into the kanchi-media bucket:
#
#    editorial/<name>.jpg                homepage photos
#    products/<slug>-<n>.jpg             saree photos (n = 1, 2, ...)
#
#  Every photo also gets WebP renditions <file>-640/1080/1600/2400.webp, which
#  src/lib/image-loader.ts serves by screen size. Existing photos are skipped,
#  so it is safe to re-run; --force re-downloads everything.
#
#    bash scripts/media-demo-photos.sh [--force]
# ---------------------------------------------------------------------------
set -euo pipefail

FORCE="${1:-}"
cd "$(dirname "$0")/.."
# shellcheck source=lib/remote.sh
source scripts/lib/remote.sh

# "<folder>/<file-stem> <unsplash-id> <max-width>", one per line
LIST=$(node -e '
  const m = require("./src/content/demo-photos.json");
  for (const [name, e] of Object.entries(m.editorial))
    console.log(`editorial/${name}`, m.photos[e.photo].id, e.width);
  for (const [slug, keys] of Object.entries(m.products))
    keys.forEach((k, i) => console.log(`products/${slug}-${i + 1}`, m.photos[k].id, 1600));
')

printf '%s\n' "$LIST" | remote "
  FORCE='$FORCE'
  set -euo pipefail
  set -a; . /srv/kanchi-vastra/shared/app.env; set +a
  export RCLONE_CONFIG_G_TYPE=s3 RCLONE_CONFIG_G_PROVIDER=Other \
         RCLONE_CONFIG_G_ENDPOINT=http://127.0.0.1:3900 RCLONE_CONFIG_G_REGION=\"\$S3_REGION\" \
         RCLONE_CONFIG_G_ACCESS_KEY_ID=\"\$S3_ACCESS_KEY_ID\" RCLONE_CONFIG_G_SECRET_ACCESS_KEY=\"\$S3_SECRET_ACCESS_KEY\" \
         RCLONE_CONFIG_G_FORCE_PATH_STYLE=true
  have=\$( (rclone -q lsf G:\"\$S3_BUCKET\"/editorial/; rclone -q lsf G:\"\$S3_BUCKET\"/products/) 2>/dev/null || true)
  new=0
  while read -r stem id width; do
    file=\${stem##*/}
    if [ -z \"\$FORCE\" ] && grep -qx \"\$file-2400.webp\" <<<\"\$have\"; then continue; fi
    # The original (JPEG, for sharing previews) plus the WebP renditions.
    curl -fsS \"https://images.unsplash.com/\$id?w=\$width&q=80&fm=jpg&fit=max\" \
      | rclone -q rcat --header-upload \"Content-Type: image/jpeg\" G:\"\$S3_BUCKET\"/\$stem.jpg
    for w in 640 1080 1600 2400; do
      curl -fsS \"https://images.unsplash.com/\$id?w=\$w&q=78&fm=webp&fit=max\" \
        | rclone -q rcat --header-upload \"Content-Type: image/webp\" G:\"\$S3_BUCKET\"/\$stem-\$w.webp
    done
    new=\$((new+1))
  done
  echo \"  uploaded \$new photos; storage now holds \$(rclone -q lsf G:\"\$S3_BUCKET\"/editorial/ | wc -l) editorial and \$(rclone -q lsf G:\"\$S3_BUCKET\"/products/ | wc -l) product files\"
"
