<#
.SYNOPSIS
    WorkFlow Pro — Folder Scanner & Auto-Updater
    
.DESCRIPTION
    Scans the D:\WFH project folder, detects new/modified files,
    updates timestamps in tracked documents, and appends entries to TRACKLOG.md.
    
    Run modes:
      - On-demand: .\FOLDER_SCANNER.ps1
      - Watch loop: .\FOLDER_SCANNER.ps1 -Watch
      - Single scan: .\FOLDER_SCANNER.ps1 -Scan
    
.PARAMETER Watch
    Starts a continuous watch loop that scans every 30 seconds.
    
.PARAMETER Scan
    Runs a single scan and exits.
    
.PARAMETER ScanIntervalSeconds
    How often to scan in Watch mode (default: 30 seconds)
    
.EXAMPLE
    .\FOLDER_SCANNER.ps1 -Watch
    .\FOLDER_SCANNER.ps1 -Scan
#>

param(
    [switch]$Watch,
    [switch]$Scan,
    [int]$ScanIntervalSeconds = 30
)

# ============================================================
# CONFIGURATION
# ============================================================

$ProjectRoot    = "D:\WFH"
$TrackLogFile   = Join-Path $ProjectRoot "TRACKLOG.md"
$StateFile      = Join-Path $ProjectRoot ".scan_state.json"

# Files and folders to EXCLUDE from scanning
$ExcludePatterns = @(
    ".git",
    "node_modules",
    ".agents",
    "__pycache__",
    ".scan_state.json",
    "*.pyc",
    "*.log",
    "*.tmp"
)

# Files that contain "Last Updated" timestamps to auto-update
$TimestampedFiles = @(
    "PROJECT_DESCRIPTION.md",
    "REQUIREMENTS.md",
    "ARCHITECTURE.md",
    "FEATURE_LIST.md",
    "DATABASE_SCHEMA.md",
    "SYSTEM_WORKFLOW.md",
    "TRACKLOG.md"
)

# Feature indicator patterns — if a file changes, which feature is affected
$FeaturePatterns = @{
    "auth"         = "F01 - Authentication System"
    "company"      = "F02 - Company Management"
    "employee"     = "F03 - Employee Management"
    "department"   = "F04 - Department Management"
    "team"         = "F05 - Team Management"
    "project"      = "F06 - Project Management"
    "task"         = "F07 - Task Management"
    "assignment"   = "F08 - Assignment Management"
    "wfh"          = "F09 - WFH Management"
    "attendance"   = "F10 - Attendance System"
    "report"       = "F11 - Daily Work Reports"
    "weekly"       = "F12 - Weekly Work Planning"
    "dashboard"    = "F13/F14 - Dashboard"
    "notification" = "F15 - Notifications"
    "chat"         = "F20 - Team Chat"
    "meeting"      = "F21 - Meeting Management"
    "goal"         = "F22 - Goals & KPIs"
    "performance"  = "F23 - Performance Analytics"
    "ai"           = "F25 - AI Assistant"
    "webmcp"       = "F28 - WebMCP Integration"
}

# ============================================================
# FUNCTIONS
# ============================================================

function Write-Log {
    param([string]$Message, [string]$Level = "INFO")
    $ts = Get-Date -Format "HH:mm:ss"
    $color = switch ($Level) {
        "INFO"    { "Cyan" }
        "NEW"     { "Green" }
        "CHANGED" { "Yellow" }
        "ERROR"   { "Red" }
        default   { "White" }
    }
    Write-Host "[$ts] [$Level] $Message" -ForegroundColor $color
}

function Should-Exclude {
    param([string]$Path)
    foreach ($pattern in $ExcludePatterns) {
        if ($Path -like "*$pattern*") { return $true }
    }
    return $false
}

function Get-FileState {
    param([string]$RootPath)
    
    $state = @{}
    $files = Get-ChildItem -Path $RootPath -Recurse -File -Force |
             Where-Object { -not (Should-Exclude $_.FullName) }
    
    foreach ($file in $files) {
        $relativePath = $file.FullName.Replace($RootPath + "\", "")
        $state[$relativePath] = @{
            LastWriteTime = $file.LastWriteTimeUtc.ToString("o")
            Size          = $file.Length
        }
    }
    return $state
}

function Load-State {
    if (Test-Path $StateFile) {
        $json = Get-Content $StateFile -Raw
        return $json | ConvertFrom-Json -AsHashtable
    }
    return @{}
}

function Save-State {
    param([hashtable]$State)
    $State | ConvertTo-Json -Depth 5 | Set-Content $StateFile -Encoding UTF8
}

function Detect-Feature {
    param([string]$FilePath)
    $lower = $FilePath.ToLower()
    foreach ($key in $FeaturePatterns.Keys) {
        if ($lower -like "*$key*") {
            return $FeaturePatterns[$key]
        }
    }
    return "General"
}

function Update-Timestamps {
    param([string]$Timestamp)
    
    foreach ($fileName in $TimestampedFiles) {
        $filePath = Join-Path $ProjectRoot $fileName
        if (Test-Path $filePath) {
            $content = Get-Content $filePath -Raw -Encoding UTF8
            # Update "Last Updated:" line
            $updated = $content -replace '(\*\*Last Updated:\*\* )[\d]{4}-[\d]{2}-[\d]{2}T[\d:+]+', "`${1}$Timestamp"
            if ($updated -ne $content) {
                $updated | Set-Content $filePath -Encoding UTF8 -NoNewline
                Write-Log "Updated timestamp in $fileName" "CHANGED"
            }
        }
    }
}

function Append-TrackLog {
    param(
        [string]$Timestamp,
        [string]$EventType,
        [string]$FileOrFeature,
        [string]$Description,
        [int]$EntryNumber
    )
    
    if (-not (Test-Path $TrackLogFile)) {
        Write-Log "TRACKLOG.md not found!" "ERROR"
        return
    }
    
    $content   = Get-Content $TrackLogFile -Raw -Encoding UTF8
    $paddedNum = $EntryNumber.ToString().PadLeft(3, '0')
    $newRow    = "| $paddedNum | $Timestamp | $EventType | $FileOrFeature | $Description |"
    
    # Insert before the closing of the log table (before the blank line after last row)
    # Find the last table row and append after it
    $lines    = $content -split "`n"
    $lastRowIdx = -1
    for ($i = $lines.Length - 1; $i -ge 0; $i--) {
        if ($lines[$i] -match '^\| \d{3} \|') {
            $lastRowIdx = $i
            break
        }
    }
    
    if ($lastRowIdx -ge 0) {
        $before = ($lines[0..$lastRowIdx]) -join "`n"
        $after  = ($lines[($lastRowIdx + 1)..($lines.Length - 1)]) -join "`n"
        $newContent = $before + "`n" + $newRow + "`n" + $after
        $newContent | Set-Content $TrackLogFile -Encoding UTF8 -NoNewline
    }
}

function Get-NextLogEntry {
    if (-not (Test-Path $TrackLogFile)) { return 1 }
    $content = Get-Content $TrackLogFile -Raw
    $matches = [regex]::Matches($content, '^\| (\d{3}) \|', [System.Text.RegularExpressions.RegexOptions]::Multiline)
    if ($matches.Count -eq 0) { return 1 }
    $last = ($matches | ForEach-Object { [int]$_.Groups[1].Value } | Measure-Object -Maximum).Maximum
    return $last + 1
}

function Update-ScanTable {
    param([string]$Timestamp, [int]$ScanNum, [int]$TotalFiles, [int]$NewFiles, [int]$ModifiedFiles)
    
    if (-not (Test-Path $TrackLogFile)) { return }
    
    $content = Get-Content $TrackLogFile -Raw -Encoding UTF8
    $paddedScan = $ScanNum.ToString().PadLeft(3, '0')
    $newScanRow = "| $paddedScan | $Timestamp | $TotalFiles | $NewFiles | $ModifiedFiles |"
    
    $lines = $content -split "`n"
    $lastScanIdx = -1
    for ($i = $lines.Length - 1; $i -ge 0; $i--) {
        if ($lines[$i] -match '^\| \d{3} \| \d{4}-') {
            $lastScanIdx = $i
            break
        }
    }
    
    if ($lastScanIdx -ge 0) {
        $before = ($lines[0..$lastScanIdx]) -join "`n"
        $after  = ($lines[($lastScanIdx + 1)..($lines.Length - 1)]) -join "`n"
        $newContent = $before + "`n" + $newScanRow + "`n" + $after
        $newContent | Set-Content $TrackLogFile -Encoding UTF8 -NoNewline
    }
}

function Run-Scan {
    param([int]$ScanNumber = 1)
    
    $timestamp = Get-Date -Format "yyyy-MM-ddTHH:mm:sszzz"
    Write-Log "=== SCAN #$ScanNumber STARTED ===" "INFO"
    Write-Log "Scanning: $ProjectRoot" "INFO"
    
    # Load previous state
    $oldState = Load-State
    
    # Get current state
    $newState = Get-FileState -RootPath $ProjectRoot
    
    $newFiles      = @()
    $modifiedFiles = @()
    $deletedFiles  = @()
    
    # Detect new and modified
    foreach ($path in $newState.Keys) {
        if (-not $oldState.ContainsKey($path)) {
            $newFiles += $path
            Write-Log "NEW: $path" "NEW"
        } elseif ($oldState[$path].LastWriteTime -ne $newState[$path].LastWriteTime) {
            $modifiedFiles += $path
            Write-Log "MODIFIED: $path" "CHANGED"
        }
    }
    
    # Detect deleted
    foreach ($path in $oldState.Keys) {
        if (-not $newState.ContainsKey($path)) {
            $deletedFiles += $path
            Write-Log "DELETED: $path" "ERROR"
        }
    }
    
    # Update timestamps in tracked docs if there are changes
    if ($newFiles.Count -gt 0 -or $modifiedFiles.Count -gt 0) {
        Update-Timestamps -Timestamp $timestamp
    }
    
    # Append to tracklog
    $entryNum = Get-NextLogEntry
    
    foreach ($file in $newFiles) {
        $feature = Detect-Feature -FilePath $file
        Append-TrackLog -Timestamp $timestamp -EventType "CREATE" -FileOrFeature $file -Description "New file detected in project. Feature: $feature" -EntryNumber $entryNum
        $entryNum++
    }
    
    foreach ($file in $modifiedFiles) {
        $feature = Detect-Feature -FilePath $file
        Append-TrackLog -Timestamp $timestamp -EventType "MODIFY" -FileOrFeature $file -Description "File modified. Feature: $feature" -EntryNumber $entryNum
        $entryNum++
    }
    
    foreach ($file in $deletedFiles) {
        Append-TrackLog -Timestamp $timestamp -EventType "DELETE" -FileOrFeature $file -Description "File deleted from project" -EntryNumber $entryNum
        $entryNum++
    }
    
    # Update scan results table
    Update-ScanTable -Timestamp $timestamp -ScanNum $ScanNumber -TotalFiles $newState.Count -NewFiles $newFiles.Count -ModifiedFiles $modifiedFiles.Count
    
    # Save new state
    Save-State -State $newState
    
    $summary = "Scan complete: $($newState.Count) total, $($newFiles.Count) new, $($modifiedFiles.Count) modified, $($deletedFiles.Count) deleted"
    Write-Log $summary "INFO"
    Write-Log "=== SCAN #$ScanNumber COMPLETE ===" "INFO"
    
    return @{
        TotalFiles    = $newState.Count
        NewFiles      = $newFiles.Count
        ModifiedFiles = $modifiedFiles.Count
        DeletedFiles  = $deletedFiles.Count
    }
}

# ============================================================
# MAIN
# ============================================================

Write-Host ""
Write-Host "================================================" -ForegroundColor Magenta
Write-Host "  WorkFlow Pro - Folder Scanner v1.0" -ForegroundColor Magenta
Write-Host "  Project: D:\WFH" -ForegroundColor Magenta
Write-Host "================================================" -ForegroundColor Magenta
Write-Host ""

if ($Watch) {
    Write-Log "Starting WATCH mode (scan every ${ScanIntervalSeconds}s). Press Ctrl+C to stop." "INFO"
    $scanNum = 1
    while ($true) {
        Run-Scan -ScanNumber $scanNum | Out-Null
        $scanNum++
        Write-Log "Next scan in $ScanIntervalSeconds seconds..." "INFO"
        Start-Sleep -Seconds $ScanIntervalSeconds
    }
} elseif ($Scan -or (-not $Watch -and -not $Scan)) {
    # Default: single scan
    $result = Run-Scan -ScanNumber 1
    Write-Host ""
    Write-Host "Results:" -ForegroundColor Green
    Write-Host "  Total Files   : $($result.TotalFiles)" -ForegroundColor White
    Write-Host "  New Files     : $($result.NewFiles)" -ForegroundColor Green
    Write-Host "  Modified Files: $($result.ModifiedFiles)" -ForegroundColor Yellow
    Write-Host "  Deleted Files : $($result.DeletedFiles)" -ForegroundColor Red
    Write-Host ""
    Write-Host "TRACKLOG.md has been updated." -ForegroundColor Cyan
}
