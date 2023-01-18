# SimbaTS
TypeScript SDK for SIMBA Chain

# @simbachain/simbats

Hardhat plugin for deploying smart contracts to the SIMBA Chain Blocks platform.

# Table of Contents:
1. [Summary](#summary)
2. [Installation](#installation)
3. [Configuration and Authentication](#configuration-and-authentication)
4. [Usage](#usage)
    - [Note on contractName parameter](#quick-note-on-"contractName"-parameter)
    - [Variables Used in examples](#variables-used-throughout-method-calls-below)
    - [Simba](#simba)
        - [Simba Insantiation](#simba-instantation)
        - [Simba Wallet Methods](#simba-wallet-methods)
        - [Simba Org And App Methods](#simba-org-and-app-methods)
        - [Getting Contracts and Transactions](#getting-contracts-and-transactions)
        - [File (Bundle) Methods](#simba-bundle-file-methods)
        - [Event Methods](#event-methods)
        - [Getting a Transaction Receipt](#get-receipt)
        - [Smart Contract Methods](#simba-smart-contract-methods)
        - [Submitting a Signed Transaction](#submitting-a-signed-transaction)
        - [Saving, Getting, and Deploying Contract Designs and Artifacts](#saving-and-getting-and-deploying-contract-designs-and-artifacts)
        - [Method That Wait For Processes To Complete](#method-that-wait-for-processes-to-complete)
        - [Getting Blockchains and Storages](#getting-blockchains-and-storages)
        - [Subscriptions and Notifications](#subscriptions-and-notifications)
    - [SimbaContract](#SimbaContract)
        - [Instantiating SimbaContract](#instantiating-simbacontract)
        - [SimbaContract Smart Contract Methods](#simbacontract-smart-contract-methods)
        - [SimbaContract Bundle File Methods](#simbacontract-bundle-file-methods)
    - [SimbaSync](#SimbaSync)
        - [Instantiating SimbaSync](#instantiating-simbasync)
        - [Submitting a SimbaSync Smart Contract Method](#submitting-a-simbasync-smart-contract-method)
    - [SimbaContractSync](#SimbaContractSync)
        - [Instantiating SimbaContractSync](#instantiating-simbacontractsync)
        - [Submitting a SimbaContractSync Smart Contract Method](#submitting-a-simbacontractsync-smart-contract-method)
5. [Integrating with Polyglot](#integrating-with-polyglot)
6. [Testing](#testing)


## Summary

SimbaTS is the TypeScript SDK for SIMBA Chain. It contains functionality for interacting with the SIMBA platform in general, as well as for interacting with your deployed smart contracts in particular. We currently have a service, Polyglot, that is under construction, which will streamline the process of interacting with your deployed smart contracts If you are using SimbaTS to interact with your deployed smart contracts, then we highly recommend you integrate with our Polyglot service, which we explain in this documentation.

## Installation

To install using NPM:
```
npm install @simbachain/simbats
```

To clone:
```
git clone https://github.com/SIMBAChain/SimbaTS.git

Then you'll want to checkout the develop branch
```

## Configuration and Authentication
Authentication in SimbaTS uses a client credentials flow. So to use SimbaTS, you'll need to first obtain client credentials from SIMBA Chain. To do so, go to the SIMBA Chain UI, and navigate to your organisation, then your application. Then, in the upper right hand side of the UI, you will see a "Secrets" button. If you click that button, you can create a client ID and client secret. Once you have obtained your client credentials, you will need to store them, along with a couple other environment variables. Here, we will explain what those variables are, and where to store them.

### Environment variables you'll need to store
The environment variables you will need to store, with example values, are (keep reading for WHERE to store these variables):
```
SIMBA_API_BASE_URL="https://simba-dev-api.platform.simbachain.com/"
SIMBA_AUTH_BASE_URL="https://simba-dev-api.platform.simbachain.com/"
SIMBA_AUTH_CLIENT_ID="your SIMBA client ID"
SIMBA_AUTH_CLIENT_SECRET="your SIMBA client secret"
```

Additionall, you can also set the log level for debugging purposes. So for instance, if you want to set the SimbaTS logger to debug, you would set:
```
SIMBATS_LOG_LEVEL="info"
```

### Where to store your environment variables
We try to make sure that when you switch between different SIMBA Chain products, we make things as easy as possible for you. To aid in that, all SIMBA Chain SDKs use the same base environment variables, and look for them in a series of the same places. First, we provide a note on the SIMBA_HOME system level environment variable:

### SIMBA_HOME
To help developers easily switch between all SIMBA SDKs, they can keep one .env file (name either .simbachain.env, simbachain.env, or .env) in a directory of their choice. Whatever directory they store this .env file in, the user can set the path to that directory as a system level environment variabale called SIMBA_HOME. If you don't set SIMBA_HOME, then it defaults to your home directory. So for instance, if you use .bash_profile for your system environment variables, then in your .bash_profile, you can set:

```
... rest of .bash_profile

export SIMBA_HOME=myexamplehomedirectory/dev/simbachain/mysimbahome/
```

### Where, and in what order, we search for SIMBA environment files
For env vars, we search, in this order:
     * local project directory (the top level of your project) for:
        - .simbachain.env
        - simbachain.env
        - .env
     
     * then we look for a SIMBA_HOME env var at the system level, and within that directory, we search for:
        - .simbachain.env
        - simbachain.env
        - .env

So if you are using multiple SIMBA products, then it's probably a good idea to set SIMBA_HOME as a system environment variable. If you're only using SimbaTS, then it's probably easier to create a .simbachain.env file in the top level of your project, and stick your environment variables in there, as instructed above.

### authconfig.json
The way SimbaTS tracks access tokens is through the file authconfig.json. YOU DO NOT NEED TO CREATE THIS FILE. It automatically gets created once SimbaTS code retrieves an access token. Because access tokens are stored in this file, you should add it to your .gitignore:

```
... rest of .gitignore

# authconfig.json
**authconfig.json
```

Once all of this is configured, you're ready to start using SimbaTS!

## Usage
There are a few main objects that you'll want to use in your project:
- Simba
    - Simba objects handle general interaction with the platform
    - Simba objects can also be used to submit, call, and query methods of your deployed smart contracts
- SimbaContract
    - SimbaContract objects are used specifically to interact with your deployed smart contracts
    - SIMBA Chain contract method endopints are "async" by default. This term is overloaded here; what "async" means here is that hitting a default contract method, a response will be returned without waiting for additional details about the transaction
- SimbaSync
    - SimbaSync is idential to Simba, except the contract object it instantiates through .getSimbaContract is an instance of SimbaContractSync instead of SimbaContract
- SimbaContractSync
    - SimbaContractSync is identical to SimbaContract, except it hits contract method endpoints synchronously instead of asynchronously. That that means in this context is that contract method requests made using SimbaContractSync will call /sync/ endpoints for contract methods, which means that the response will not return immediately, but will return with more information on the transaction when it does return.

The following sections provide examples of using the above objects, but we're also going to provide some example variables that are used throughout the examples, so that you can reference them when you see them in example method calls. So when you see a method call use the argument baseApiUrl, but you don't see it defined locally, know that it was defined previously, in the following variables, below.

### quick note on "contractName" parameter:
A quick note on areas where you see the parameter "contractName" referenced. In most cases, "contractName" actually refers to the contract API name you specified when deploying your contract. So if you deployed a contract that, in its solidity code was called TestContract, and you deployed it using the API name "test_contract_v2", then this API name is actually what's being asked for where params are called "contractName".

### variables used throughout method calls below
```TypeScript
export const baseApiUrl = "https://simba-dev-api.platform.simbachain.com/";
export const orgName = "brendan_birch_simbachain_com";
export const appName = "BrendanTestApp";
export const contractName = "test_contract_vds5";
export const mumbaiWallet = "0x59D859Da04439AE87Afd689A4CA89C354CB93532";
export const userEmail = "brendan.birch@simbachain.com";
export const bundleHash = "57f6ef0fcc97614f899af3f165cabbaec9632b95fc89906837f474a6a2c8a184";
export const solContractName = "TestContractChanged";
export const Quorum = "Quorum";
export const mumbai = "mumbai";
export const ethereum = "ethereum";
export const transactionHash = "0x2b05a28c90283011054f9299e92b80f045ff3d454f87008c8b67e767393b7d14";
export const solidity = "solidity";
export const deploymentID = "37cb8577-65bd-4669-8380-b0a3ba93e718";
export const designID = "5114c41b-c03a-4674-b348-a0cd73d2c0d6";
export const artifactID = "4b80be26-c6a3-4aa6-82d1-f94925e5da2b";
export const transactionID = "7eb73229-b1f8-4aa4-af4b-37f79c1df6bb";
export const eventContract = "eventcontract_vds5";
export const eventName = "Log";
export const nonPendingTransactionID = "8a2c5fbf-340f-4038-a3c0-bb8d088ecf1e";
export const sourceCode = "// SPDX-License-Identifier: UNLICENSED\npragma solidity ^0.8.3;\n\ncontract EventContract {\n    \n    event Log(address indexed sender, string message);\n    mapping(string => uint) public userBalances;\n\n    function addMapping(string memory userId) public {\n        userBalances[userId]++;\n        emit Log(msg.sender, \"Data reported\");\n        return;\n    }\n\n    function getBalance(string memory userId) public view returns (uint) {\n        return userBalances[userId];\n    }\n\n}";
export const transactionObject = {
    "id": "8a2c5fbf-340f-4038-a3c0-bb8d088ecf1e",
    "request_id": "418d2bc0-0b0c-455f-8ae2-1ba6ffdd63da",
    "created_on": "2022-10-03T16:47:20.099589Z",
    "finalized_on": null,
    "method": "structTest5",
    "inputs": {
      "person": {
        "age": 1000,
        "addr": {
          "town": "nyc",
          "number": 1234,
          "street": "rogers"
        },
        "name": "Lenny's Ghost"
      },
      "_bundleHash": "223873f49bb7623bfc7da8806f009bdead8e4aaafe5b6e56c0fb2b46471ca9e7"
    },
    "receipt": {},
    "error": null,
    "error_details": {},
    "state": "SUBMITTED",
    "raw_transaction": {
      "to": "0x3daac1c8Bb80406D0eb2e7608C5d2fBcA92eD4a6",
      "gas": "0x6c54",
      "data": "0x47fb8c0a000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000001c0000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000003e800000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000000d4c656e6e7927732047686f737400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000004d200000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000006726f67657273000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000036e79630000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004032323338373366343962623736323362666337646138383036663030396264656164386534616161666535623665353663306662326234363437316361396537",
      "from": "0xCa47475036474eAc0dF6697e6A6C74386f218236",
      "nonce": "0x1a3",
      "value": "0x0",
      "chainId": "0x151",
      "gasPrice": "0x0"
    },
    "signed_transaction": {
      "r": 4.2809928544253906e+76,
      "s": 5.268161053606005e+76,
      "v": 710,
      "hash": "0x2a5b7db8fe8b81905ac602a1f09aedc943efd48cb5fa06e7b35537f636cf0976",
      "rawTransaction": "0xf902898201a380826c54943daac1c8bb80406d0eb2e7608c5d2fbca92ed4a680b9022447fb8c0a000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000001c0000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000003e800000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000000d4c656e6e7927732047686f737400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000004d200000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000006726f67657273000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000036e796300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000040323233383733663439626237363233626663376461383830366630303962646561643865346161616665356236653536633066623262343634373163613965378202c6a05ea58f96ab195f30f409c52bba44df15a9e9ba7acdd00ba18f83cfb060309d0ba07478bc2248e434d89e887f7f128085c89018828e002c19caf23d6a138bdbf344"
    },
    "transaction_hash": "0x2a5b7db8fe8b81905ac602a1f09aedc943efd48cb5fa06e7b35537f636cf0976",
    "bundle": "def70871-57b3-4711-905d-6935c939529e",
    "block": null,
    "nonce": 419,
    "from_address": "0xCa47475036474eAc0dF6697e6A6C74386f218236",
    "to_address": null,
    "created_by": 9,
    "contract": {
      "id": "f8896066-73c4-40b6-837e-7bcb8307b231",
      "api_name": "test_contract_vds5"
    },
    "app": "fb5fd523-9982-4785-a0ea-89d277f4014b",
    "blockchain": "3b288902-8438-492b-857a-58060d9c254a",
    "origin": "SCAAS",
    "transaction_type": "MC",
    "confirmations": 0,
    "value": "0"
  };
```

### Simba

#### Simba Instantiation
```TypeScript
// instantiating Simba object
import {
    Simba,
} from "@simbachain/simbats";
const simba = new Simba();

// Simba.getSimbaContract
const simbaContract = simba.getSimbaContract(appName, contractName);
```

#### Simba Wallet Methods
```TypeScript
// Simba.whoAmI
const simba = new Simba();
const iAm = await simba.whoAmI() as Record<any, any>;

// Simba.fund
const simba = new Simba();
const res = await simba.fund(
    mumbai,
    mumbaiWallet,
    1,
);

// Simba.balance
const simba = new Simba();
const balance = await simba.balance("mumbai", mumbaiWallet) as Record<any, any>;

// Simba.adminSetWallet
const simba = new Simba();
const res = await simba.adminSetWallet(
    userID,
    "fakeBlockchain",
    "fakePublicKey",
    "fakePrivateKey",
);

// Simba.setWallet
const simba = new Simba();
const res = await simba.setWallet(
    "fakeBlockchain",
    "fakePublicKey",
    "fakePrivateKey",
);

// Simba.getWallet
const simba = new Simba();
const walletRes = await simba.getWallet() as Record<any, any>;
```

#### Simba Org And App Methods
```TypeScript
// Simba.createOrg
const simba = new Simba();
const orgName = "simbats_org";
const display = "simbats_org";
await simba.createOrg(orgName, display) as Record<any, any>;

// Simba.createApp
const simba = new Simba();
const orgName = "simbats_org";
const appName = "simbats_app";
const display = "simbats_app";
const res = await simba.createApp(orgName, appName, display) as Record<any, any>;

// Simba.getApplications
const simba = new Simba();
const apps = await simba.getApplications() as Record<any, any>;

// Simba.getApplication
const simba = new Simba();
const app = await simba.getApplication(orgName, appName) as Record<any, any>;

// Simba.getApplicationTransactions
const simba = new Simba();
const txns = await simba.getApplicationTransactions(appName) as Record<any, any>;

// Simba.getApplicationTransactions with queryParams
const simba = new Simba();
const request_id = "34bb8e12-8459-43cc-ae7f-e0fe0a59fbb1";
const queryParams = {
    request_id,
}
const txns = await simba.getApplicationTransactions(appName, queryParams) as Record<any, any>;

// Simba.getApplicationContract
const simba = new Simba();
const contract = await simba.getApplicationContract(appName, contractName) as Record<any, any>;
```

#### Getting Contracts and Transactions
```TypeScript
// Simba.getcontractTransactions
const simba = new Simba();
const txns = await simba.getContractTransactions(appName, contractName) as Record<any, any>;

// Simba.getcontractTransactions with queryParams
const simba = new Simba();
const id = "5a2288c6-0562-41e8-8f63-e6820fa3e62a";
const queryParams = {
    id,
}
const txn = await simba.getContractTransactions(appName, contractName, queryParams) as Record<any, any>;

// Simba.getContracts
const simba = new Simba();
const contracts = await simba.getContracts(appName) as Record<any, any>;

// Simba.getContracts with queryParams
const simba = new Simba();
const id = "acf6fd5d-e27a-4493-ae79-9b73c6ddc9a4";
const queryParams = {
    id,
}
const res = await simba.getContracts(appName, queryParams) as Record<any, any>;

// Simba.getContractInfo
const simba = new Simba();
const info = await simba.getContractInfo(appName, contractName) as Record<any, any>;
const contract = info.contract;

// Simba.getTransaction
const simba = new Simba();
const res = await simba.getTransaction(appName, contractName, transactionHash) as Record<any, any>;
const transaction = res.transaction;

// Simba.getTransactionsByMethod
const simba = new Simba();
const res = await simba.getTransactionsByMethod(appName, contractName, "structTest5") as Record<any, any>;

// Simba.getTransactionsByMethod with queryParams
const simba = new Simba();
const id = "5a2288c6-0562-41e8-8f63-e6820fa3e62a";
const queryParams = {
    id,
}
const res = await simba.getTransactionsByMethod(appName, contractName, "structTest5", queryParams) as Record<any, any>;

// Simba.getTransactionsByContract
const simba = new Simba();
const res = await simba.getTransactionsByContract(appName, contractName) as Record<any, any>;

// Simba.getTransactionsByContract with queryParams
const simba = new Simba();
const id = "5a2288c6-0562-41e8-8f63-e6820fa3e62a";
const queryParams = {
    id,
}
const res = await simba.getTransactionsByMethod(appName, contractName, "structTest5", queryParams) as Record<any, any>;
```

#### Simba Bundle File Methods
```TypeScript
// Simba.validateBundleHash
const simba = new Simba();
const ver = await simba.validateBundleHash(appName, contractName, bundleHash) as Record<any, any>;

// Simba.getBundle
const simba = new Simba();
const downloadLocation = path.join(cwd(), "test_data", "downloadedBundle.tar.gz");

// Simba.getBundleFile
const simba = new Simba();
const fileName = "testimage1.png";
const downloadLocation = path.join(cwd(), "test_data", "testimage1FromAPIcall.png");
await simba.getBundleFile(
    appName,
    contractName,
    bundleHash,
    fileName,
    downloadLocation,
) as Record<any, any>;

// Simba.getManifestForBundleFromBundleHash
const simba = new Simba();
const manifest = await simba.getManifestForBundleFromBundleHash(
    appName,
    contractName,
    bundleHash
) as Record<any, any>;
```

#### Event Methods
```TypeScript
// Simba.getEvents
const simba = new Simba();
const res = await simba.getEvents(
    appName,
    eventContract,
    eventName,
) as Record<any, any>;

// Simba.getEvents with queryParams
const simba = new Simba();
const queryParams = {
    id: "insert an event id here",
}
const res = await simba.getEvents(
    appName,
    eventContract,
    eventName,
    queryParams,
) as Record<any, any>;

// Simba.adminGetEvents
const simba = new Simba();
const res = await simba.adminGetEvents() as Record<any, any>;

// Simba.adminGetEvents with queryParams
const simba = new Simba();
const id = "195a5391-84f4-4743-8dfe-d898309db809";
const queryParams = {
    id,
}
const res = await simba.adminGetEvents(queryParams) as Record<any, any>;
```

#### Get Receipt
```TypeScript
// Simba.getReceipt
const simba = new Simba();
const res = await simba.getReceipt(appName, contractName, transactionHash) as Record<any, any>;
const receipt = res.receipt;
```

### Simba Smart Contract Methods
```TypeScript
// Simba.submitContractMethod
const simba = new Simba();
const person = {
    name: "Lenny's Ghost",
    age: 1000,
    addr: {
        street: "rogers",
        town: "nyc",
        number: 1234,
    },
}
const methodName = "structTest5";
const inputs = {
    person,
}
const imageFile1Path = path.join(cwd(), "test_data", "testimage1.png");
const imageFile2Path = path.join(cwd(), "test_data", "testimage2.png");
const filePaths = [imageFile1Path, imageFile2Path];
const res = await simba.submitContractMethod(appName, contractName, methodName, inputs, filePaths) as Record<any, any>;

// Simba.submitContractMethodSync
const simba = new Simba();
const person = {
    name: "Lenny's Ghost",
    age: 1000,
    addr: {
        street: "rogers",
        town: "nyc",
        number: 1234,
    },
}
const methodName = "structTest5";
const inputs = {
    person,
}
const imageFile1Path = path.join(cwd(), "test_data", "testimage1.png");
const imageFile2Path = path.join(cwd(), "test_data", "testimage2.png");
const filePaths = [imageFile1Path, imageFile2Path];
const res = await simba.submitContractMethodSync(appName, contractName, methodName, inputs, filePaths) as Record<any, any>;

const raw_transaction = res.raw_transaction;
const signed_transaction = res.signed_transaction;


// Simba.callContractMethod
const simba = new Simba();
const methodName = "getNum";
const res = await simba.callContractMethod(appName, contractName, methodName) as Record<any, any>;
```

#### Submitting A Signed Transaction
```TypeScript
// Simba.submitSignedTransaction
const simba = new Simba();
const txn = transactionObject;
const res = await simba.submitSignedTransaction(
    appName,
    nonPendingTransactionID,
    txn,
);
```

#### Saving and Getting and Deploying Contract Designs and Artifacts
```TypeScript
// Simba.saveDesign
const simba = new Simba();
const designName = "EventContract99";
const res = await simba.saveDesign(
    orgName,
    designName,
    sourceCode,
) as Record<any, any>;

// Simba.deployDesign
const simba = new Simba();
const res = const alreadyTakenAPIName = contractName;
await simba.deployDesign(
    orgName,
    appName,
    alreadyTakenAPIName,
    designID,
    Quorum,
);

// Simba.getDesigns
const simba = new Simba();
const res = await simba.getDesigns(orgName) as Record<any, any>;

const design = res.results[0];

// Simba.createArtifact
const simba = new Simba();
const designID = "644ed6cc-8073-4c4b-9395-aa466a3a27e7";
const artifact = await simba.createArtifact(orgName, designID) as Record<any, any>;

// Simba.deployArtifact
const simba = new Simba();
const res = alreadyTakenAPIName = contractName;
await simba.deployArtifact(
    orgName,
    appName,
    alreadyTakenAPIName,
    artifactID,
    Quorum,
);

// Simba.getArtifacts
const simba = new Simba();
const res = await simba.getArtifacts(orgName) as Record<any, any>;

const artifact = res.results[0];

// Simba.getArtifact
const simba = new Simba();
const artifactID = "af76b1a9-365a-428f-8749-cd23280b4ead";
const artifact = await simba.getArtifact(orgName, artifactID) as Record<any, any>;
```

#### Method That Wait For Processes To Complete
```TypeScript
// Simba.waitForDeployment
const simba = new Simba();
const res = await simba.waitForDeployment(
    orgName,
    deploymentID,
) as Record<any, any>;

// Simba.waitForOrgTransaction
const simba = new Simba();
const res = await simba.waitForOrgTransaction(
    orgName,
    transactionID,
) as Record<any, any>;

// Simba.waitForDeployDesign
const simba = new Simba();
const alreadyTakenAPIName = contractName;
const res = await simba.waitForDeployDesign(
    orgName,
    appName,
    designID,
    alreadyTakenAPIName,
    Quorum,
);

// Simba.waitForDeployArtifact
const simba = new Simba();
const alreadyTakenAPIName = contractName;
const res = await simba.waitForDeployArtifact(
    orgName,
    appName,
    artifactID,
    alreadyTakenAPIName,
    Quorum,
);
```

#### Getting Blockchains and Storages
```TypeScript
// Simba.getBlockchains
const simba = new Simba();
const res = await simba.getBlockchains(orgName) as Record<any, any>;

const blockchain = res.results[0];

// Simba.getStorages
const simba = new Simba();
const res = await simba.getStorages(orgName) as Record<any, any>;
const storage = res.results[0];
```

#### Subscriptions and Notifications
```TypeScript
// Simba.subscribe
const simba = new Simba();
const notificationEndpoint = "https://a-fake-url/v2/a.fake.endpoint";
const contractAPI = contractName;
const txn = "structTest5";
const subscriptionType = "METHOD";
const res = await simba.subscribe(
    orgName,
    notificationEndpoint,
    contractAPI,
    txn,
    subscriptionType,
) as Record<any, any>;

// Simba.setNotificationConfig
const simba = new Simba();
const scheme = "http";
const authType = "";
const authInfo = {};
const res = await simba.setNotificationConfig(orgName, scheme, authType, authInfo) as Record<any, any>;
```

### SimbaContract
A note on the use of the "validateParams" parameter in SimbaContract.submitMethod. To prevent users from having to wait for an API call before they are informed that there is something wrong with one of their parameters, in terms of what the API expects, SimbaContract validates parameters before API calls. If, for some reason, you want to turn this feature off, then you can pass the boolean value false for that param. see the example below for "SimbaContract.submitMethod without validation of params"

#### Instantiating SimbaContract
```TypeScript
// instantiating SimbaContract object
import {
    SimbaContract,
} from "@simbachain/simbats";

const simbaContract = new SimbaContract(
    baseApiUrl,
    appName,
    contractName,
);
```

#### SimbaContract Smart Contract Methods
```TypeScript
// SimbaContract.callMethod
const simbaContract = new SimbaContract(
    baseApiUrl,
    appName,
    contractName,
);
const methodName = "getNum";
const res = await simbaContract.callMethod(methodName) as Record<any, any>;

// SimbaContract.submitMethod
const simbaContract = new SimbaContract(
    baseApiUrl,
    appName,
    contractName,
);
const person = {
    name: "Lenny's Ghost",
    age: 1000,
    addr: {
        street: "rogers",
        town: "nyc",
        number: 1234,
    },
}
const methodName = "structTest5";
const inputs = {
    person,
}
const imageFile1Path = path.join(cwd(), "test_data", "testimage1.png");
const imageFile2Path = path.join(cwd(), "test_data", "testimage2.png");
const filePaths = [imageFile1Path, imageFile2Path];
const res = await simbaContract.submitMethod(methodName, inputs, filePaths) as Record<any, any>;

// SimbaContract.submitMethod without validation of params:
const simbaContract = new SimbaContract(
    baseApiUrl,
    appName,
    contractName,
);
const person = {
    name: "Lenny's Ghost",
    age: 1000,
    addr: {
        street: "rogers",
        town: "nyc",
        number: 1234,
    },
}
const methodName = "structTest5";
const inputs = {
    person,
}
const imageFile1Path = path.join(cwd(), "test_data", "testimage1.png");
const imageFile2Path = path.join(cwd(), "test_data", "testimage2.png");
const filePaths = [imageFile1Path, imageFile2Path];
const validateParams = false;
const res = await simbaContract.submitMethod(
    methodName,
    inputs,
    filePaths,
    validateParams
) as Record<any, any>;
```

#### SimbaContract Getting Transactions
```TypeScript
// SimbaContract.getTransactionsByMethod
const simbaContract = new SimbaContract(
    baseApiUrl,
    appName,
    contractName,
);
const methodName = "structTest5";
const res = await simbaContract.getTransactionsByMethod(methodName) as Record<any, any>;


// SimbaContract.getTransactionsByMethod with queryParams
const simbaContract = new SimbaContract(
    baseApiUrl,
    appName,
    contractName,
);
const id = "56a05373-09bd-4de7-a1ab-74ab864d58d8";
const queryParams = {
    id,
}
const methodName = "structTest5";
```

#### SimbaContract Bundle File Methods
```TypeScript
// SimbaContract.getBundle
const simbaContract = new SimbaContract(
    baseApiUrl,
    appName,
    contractName,
);
const downloadLocation = path.join(cwd(), "test_data", "downloadedBundle.tar.gz");
FileHandler.removeFile(downloadLocation);
await simbaContract.getBundle(
    bundleHash,
    downloadLocation,
) as Record<any, any>;
FileHandler.removeFile(downloadLocation);

// SimbaContract.getBundleFile
const simbaContract = new SimbaContract(
    baseApiUrl,
    appName,
    contractName,
);
const fileName = "testimage1.png";
const downloadLocation = path.join(cwd(), "test_data", "testimage1FromAPIcall.png");
FileHandler.removeFile(downloadLocation);
await simbaContract.getBundleFile(
    bundleHash,
    fileName,
    downloadLocation,
) as Record<any, any>;
FileHandler.removeFile(downloadLocation);

// SimbaContract.getManifestForBundleFromBundleHash
const simbaContract = new SimbaContract(
    baseApiUrl,
    appName,
    contractName,
);
const manifest = await simbaContract.getmanifestFromBundleHash(bundleHash) as Record<any, any>;
const file1 = manifest.files[0];
```

### SimbaSync

#### Instantiating SimbaSync
```TypeScript
// istantiating SimbaSync object
import {
    SimbaSync,
} from "@simbachain/simbats";
// Simba.getSimbaContract
const simba = new SimbaSync(baseApiUrl);
const simbaContractSync = simba.getSimbaContract(appName, contractName);
```

#### Submitting a SimbaSync Smart Contract Method
```TypeScript
// Simba.submitContractMethodSync
const simbaSync = new SimbaSync();
const person = {
    name: "Lenny's Ghost",
    age: 1000,
    addr: {
        street: "rogers",
        town: "nyc",
        number: 1234,
    },
}
const methodName = "structTest5";
const inputs = {
    person,
}
const imageFile1Path = path.join(cwd(), "test_data", "testimage1.png");
const imageFile2Path = path.join(cwd(), "test_data", "testimage2.png");
const filePaths = [imageFile1Path, imageFile2Path];
const res = await simbaSync.submitContractMethodSync(appName, contractName, methodName, inputs, filePaths) as Record<any, any>;
```

### SimbaContractSync
A note on the use of the "validateParams" parameter in SimbaContractSync.submitMethod. To prevent users from having to wait for an API call before they are informed that there is something wrong with one of their parameters, in terms of what the API expects, SimbaContractSync validates parameters before API calls. If, for some reason, you want to turn this feature off, then you can pass the boolean value false for that param. see the example below for "SimbaContractSync.submitMethod without validation of params"

#### Instantiating SimbaContractSync
```TypeScript
// istantiating SimbaContractSync object
import {
    SimbaContractSync,
} from "@simbachain/simbats";

const simbaContractSync = new SimbaContractSync(
    baseApiUrl,
    appName,
    contractName,
);
```

#### Submitting a SimbaContractSync Smart Contract Method
```TypeScript
// SimbaContractSync.submitMethod
const simbaContractSync = new SimbaContractSync(
    baseApiUrl,
    appName,
    contractName,
);
const person = {
    name: "Lenny's Ghost",
    age: 1000,
    addr: {
        street: "rogers",
        town: "nyc",
        number: 1234,
    },
}
const methodName = "structTest5";
const inputs = {
    person,
}
const imageFile1Path = path.join(cwd(), "test_data", "testimage1.png");
const imageFile2Path = path.join(cwd(), "test_data", "testimage2.png");
const filePaths = [imageFile1Path, imageFile2Path];
const res = await simbaContractSync.submitMethod(methodName, inputs, filePaths) as Record<any, any>;

// SimbaContractSync.submitMethod without validation of params
const simbaContractSync = new SimbaContractSync(
    baseApiUrl,
    appName,
    contractName,
);
const person = {
    name: "Lenny's Ghost",
    age: 1000,
    addr: {
        street: "rogers",
        town: "nyc",
        number: 1234,
    },
}
const methodName = "structTest5";
const inputs = {
    person,
}
const imageFile1Path = path.join(cwd(), "test_data", "testimage1.png");
const imageFile2Path = path.join(cwd(), "test_data", "testimage2.png");
const filePaths = [imageFile1Path, imageFile2Path];
const validateParams = false;
const res = await simbaContractSync.submitMethod(
    methodName,
    inputs,
    filePaths,
    validateParams
) as Record<any, any>;
```

## Integrating with Polyglot
/// UNDER CONSTRUCTION ///
Polyglot is currently under construction, but will substantially streamline the process of interacting with your deployed smart contracts once fully implemented.

### Testing
This section pertains to testing, if you have clonded SimbaTS. To run tests for SimbaTS, you'll want to have your SIMBA environment variables set in .simbachain.env at the top level of the /tests/ directory. So something like:

```
SIMBA_API_BASE_URL="https://simba-dev-api.platform.simbachain.com/"
SIMBA_AUTH_BASE_URL="https://simba-dev-api.platform.simbachain.com/"
SIMBA_AUTH_CLIENT_ID="Insert your client ID"
SIMBA_AUTH_CLIENT_SECRET="Insert your clietn secret"
```

Additionally, you can also configure SIMBATS_LOG_LEVEL, if you want tests to be run at a different log level. So if you want tests to be run at "debug" level, in .simbachain.env you would set:

```
SIMBATS_LOG_LEVEL="info"
```

### unit and integration tests for developers
SimbaTS does not currently support running individual tests. unit tests and integration tests can be run separately, though.

To run integration tests, from the top level of your project, run:
```
npm run integration_test
```

To run unit test, from the top level of your project, run:
```
npm run unit_test
```

To run all tests, from the top level of your project, run:
```
npm test
```