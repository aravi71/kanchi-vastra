# DEV server — how it is built

`srv1396079.hstgr.cloud` (Hostinger KVM 2, Ubuntu 24.04, 2 vCPU, 8 GB). The
practice environment: everything is free and open source, and nothing here may
ever hold real customer data. Production will be a separate server built from
the same `infra/docker/compose.yaml`, with the differences listed at the bottom.

No secrets are in this file or this folder. They live on the server in
`/srv/kanchi-vastra/stack/.env`, `/srv/kanchi-vastra/shared/app.env` and
`/srv/kanchi-vastra/shared/garage.toml` (all root-only), and in the nightly
backup.

## What runs

Everything runs in Docker Compose, project name `kanchi`, from
`/srv/kanchi-vastra/stack` (moved from systemd services on 2026-09-25).

| Container | Image | Reachable from | Purpose |
|---|---|---|---|
| `caddy` | `caddy:2.11.4-alpine` | internet `:80`, `:443` | HTTPS, routes `/media/*`, `/mailpit/*`, everything else to the app |
| `app` | `kanchi-vastra:<commit>` (built from `Dockerfile`) | Caddy only | The shop, and later `/account` and `/admin` |
| `postgres` | `postgres:16-alpine` | app only (`internal` network, no port) | Database `kanchi_vastra`, role `kanchi` |
| `garage` | `dxflrs/garage:v2.4.1` | Caddy, app; `127.0.0.1:3900` for backups | S3-compatible photo storage, bucket `kanchi-media` |
| `mailpit` | `axllent/mailpit:v1.31.2` | Caddy, app | Test inbox — catches every email, delivers none |
| `stalwart` | `stalwartlabs/stalwart:v0.16.23` | internet `:25 :465 :587 :993` | Real mail server — off until the domain is ready (`--profile mail`) |

The nightly backup is a systemd timer, `kanchi-backup.timer` (21:00 UTC =
02:30 IST), running `/usr/local/sbin/kanchi-backup` (source:
`infra/docker/backup.sh`).

`ufw` allows 22, 80 and 443. Note that Docker publishes container ports
itself, bypassing `ufw` — which is why every container except Caddy (and later
Stalwart) either publishes nothing or publishes on `127.0.0.1` only. Remote
desktop (xrdp) is disabled.

## Paths

| What | Where |
|---|---|
| Compose file + Caddyfile | `/srv/kanchi-vastra/stack/` (copied from `infra/docker` on every deploy) |
| Server-only settings | `stack/.env` (hostnames, passwords, image tag), `shared/app.env` (the app's settings), `shared/garage.toml` |
| Data | `/srv/kanchi-vastra/data/{postgres,garage,mailpit,caddy,stalwart}` |
| Source of each release | `/srv/kanchi-vastra/releases/<commit>` (last 3 kept) |
| Backups | `/var/backups/kanchi/<date>/` — `database.dump`, `media/`, `config.tar.gz` (+ `mail.tar.gz` once mail is on) |
| Backup log | `/var/log/kanchi-backup.log` |
| Pre-Docker data (rollback only) | `/var/lib/{garage,mailpit,caddy,postgresql}`, services disabled — delete after 2026-10-02 |

## Everyday commands (on the server)

```bash
cd /srv/kanchi-vastra/stack
docker compose ps                          # what is running, and health
docker compose logs -f app                 # app logs (Ctrl+C to stop)
docker compose restart app                 # restart one part
docker compose exec postgres psql -U kanchi kanchi_vastra
docker compose exec garage /garage bucket info kanchi-media
systemctl start kanchi-backup.service      # back up right now
tail /var/log/kanchi-backup.log            # last backups
```

From your laptop, code changes go out with `npm run deploy`
(`npm run deploy -- --rollback` goes back one image).

## Restore from a backup

```bash
D=/var/backups/kanchi/2026-09-25
cd /srv/kanchi-vastra/stack
# database
docker compose exec -T postgres pg_restore --clean --no-owner -U kanchi -d kanchi_vastra < $D/database.dump
# photos (rclone settings: see /usr/local/sbin/kanchi-backup)
rclone sync $D/media G:kanchi-media
```

Restore tested 2026-09-25 into a throwaway container: every table and the
price total matched the live database.

## What changes for PRODUCTION

| | DEV (this server) | PROD (new server) |
|---|---|---|
| Email | Mailpit — caught, never sent | Stalwart on your domain, SPF/DKIM/DMARC |
| Backups | On the same server | Encrypted, copied **off** the server nightly |
| In front | Nothing | Cloudflare (free): attack filtering, hides the server IP |
| Firewall | 22, 80, 443 open | 80/443 only from Cloudflare; 22 key-only + fail2ban |
| SSH | Root key login | Non-root user, key only, password login disabled |
| App | One container | Two containers, replaced one at a time |
| Admin | Password | Password + authenticator-app code |
| Search engines | Blocked (`X-Robots-Tag: noindex`) | Allowed |
| Monitoring | Manual | Uptime alerts |
