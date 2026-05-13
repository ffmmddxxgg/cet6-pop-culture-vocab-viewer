#!/bin/zsh
set -e

cd "$(dirname "$0")"

echo "CET-6 Pop Culture Vocabulary Card Viewer"
echo "项目目录: $(pwd)"
echo ""

if ! command -v npm >/dev/null 2>&1; then
  echo "未找到 npm。请先安装 Node.js:"
  echo "https://nodejs.org"
  echo ""
  echo "安装完成后，重新双击这个文件。"
  echo ""
  read "reply?按回车键关闭窗口..."
  exit 1
fi

if [ ! -d "node_modules" ]; then
  echo "首次启动：正在安装依赖..."
  npm install
  echo ""
fi

echo "正在启动本地前端..."
echo "如果浏览器没有自动打开，请访问: http://localhost:5173"
echo ""

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
