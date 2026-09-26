#!/usr/bin/env bash
# ---------------------------------------------------------------------------
#  harden.sh — security baseline for a Kanchi Vastra server (Ubuntu 24.04).
#  Run as root. Idempotent: safe to run again after upgrades or on a new
#  server. SSH lock-down is a separate, verified step (see infra/server/README.md)
#  so a mistake can never lock the operator out.
#
#  What it does
#    1. fail2ban      bans addresses that guess SSH logins (1 h; repeat -> 1 week)
#    2. updates       automatic security updates, stale kernels removed
#    3. services      turns off desktop leftovers that a web server never needs
#    4. kernel        network hardening sysctls (Docker keeps ip_forward)
#    5. Docker        no-new-privileges and log limits for every container
#    6. accounts      locks unused logins
#    7. audit tools   lynis for a periodic hardening score
# ---------------------------------------------------------------------------
set -euo pipefail
[ "$(id -u)" = 0 ] || { echo "run as root"; exit 1; }
export DEBIAN_FRONTEND=noninteractive
say() { printf '\n== %s\n' "$*"; }

say "1. fail2ban"
apt-get install -y -qq fail2ban >/dev/null
cat > /etc/fail2ban/jail.d/kanchi.local <<'EOF'
[DEFAULT]
backend  = systemd
banaction = ufw
findtime = 10m

[sshd]
enabled  = true
maxretry = 5
bantime  = 1h

# Addresses banned again and again are banned for a week.
[recidive]
enabled  = true
backend  = auto
logpath  = /var/log/fail2ban.log
bantime  = 1w
findtime = 1d
maxretry = 3
EOF
systemctl enable --now fail2ban >/dev/null 2>&1
systemctl restart fail2ban

say "2. automatic security updates"
apt-get install -y -qq unattended-upgrades needrestart >/dev/null
cat > /etc/apt/apt.conf.d/20auto-upgrades <<'EOF'
APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Unattended-Upgrade "1";
APT::Periodic::AutocleanInterval "7";
EOF
cat > /etc/apt/apt.conf.d/52kanchi-unattended <<'EOF'
// Security updates install nightly. Reboots stay manual (the uptime
// monitor reports "reboot required") so the shop is never restarted
// in the middle of an order.
Unattended-Upgrade::Remove-Unused-Kernel-Packages "true";
Unattended-Upgrade::Remove-Unused-Dependencies "true";
Unattended-Upgrade::Automatic-Reboot "false";
EOF

say "3. services a web server does not need"
for unit in x2goserver cups cups-browsed avahi-daemon bluetooth ModemManager \
            kerneloops wpa_supplicant gpu-manager; do
  if systemctl list-unit-files "$unit.service" --no-legend 2>/dev/null | grep -q .; then
    systemctl disable --now "$unit.service" >/dev/null 2>&1 || true
    systemctl mask "$unit.service" >/dev/null 2>&1 || true
    echo "  off: $unit"
  fi
done
for sock in cups.socket avahi-daemon.socket; do
  systemctl disable --now "$sock" >/dev/null 2>&1 || true
  systemctl mask "$sock" >/dev/null 2>&1 || true
done

say "4. kernel network hardening"
cat > /etc/sysctl.d/60-kanchi-hardening.conf <<'EOF'
# Drop spoofed and redirected packets; keep SYN floods from filling queues.
net.ipv4.conf.all.rp_filter = 1
net.ipv4.conf.default.rp_filter = 1
net.ipv4.conf.all.accept_redirects = 0
net.ipv4.conf.default.accept_redirects = 0
net.ipv6.conf.all.accept_redirects = 0
net.ipv6.conf.default.accept_redirects = 0
net.ipv4.conf.all.send_redirects = 0
net.ipv4.conf.default.send_redirects = 0
net.ipv4.conf.all.accept_source_route = 0
net.ipv6.conf.all.accept_source_route = 0
net.ipv4.conf.all.log_martians = 1
net.ipv4.tcp_syncookies = 1
net.ipv4.icmp_echo_ignore_broadcasts = 1
# Hide kernel addresses and logs from unprivileged users.
kernel.kptr_restrict = 2
kernel.dmesg_restrict = 1
kernel.unprivileged_bpf_disabled = 1
fs.protected_symlinks = 1
fs.protected_hardlinks = 1
fs.suid_dumpable = 0
# Docker needs forwarding; leave net.ipv4.ip_forward alone.
EOF
sysctl -q --system

say "5. Docker defaults"
python3 - <<'PY'
import json, pathlib
p = pathlib.Path('/etc/docker/daemon.json')
cfg = json.loads(p.read_text()) if p.exists() else {}
cfg.update({
    "log-driver": "json-file",
    "log-opts": {"max-size": "10m", "max-file": "3"},
    "live-restore": True,
    # No process in any container may gain privileges (setuid etc.).
    "no-new-privileges": True,
})
p.write_text(json.dumps(cfg, indent=2) + "\n")
PY
systemctl reload docker 2>/dev/null || systemctl restart docker

say "6. unused logins"
for u in ubuntu x2goprint; do
  id "$u" >/dev/null 2>&1 && { usermod -L -s /usr/sbin/nologin "$u"; echo "  locked: $u"; }
done

say "7. audit tools"
apt-get install -y -qq lynis debsums apt-show-versions apt-listchanges libpam-tmpdir >/dev/null
echo "  run: lynis audit system --quick"

say "8. audit trail (auditd)"
apt-get install -y -qq auditd >/dev/null
cat > /etc/audit/rules.d/60-kanchi.rules <<'EOF'
# Who changed accounts, privileges, SSH or Docker - kept even if an attacker
# later edits the normal logs. Search with: ausearch -k <key>
-w /etc/passwd -p wa -k identity
-w /etc/group -p wa -k identity
-w /etc/shadow -p wa -k identity
-w /etc/sudoers -p wa -k privilege
-w /etc/sudoers.d/ -p wa -k privilege
-w /etc/ssh/sshd_config -p wa -k sshd
-w /etc/ssh/sshd_config.d/ -p wa -k sshd
-w /etc/docker/ -p wa -k docker
-w /srv/kanchi-vastra/shared/ -p wa -k secrets
-w /srv/kanchi-vastra/stack/.env -p wa -k secrets
-w /usr/bin/docker -p x -k docker-cli
EOF
augenrules --load >/dev/null 2>&1 || true
systemctl enable --now auditd >/dev/null 2>&1

say "9. rootkit scanner"
apt-get install -y -qq rkhunter >/dev/null
sed -i 's/^CRON_DAILY_RUN=.*/CRON_DAILY_RUN="true"/; s/^APT_AUTOGEN=.*/APT_AUTOGEN="true"/' /etc/default/rkhunter
sed -i 's|^WEB_CMD=.*|WEB_CMD=""|' /etc/rkhunter.conf
rkhunter --propupd -q || true

say "10. unused kernel features"
cat > /etc/modprobe.d/60-kanchi-blacklist.conf <<'EOF'
# Network protocols and USB storage a cloud web server never uses.
install dccp /bin/true
install sctp /bin/true
install rds /bin/true
install tipc /bin/true
install usb-storage /bin/true
EOF
printf '* hard core 0\n' > /etc/security/limits.d/60-kanchi-nocore.conf
sed -i 's/^UMASK\s.*/UMASK\t\t027/' /etc/login.defs

say "11. accounting and banner"
apt-get install -y -qq acct >/dev/null
systemctl enable --now acct >/dev/null 2>&1 || true
sed -i 's/^ENABLED=.*/ENABLED="true"/' /etc/default/sysstat 2>/dev/null || true
systemctl enable --now sysstat >/dev/null 2>&1 || true
BANNER='Authorised access only. Activity on this system is monitored and recorded.'
echo "$BANNER" > /etc/issue
echo "$BANNER" > /etc/issue.net

say "12. leftover package configuration"
dpkg -l | awk '/^rc/{print $2}' | xargs -r dpkg --purge >/dev/null 2>&1 || true
apt-get autoremove -y -qq >/dev/null

say "done"
