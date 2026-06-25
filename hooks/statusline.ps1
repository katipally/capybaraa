# Prints a level badge, e.g. [CAPYBARA] or [CAPYBARA:HIGH]. Empty when off/unset.
$flag = Join-Path ($env:CLAUDE_CONFIG_DIR ? $env:CLAUDE_CONFIG_DIR : (Join-Path $HOME ".claude")) ".capybara-active"
if (-not (Test-Path $flag)) { exit 0 }
$level = (Get-Content $flag -First 1).Trim()
if (-not $level -or $level -eq "off") { exit 0 }
$e = [char]27
if ($level -eq "medium") {
  [Console]::Write("$e[38;5;179m[CAPYBARA]$e[0m")
} else {
  [Console]::Write("$e[38;5;179m[CAPYBARA:$($level.ToUpper())]$e[0m")
}
