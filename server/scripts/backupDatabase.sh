#!/bin/bash
# FILE: server/scripts/backupDatabase.sh
# PURPOSE: Daily automated backup of the production MongoDB database, with
# automatic cleanup of old backups so the VPS disk never fills up.
#
# SETUP (run once on the production VPS):
#   1. chmod +x server/scripts/backupDatabase.sh
#   2. Add to root's crontab (crontab -e):
#        0 2 * * * /path/to/server/scripts/backupDatabase.sh >> /var/log/mongo-backup.log 2>&1
#      (runs every day at 2 AM; the log line lets you check for failures)
#
# RESTORE (if you ever need it):
#   mongorestore --db sanwariyas /var/backups/mongo/2026-09-25/sanwariyas

set -euo pipefail

DB_NAME="sanwariyas"
BACKUP_ROOT="/var/backups/mongo"
RETENTION_DAYS=30
TODAY=$(date +%F)
DEST="$BACKUP_ROOT/$TODAY"

mkdir -p "$BACKUP_ROOT"

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Starting backup of '$DB_NAME' to $DEST"

if mongodump --db "$DB_NAME" --out "$DEST"; then
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] Backup succeeded."
else
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] BACKUP FAILED — check mongodump output above."
  exit 1
fi

# Delete backup folders older than RETENTION_DAYS, so disk usage stays
# bounded. Only touches directories directly under BACKUP_ROOT that look
# like dated backups (YYYY-MM-DD), never anything else.
find "$BACKUP_ROOT" -maxdepth 1 -type d -name "20*-*-*" -mtime "+$RETENTION_DAYS" -print -exec rm -rf {} \;

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Cleanup of backups older than $RETENTION_DAYS days complete."
