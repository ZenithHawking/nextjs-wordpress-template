#!/usr/bin/env bash
# Give a second user working access to zenith's project directories.
#
# /home/zenith is the real working tree: every docker-compose stack, every bind
# mount and the autopost cron all live under it. A second developer — or an
# agent acting for one — has to land there rather than rebuild a parallel copy
# somewhere else.
#
# Access is granted with ACLs rather than by changing ownership. Several running
# containers bind-mount paths under /home/zenith/*/uploads, and a recursive
# chown/chgrp risks taking write access away from them. ACLs only add.
#
# The home directory itself gets --x, not r-x: the grantee can traverse into a
# project path but cannot list /home/zenith, which is what keeps ~/.ssh and
# ~/.cloudflared out of reach. That tunnel credentials file alone would let
# someone re-serve vansao.com, so it must not be readable.
#
# Usage:
#   ./grant-shared-workdir.sh <username>            # report what would change
#   ./grant-shared-workdir.sh <username> --apply
#   ./grant-shared-workdir.sh <username> --apply --docker

set -uo pipefail

OWNER_HOME=/home/zenith
USER_NAME=${1:-}
APPLY=false
DOCKER=false
for arg in "$@"; do
    [[ $arg == --apply  ]] && APPLY=true
    [[ $arg == --docker ]] && DOCKER=true
done

if [[ -z $USER_NAME || $USER_NAME == --* ]]; then
    echo "Usage: $0 <username> [--apply] [--docker]" >&2
    exit 1
fi

if ! id "$USER_NAME" >/dev/null 2>&1; then
    echo "Không có user '$USER_NAME' trên máy." >&2
    exit 1
fi

run() { if $APPLY; then "$@"; else echo "    [dry-run] $*"; fi; }

echo "User       : $USER_NAME"
echo "Thư mục gốc: $OWNER_HOME"
echo

if ! command -v setfacl >/dev/null 2>&1; then
    echo "Thiếu setfacl. Cài trước:  sudo apt install -y acl" >&2
    exit 1
fi

# Everything that is not a dotfile. Dotfiles hold credentials and shell state,
# and are deliberately left alone.
mapfile -t PROJECTS < <(find "$OWNER_HOME" -maxdepth 1 -mindepth 1 -type d ! -name '.*' -printf '%f\n' | sort)

echo "Sẽ cấp quyền đọc/ghi cho ${#PROJECTS[@]} thư mục project:"
printf '    %s\n' "${PROJECTS[@]}"
echo
echo "Giữ kín (không cấp):"
find "$OWNER_HOME" -maxdepth 1 -mindepth 1 -name '.*' -printf '    %f\n' | sort
echo

echo "[1/3] Cho phép đi xuyên qua $OWNER_HOME, không cho liệt kê"
run setfacl -m "u:$USER_NAME:--x" "$OWNER_HOME"

echo "[2/3] Cấp quyền trên từng project (kèm ACL mặc định cho file tạo sau)"
for p in "${PROJECTS[@]}"; do
    echo "  $p"
    run setfacl -R    -m "u:$USER_NAME:rwX" "$OWNER_HOME/$p"
    run setfacl -R -d -m "u:$USER_NAME:rwX" "$OWNER_HOME/$p"
done

echo "[3/3] Nhóm docker"
if $DOCKER; then
    # Membership of the docker group is equivalent to root: anyone in it can
    # mount / into a container. Only granted when asked for explicitly.
    run usermod -aG docker "$USER_NAME"
else
    echo "    bỏ qua (thêm --docker nếu cần chạy docker compose)"
fi

echo
if $APPLY; then
    echo "Xong. Kiểm tra:"
    echo "  sudo -u $USER_NAME ls $OWNER_HOME            # phải bị từ chối"
    echo "  sudo -u $USER_NAME ls $OWNER_HOME/vansao-docker"
    echo "  sudo -u $USER_NAME docker ps"
else
    echo "Dry run. Thêm --apply để thực hiện."
fi
