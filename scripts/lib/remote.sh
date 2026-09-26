# shellcheck shell=bash
# ---------------------------------------------------------------------------
#  remote.sh — run a script on the server, as root, through the operator
#  account. Sourced by deploy.sh and the other maintenance scripts.
#
#  SSH accepts only `kvops` with a key (root and passwords are refused); kvops
#  runs the script with sudo. The script travels base64-encoded in the command
#  line, so stdin stays free for data such as the release tarball.
#
#    remote "echo hello from \$(hostname)"
#    git archive HEAD | remote "tar -xf - -C /tmp/x"
# ---------------------------------------------------------------------------

HOST="${DEPLOY_HOST:-kvops@72.61.146.146}"
KEY="${DEPLOY_KEY:-$HOME/.ssh/kanchi_vastra_vps}"

remote() {
  local encoded
  encoded=$(printf '%s' "$1" | base64 -w0)
  ssh -i "$KEY" -o BatchMode=yes -o LogLevel=ERROR -o ServerAliveInterval=15 "$HOST" \
    "f=\$(mktemp) && echo $encoded | base64 -d > \$f && sudo -n bash \$f; rc=\$?; rm -f \$f; exit \$rc"
}
