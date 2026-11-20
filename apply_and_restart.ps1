$root = $PSScriptRoot
if (-not $root) {
    $root = Split-Path -Parent $MyInvocation.MyCommand.Definition
}
$logFile = Join-Path $root 'install.log'
function Log($msg) {
    $ts = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
    Add-Content -Path $logFile -Value "[$ts] $msg" -Encoding UTF8 -ErrorAction SilentlyContinue
}

Log "=== Apply & Restart started ==="

$localAppData = if ($env:LOCALAPPDATA) { $env:LOCALAPPDATA } else { Join-Path $env:USERPROFILE 'AppData\Local' }
$res = Join-Path $localAppData 'Programs\antigravity\resources'
$orig = Join-Path $res 'app.asar'
$bak = Join-Path $res 'app.asar.bak'
$patched = Join-Path $res 'app.asar.patched'
$exe = Join-Path $localAppData 'Programs\antigravity\Antigravity.exe'
$launcher = Join-Path $root 'launch_medium.ps1'
$patcher = Join-Path $root 'patch_asar.py'
$uiScript = Join-Path $root 'qusaCustomUI.js'

# 1. Ensure backup exists
if (-not (Test-Path $bak)) {
    if (Test-Path $orig) {
        Copy-Item $orig $bak -Force
        Log "Created backup app.asar.bak"
    }
}

# 2. Ensure patched ASAR exists and is valid
$needsPatch = $true
if (Test-Path $patched) {
    $checkOut = & python $patcher --check $patched 2>&1
    if ($LASTEXITCODE -eq 0) {
        $needsPatch = $false
        Log "Using existing valid app.asar.patched"
    }
}

if ($needsPatch) {
    $src = if (Test-Path $bak) { $bak } else { $orig }
    Log "Patching from $src..."
    & python $patcher --patch $src --ui $uiScript --out $patched --force
    Log "Patch completed with exit code $LASTEXITCODE"
}

# 3. Kill all running Antigravity processes
Log "Stopping Antigravity processes..."
Get-Process -Name Antigravity -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2

# Wait until processes are completely terminated
for ($w = 1; $w -le 10; $w++) {
    $procs = @(Get-Process -Name Antigravity -ErrorAction SilentlyContinue)
    if ($procs.Count -eq 0) {
        Log "All Antigravity processes stopped."
        break
    }
    Log "Waiting for $($procs.Count) processes to exit..."
    $procs | Stop-Process -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 1
}

# 4. Replace app.asar with retry loop
$swapped = $false
for ($i = 1; $i -le 15; $i++) {
    try {
        Move-Item -Path $patched -Destination $orig -Force -ErrorAction Stop
        $swapped = $true
        Log "Successfully moved app.asar.patched -> app.asar!"
        break
    } catch {
        Log "Swap attempt $i failed: $_. Retrying in 1s..."
        Start-Sleep -Seconds 1
    }
}

if (-not $swapped) {
    Log "ERROR: Could not replace app.asar after 15 attempts!"
    exit 1
}

# 5. Verify target app.asar is patched
$verifyOut = & python $patcher --check $orig 2>&1
Log "Verification of app.asar: $verifyOut (code=$LASTEXITCODE)"

# 6. Start background watcher
$hiddenStarter = Join-Path $root 'start_watcher_hidden.vbs'
if (Test-Path $hiddenStarter) {
    Log "Starting background watcher..."
    Start-Process -FilePath 'wscript.exe' -ArgumentList "//B //Nologo `"$hiddenStarter`"" -ErrorAction SilentlyContinue
}

# 7. Launch Antigravity
Log "Launching Antigravity..."
if (Test-Path $launcher) {
    & $launcher -ExePath $exe
} else {
    Start-Process $exe
}
Log "=== Apply & Restart finished successfully ==="
