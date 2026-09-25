#!/usr/bin/env bash
# Nightly backup of the Kanchi Vastra containers: database, shop photos,
# mail (once the mail server is on) and server settings.
# Installed as /usr/local/sbin/kanchi-backup, run by kanchi-backup.timer.
# Keeps 14 days in /var/backups/kanchi. Log: /var/log/kanchi-backup.log
set -euo pipefail
umask 077

STACK=/srv/kanchi-vastra/stack
SHARED=/srv/kanchi-vastra/shared
DATA=/srv/kanchi-vastra/data
ROOT=/var/backups/kanchi
DEST="$ROOT/$(date +%F)"
mkdir -p "$DEST"
dc() { docker compose --project-directory "$STACK" "$@"; }

# 1. database - custom format, restorable with pg_restore
dc exec -T postgres pg_dump --format=custom --no-owner -U kanchi kanchi_vastra > "$DEST/database.dump"

# 2. photos - full copy of the storage bucket, through Garage's server-only port
set -a; . "$SHARED/app.env"; set +a
export RCLONE_CONFIG_G_TYPE=s3 RCLONE_CONFIG_G_PROVIDER=Other \
       RCLONE_CONFIG_G_ENDPOINT=http://127.0.0.1:3900 RCLONE_CONFIG_G_REGION="$S3_REGION" \
       RCLONE_CONFIG_G_ACCESS_KEY_ID="$S3_ACCESS_KEY_ID" RCLONE_CONFIG_G_SECRET_ACCESS_KEY="$S3_SECRET_ACCESS_KEY" \
       RCLONE_CONFIG_G_FORCE_PATH_STYLE=true
rclone sync G:"$S3_BUCKET" "$DEST/media" -q

# 3. mail - only when the mail server has been started
if [ -d "$DATA/stalwart" ] && dc ps --status running --services 2>/dev/null | grep -qx stalwart; then
  # a short pause gives a consistent copy of the mail store
  dc stop stalwart >/dev/null 2>&1
  tar -czf "$DEST/mail.tar.gz" -C "$DATA" stalwart
  dc --profile mail start stalwart >/dev/null 2>&1
fi

# 4. settings (contain secrets - the backup folder is root-only)
tar -czf "$DEST/config.tar.gz" -C / \
    srv/kanchi-vastra/stack srv/kanchi-vastra/shared 2>/dev/null

# 5. keep 14 days
find "$ROOT" -mindepth 1 -maxdepth 1 -type d -mtime +14 -exec rm -rf {} +

echo "$(date -Is) OK db=$(du -h "$DEST/database.dump" | cut -f1) photos=$(find "$DEST/media" -type f | wc -l) total=$(du -sh "$DEST" | cut -f1)" >> /var/log/kanchi-backup.log
