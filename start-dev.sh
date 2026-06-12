#!/bin/bash
node node_modules/tsx/dist/cli.mjs server.ts &
TSX_PID=$!
sleep 3
node node_modules/vite/bin/vite.js &
VITE_PID=$!
wait $TSX_PID $VITE_PID
