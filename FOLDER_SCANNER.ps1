$folderToWatch = "D:\WFH\backend\src", "D:\WFH\frontend\src"
$logFile = "D:\WFH\TRACKLOG.md"

if (-Not (Test-Path $logFile)) {
    New-Item -Path $logFile -ItemType File -Force | Out-Null
    Add-Content -Path $logFile -Value "# Project Track Log`n`nTracking every feature addition and update...`n"
}

Write-Host "Starting Folder Scanner Loop. Monitoring for changes in $folderToWatch"
Write-Host "Updates will be logged to $logFile"

$lastCheck = Get-Date

while ($true) {
    Start-Sleep -Seconds 10
    $currentTime = Get-Date

    foreach ($folder in $folderToWatch) {
        if (Test-Path $folder) {
            $changedFiles = Get-ChildItem -Path $folder -Recurse -File | Where-Object { $_.LastWriteTime -gt $lastCheck -or $_.CreationTime -gt $lastCheck }
            
            foreach ($file in $changedFiles) {
                $changeType = if ($file.CreationTime -gt $lastCheck) { "Created" } else { "Updated" }
                $timestamp = $currentTime.ToString("yyyy-MM-dd HH:mm:ss")
                $logEntry = "- **[$timestamp]** - _$changeType feature file:_ ``$($file.FullName)``"
                
                Add-Content -Path $logFile -Value $logEntry
                Write-Host $logEntry
            }
        }
    }
    
    $lastCheck = $currentTime
}
