#!/bin/bash
# FILE: /var/www/sanwariyas/server/scripts/syncInstagram.sh

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Triggering Instagram sync via Node.js..."

 #  to  going  in the server  file  is necessary so that .env file loads properly
cd /var/www/sanwariyas/server

# Node script  running 
if /root/.nvm/versions/node/v22.23.2/bin/node scripts/syncInstagramReels.js; then
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] Instagram sync successful."
else
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] Instagram sync FAILED."
  exit 1
fi  

