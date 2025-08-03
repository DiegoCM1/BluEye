#!/usr/bin/env bash
curl -X POST "https://metaquetzal-production.up.railway.app/api/notifications/send-all" \
  -H "x-api-key:$NOTIF_API_KEY" \
  -H "Content-Type: application/json; charset=utf-8" \
  --data-binary @payload.json
