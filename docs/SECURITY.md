# Security

Kanchi Vastra's production server is secured in layers ("defence in depth"):
an attacker has to defeat every layer, each failure is noticed quickly, and
backups make recovery possible even after a total loss. No system is 100%
secure — the aim is to make attacks expensive, noisy and survivable.

Last reviewed: 2026-09-26 (server srv1396079, Ubuntu 24.04, Lynis audit).

## Layers

| # | Layer | Control | Stops |
|---|---|---|---|
| 1 | Network edge | `ufw`: only 22, 80, 443 open. Verified from outside: 5432 (database), 3900–3903 (storage), 8025/1025 (mail) closed | Direct attacks on internal services |
| 2 | Server login | SSH: only `kvops`, only with the key; root login and all passwords refused; 3 tries; `fail2ban` bans guessers (1 h, repeat offenders 1 week) | Password guessing, stolen/weak passwords |
| 3 | Operating system | Nightly security updates; desktop/remote-desktop software and the unused host mail server removed; kernel network hardening; unused protocols and USB storage disabled; no core dumps | Known vulnerabilities, unused attack surface |
| 4 | Containers | Every container: `no-new-privileges`, all Linux capabilities dropped except those named, memory and process limits; app, storage and inbox run read-only; app runs as an unprivileged user | A compromised component taking over the server or planting files |
| 5 | Private networks | PostgreSQL and the test inbox are on an `internal` Docker network with no internet route; Caddy is not attached to it | Reaching the database even from the web container's neighbours |
| 6 | Web front | HTTPS only (Let's Encrypt, HSTS); CSP, `nosniff`, frame and referrer policies; probe paths (`/.env`, `/.git`, `wp-*`, `*.php`) answer 404 at Caddy; `/media` read-only; 12 MB request cap; slow-client timeouts | Man-in-the-middle, clickjacking, scanners, slowloris |
| 7 | Application | Settings validated (Zod), never in code; `server-only` modules; images never processed by the app; database access only through Prisma (parameterised) | Leaked secrets, SQL injection, SSRF through images |
| 8 | Secrets | `shared/app.env`, `stack/.env`, `garage.toml` root-only (600); passwords generated on the server and never printed; nothing secret in git or in images (BuildKit secret) | Secrets leaking through code, images or chat |
| 9 | Detection | `auditd` records changes to accounts, sudo, SSH, Docker and secrets; `rkhunter` daily; process accounting; uptime monitoring with Telegram alerts (in progress) | Unnoticed intrusion or outage |
| 10 | Recovery | Nightly backup (database, photos, settings) with a tested restore; off-site encrypted copy to Google Drive and hourly database backups (in progress) | Data loss, ransomware, server loss |

## Accepted risks and why

| Risk | Why accepted / what mitigates it |
|---|---|
| SSH port 22 is reachable | Key-only, one user, fail2ban. Restricting by IP would lock the owner out on a changing home IP. |
| One server (no second site) | Replicas on one machine cannot survive its loss; off-site backups + a rebuild runbook give recovery in about an hour. A second server comes with growth. |
| No web application firewall yet | Cloudflare (free) goes in front once the kanchivastra.in domain exists; it also hides the server's IP. |
| No boot-loader password | Would block Hostinger's emergency console, the recovery path. The console itself is protected by the Hostinger account (enable 2FA there). |
| 4 `npm audit` findings | Build-time Prisma CLI only; absent from the runtime image (see ARCHITECTURE.md). |
| Test inbox (Mailpit) on the server | Not published; reachable only through an SSH tunnel. Replaced by the real mail server once the domain exists. |

## What the owner must protect

1. **This laptop's SSH key** (`~/.ssh/kanchi_vastra_vps`) — it is the only way
   in. Keep a copy in a password manager; if the laptop is lost, remove the key
   from the server through the Hostinger console and issue a new one.
2. **The Hostinger account** — turn on two-factor authentication. Whoever
   controls it controls the server.
3. **The GitHub account** — two-factor authentication on.
4. **`C:\Users\aravi\Kanchi-Vastra\DEV-server-passwords.txt`** — private; never
   share or upload.

## Verifying

```bash
# from any computer: only 22, 80, 443 should answer
for p in 22 80 443 5432 3900 8025; do timeout 3 bash -c "exec 3<>/dev/tcp/72.61.146.146/$p" 2>/dev/null && echo "$p open" || echo "$p closed"; done

# on the server
sudo fail2ban-client status sshd        # who is being banned
sudo ausearch -k sshd -i | tail         # who changed the SSH settings
sudo lynis audit system --quick         # hardening score
```
