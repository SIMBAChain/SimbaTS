import {
    Simba,
} from "../../";
import { expect } from 'chai';
import 'mocha';
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
        expect(txns.count).to.be.greaterThan(193);
        expect(txns.next).to.include("https://simba-dev-api.platform.simbachain.com/v2/apps/BrendanTestApp/transactions/?limit=10&offset=10");
        expect(txns.previous).to.not.equal(undefined);
        expect(txns.results.length).to.be.greaterThan(0);
    }).timeout(5000);
});

describe('testing Simba.getApplicationContract', () => {
    it('specified fields should exist', async () => {
        const simba = new Simba();
        const contract = await simba.getApplicationContract("BrendanTestApp", contractName) as Record<any, any>;
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

describe('testing Simba.getContracts', () => {
    it('specified fields should exist', async () => {
        const simba = new Simba();
        const contracts = await simba.getContracts(appName) as Record<any, any>;
        expect(contracts.count).to.be.greaterThan(0);
        expect(contracts.next).to.include("https://simba-dev-api.platform.simbachain.com/v2/apps/BrendanTestApp/contracts/?limit=10&offset=10");
        expect(Object.keys(contracts).includes("previous")).to.equal(true);
        const contract = await simba.getApplicationContract("BrendanTestApp", contractName) as Record<any, any>;
        expect(contract.id).to.exist;
        expect(contract.artifact).to.exist;
        expect(contract.metadata.contract.name).to.exist;
        expect(contract.has_assets).to.exist;
        expect(contract.blockchain).to.exist;
        expect(contract.storage).to.exist;
        expect(contract.created_on).to.exist;
        expect(contract.updated_on).to.exist;
        expect(Object.keys(contract).includes("version")).to.equal(true);
        expect(contract.display_name).to.exist;
        expect(contract.api_name).to.exist;
        expect(contract.organisation).to.exist;
        expect(contract.asset_type).to.exist;
        expect(contract.generate_request_id).to.exist;
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

// describe('testing Simba.getEventsByContract', () => {
//     it('implement', async () => {
//         // implement
//     }).timeout(10000);
// });

describe('testing Simba.getReceipt', () => {
    it('implement', async () => {
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
