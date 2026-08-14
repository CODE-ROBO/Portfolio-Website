# scripts/Publish-Milestone.ps1
param (
    [string]$Phase = "Aerospace Ops",
    [string]$Description = "Simulation Results Verified",
    [string]$Status = "Completed"
)

$DataFile = "C:\Users\harsh\OneDrive\Desktop\Portfolio Website\skills-component\src\data.json"
$Json = Get-Content $DataFile | ConvertFrom-Json -Depth 10

$NewMilestone = @{
    id = [guid]::NewGuid().ToString().Substring(0,8)
    phase = $Phase
    description = $Description
    status = $Status
}

$Json.timelineMilestones += $NewMilestone

$Json | ConvertTo-Json -Depth 10 | Set-Content $DataFile

Write-Host "[SYSTEM LOG] Successfully injected milestone into $DataFile." -ForegroundColor Green

# The following lines can be uncommented to automatically push changes to GitHub,
# triggering the deploy.yml Action:
# git add $DataFile
# git commit -m "chore: Automate portfolio status update [$Description]"
# git push origin main
