# Prints [CAPYBARAA] when on. Empty when off/unset. Legacy values (deep/lean) count as on.
$flag = Join-Path ($env:CLAUDE_CONFIG_DIR ? $env:CLAUDE_CONFIG_DIR : (Join-Path $HOME ".claude")) ".capybaraa-active"
if (-not (Test-Path $flag)) { exit 0 }
$state = (Get-Content $flag -First 1).Trim()
if (-not $state -or $state -eq "off") { exit 0 }
$e = [char]27
[Console]::Write("$e[38;5;179m[CAPYBARAA]$e[0m")
