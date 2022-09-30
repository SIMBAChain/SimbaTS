import {
    Simba,
} from "../../";
import { expect } from 'chai';
import 'mocha';
import * as path from 'path';
import {cwd} from 'process';
import {
    orgName,
    appName,
    contractName,
    bundleHash,
    mumbaiWallet,
    userEmail,
    solContractName,
    Quorum,
    ethereum,
    transactionHash,
    solidity,
} from "../project_configs";

describe('testing Simba.whoAmI', () => {
    it('iAm should contain specified fields, with some specified values', async () => {
        const simba = new Simba();
        const iAm = await simba.whoAmI() as Record<any, any>;
        expect(iAm.username).to.equal(userEmail);
        expect(iAm.first_name).to.exist;
        expect(iAm.last_name).to.exist;
        expect(iAm.admin).to.equal(true);
        expect(iAm.email).to.equal(userEmail)
        expect(iAm.organisations.length).to.be.greaterThan(0);
        expect(iAm.default_organisation).to.exist;
        expect(iAm.permissions).to.exist;
    }).timeout(5000);
});

// describe('testing Simba.fund', () => {
//     it('implement', async () => {
//         // implement
//     }).timeout(5000);
// });

describe('testing Simba.balance', () => {
    it('balance.balance should exist for mumbai', async () => {
        const simba = new Simba();
        const balance = await simba.balance("mumbai", mumbaiWallet) as Record<any, any>;
        expect(balance.balance).to.exist;
    }).timeout(5000);
});

// describe('testing Simba.adminSetWallet', () => {
//     it('implement', async () => {
//         // implement
//     }).timeout(5000);
// });

// describe('testing Simba.setWallet', () => {
//     it('implement', async () => {
//         // implement
//     }).timeout(5000);
// });

describe('testing Simba.getWallet', () => {
    it('implement', async () => {
        const simba = new Simba();
        const walletRes = await simba.getWallet() as Record<any, any>;
        const wallet = walletRes.wallet;
        expect(wallet.principal).to.equal(userEmail);
        expect(wallet.alias).to.equal(userEmail);
        expect(wallet.identities).to.exist;
    }).timeout(5000);
});

describe('testing Simba.createOrg', () => {
    it('should throw 400 error, since org already exists', async () => {
        const simba = new Simba();
        const orgName = "simbats_org";
        const display = "simbats_org";
        async function createOrgThrows() {
            await simba.createOrg(orgName, display) as Record<any, any>;
        };
        try {
            await createOrgThrows();
        } catch (error) {
            expect(error.message).to.equal('Request failed with status code 400')
        }
    }).timeout(5000);
});

describe('testing Simba.createApp', () => {
    it('should throw 400 error, since app already exists', async () => {
        const simba = new Simba();
        const orgName = "simbats_org";
        const appName = "simbats_app";
        const display = "simbats_app";
        async function createAppThrows() {
            await simba.createApp(orgName, appName, display) as Record<any, any>;
        };
        try {
            await createAppThrows();
        } catch (error) {
            expect(error.message).to.equal('Request failed with status code 400')
        }
    }).timeout(5000);
});

describe('testing Simba.getApplications', () => {
    it('specified fields should exist', async () => {
        const simba = new Simba();
        const apps = await simba.getApplications() as Record<any, any>;
        expect(apps.count).to.exist;
        expect(apps.next).to.include("https://simba-dev-api.platform.simbachain.com/v2/apps/")
        expect(apps.results.length).to.be.greaterThan(0);
    }).timeout(5000);
});

describe('testing Simba.getApplication', () => {
    it('specified fields should exist', async () => {
        const simba = new Simba();
        const app = await simba.getApplication(orgName, appName) as Record<any, any>;
        expect(app.name).to.equal(appName);
        expect(app.id).to.equal("fb5fd523-9982-4785-a0ea-89d277f4014b");
        expect(app.display_name).to.equal(appName)
        expect(app.created_on).to.equal("2022-07-15T22:00:42.480234Z");
        expect(app.components.length).to.be.greaterThan(0);
        const firstComponent = app.components[0];
        expect(firstComponent.id).to.exist;
        expect(firstComponent.api_name).to.exist;
        expect(firstComponent.created_on).to.exist;
        expect(firstComponent.updated_on).to.exist;
        expect(app.organisation.name).to.equal(orgName);
        expect(app.organisation.id).to.equal("20e69814-43d0-42b4-8499-d13a9d1afb23");
        expect(app.organisation.name).to.equal(orgName)
        expect(Object.keys(app).includes("metadata")).to.equal(true);
        expect(app.openapi).to.equal("https://simba-dev-api.platform.simbachain.com/v2/apps/BrendanTestApp/");
    }).timeout(5000);
});

describe('testing Simba.getApplicationTransactions', () => {
    it('specified fields should exist', async () => {
        const simba = new Simba();
        const txns = await simba.getApplicationTransactions(appName) as Record<any, any>;
        console.log("txns: ", txns)
        expect(txns.count).to.be.greaterThan(193);
        expect(txns.next).to.include("https://simba-dev-api.platform.simbachain.com/v2/apps/BrendanTestApp/transactions/?limit=10&offset=10");
        expect(txns.previous).to.not.equal(undefined);
        expect(txns.results.length).to.be.greaterThan(0);
        
        const txn = txns.results[0];
        expect(txn.id).to.exist;
        expect(txn.request_id).to.exist;
        expect(txn.created_on).to.exist;
        expect(Object.keys(txn).includes("finalized_on")).to.equal(true);
        expect(txn.method).to.exist;
        expect(txn.inputs).to.exist;
        expect(txn.receipt).to.exist;
        expect(Object.keys(txn).includes("error")).to.equal(true);
        expect(txn.error_details).to.exist;
        expect(txn.state).to.exist;
        expect(txn.raw_transaction).to.exist;
        expect(txn.signed_transaction).to.exist;
        expect(txn.transaction_hash).to.exist;
        expect(txn.bundle).to.exist;
        expect(Object.keys(txn).includes("block")).to.equal(true);
        expect(txn.nonce).to.exist;
        expect(txn.from_address).to.exist;
        expect(txn.to_address).to.exist;
        expect(txn.created_by).to.exist;
        expect(txn.contract).to.exist;
        expect(txn.app).to.exist;
        expect(txn.blockchain).to.exist;
        expect(txn.origin).to.exist;
        expect(txn.transaction_type).to.exist;
        expect(txn.confirmations).to.exist;
        expect(txn.value).to.exist;
    }).timeout(5000);
});

// filtering not supported yet
describe.skip('testing Simba.getApplicationTransactions with queryParams', () => {
    it('specified fields should exist', async () => {
        const simba = new Simba();
        const request_id = "34bb8e12-8459-43cc-ae7f-e0fe0a59fbb1";
        const queryParams = {
            request_id,
        }
        const txns = await simba.getApplicationTransactions(appName, queryParams) as Record<any, any>;
        expect(txns.count).to.equal(1);
        expect(txns.next).to.equal(null);
        expect(txns.previous).to.equal(null);

        const txn = txns.results[0];
        expect(txn.id).to.exist;
        expect(txn.request_id).to.exist;
        expect(txn.created_on).to.exist;
        expect(Object.keys(txn).includes("finalized_on")).to.equal(true);
        expect(txn.method).to.exist;
        expect(txn.inputs).to.exist;
        expect(txn.receipt).to.exist;
        expect(Object.keys(txn).includes("error")).to.equal(true);
        expect(txn.error_details).to.exist;
        expect(txn.state).to.exist;
        expect(txn.raw_transaction).to.exist;
        expect(txn.signed_transaction).to.exist;
        expect(txn.transaction_hash).to.exist;
        expect(txn.bundle).to.exist;
        expect(Object.keys(txn).includes("block")).to.equal(true);
        expect(txn.nonce).to.exist;
        expect(txn.from_address).to.exist;
        expect(txn.to_address).to.exist;
        expect(txn.created_by).to.exist;
        expect(txn.contract).to.exist;
        expect(txn.app).to.exist;
        expect(txn.blockchain).to.exist;
        expect(txn.origin).to.exist;
        expect(txn.transaction_type).to.exist;
        expect(txn.confirmations).to.exist;
        expect(txn.value).to.exist;
    }).timeout(5000);
});

describe('testing Simba.getApplicationContract', () => {
    it('specified fields should exist', async () => {
        const simba = new Simba();
        const contract = await simba.getApplicationContract(appName, contractName) as Record<any, any>;
        expect(contract.id).to.exist;
        expect(contract.artifact).to.exist;
        expect(contract.metadata.contract.name).to.equal("TestContractChanged");
        expect(contract.has_assets).to.equal(false);
        expect(contract.blockchain).to.equal("3b288902-8438-492b-857a-58060d9c254a");
        expect(contract.storage).to.equal("f82d86ad-9a8f-4730-9765-770d2f72f6df");
        expect(contract.created_on).to.equal("2022-08-26T17:12:19.082951Z");
        expect(contract.updated_on).to.exist;
        expect(Object.keys(contract).includes("version")).to.equal(true);
        expect(contract.display_name).to.equal("BrendanTestApp");
        expect(contract.api_name).to.equal(contractName);
        expect(contract.organisation).to.equal("20e69814-43d0-42b4-8499-d13a9d1afb23");
        expect(contract.asset_type).to.equal(contractName);
        expect(contract.generate_request_id).to.equal(false);
    }).timeout(5000);
});

describe('testing Simba.getcontractTransactions', () => {
    it('specified fields should exist', async () => {
        const simba = new Simba();
        const txns = await simba.getContractTransactions(appName, contractName) as Record<any, any>;
        expect(txns.count).to.be.greaterThan(0);
        expect(txns.next.includes("https://simba-dev-api.platform.simbachain.com/v2/apps/BrendanTestApp/contract/test_contract_vds5/transactions/?limit=10&offset=10")).to.equal(true);
        expect(txns.previous).to.equal(null);
        expect(txns.results.length).to.be.greaterThanOrEqual(0);
    }).timeout(5000);
});

describe('testing Simba.getcontractTransactions with queryParams', () => {
    it('specified fields should exist', async () => {
        const simba = new Simba();
        const id = "5a2288c6-0562-41e8-8f63-e6820fa3e62a";
        const queryParams = {
            id,
        }
        const txn = await simba.getContractTransactions(appName, contractName, queryParams) as Record<any, any>;
        expect(txn.count).to.equal(1);
        expect(txn.next).to.equal(null);
        expect(txn.previous).to.equal(null);
        expect(txn.results[0].id).to.equal(id);
    }).timeout(5000);
});

describe('testing Simba.getContracts', () => {
    it('specified fields should exist', async () => {
        const simba = new Simba();
        const contracts = await simba.getContracts(appName) as Record<any, any>;
        expect(contracts.count).to.be.greaterThan(0);
        expect(contracts.next).to.include("https://simba-dev-api.platform.simbachain.com/v2/apps/BrendanTestApp/contracts/?limit=10&offset=10");
        expect(Object.keys(contracts).includes("previous")).to.equal(true);
        const contract = contracts.results[0]
        expect(contract.id).to.exist;
        expect(contract.artifact).to.exist;
        expect(contract.blockchain).to.exist;
        expect(contract.storage).to.exist;
        expect(contract.storage_container).to.exist;
        expect(contract.created_on).to.exist;
        expect(contract.updated_on).to.exist;
        expect(contract.address).to.exist;
        expect(Object.keys(contract).includes("version")).to.equal(true);
        expect(contract.display_name).to.exist;
        expect(contract.api_name).to.exist;
        expect(contract.organisation).to.exist;
        expect(contract.contract_type).to.exist;
        expect(contract.asset_type).to.exist;
        expect(contract.state).to.exist;
        expect(contract.generate_request_id).to.exist;
    }).timeout(10000);
});

// filtering not supported yet
describe.skip('testing Simba.getContracts with queryParams', () => {
    it('specified fields should exist', async () => {
        const simba = new Simba();
        const id = "acf6fd5d-e27a-4493-ae79-9b73c6ddc9a4";
        const queryParams = {
            id,
        }
        const res = await simba.getContracts(appName, queryParams) as Record<any, any>;
        expect(res.count).to.equal(1);
        expect(res.next).to.equal(null);
        expect(res.previous).to.equal(null);
        expect(res.results[0].id).to.equal(id);
    }).timeout(10000);
});

describe('testing Simba.validateBundleHash', () => {
    it('specified fields should exist', async () => {
        const simba = new Simba();
        const ver = await simba.validateBundleHash(appName, contractName, bundleHash) as Record<any, any>;
        expect(Object.keys(ver).includes("errors")).to.equal(true);
        expect(ver.alg).to.equal("sha256");
        expect(ver.digest).to.equal("hex");
        expect(ver.files.length).to.equal(2);
        const file1 = ver.files[0];
        expect(file1.alg).to.equal("sha256");
        expect(file1.digest).to.equal("hex");
        expect(file1.uid).to.equal("189f55d6-19e8-4b16-8bec-7c31978d3c04.gz");
        expect(file1.mime).to.equal("image/png");
        expect(file1.name).to.equal("testimage1.png");
        expect(file1.hash).to.equal("2296eb9942777137afc109a19b8140feb3f31a5bc816d53362e68506346d6b9a");
        expect(file1.size).to.equal(83763);
    }).timeout(10000);
});

// describe('testing Simba.getBundle', () => {
//     it('implement', async () => {
//         // implement
//     }).timeout(10000);
// });

// describe('testing Simba.getBundleFile', () => {
//     it('implement', async () => {
//         // implement
//     }).timeout(10000);
// });

describe('testing Simba.getManifestForBundleFromBundleHash', () => {
    it('specified fields should exist', async () => {
        const simba = new Simba();
        const manifest = await simba.getManifestForBundleFromBundleHash(appName, contractName, bundleHash) as Record<any, any>;
        expect(manifest.alg).to.equal("sha256");
        expect(manifest.digest).to.equal("hex");
        expect(manifest.files.length).to.equal(2);
        const file1 = manifest.files[0];
        expect(file1.alg).to.equal("sha256");
        expect(file1.digest).to.equal("hex");
        expect(file1.uid).to.equal("189f55d6-19e8-4b16-8bec-7c31978d3c04.gz");
        expect(file1.mime).to.equal("image/png");
        expect(file1.name).to.equal("testimage1.png");
        expect(file1.hash).to.equal("2296eb9942777137afc109a19b8140feb3f31a5bc816d53362e68506346d6b9a");
        expect(file1.size).to.equal(83763);
    }).timeout(10000);
});

describe('testing Simba.getContractInfo', () => {
    it('specified fields should exist', async () => {
        const simba = new Simba();
        const info = await simba.getContractInfo(appName, contractName) as Record<any, any>;
        const contract = info.contract;
        expect(contract.name).to.equal(solContractName);
        expect(contract.enums).to.exist;
        expect("TestContractChanged.Addr" in contract.types).to.equal(true);
        expect("TestContractChanged.Person" in contract.types).to.equal(true);
        expect("TestContractChanged.AddressPerson" in contract.types).to.equal(true);
        expect(contract.assets).to.exist;
        expect(contract.events).to.exist;
        expect(contract.source.lang).to.equal("solidity");
        expect(contract.source.version).to.equal("^0.8.0");
        expect(contract.methods).to.exist;
        expect(contract.abstract).to.equal(false);
        expect(contract["constructor"]).to.exist;
        expect(contract.inheritance.length).to.equal(0);
        expect(info.api_name).to.equal(contractName);
        expect(info.name).to.equal(contractName);
        expect(info.network).to.equal(Quorum);
        expect(info.network_type).to.equal(ethereum)
        expect(info.poa).to.equal(true);
        expect(info.faucet).to.equal(null);
        expect(info.simba_faucet).to.equal(false);
    }).timeout(10000);
});

// describe('testing Simba.getEvents', () => {
//     it('implement', async () => {
//         // implement
//     }).timeout(10000);
// });

// describe('testing Simba.getEvents with queryParams', () => {
//     it('implement', async () => {
//         // implement
//     }).timeout(10000);
// });

// describe('testing Simba.getEventsByContract', () => {
//     it('implement', async () => {
//         // implement
//     }).timeout(10000);
// });

// describe('testing Simba.getEventsByContract with queryParams', () => {
//     it('implement', async () => {
//         // implement
//     }).timeout(10000);
// });

describe('testing Simba.getReceipt', () => {
    it('specified fields should exist', async () => {
        const simba = new Simba();
        const res = await simba.getReceipt(appName, contractName, transactionHash) as Record<any, any>;
        const receipt = res.receipt;
        expect(receipt.blockHash).to.equal("0x8b86451a944d10019047b9e14c3c423a1d620254733b02bc34c7292b4b82f04e");
        expect(receipt.blockNumber).to.equal(13814752);
        expect(receipt.contractAddress).to.equal(null);
        expect(receipt.cumulativeGasUsed).to.be.greaterThan(0);
        expect(receipt.from).to.equal("0xCa47475036474eAc0dF6697e6A6C74386f218236");
        expect(receipt.gasUsed).to.be.greaterThan(0);
        expect(receipt.isPrivacyMarkerTransaction).to.equal(false);
        expect(receipt.logs.length).to.equal(0);
        expect(receipt.logsBloom).to.exist;
        expect(receipt.status).to.exist;
        expect(receipt.to).equal("0x3daac1c8Bb80406D0eb2e7608C5d2fBcA92eD4a6");
        expect(receipt.transactionHash).to.equal(transactionHash);
        expect(receipt.transactionIndex).to.equal(0);
        expect(receipt.type).to.equal("0x0");
    }).timeout(10000);
});

describe('testing Simba.getTransaction', () => {
    it('specified fields should exist', async () => {
        const simba = new Simba();
        const res = await simba.getTransaction(appName, contractName, transactionHash) as Record<any, any>;
        const transaction = res.transaction;
        expect(transaction.blockHash).to.equal("0x8b86451a944d10019047b9e14c3c423a1d620254733b02bc34c7292b4b82f04e");
        expect(transaction.blockNumber).to.equal(13814752);
        expect(transaction.from).to.equal("0xCa47475036474eAc0dF6697e6A6C74386f218236");
        expect(transaction.gas).to.be.greaterThan(0);
        expect(transaction.gasPrice).to.be.greaterThanOrEqual(0);
        expect(transaction.hash).to.equal(transactionHash);
        expect(transaction.input).to.exist;
        expect(transaction.nonce).to.equal(325)
        expect(transaction.to).equal("0x3daac1c8Bb80406D0eb2e7608C5d2fBcA92eD4a6");
        expect(transaction.value).to.equal(0);
        expect(transaction.type).to.equal("0x0");
        expect(transaction.v).to.equal(709);
        expect(transaction.r).to.equal("0x2a7f3ad4a253733599528764bfd364443cf3346b32f6a541d803c92cfaf0ff23");
        expect(transaction.s).to.equal("0x7f8fdf641c3ecc8c0f8e817885ff9ca1b3c006cc260039328526e093f28540e0");
    }).timeout(10000);
});

describe('testing Simba.getTransactionsByMethod', () => {
    it('specified fields should exist', async () => {
        const simba = new Simba();
        const res = await simba.getTransactionsByMethod(appName, contractName, "structTest5") as Record<any, any>;
        expect(res.count).to.be.greaterThan(0);
        expect(res.next.includes("https://simba-dev-api.platform.simbachain.com/v2/apps/BrendanTestApp/contract/test_contract_vds5/structTest5/?limit=10&offset=10")).to.equal(true);
        expect(res.results.length).to.be.greaterThan(0);
    }).timeout(10000);
});

describe('testing Simba.getTransactionsByMethod with queryParams', () => {
    it('specified fields should exist', async () => {
        const simba = new Simba();
        const id = "5a2288c6-0562-41e8-8f63-e6820fa3e62a";
        const queryParams = {
            id,
        }
        const res = await simba.getTransactionsByMethod(appName, contractName, "structTest5", queryParams) as Record<any, any>;
        expect(res.count).to.be.equal(1);
        expect(res.next).to.equal(null);
        expect(res.previous).to.equal(null);
        expect(res.results[0].id).to.equal(id);
    }).timeout(10000);
});

describe('testing Simba.getTransactionsByContract', () => {
    it('specified fields should exist', async () => {
        const simba = new Simba();
        const res = await simba.getTransactionsByContract(appName, contractName) as Record<any, any>;
        expect(res.count).to.be.greaterThan(0);
        expect(res.next.includes("https://simba-dev-api.platform.simbachain.com/v2/apps/BrendanTestApp/contract/test_contract_vds5/transactions/?limit=10&offset=10")).to.equal(true);
        expect(res.previous).to.equal(null);
        expect(res.results.length).to.be.greaterThan(0);
    }).timeout(10000);
});

describe('testing Simba.getTransactionsByContract with queryParams', () => {
    it('specified fields should exist', async () => {
        const simba = new Simba();
        const id = "5a2288c6-0562-41e8-8f63-e6820fa3e62a";
        const queryParams = {
            id,
        }
        const res = await simba.getTransactionsByMethod(appName, contractName, "structTest5", queryParams) as Record<any, any>;
        expect(res.count).to.equal(1);
        expect(res.next).to.equal(null);
        expect(res.previous).to.equal(null);
        expect(res.results[0].id).to.equal(id);
    }).timeout(10000);
});

describe('testing Simba.submitContractMethod', () => {
    it('specified fields should exist', async () => {
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
        expect(res.id).to.exist;
        expect(res.request_id).to.exist;
        expect(res.created_on).to.exist;
        expect(res.finalized_on).to.equal(null);
        expect(res.method).to.equal(methodName);
        expect(res.inputs.person).to.exist;
        expect(res.inputs["_bundleHash"]).to.exist;
        expect(res.receipt).to.exist;
        expect(Object.keys(res).includes("error")).to.equal(true);
        expect(res.error_details).to.exist;
        expect(res.state).to.equal("ACCEPTED");
        expect(Object.keys(res.raw_transaction).length).to.equal(0);
        expect(res.transaction_hash).to.equal(null);
        expect(res.bundle).to.exist;
        expect(res.block).to.equal(null);
        expect(res.nonce).to.equal(null);
        expect(res.from_address).to.equal(null);
        expect(res.to_address).to.equal(null);
        expect(res.created_by).to.exist;
        expect(res.contract.id).to.equal("f8896066-73c4-40b6-837e-7bcb8307b231");
        expect(res.contract.api_name).to.equal(contractName);
        expect(res.app).to.equal("fb5fd523-9982-4785-a0ea-89d277f4014b");
        expect(res.blockchain).to.equal("3b288902-8438-492b-857a-58060d9c254a");
        expect(res.origin).to.equal("SCAAS");
        expect(res.transaction_type).to.equal("MC");
        expect(res.confirmations).to.equal(0);
        expect(res.value).to.equal("0");
    }).timeout(10000);
});

describe('testing Simba.submitContractMethod', () => {
    it('specified fields should exist', async () => {
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
        expect(res.id).to.exist;
        expect(res.request_id).to.exist;
        expect(res.created_on).to.exist;
        expect(res.finalized_on).to.equal(null);
        expect(res.method).to.equal(methodName);
        expect(res.inputs.person).to.exist;
        expect(res.inputs["_bundleHash"]).to.exist;
        expect(res.receipt).to.exist;
        expect(Object.keys(res).includes("error")).to.equal(true);
        expect(res.error_details).to.exist;
        expect(res.state).to.equal("SUBMITTED");

        const raw_transaction = res.raw_transaction;
        expect(raw_transaction.from).to.exist;
        expect(raw_transaction.to).to.exist;
        expect(raw_transaction.chainId).to.exist;
        expect(raw_transaction.nonce).to.exist;
        expect(raw_transaction.data).to.exist;
        expect(raw_transaction.value).to.exist;
        expect(raw_transaction.gas).to.exist;
        expect(raw_transaction.gasPrice).to.exist;

        const signed_transaction = res.signed_transaction;
        expect(signed_transaction.rawTransaction).to.exist;
        expect(signed_transaction.hash).to.exist;
        expect(signed_transaction.r).to.exist;
        expect(signed_transaction.s).to.exist;
        expect(signed_transaction.v).to.exist;

        expect(res.transaction_hash).to.exist
        expect(res.bundle).to.exist;
        expect(res.block).to.equal(null);
        expect(res.nonce).to.be.greaterThan(0);
        expect(res.from_address).to.exist;
        expect(res.to_address).to.equal(null);
        expect(res.created_by).to.exist;
        expect(res.contract.id).to.equal("f8896066-73c4-40b6-837e-7bcb8307b231");
        expect(res.contract.api_name).to.equal(contractName);
        expect(res.app).to.equal("fb5fd523-9982-4785-a0ea-89d277f4014b");
        expect(res.blockchain).to.equal("3b288902-8438-492b-857a-58060d9c254a");
        expect(res.origin).to.equal("SCAAS");
        expect(res.transaction_type).to.equal("MC");
        expect(res.confirmations).to.equal(0);
        expect(res.value).to.equal("0");
    }).timeout(10000);
});

describe('testing Simba.callContractMethod', () => {
    it('specified fields should exist', async () => {
        const simba = new Simba();
        const methodName = "getNum";
        const res = await simba.callContractMethod(appName, contractName, methodName) as Record<any, any>;
        expect(res.request_id).to.exist;
        expect(res.value).to.equal(13);
        expect(res.state).to.equal("COMPLETED");
    }).timeout(10000);
});

// // describe('testing Simba.submitSignedTransaction', () => {
// //     it('implement', async () => {
// //         // implement
// //     }).timeout(10000);
// // });

// // describe('testing Simba.saveDesign', () => {
// //     it('implement', async () => {
// //         // implement
// //     }).timeout(10000);
// // });

// // describe('testing Simba.waitForDeployment', () => {
// //     it('implement', async () => {
// //         // implement
// //     }).timeout(10000);
// // });

// // describe('testing Simba.deployDesign', () => {
// //     it('implement', async () => {
// //         // implement
// //     }).timeout(10000);
// // });

// // describe('testing Simba.deployArtifact', () => {
// //     it('implement', async () => {
// //         // implement
// //     }).timeout(10000);
// // });

// // describe('testing Simba.waitForDeployDesign', () => {
// //     it('implement', async () => {
// //         // implement
// //     }).timeout(10000);
// // });

// // describe('testing Simba.waitForDeployArtifact', () => {
// //     it('implement', async () => {
// //         // implement
// //     }).timeout(10000);
// // });

// // describe('testing Simba.waitForOrgTransaction', () => {
// //     it('implement', async () => {
// //         // implement
// //     }).timeout(10000);
// // });

describe('testing Simba.getDesigns', () => {
    it('implement', async () => {
        const simba = new Simba();
        const res = await simba.getDesigns(orgName) as Record<any, any>;
        expect(res.count).to.be.greaterThan(0);
        expect(res.next.includes("https://simba-dev-api.platform.simbachain.com/v2/organisations/brendan_birch_simbachain_com/contract_designs/?limit=10&offset=10")).to.equal(true);
        expect(res.previous).to.equal(null);
        expect(res.results.length).to.be.greaterThan(0);

        const design = res.results[0];
        expect(design.id).to.exist;
        expect(design.name).to.exist;
        expect(Object.keys(design).includes("version")).to.equal(true);
        expect(design.created_on).to.exist;
        expect(design.updated_on).to.exist;
        expect(design.code).to.exist;
        expect(design.language).to.equal(solidity);
        expect(design.metadata).to.exist;
        expect(Object.keys(design).includes("err")).to.equal(true);
        expect(design.mode).to.exist;
        expect(Object.keys(design).includes("model")).to.equal(true);
        expect(design.service_args).to.exist;
        expect(Object.keys(design).includes("asset_type")).to.equal(true);
        expect(design.organisation).to.exist;
        expect(Object.keys(design).includes("designset")).to.equal(true);
    }).timeout(10000);
});

describe('testing Simba.getBlockchains', () => {
    it('specified fields should exist', async () => {
        const simba = new Simba();
        const res = await simba.getBlockchains(orgName) as Record<any, any>;
        expect(res.count).to.be.greaterThan(0);
        expect(Object.keys(res).includes("next")).to.equal(true);
        expect(res.previous).to.equal(null);
        expect(res.results.length).to.be.greaterThan(0);
        
        const blockchain = res.results[0];
        expect(blockchain.id).to.exist;
        expect(blockchain.global_id).to.exist;
        expect(blockchain.display_name).to.exist;
        expect(blockchain.name).to.exist;
        expect(blockchain.blockchain_type).to.exist;
        expect(blockchain.poa).to.exist;
        expect(Object.keys(blockchain).includes("faucet")).to.equal(true);
        expect(blockchain.supported_contract_types).to.exist;
        expect(blockchain.currency_unit).to.exist;
        expect(Object.keys(blockchain).includes("consensus_alg")).to.equal(true);
        expect(blockchain.gas_price_multiplier).to.exist;
        expect(blockchain.block_time).to.exist;
        expect(blockchain.min_confirms_reqd).to.exist;
        expect(blockchain.min_confirms_adjustable).to.exist;
        expect(blockchain.disable_gap_analysis).to.exist;
        expect(blockchain.disable_new_blocks).to.exist;
        expect(blockchain.perform_initial_import).to.exist;
        expect(blockchain.base_price_multiplier).to.exist;
        expect(blockchain.priority_fee_multiplier).to.exist;
        expect(blockchain.low_fee_percentile).to.exist;
        expect(blockchain.high_fee_percentile).to.exist;
        expect(blockchain.name).to.exist;
        expect(blockchain.dynamic_pricing).to.exist;
    }).timeout(10000);
});

describe('testing Simba.getStorages', () => {
    it('specified fields should exist', async () => {
        const simba = new Simba();
        const res = await simba.getStorages(orgName) as Record<any, any>;
        expect(res.count).to.be.greaterThan(0);
        expect(Object.keys(res).includes("next")).to.equal(true);
        expect(res.previous).to.equal(null);
        expect(res.results.length).to.be.greaterThan(0);
        
        const storage = res.results[0];
        expect(storage.id).to.exist;
        expect(storage.display_name).to.exist;
        expect(storage.name).to.exist;
        expect(storage.storage_type).to.exist;
    }).timeout(10000);
});

describe('testing Simba.getArtifacts', () => {
    it('specified fields should exist', async () => {
        const simba = new Simba();
        const res = await simba.getArtifacts(orgName) as Record<any, any>;
        expect(res.count).to.be.greaterThan(0);
        expect(Object.keys(res).includes("next")).to.equal(true);
        expect(res.previous).to.equal(null);
        expect(res.results.length).to.be.greaterThan(0);
        
        const artifact = res.results[0];
        expect(artifact.id).to.exist;
        expect(artifact.design).to.exist;
        expect(artifact.created_on).to.exist;
        expect(artifact.updated_on).to.exist;
        expect(artifact.name).to.exist;
        expect(artifact.code).to.exist;
        expect(artifact.metadata).to.exist;
        expect(artifact.service_args).to.exist;
        expect(artifact.organisation).to.exist;
        expect(artifact.language).to.exist;
        expect(artifact.methods).to.exist;
        expect(Object.keys(artifact).includes("asset_type")).to.equal(true);
        expect(artifact.linked_contracts).to.exist;
    }).timeout(10000);
});

describe('testing Simba.getArtifact', () => {
    it('specified fields should exist', async () => {
        const simba = new Simba();
        const artifactID = "af76b1a9-365a-428f-8749-cd23280b4ead";
        const artifact = await simba.getArtifact(orgName, artifactID) as Record<any, any>;
        expect(artifact.id).to.exist;
        expect(artifact.design).to.exist;
        expect(artifact.created_on).to.exist;
        expect(artifact.updated_on).to.exist;
        expect(artifact.name).to.exist;
        expect(artifact.code).to.exist;
        expect(artifact.metadata).to.exist;
        expect(artifact.service_args).to.exist;
        expect(artifact.organisation).to.exist;
        expect(artifact.language).to.exist;
        expect(artifact.methods).to.exist;
        expect(Object.keys(artifact).includes("asset_type")).to.equal(true);
        expect(artifact.linked_contracts).to.exist;
    }).timeout(10000);
});

describe('testing Simba.createArtifact', () => {
    it('specified fields should exist', async () => {
        const simba = new Simba();
        const designID = "644ed6cc-8073-4c4b-9395-aa466a3a27e7";
        const artifact = await simba.createArtifact(orgName, designID) as Record<any, any>;
        expect(artifact.id).to.exist;
        expect(artifact.design).to.exist;
        expect(artifact.created_on).to.exist;
        expect(artifact.updated_on).to.exist;
        expect(artifact.name).to.exist;
        expect(artifact.code).to.exist;
        expect(artifact.metadata).to.exist;
        expect(artifact.service_args).to.exist;
        expect(artifact.organisation).to.exist;
        expect(artifact.language).to.exist;
        expect(artifact.methods).to.exist;
        expect(Object.keys(artifact).includes("asset_type")).to.equal(true);
        expect(artifact.linked_contracts).to.exist;
    }).timeout(10000);
});

describe('testing Simba.subscribe', () => {
    it('specified fields should exist', async () => {
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
        expect(res.id).to.exist;
        expect(res.endpoint).to.equal(notificationEndpoint);
        expect(res.txn).to.equal(txn);
        expect(res.contract).to.exist;
        expect(res.applications).to.exist;
        expect(res.filters).to.exist;
    }).timeout(10000);
});

describe('testing Simba.setNotificationConfig', () => {
    it('specified fields should exist', async () => {
        const simba = new Simba();
        const scheme = "http";
        const authType = "";
        const authInfo = {};
        const res = await simba.setNotificationConfig(orgName, scheme, authType, authInfo) as Record<any, any>;
        expect(res.id).to.exist;
        expect(res.scheme).to.equal(scheme);
        expect(res.auth_type).to.equal(authType)
        expect(res.auth_info).to.exist;
        expect(res.created_on).to.exist;
        expect(res.updated_on).to.exist;
        expect(res.organisation).to.exist;
    }).timeout(10000);
});
