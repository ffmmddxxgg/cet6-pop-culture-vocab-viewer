#!/bin/zsh
set -e

cd "$(dirname "$0")"

if ! command -v npm >/dev/null 2>&1; then
  echo "未找到 npm。请先安装 Node.js: https://nodejs.org"
  exit 1
fi

if [ ! -d "node_modules" ]; then
  npm install
fi

(
  for i in {1..60}; do
    if curl -fsS "http://localhost:5173" >/dev/null 2>&1; then
      open "http://localhost:5173" >/dev/null 2>&1
      exit 0
    fi
    sleep 0.5
  done
) >/dev/null 2>&1 &
npm run dev -- --host 127.0.0.1
