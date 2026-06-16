$RootDir = Split-Path (Split-Path $MyInvocation.MyCommand.Path -Parent) -Parent
$Target = if ($args.Count -gt 0) { $args[0] } else { "all" }
$ProjectProfile = if ($env:PROJECT_PROFILE) { $env:PROJECT_PROFILE } else { "aps-quality-intelligence-multi-ai" }

Write-Host ""
Write-Host "========================================"
Write-Host " QA Agent Suite Multi IA - Validation"
Write-Host "========================================"
Write-Host ""

function Validate-Tool {
    param(
        [string]$Tool,
        [string]$Label
    )

    if (!(Get-Command $Tool -ErrorAction SilentlyContinue)) {
        Write-Host "ERRO: $Label nao encontrado."
        exit 1
    }

    Write-Host "OK - $Label encontrado"
}

function Validate-CommonFile {
    param(
        [string]$ConfigFile,
        [string]$SetupTarget
    )

    if (!(Test-Path $ConfigFile)) {
        Write-Host "ERRO: MCP nao configurado em $ConfigFile."
        Write-Host "Execute .\scripts\setup-mcp.ps1 $SetupTarget"
        exit 1
    }

    Write-Host "OK - MCP Config encontrado: $ConfigFile"

    $content = Get-Content $ConfigFile -Raw

    if ($content -match "__ORG__|__ORG_URL__|__PAT__|__SERVER_NAME__|__MCP_PACKAGE__") {
        Write-Host "ERRO: MCP Config ainda possui placeholders. Execute .\scripts\setup-mcp.ps1 $SetupTarget novamente."
        exit 1
    }

    Write-Host "OK - Placeholders substituidos"

    if ($content -match "pathaqui|SEU_PAT|SEU_PAT_AQUI") {
        Write-Host "ERRO: AZURE_DEVOPS_PAT ainda esta com valor de exemplo."
        Write-Host "Abra o .env, troque AZURE_DEVOPS_PAT pelo seu PAT real e execute .\scripts\setup-mcp.ps1 $SetupTarget novamente."
        exit 1
    }

    Write-Host "OK - PAT preenchido"

    return $content
}

function Validate-Json {
    param(
        [string]$ConfigFile,
        [string]$Content
    )

    try {
        $null = $Content | ConvertFrom-Json
        Write-Host "OK - MCP Config JSON valido"
    } catch {
        Write-Host "ERRO: MCP Config nao e um JSON valido: $ConfigFile"
        exit 1
    }
}

function Validate-Copilot {
    $configFile = Join-Path (Join-Path $HOME ".copilot") "mcp-config.json"
    $content = Validate-CommonFile $configFile "copilot"
    Validate-Json $configFile $content
    Validate-Tool "copilot" "Copilot CLI"
}

function Validate-Codex {
    $codexHome = if ($env:CODEX_HOME) { $env:CODEX_HOME } else { Join-Path $HOME ".codex" }
    $configFile = Join-Path $codexHome "$ProjectProfile.config.toml"
    $content = Validate-CommonFile $configFile "codex"

    if ($content -notmatch "(?m)^\[mcp_servers\.") {
        Write-Host "ERRO: Codex MCP Config nao contem bloco [mcp_servers.<nome>]."
        exit 1
    }

    Write-Host "OK - Codex MCP Config TOML encontrado"

    if ($content -notmatch '(?m)^default_tools_approval_mode = "approve"') {
        Write-Host "ERRO: Codex MCP Config nao esta configurado para autoaprovar ferramentas do MCP ado."
        Write-Host "Execute .\scripts\setup-mcp.ps1 codex novamente e abra uma nova sessao Codex."
        exit 1
    }

    Write-Host "OK - Codex MCP tools autoaprovadas"
    Validate-Tool "codex" "Codex CLI"
}

function Validate-Claude {
    $configFile = Join-Path $RootDir ".mcp.json"
    $content = Validate-CommonFile $configFile "claude"
    Validate-Json $configFile $content
    Validate-Tool "claude" "Claude Code"
}

Validate-Tool "node" "Node.js"
Validate-Tool "npx" "npx"

switch ($Target) {
    "all" {
        Validate-Copilot
        Validate-Codex
        Validate-Claude
    }
    "copilot" {
        Validate-Copilot
    }
    "codex" {
        Validate-Codex
    }
    "claude" {
        Validate-Claude
    }
    default {
        Write-Host "ERRO: alvo invalido: $Target"
        Write-Host "Use: .\scripts\validate-setup.ps1 [all|copilot|codex|claude]"
        exit 1
    }
}

Write-Host ""
Write-Host "Validacao concluida."
Write-Host ""
