cd $home

$NODEJS_FILENAME="node-v8.9.4-x64.msi"
$NODEJS_URL="https://nodejs.org/dist/v8.9.4/$NODEJS_FILENAME"
$NODEJS_DOWNLOAD_LOCATION="C:\"

if(-not(Test-Path $NODEJS_DOWNLOAD_LOCATION$NODEJS_FILENAME)) {
    Invoke-WebRequest -Uri $NODEJS_URL -OutFile $NODEJS_DOWNLOAD_LOCATION$NODEJS_FILENAME
}
Start-Process msiexec -ArgumentList "/qn /l* C:\node-log.txt /i $NODEJS_DOWNLOAD_LOCATION$NODEJS_FILENAME" -wait

$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

&"$env:programfiles\nodejs\npm.cmd" i pm2 pm2-windows-startup -g

$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

&"pm2-startup" install

$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

$geth_url = "https://gethstore.blob.core.windows.net/builds/geth-windows-amd64-1.8.1-1e67410e.exe"
$genesis_url = "http://counting-votes-ethereum.westeurope.cloudapp.azure.com:3000/scripts/genesis.json"
$static_nodes = "http://counting-votes-ethereum.westeurope.cloudapp.azure.com:3000/scripts/static_nodes.json"
$output = ".\geth-installer.exe"
$st_time = Get-Date

if(-not(Test-Path $output)) {
    Invoke-WebRequest -Uri $geth_url -OutFile $output
}

Write-Output "Time taken: $((Get-Date).Subtract($st_time).Seconds) second(s)"

&$output /S

cd "$env:programfiles"

cd "geth"

Invoke-WebRequest -Uri $genesis_url -OutFile ".\genesis.json"

New-Item -ItemType Directory -Force -Path ".\.ethereum"

Invoke-WebRequest -Uri $static_nodes -OutFile ".\.ethereum\static-nodes.json"

cd "$env:programfiles"

cd "geth"

$job = Start-job { &"$env:programfiles\geth\geth.exe" init $env:programfiles\geth\genesis.json  --datadir $env:programfiles\geth\.ethereum }
Wait-Job $job
#Receive-job $job
             
&"pm2" start --name=ETH-NODE $env:programfiles\geth\geth.exe -- --nodiscover --vmodule=p2p=6,downloader=6,discover=6 --ws --wsaddr "127.0.0.1" --wsapi "eth,net,web3,admin,personal" --wsport 8546 --wsorigins="*" --datadir $env:programfiles\geth\.ethereum --rpcapi "eth,net,web3,admin,personal" --verbosity 6 --maxpeers 300 --nat none --networkid 10101010 --fast --rpc --rpcport 8545 --rpcaddr "127.0.0.1" --rpccorsdomain "*" 

&"pm2" save