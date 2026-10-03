#!/bin/bash
# FILE: /var/www/sanwariyas/server/scripts/syncInstagram.sh

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Triggering Instagram sync via Node.js..."

# Server folder me jana zaroori hai taaki .env file theek se load ho

cd /var/www/sanwariyas/server

# Node script ko run karna
if /usr/bin/node scripts/syncInstagramReels.js; then
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] Instagram sync successful."
else
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] Instagram sync FAILED."
  exit 1
fi  

