#Preparing  
For the following guide we are using a premade wallet:
public  key: 0x060c648ede78724950fd0b168be7e0d28a041708
private key: f2289ff9f957da3f4363d14d93266b7b61c4ae52289079df607a8a023ab50ebc
password   : @abc123456
Redirect to https://www.myetherwallet.com/ for more info on how to generate a wallet.
A private key will always create the same public key regardless of the network you use 
for this test.

#Genesis File  
In order to start an ethereum node you'll need a genesis.json file.
There is an example genesis.json file under the project root folder.

#Ethereum Node  
You can either use a local geth (https://geth.ethereum.org/) to run a node,
or setup a virtual box using any Linux distribution.
For this test we are going to use a pre-installed Ubuntu 16 Server virtual
box configured on a host-only adapter using the ip address 192.168.0.3.

Upload the genesis.json file to the machine
> pscp -p ethereum "%workingdir%\genesis.json" ethereum@192.168.0.3:ethereum/

#initialize the node  
> geth --datadir "/home/ethereum/data" init "/home/ethereum/genesis.json"

#start node  
> geth --datadir "/home/ethereum/data" --nodiscover --ws --wsaddr "192.168.0.3" --wsport 8546 --wsorigins="*" --wsapi "eth,net,web3,admin,personal" --rpc --rpcaddr "192.168.0.3" --rpcport 8545  --rpccorsdomain "*" --rpcapi "eth,net,web3,admin,personal"  --maxpeers 300 --nat none --networkid 10151010 --fast console

#import the private key  
In order to start you'll need to import the private key. After importing
the private key geth will output the public key.
To import the private key issue the following command:
> personal.importRawKey("f2289ff9f957da3f4363d14d93266b7b61c4ae52289079df607a8a023ab50ebc", "@abc123456")

#unlock the account  
Some operations need account unlocking, to unlock the account issue 
the following command.
> personal.unlockAccount("0x060c648ede78724950fd0b168be7e0d28a041708", "@abc123456", 0)

#start the miner  
We are going to use 4 (four) threads to improve mining speed.
> miner.start(4)

#compile and deploy the contracts  
Using terminal under the blockchain project issue the following commands
> truffle compile  
truffle migrate 