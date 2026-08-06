$RootDir = Split-Path (Split-Path $MyInvocation.MyCommand.Path -Parent) -Parent

Set-Location $RootDir

$EnvFile = ".env"
$Target = if ($args.Count -gt 0) { $args[0] } else { "all" }
$ProjectProfile = if ($env:PROJECT_PROFILE) { $env:PROJECT_PROFILE } else { "aps-quality-intelligence-multi-ai" }

if (-not (Test-Path $EnvFile)) {
    Write-Host ""
    Write-Host "ERRO: arquivo $EnvFile nao encontrado."
    Write-Host ""
    Write-Host "Crie o arquivo a partir do modelo:"
    Write-Host "Copy-Item .env.example .env"
    Write-Host ""
    Write-Host "Depois preencha AZURE_DEVOPS_ORG, AZURE_DEVOPS_ORG_URL e AZURE_DEVOPS_PAT no $EnvFile."
    Write-Host ""
    exit 1
}

if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host ""
    Write-Host "ERRO: Node.js nao encontrado."
    Write-Host ""
    exit 1
}

function Set-PrivateFileAcl {
    param([string]$Path)

    if ($Path -like "$RootDir*") {
        return
    }

    try {
        $acl = Get-Acl $Path -ErrorAction Stop
        $acl.SetAccessRuleProtection($true, $false)
        $currentUser = [System.Security.Principal.WindowsIdentity]::GetCurrent().User
        $rule = New-Object System.Security.AccessControl.FileSystemAccessRule($currentUser, "FullControl", "Allow")
        $acl.SetAccessRule($rule)
        Set-Acl $Path $acl -ErrorAction Stop
    } catch {
        Write-Host "AVISO: nao foi possivel restringir permissoes de $Path automaticamente."
        Write-Host "O arquivo MCP foi gerado, mas confirme que ele esta salvo apenas no seu usuario Windows."
    }
}

function Render-Client {
    param(
        [string]$Client,
        [string]$Template,
        [string]$Output
    )

    node scripts/render-mcp-config.mjs $EnvFile $Template $Output

    if ($LASTEXITCODE -ne 0) {
        exit $LASTEXITCODE
    }

    Set-PrivateFileAcl $Output
    Write-Host "OK - $Client MCP gerado em $Output"
}

$copilotConfig = Join-Path (Join-Path $HOME ".copilot") "mcp-config.json"
$codexHome = if ($env:CODEX_HOME) { $env:CODEX_HOME } else { Join-Path $HOME ".codex" }
$codexConfig = Join-Path $codexHome "$ProjectProfile.config.toml"
$claudeConfig = Join-Path $RootDir ".mcp.json"
$claudeSettings = Join-Path $RootDir ".claude/settings.json"

switch ($Target) {
    "all" {
        Render-Client "Copilot" "clients/copilot/mcp-config.template.json" $copilotConfig
        node scripts/update-copilot-permissions.mjs $EnvFile $RootDir
        Render-Client "Codex" "clients/codex/config.template.toml" $codexConfig
        Render-Client "Claude" "clients/claude/mcp-config.template.json" $claudeConfig
        Render-Client "Claude settings" "clients/claude/settings.template.json" $claudeSettings
    }
    "copilot" {
        Render-Client "Copilot" "clients/copilot/mcp-config.template.json" $copilotConfig
        node scripts/update-copilot-permissions.mjs $EnvFile $RootDir
    }
    "codex" {
        Render-Client "Codex" "clients/codex/config.template.toml" $codexConfig
    }
    "claude" {
        Render-Client "Claude" "clients/claude/mcp-config.template.json" $claudeConfig
        Render-Client "Claude settings" "clients/claude/settings.template.json" $claudeSettings
    }
    default {
        Write-Host ""
        Write-Host "ERRO: alvo invalido: $Target"
        Write-Host "Use: .\scripts\setup-mcp.ps1 [all|copilot|codex|claude]"
        Write-Host ""
        exit 1
    }
}

Write-Host ""
Write-Host "========================================"
Write-Host "QA Agent Suite Multi IA"
Write-Host "Azure DevOps MCP configurado para: $Target"
Write-Host "========================================"
Write-Host ""
Write-Host "Valide com:"
Write-Host ".\scripts\validate-setup.ps1 $Target"
Write-Host ""
