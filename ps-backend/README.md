# Introduction 
Counting Votes Backend Services

# Getting Started
### Installation process
Install Node.js 8.x
### API References
- [Node.js](https://nodejs.org/en/)
Base Runtime Environment
- [Express](https://expressjs.com/)
Base API Framework
- [LokiJS](http://lokijs.org/#/)
In-Memory Database for volatile information such as tokens, codes and queues

# Build and Test
Install VSCode (latest);
Add npm intellisense (latest);
Add npm support for VS Code;
If everything is setup correctly just press F5 to start debug;
You can use fiddler or postman to debug API Requests;

### Ethereum Private Node
Install [geth](https://geth.ethereum.org/)
Define Ethereum base directory and write down the genesis.json as follows:

{
    "config": {
        "chainId": 10151010,
        "homesteadBlock": 0,
        "eip155Block": 0,
        "eip158Block": 0
    },
    "nonce": "0x0000000000000042",
    "timestamp": "0x0",
    "parentHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
    "extraData": "0x4c41423135524f58",
    "gasLimit": "0x8000000",
    "difficulty": "0x400",
    "mixhash": "0x0000000000000000000000000000000000000000000000000000000000000000",
    "coinbase": "0x5b29a9a7543b364a4b9cf5b978358f65c80cf442",
    "alloc": {
        "wallet address": { "balance": "9999999999999999999999999999999999999999999" }
    }
}

Initialize Ethereum Data Directory:
geth --datadir "%EthereumBaseDir%\data" init "%EthereumBaseDir%\genesis.json"

Start geth
geth --datadir "%EthereumBaseDir%\data" --nodiscover --ws --wsaddr "127.0.0.1" --wsport 8546 --wsorigins="*" --wsapi "eth,net,web3,admin,personal" --rpc --rpcaddr "127.0.0.1" --rpcport 8545  --rpccorsdomain "*" --rpcapi "eth,net,web3,admin,personal"  --maxpeers 300 --nat none --networkid 10151010 --fast console

Create a wallet and add it on the genesis.json file
Restart geth

Run the backend and frontend services


# Contribute
TODO: Explain how other users and developers can contribute to make your code better. 

If you want to learn more about creating good readme files then refer the following [guidelines](https://www.visualstudio.com/en-us/docs/git/create-a-readme). You can also seek inspiration from the below readme files:
- [ASP.NET Core](https://github.com/aspnet/Home)
- [Visual Studio Code](https://github.com/Microsoft/vscode)
- [Chakra Core](https://github.com/Microsoft/ChakraCore)