#!/usr/bin/env bash
# ---------------------------------------------------------------------------
#  media-editorial-upload.sh — put one of YOUR OWN photos into the photo
#  storage as a homepage (editorial) photo.
#
#  Makes the JPEG original plus the WebP sizes the site serves
#  (<name>-640/1080/1600/2400.webp) on this computer, then copies them to
#  editorial/<name>.* in the kanchi-media bucket, replacing any old copy.
#
#    bash scripts/media-editorial-upload.sh <name> <photo.jpg>
#    e.g. bash scripts/media-editorial-upload.sh hero-own ~/Pictures/hero.jpg
#
#  Then point the page at it, e.g. photo: 'hero-own' in
#  src/features/home/content.ts, and deploy.
# ---------------------------------------------------------------------------
set -euo pipefail

NAME="${1:?name, e.g. hero-own}"
PHOTO="${2:?path to the photo}"
[[ "$NAME" =~ ^[a-z0-9-]+$ ]] || { echo "name: lowercase letters, numbers and dashes only" >&2; exit 1; }
[ -f "$PHOTO" ] || { echo "no such file: $PHOTO" >&2; exit 1; }

cd "$(dirname "$0")/.."
# shellcheck source=lib/remote.sh
source scripts/lib/remote.sh

WORK=$(mktemp -d)
trap 'rm -rf "$WORK"' EXIT

node -e '
  const sharp = require("sharp");
  const [src, dir, name] = process.argv.slice(1);
  (async () => {
    const base = sharp(src).rotate();
    await base.clone().resize({ width: 2400, withoutEnlargement: true })
      .jpeg({ quality: 88, mozjpeg: true }).toFile(`${dir}/${name}.jpg`);
    for (const w of [640, 1080, 1600, 2400])
      await base.clone().resize({ width: w }).webp({ quality: 80 }).toFile(`${dir}/${name}-${w}.webp`);
  })().catch((e) => { console.error(e.message); process.exit(1); });
' "$PHOTO" "$WORK" "$NAME"
echo "  made $(ls "$WORK" | wc -l) files for editorial/$NAME"

tar -C "$WORK" -cf - . | remote "
  set -euo pipefail
  set -a; . /srv/kanchi-vastra/shared/app.env; set +a
  export RCLONE_CONFIG_G_TYPE=s3 RCLONE_CONFIG_G_PROVIDER=Other \
         RCLONE_CONFIG_G_ENDPOINT=http://127.0.0.1:3900 RCLONE_CONFIG_G_REGION=\"\$S3_REGION\" \
         RCLONE_CONFIG_G_ACCESS_KEY_ID=\"\$S3_ACCESS_KEY_ID\" RCLONE_CONFIG_G_SECRET_ACCESS_KEY=\"\$S3_SECRET_ACCESS_KEY\" \
         RCLONE_CONFIG_G_FORCE_PATH_STYLE=true
  d=\$(mktemp -d); trap 'rm -rf \$d' EXIT
  tar -xf - -C \$d
  rclone -q copy \$d G:\"\$S3_BUCKET\"/editorial/
  echo \"  uploaded: \$(ls \$d | tr '\n' ' ')\"
"
