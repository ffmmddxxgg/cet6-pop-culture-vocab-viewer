$ErrorActionPreference = "Stop"
Set-Location -LiteralPath $PSScriptRoot

Write-Host "CET-6 Pop Culture Vocabulary Card Viewer" -ForegroundColor Cyan
Write-Host "Project directory: $PWD"
Write-Host ""

if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
  Write-Host "npm was not found. Please install Node.js first:" -ForegroundColor Yellow
  Write-Host "https://nodejs.org"
  Write-Host ""
  Read-Host "Press Enter to close"
  exit 1
}

if (-not (Test-Path -LiteralPath "node_modules")) {
  Write-Host "First launch: installing dependencies..." -ForegroundColor Cyan
  npm install
  if ($LASTEXITCODE -ne 0) {
    Write-Host "npm install failed." -ForegroundColor Red
    Read-Host "Press Enter to close"
    exit $LASTEXITCODE
  }
  Write-Host ""
}

Write-Host "Starting local frontend..." -ForegroundColor Cyan
Write-Host "If the browser does not open automatically, visit: http://localhost:5173"
Write-Host ""

Start-Job -ScriptBlock {
  for ($i = 0; $i -lt 60; $i++) {
    try {
      Invoke-WebRequest -Uri "http://localhost:5173" -UseBasicParsing -TimeoutSec 1 | Out-Null
      Start-Process "http://localhost:5173"
      break
    } catch {
      Start-Sleep -Milliseconds 500
    }
  }
} | Out-Null

npm run dev -- --host 127.0.0.1
