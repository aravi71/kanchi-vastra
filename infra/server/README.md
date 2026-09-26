# Server access and hardening

## Getting in

Only one account can log in over SSH: `kvops`, with the key on the owner's
laptop. Root login and passwords are refused.

```bash
ssh -i ~/.ssh/kanchi_vastra_vps kvops@72.61.146.146
sudo -i                                   # root, when needed
```

Scripts use `scripts/lib/remote.sh`, which runs commands as root through
`kvops` + `sudo`.

**Locked out?** Log in to hPanel → VPS → *Browser terminal* (Hostinger's
console, independent of SSH) as root, then fix
`/etc/ssh/sshd_config.d/01-kanchi-hardening.conf` or
`/home/kvops/.ssh/authorized_keys`.

## Internal tools through a tunnel

Nothing internal is published. To look at the test inbox (Mailpit):

```bash
ssh -i ~/.ssh/kanchi_vastra_vps -L 8025:localhost:8025 kvops@72.61.146.146 \
  'sudo docker run --rm --network kanchi_internal -p 127.0.0.1:8025:8025 alpine/socat TCP-LISTEN:8025,fork TCP:mailpit:8025'
# then open http://localhost:8025 on the laptop; Ctrl+C closes it
```

## Hardening

| File | What |
|---|---|
| `harden.sh` | OS baseline: fail2ban, security updates, services off, sysctls, Docker defaults, auditd, rkhunter, kernel modules, banner. Idempotent. |
| `sshd-01-kanchi-hardening.conf` | SSH policy, installed as `/etc/ssh/sshd_config.d/01-kanchi-hardening.conf` |

New server, in order:

1. Create `kvops`, copy the key, add to `docker` and a sudoers file.
2. From a second terminal, confirm `ssh kvops@…` and `sudo -n true` work.
3. Install `sshd-01-kanchi-hardening.conf`, run `sshd -t`, reload ssh.
4. Confirm again from a second terminal that kvops works and root is refused.
5. Run `harden.sh` as root, reboot, run `lynis audit system --quick`.

See `docs/SECURITY.md` for the full security design.
