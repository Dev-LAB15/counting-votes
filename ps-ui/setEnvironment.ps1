param([String] $replaceWith)

$replace = 'http://localhost:3000';
$path = './js/config.js'

(Get-Content -literalPath $path -raw) -replace $replace, $replaceWith |
    Out-File $path -encoding UTF8