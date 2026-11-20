$ErrorActionPreference = 'SilentlyContinue'
$res = Join-Path $env:LOCALAPPDATA 'Programs\antigravity\resources'
$orig = Join-Path $res 'app.asar'
$bak = Join-Path $res 'app.asar.bak'
$exe = Join-Path $env:LOCALAPPDATA 'Programs\antigravity\Antigravity.exe'
$root = $PSScriptRoot
$launcher = Join-Path $root 'launch_medium.ps1'

if (-not (Test-Path $bak)) {
    exit 1
}

# Stop all Antigravity processes
Get-Process -Name Antigravity -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2

# Restore original app.asar
$swapped = $false
for ($i = 1; $i -le 15; $i++) {
    try {
        Copy-Item -Path $bak -Destination $orig -Force -ErrorAction Stop
        $swapped = $true
        break
    } catch {
        Get-Process -Name Antigravity -ErrorAction SilentlyContinue | Stop-Process -Force
        Start-Sleep -Seconds 1
    }
}

# Relaunch clean Antigravity
if ($swapped -and (Test-Path $exe)) {
    & $launcher -ExePath $exe
}
