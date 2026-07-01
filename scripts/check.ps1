$RootDir = Split-Path (Split-Path $MyInvocation.MyCommand.Path -Parent) -Parent

Set-Location $RootDir

$ErrorActionPreference = "Stop"

function Test-Command {
    param(
        [string]$Command,
        [string]$Label
    )

    if (!(Get-Command $Command -ErrorAction SilentlyContinue)) {
        Write-Host "ERRO: $Label nao encontrado."
        exit 1
    }
}

Test-Command "node" "Node.js"
Test-Command "git" "Git"

node --check scripts/render-mcp-config.mjs
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

node --check scripts/validate-agent-assets.mjs
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

node scripts/test-render-mcp-config.mjs
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

node scripts/validate-agent-assets.mjs
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

git diff --check
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "OK - repository checks passed"
