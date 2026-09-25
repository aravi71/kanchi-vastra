# DEV server — how it is built

`srv1396079.hstgr.cloud` (Hostinger KVM 2, Ubuntu 24.04). The practice
environment: everything is free and open source, and nothing here may ever hold
real customer data. Production will be a separate server built the same way,
with the differences listed at the bottom.

No secrets are in this file or this folder. They live on the server in
`/srv/kanchi-vastra/shared/.env.local` (mode 600) and in the nightly backup.

## What runs

| Service | systemd unit | Listens on | Purpose |
|---|---|---|---|
| Caddy 2.11 | `caddy-kanchi` | `:80`, `:443` (public) | HTTPS, routes `/media/*`, `/mailpit/*`, everything else to the app |
| Next.js app | `kanchi-vastra` | `127.0.0.1:3000` | The shop, and later `/account` and `/admin` |
| PostgreSQL 16 | `postgresql` | `127.0.0.1:5432` | Database `kanchi_vastra`, role `kanchi` |
| Garage 2.4.1 | `garage` | `127.0.0.1:3900-3903` | S3-compatible photo storage, bucket `kanchi-media` |
| Mailpit 1.31 | `mailpit` | `127.0.0.1:1025` SMTP, `:8025` UI | Test inbox — catches every email, delivers none |
| Backup | `kanchi-backup.timer` | — | Nightly 21:00 UTC (02:30 IST) |

Only Caddy is reachable from the internet. `ufw` allows 22, 80 and 443;
everything else is denied. Remote desktop (xrdp) is disabled.

## Paths

| What | Where |
|---|---|
| App releases | `/srv/kanchi-vastra/releases/<commit>`, `app` symlinks to the live one |
| App settings | `/srv/kanchi-vastra/shared/.env.local` |
| Caddy config | `/etc/caddy/Caddyfile` |
| Garage config / data | `/etc/garage.toml`, `/var/lib/garage` |
| Mailpit data | `/var/lib/mailpit/mailpit.db` |
| Backups | `/var/backups/kanchi/<date>/` — `database.dump`, `media/`, `config.tar.gz` |
| Backup log | `/var/log/kanchi-backup.log` |
| MetaTrader backups | `/root/backups/` (removed from the server 2026-09-24) |

## App settings (names only)

```
DATABASE_URL, DIRECT_URL            PostgreSQL, local
S3_ENDPOINT, S3_REGION, S3_BUCKET,  Garage
S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY
MEDIA_PUBLIC_BASE_URL               https://srv1396079.hstgr.cloud/media
SMTP_HOST, SMTP_PORT, SMTP_SECURE,  Mailpit (127.0.0.1:1025)
MAIL_FROM
NEXT_PUBLIC_SITE_URL
```

## Everyday commands (on the server)

```bash
systemctl status kanchi-vastra caddy-kanchi postgresql garage mailpit
journalctl -u kanchi-vastra -n 50          # app logs
tail /var/log/kanchi-backup.log            # last backups
systemctl start kanchi-backup.service      # back up right now
garage -c /etc/garage.toml bucket info kanchi-media
```

## Restore from a backup

```bash
D=/var/backups/kanchi/2026-09-25
# database
cat $D/database.dump | sudo -u postgres pg_restore --clean --no-owner -d kanchi_vastra
# photos (rclone settings come from the app env file; see /usr/local/sbin/kanchi-backup)
rclone sync $D/media G:kanchi-media
```

The restore was tested on 2026-09-25 into a throwaway database: every table
matched the live one.

## What changes for PRODUCTION

| | DEV (this server) | PROD (new server) |
|---|---|---|
| Email | Mailpit — caught, never sent | Hostinger mailbox SMTP on your domain |
| Backups | On the same server | Encrypted, copied **off** the server nightly |
| In front | Nothing | Cloudflare (free): attack filtering, hides the server IP |
| Firewall | 22, 80, 443 open | 80/443 only from Cloudflare; 22 key-only + fail2ban |
| SSH | Root key login | Non-root user, key only, password login disabled |
| App | One instance | Two instances, restarted one at a time |
| Admin | Password | Password + authenticator-app code |
| Search engines | Blocked (`X-Robots-Tag: noindex`) | Allowed |
| Monitoring | Manual | Uptime alerts |
