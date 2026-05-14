$ErrorActionPreference = "Stop"
Set-Location -LiteralPath $PSScriptRoot

function Pause-And-Exit([int]$Code) {
  Write-Host ""
  Read-Host "Press Enter to close this window"
  exit $Code
}

Write-Host "CET-6 Pop Culture Vocabulary Card Viewer" -ForegroundColor Cyan
Write-Host "Windows one-click launcher" -ForegroundColor Cyan
Write-Host "Project directory: $PWD"
Write-Host ""

$npmCommand = Get-Command npm.cmd -ErrorAction SilentlyContinue
if (-not $npmCommand) {
  $npmCommand = Get-Command npm -ErrorAction SilentlyContinue
}

if (-not $npmCommand) {
  Write-Host "npm was not found. Please install Node.js LTS first:" -ForegroundColor Yellow
  Write-Host "https://nodejs.org"
  Pause-And-Exit 1
}

try {
  $nodeVersion = (& node -v) 2>$null
  Write-Host "Node: $nodeVersion"
  Write-Host "npm:  $((& $npmCommand.Source -v) 2>$null)"
  Write-Host ""
} catch {
  Write-Host "Node.js was not found or is not working correctly. Please reinstall Node.js LTS:" -ForegroundColor Yellow
  Write-Host "https://nodejs.org"
  Pause-And-Exit 1
}

if (-not (Test-Path -LiteralPath "node_modules")) {
  Write-Host "First launch: installing dependencies. This may take a few minutes..." -ForegroundColor Cyan
  & $npmCommand.Source install
  if ($LASTEXITCODE -ne 0) {
    Write-Host "npm install failed. Please check the error above." -ForegroundColor Red
    Pause-And-Exit $LASTEXITCODE
  }
  Write-Host ""
}

Write-Host "Starting local frontend..." -ForegroundColor Cyan
Write-Host "Keep this window open while using the app."
Write-Host "If the browser does not open automatically, visit: http://localhost:5173"
Write-Host ""

$npmPath = $npmCommand.Source
$devProcess = Start-Process -FilePath $npmPath -ArgumentList @("run", "dev", "--", "--host", "127.0.0.1") -NoNewWindow -PassThru

$opened = $false
for ($i = 0; $i -lt 80; $i++) {
  if ($devProcess.HasExited) {
    Write-Host "The dev server exited before it became ready. Exit code: $($devProcess.ExitCode)" -ForegroundColor Red
    Pause-And-Exit $devProcess.ExitCode
  }

  try {
    Invoke-WebRequest -Uri "http://127.0.0.1:5173" -UseBasicParsing -TimeoutSec 1 | Out-Null
    Start-Process "http://127.0.0.1:5173"
    $opened = $true
    break
  } catch {
    Start-Sleep -Milliseconds 500
  }
}

if (-not $opened) {
  Write-Host "The server did not respond within 40 seconds." -ForegroundColor Yellow
  Write-Host "You can still try opening: http://127.0.0.1:5173"
}

Write-Host ""
Write-Host "Dev server is running. Close this window or press Ctrl+C to stop it." -ForegroundColor Green
Wait-Process -Id $devProcess.Id

Write-Host ""
Write-Host "Dev server stopped. Exit code: $($devProcess.ExitCode)" -ForegroundColor Yellow
Pause-And-Exit $devProcess.ExitCode
