import {
    Simba,
} from "../../src/simba";
import { expect } from 'chai';
import 'mocha';
import {
    baseApiUrl,
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
    sourceCode,
    deploymentID,
    designID,
    artifactID,
    transactionID,
    mumbai,
    eventContract,
    eventName,
    nonPendingTransactionID,
    transactionObject,
} from "../project_configs"
import * as path from 'path';
import {cwd} from 'process';
import * as fs from "fs";

import { FileHandler } from "../../src/filehandler";

import {
    RequestHandler,
} from "../../src/request_handler";
import {
    callFakeMethod,
} from "../tests_setup/fake_method_caller";
import sinon from "sinon";

describe('testing Simba.getSimbaContract', () => {
    it('simba.simbaContract.baseApiUrl should be baseApiUrl', async () => {
        const simba = new Simba();
        const simbaContract = simba.getSimbaContract(appName, contractName);
        expect(simbaContract.baseApiURL).to.equal(baseApiUrl);
    });
});

describe('testing Simba.whoAmI', () => {
    it('request method(s) should be called with correct params', async () => {
        const simba = new Simba();

        const sandbox = sinon.createSandbox();
        const doGetRequestStub = sandbox.stub(RequestHandler.prototype, "doGetRequest").resolves(await callFakeMethod("whoAmI"));
        sandbox.stub(RequestHandler.prototype, "getAuthAndOptions").resolves({});

        const iAm = await simba.whoAmI() as Record<any, any>;

        expect(doGetRequestStub.calledWith(
            "https://simba-dev-api.platform.simbachain.com/user/whoami/",
            sinon.match({}),
            true,
        )).to.be.true;

        expect(iAm.username).to.equal(userEmail);
        expect(iAm.first_name).to.exist;
        expect(iAm.last_name).to.exist;
        expect(iAm.admin).to.equal(true);
        expect(iAm.email).to.equal(userEmail)
        expect(iAm.organisations.length).to.be.greaterThan(0);
        expect(iAm.default_organisation).to.exist;
        expect(iAm.permissions).to.exist;

        sandbox.restore();
    });
});

describe('testing Simba.balance', () => {
    it('request method(s) should be called with correct params', async () => {
        const simba = new Simba();

        const sandbox = sinon.createSandbox();
        const doGetRequestStub = sandbox.stub(RequestHandler.prototype, "doGetRequest").resolves(await callFakeMethod("balance"));
        sandbox.stub(RequestHandler.prototype, "getAuthAndOptions").resolves({});
        
        const balance = await simba.balance("mumbai", mumbaiWallet) as Record<any, any>;

        expect(doGetRequestStub.calledWith(
            "https://simba-dev-api.platform.simbachain.com/user/account/mumbai/balance/0x59D859Da04439AE87Afd689A4CA89C354CB93532/",
            sinon.match({}),
            true,
        ))
        expect(balance.balance).to.exist;

        sandbox.restore();
    });
});

describe('testing Simba.adminSetWallet', () => {
    it('request method(s) should be called with correct params', async () => {
        const simba = new Simba();

        const sandbox = sinon.createSandbox();
        const doPostRequestStub = sandbox.stub(RequestHandler.prototype, "doPostRequest").resolves(await callFakeMethod("adminSetWallet"));
        sandbox.stub(RequestHandler.prototype, "getAuthAndOptions").resolves({});

        const userID = 17;
        const res: any = await simba.adminSetWallet(
            userID,
            "fakeBlockchain",
            "fakePublicKey",
            "fakePrivateKey",
        );

        expect(doPostRequestStub.calledWith(
            "https://simba-dev-api.platform.simbachain.com/v2/admin/users/17/wallet/set/",
            sinon.match({}),
            sinon.match({"blockchain":"fakeBlockchain","identities":[{"pub":"fakePublicKey","priv":"fakePrivateKey"}]}),
            true,
        )).to.be.true;

        expect(res.wallet).to.equal("someWalletData");

        sandbox.restore();

    });
});


describe('testing Simba.setWallet', () => {
    it('request method(s) should be called with correct params', async () => {
        const simba = new Simba();

        const sandbox = sinon.createSandbox();
        const doPostRequestStub = sandbox.stub(RequestHandler.prototype, "doPostRequest").resolves(await callFakeMethod("adminSetWallet"));
        sandbox.stub(RequestHandler.prototype, "getAuthAndOptions").resolves({});
        
        const res: any = await simba.setWallet(
            "fakeBlockchain",
            "fakePublicKey",
            "fakePrivateKey",
        );

        expect(doPostRequestStub.calledWith(
            "https://simba-dev-api.platform.simbachain.com/user/wallet/set/",
            sinon.match({}),
            sinon.match({"blockchain":"fakeBlockchain","identities":[{"pub":"fakePublicKey","priv":"fakePrivateKey"}]}),
            true,
        )).to.be.true;

        expect(res.wallet).to.equal("someWalletData");

        sandbox.restore();
    });
});

describe('testing Simba.getWallet', () => {
    it('request method(s) should be called with correct params', async () => {
        const simba = new Simba();

        const sandbox = sinon.createSandbox();
        const doGetRequestStub = sandbox.stub(RequestHandler.prototype, "doGetRequest").resolves(await callFakeMethod("getWallet"));
        sandbox.stub(RequestHandler.prototype, "getAuthAndOptions").resolves({});

        const walletRes = await simba.getWallet() as Record<any, any>;

        expect(doGetRequestStub.calledWith(
            "https://simba-dev-api.platform.simbachain.com/user/wallet/",
            sinon.match({}),
            true,
        )).to.be.true;

        const wallet = walletRes.wallet;
        expect(wallet.principal).to.equal(userEmail);
        expect(wallet.alias).to.equal(userEmail);
        expect(wallet.identities).to.exist;

        sandbox.restore();
    });
});

describe('testing Simba.createOrg', () => {
    it('request method(s) should be called with correct params', async () => {
        const simba = new Simba();
        const orgName = "simbats_org";
        const display = "simbats_org";

        const sandbox = sinon.createSandbox();
        const doPostRequestStub = sandbox.stub(RequestHandler.prototype, "doPostRequest").resolves(await callFakeMethod("createOrg"));
        sandbox.stub(RequestHandler.prototype, "getAuthAndOptions").resolves({});

        const res = await simba.createOrg(orgName, display) as Record<any, any>;

        expect(doPostRequestStub.calledWith(
            "https://simba-dev-api.platform.simbachain.com/v2/organisations/",
            sinon.match({}),
            sinon.match({"name":"simbats_org","display_name":"simbats_org"}),
            true,
        )).to.be.true;
        expect(res.id).to.equal("3fa85f64-5717-4562-b3fc-2c963f66afa6");

        sandbox.restore();
    });
});

describe('testing Simba.createApp', () => {
    it('request method(s) should be called with correct params', async () => {
        const simba = new Simba();
        const orgName = "simbats_org";
        const appName = "simbats_app";
        const display = "simbats_app";

        const sandbox = sinon.createSandbox();
        const doGetRequestStub = sandbox.stub(RequestHandler.prototype, "doGetRequest").resolves();
        sandbox.stub(RequestHandler.prototype, "getAuthAndOptions").resolves({});
        
        try {
            // create app will throw an error when doGetRequest resolves
            await simba.createApp(orgName, appName, display) as Record<any, any>;
        } catch (error) {
            // do nothing
        }

        expect(doGetRequestStub.calledWith(
            "https://simba-dev-api.platform.simbachain.com/v2/organisations/simbats_org/applications/simbats_app/",
            sinon.match({}),
            true,
        )).to.be.true;

        sandbox.restore();

    });
});

describe('testing Simba.getApplication', () => {
    it('request method(s) should be called with correct params', async () => {
        const simba = new Simba();

        const sandbox = sinon.createSandbox();
        const doGetRequestStub = sandbox.stub(RequestHandler.prototype, "doGetRequest").resolves(await callFakeMethod("getApplication"));
        sandbox.stub(RequestHandler.prototype, "getAuthAndOptions").resolves({});

        const app = await simba.getApplication(orgName, appName) as Record<any, any>;

        expect(doGetRequestStub.calledWith(
            "https://simba-dev-api.platform.simbachain.com/v2/organisations/brendan_birch_simbachain_com/applications/BrendanTestApp/",
            sinon.match({}),
            true,
        )).to.be.true;

        expect(app.name).to.equal(appName);
        expect(app.id).to.equal("fb5fd523-9982-4785-a0ea-89d277f4014b");
        expect(app.display_name).to.equal(appName)
        expect(app.created_on).to.equal("2022-07-15T22:00:42.480234Z");
        expect(app.number_of_api).to.equal(40)
        expect(app.openapi).to.equal("https://simba-dev-api.platform.simbachain.com/v2/apps/BrendanTestApp/");

        sandbox.restore();
    });
});

describe('testing Simba.getApplicationTransactions', () => {
    it('request method(s) should be called with correct params', async () => {
        const simba = new Simba();

        const sandbox = sinon.createSandbox();
        const doGetRequestStub = sandbox.stub(RequestHandler.prototype, "doGetRequest").resolves(await callFakeMethod("getApplicationTransactions"));
        sandbox.stub(RequestHandler.prototype, "getAuthAndOptions").resolves({});

        const txns = await simba.getApplicationTransactions(appName) as Record<any, any>;

        expect(doGetRequestStub.calledWith(
            "https://simba-dev-api.platform.simbachain.com/v2/apps/BrendanTestApp/transactions/",
            sinon.match({}),
            true,
        )).to.be.true;

        expect(txns.count).to.be.greaterThan(0);
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
        expect(Object.keys(txn).includes("to_address")).to.equal(true);
        expect(txn.created_by).to.exist;
        expect(txn.contract).to.exist;
        expect(txn.app).to.exist;
        expect(txn.blockchain).to.exist;
        expect(txn.origin).to.exist;
        expect(txn.transaction_type).to.exist;
        expect(txn.confirmations).to.exist;
        expect(txn.value).to.exist;

        sandbox.restore();
    });
});

describe('testing Simba.getApplicationContract', () => {
    it('request method(s) should be called with correct params', async () => {
        const simba = new Simba();

        const sandbox = sinon.createSandbox();
        const doGetRequestStub = sandbox.stub(RequestHandler.prototype, "doGetRequest").resolves(await callFakeMethod("getApplicationContract"));
        sandbox.stub(RequestHandler.prototype, "getAuthAndOptions").resolves({});

        const contract = await simba.getApplicationContract(appName, contractName) as Record<any, any>;

        expect(doGetRequestStub.calledWith(
            "https://simba-dev-api.platform.simbachain.com/v2/apps/BrendanTestApp/contract/test_contract_vds5/",
            sinon.match({}),
            true,
        )).to.be.true;

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

        sandbox.restore();
    });
});

describe('testing Simba.getcontractTransactions', () => {
    it('request method(s) should be called with correct params', async () => {
        const simba = new Simba();

        const sandbox = sinon.createSandbox();
        const doGetRequestStub = sandbox.stub(RequestHandler.prototype, "doGetRequest").resolves(await callFakeMethod("getContractTransactions"));
        sandbox.stub(RequestHandler.prototype, "getAuthAndOptions").resolves({});

        const txns = await simba.getContractTransactions(appName, contractName) as Record<any, any>;

        expect(doGetRequestStub.calledWith(
                "https://simba-dev-api.platform.simbachain.com/v2/apps/BrendanTestApp/contract/test_contract_vds5/transactions/",
                sinon.match({}),
                true,
        )).to.be.true;

        expect(txns.count).to.be.greaterThan(0);
        expect(txns.next.includes("https://simba-dev-api.platform.simbachain.com/v2/apps/BrendanTestApp/contract/test_contract_vds5/transactions/?limit=10&offset=10")).to.equal(true);
        expect(txns.previous).to.equal(null);
        expect(txns.results.length).to.be.greaterThanOrEqual(0);

        sandbox.restore();
    });
});

describe('testing Simba.getcontractTransactions with queryParams', () => {
    it('request method(s) should be called with correct params', async () => {
        const simba = new Simba();
        const id = "5a2288c6-0562-41e8-8f63-e6820fa3e62a";
        const queryParams = {
            id,
        }

        const headersWithQueryParams = {
            headers: {
                Authorization: 'Bearer XTTGViuQ7LPi1MCqmfuTxh3zq48PNp',
                'Content-Type': 'application/json'
            },
            params: { id: '5a2288c6-0562-41e8-8f63-e6820fa3e62a' }
        };

        const sandbox = sinon.createSandbox();
        const doGetRequestStub = sandbox.stub(RequestHandler.prototype, "doGetRequest").resolves(await callFakeMethod("getContractTransactionsWithQueryParams"));
        sandbox.stub(RequestHandler.prototype, "getAuthAndOptions").resolves(headersWithQueryParams);

        const txn = await simba.getContractTransactions(appName, contractName, queryParams) as Record<any, any>;

        expect(doGetRequestStub.calledWith(
            "https://simba-dev-api.platform.simbachain.com/v2/apps/BrendanTestApp/contract/test_contract_vds5/transactions/",
            sinon.match(headersWithQueryParams),
            true,
        )).to.be.true;

        expect(txn.count).to.equal(1);
        expect(txn.next).to.equal(null);
        expect(txn.previous).to.equal(null);
        expect(txn.results[0].id).to.equal(id);

        sandbox.restore();
    });
});

describe('testing Simba.getContracts', () => {
    it('request method(s) should be called with correct params', async () => {
        const simba = new Simba();

        const sandbox = sinon.createSandbox();
        const doGetRequestStub = sandbox.stub(RequestHandler.prototype, "doGetRequest").resolves(await callFakeMethod("getContracts"));
        sandbox.stub(RequestHandler.prototype, "getAuthAndOptions").resolves({});

        const contracts = await simba.getContracts(appName) as Record<any, any>;

        expect(doGetRequestStub.calledWith(
            "https://simba-dev-api.platform.simbachain.com/v2/apps/BrendanTestApp/contracts/",
            sinon.match({}),
            true,
        )).to.be.true;

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
        expect(Object.keys(contract).includes("address")).to.equal(true);
        expect(Object.keys(contract).includes("version")).to.equal(true);
        expect(contract.display_name).to.exist;
        expect(contract.api_name).to.exist;
        expect(contract.organisation).to.exist;
        expect(contract.contract_type).to.exist;
        expect(contract.asset_type).to.exist;
        expect(contract.state).to.exist;
        expect(contract.generate_request_id).to.exist;

        sandbox.restore();
    });
});

describe('testing Simba.validateBundleHash', () => {
    it('request method(s) should be called with correct params', async () => {
        const simba = new Simba();

        const sandbox = sinon.createSandbox();
        const doGetRequestStub = sandbox.stub(RequestHandler.prototype, "doGetRequest").resolves(await callFakeMethod("validateBundleHash"));
        sandbox.stub(RequestHandler.prototype, "getAuthAndOptions").resolves({});

        const ver = await simba.validateBundleHash(appName, contractName, bundleHash) as Record<any, any>;

        expect(doGetRequestStub.calledWith(
            "https://simba-dev-api.platform.simbachain.com/v2/apps/BrendanTestApp/validate/test_contract_vds5/57f6ef0fcc97614f899af3f165cabbaec9632b95fc89906837f474a6a2c8a184/",
            sinon.match({}),
            true,
        )).to.be.true;
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

        sandbox.restore();
    });
});

describe('testing Simba.getManifestForBundleFromBundleHash', () => {
    it('request method(s) should be called with correct params', async () => {
        const simba = new Simba();

        const sandbox = sinon.createSandbox();
        const doGetRequestStub = sandbox.stub(RequestHandler.prototype, "doGetRequest").resolves(await callFakeMethod("getManifestForBundleFromBundleHash"))
        sandbox.stub(RequestHandler.prototype, "getAuthAndOptions").resolves({});

        const manifest = await simba.getManifestForBundleFromBundleHash(appName, contractName, bundleHash) as Record<any, any>;

        expect(doGetRequestStub.calledWith(
            "https://simba-dev-api.platform.simbachain.com/v2/apps/BrendanTestApp/contract/test_contract_vds5/bundle/57f6ef0fcc97614f899af3f165cabbaec9632b95fc89906837f474a6a2c8a184/manifest/",
            sinon.match({}),
            true,
        )).to.be.true;

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

        sandbox.restore();
    });
});

describe('testing Simba.getContractInfo', () => {
    it('request method(s) should be called with correct params', async () => {
        const simba = new Simba();

        const sandbox = sinon.createSandbox();
        const doGetRequestStub = sandbox.stub(RequestHandler.prototype, "doGetRequest").resolves(await callFakeMethod("getContractInfo"));
        sandbox.stub(RequestHandler.prototype, "getAuthAndOptions").resolves({});

        const info = await simba.getContractInfo(appName, contractName) as Record<any, any>;

        expect(doGetRequestStub.calledWith(
            "https://simba-dev-api.platform.simbachain.com/v2/apps/BrendanTestApp/contract/test_contract_vds5/info/",
            sinon.match({}),
            true,
        )).to.be.true;

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

        sandbox.restore();
    });
});

describe('testing Simba.getEvents', () => {
    it('request method(s) should be called with correct params', async () => {
        const simba = new Simba();

        const sandbox = sinon.createSandbox();
        const doGetRequestSTub = sandbox.stub(RequestHandler.prototype, "doGetRequest").resolves(await callFakeMethod("getEvents"));
        sandbox.stub(RequestHandler.prototype, "getAuthAndOptions").resolves({});

        const res = await simba.getEvents(
            appName,
            eventContract,
            eventName,
        ) as Record<any, any>;

        expect(doGetRequestSTub.calledWith(
            "https://simba-dev-api.platform.simbachain.com/v2/apps/BrendanTestApp/contract/eventcontract_vds5/events/Log/",
            sinon.match({}),
            true,
        )).to.be.true;

        expect(res.count).to.exist;
        expect(Object.keys(res).includes("next")).to.equal(true);
        expect(Object.keys(res).includes("previous")).to.equal(true);
        expect(res.results.length).to.exist;
        if (res.results.length > 0) {
            const event = res.results[0];
            expect(Object.keys(event).includes("id")).to.equal(true);
            expect(Object.keys(event).includes("created_on")).to.equal(true);
            expect(Object.keys(event).includes("updated_on")).to.equal(true);
            expect(Object.keys(event).includes("event_name")).to.equal(true);
            expect(Object.keys(event).includes("inputs")).to.equal(true);
            expect(Object.keys(event).includes("transaction")).to.equal(true);
        }

        sandbox.restore();
    });
});

describe('testing Simba.adminGetEvents', () => {
    it('request method(s) should be called with correct params', async () => {
        const simba = new Simba();

        const sandbox = sinon.createSandbox();
        const doGetRequestStub = sandbox.stub(RequestHandler.prototype, "doGetRequest").resolves(await callFakeMethod("adminGetEvents"));
        sandbox.stub(RequestHandler.prototype, "getAuthAndOptions").resolves({});

        const res = await simba.adminGetEvents() as Record<any, any>;

        expect(doGetRequestStub.calledWith(
            "https://simba-dev-api.platform.simbachain.com/admin/events/",
            sinon.match({}),
            true,
        )).to.be.true;

        expect(res.count).to.be.greaterThan(0);
        expect(Object.keys(res).includes("next")).to.equal(true);
        expect(Object.keys(res).includes("previous")).to.equal(true);
        expect(res.results.length).to.exist;
        if (res.results.length > 0) {
            const event = res.results[0];
            expect(event.id).to.exist;
            expect(event.created_on).to.exist;
            expect(event.updated_on).to.exist;
            expect(event.event_name).to.exist;
            expect(event.inputs).to.exist;
            expect(event.transaction).to.exist;
        }

        sandbox.restore();
    });
});

describe('testing Simba.getReceipt', () => {
    it('request method(s) should be called with correct params', async () => {
        const simba = new Simba();

        const sandbox = sinon.createSandbox();
        const doGetRequestStub = sandbox.stub(RequestHandler.prototype, "doGetRequest").resolves(await callFakeMethod("getReceipt"));
        sandbox.stub(RequestHandler.prototype, "getAuthAndOptions").resolves({});

        const res = await simba.getReceipt(appName, contractName, transactionHash) as Record<any, any>;

        expect(doGetRequestStub.calledWith(
            "https://simba-dev-api.platform.simbachain.com/v2/apps/BrendanTestApp/contract/test_contract_vds5/receipt/0x2b05a28c90283011054f9299e92b80f045ff3d454f87008c8b67e767393b7d14/",
            sinon.match({}),
            true,
        )).to.be.true;

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

        sandbox.restore();
    });
});

describe('testing Simba.getTransaction', () => {
    it('request method(s) should be called with correct params', async () => {
        const simba = new Simba();

        const sandbox = sinon.createSandbox();
        const doGetRequestStub = sandbox.stub(RequestHandler.prototype, "doGetRequest").resolves(await callFakeMethod("getTransaction"));
        sandbox.stub(RequestHandler.prototype, "getAuthAndOptions").resolves({});

        const res = await simba.getTransaction(appName, contractName, transactionHash) as Record<any, any>;

        expect(doGetRequestStub.calledWith(
            "https://simba-dev-api.platform.simbachain.com/v2/apps/BrendanTestApp/contract/test_contract_vds5/transaction/0x2b05a28c90283011054f9299e92b80f045ff3d454f87008c8b67e767393b7d14/",
            sinon.match({}),
            true,
        )).to.be.true;

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

        sandbox.restore();
    });
});

describe('testing Simba.getTransactionsByMethod', () => {
    it('request method(s) should be called with correct params', async () => {
        const simba = new Simba();

        const sandbox = sinon.createSandbox();
        const doGetRequestStub = sandbox.stub(RequestHandler.prototype, "doGetRequest").resolves(await callFakeMethod("getTransactionsByMethod"));
        sandbox.stub(RequestHandler.prototype, "getAuthAndOptions").resolves({});

        const res = await simba.getTransactionsByMethod(appName, contractName, "structTest5") as Record<any, any>;

        expect(doGetRequestStub.calledWith(
            "https://simba-dev-api.platform.simbachain.com/v2/apps/BrendanTestApp/contract/test_contract_vds5/structTest5/",
            sinon.match({}),
            true,
        )).to.be.true;

        expect(res.count).to.be.greaterThan(0);
        expect(res.next.includes("https://simba-dev-api.platform.simbachain.com/v2/apps/BrendanTestApp/contract/test_contract_vds5/structTest5/?limit=10&offset=10")).to.equal(true);
        expect(res.results.length).to.be.greaterThan(0);

        sandbox.restore();
    });
});

describe('testing Simba.getTransactionsByMethod with queryParams', () => {
    it('request method(s) should be called with correct params', async () => {
        const simba = new Simba();
        const id = "5a2288c6-0562-41e8-8f63-e6820fa3e62a";
        const queryParams = {
            id,
        }

        const sandbox = sinon.createSandbox();
        const doGetRequestStub = sandbox.stub(RequestHandler.prototype, "doGetRequest").resolves(await callFakeMethod("getTransactionsByMethodWithQueryParams"));
        sandbox.stub(RequestHandler.prototype, "getAuthAndOptions").resolves({});

        const res = await simba.getTransactionsByMethod(appName, contractName, "structTest5", queryParams) as Record<any, any>;

        expect(doGetRequestStub.calledWith(
            "https://simba-dev-api.platform.simbachain.com/v2/apps/BrendanTestApp/contract/test_contract_vds5/structTest5/",
            sinon.match({}),
            true,
        )).to.be.true;

        expect(res.count).to.be.equal(1);
        expect(res.next).to.equal(null);
        expect(res.previous).to.equal(null);
        expect(res.results[0].id).to.equal(id);

        sandbox.restore();
    });
});

describe('testing Simba.getTransactionsByContract', () => {
    it('request method(s) should be called with correct params', async () => {
        const simba = new Simba();

        const sandbox = sinon.createSandbox();
        const doGetRequestStub = sandbox.stub(RequestHandler.prototype, "doGetRequest").resolves(await callFakeMethod("getTransactionsByContract"));
        sandbox.stub(RequestHandler.prototype, "getAuthAndOptions").resolves({});

        const res = await simba.getTransactionsByContract(appName, contractName) as Record<any, any>;

        expect(doGetRequestStub.calledWith(
            "https://simba-dev-api.platform.simbachain.com/v2/apps/BrendanTestApp/contract/test_contract_vds5/transactions/",
            sinon.match({}),
            true,
        )).to.be.true;

        expect(res.count).to.be.greaterThan(0);
        expect(res.next.includes("https://simba-dev-api.platform.simbachain.com/v2/apps/BrendanTestApp/contract/test_contract_vds5/transactions/?limit=10&offset=10")).to.equal(true);
        expect(res.previous).to.equal(null);
        expect(res.results.length).to.be.greaterThan(0);

        sandbox.restore();
    });
});

describe('testing Simba.getTransactionsByContract with queryParams', () => {
    it('request method(s) should be called with correct params', async () => {
        const simba = new Simba();
        const id = "5a2288c6-0562-41e8-8f63-e6820fa3e62a";
        const queryParams = {
            id,
        }

        const sandbox = sinon.createSandbox();
        const doGetRequestStub = sandbox.stub(RequestHandler.prototype, "doGetRequest").resolves(await callFakeMethod("getTransactionsByMethodWithQueryParams"));
        sandbox.stub(RequestHandler.prototype, "getAuthAndOptions").resolves({});

        const res = await simba.getTransactionsByMethod(appName, contractName, "structTest5", queryParams) as Record<any, any>;

        expect(doGetRequestStub.calledWith(
            "https://simba-dev-api.platform.simbachain.com/v2/apps/BrendanTestApp/contract/test_contract_vds5/structTest5/",
            sinon.match({}),
            true,
        )).to.be.true;

        expect(res.count).to.equal(1);
        expect(res.next).to.equal(null);
        expect(res.previous).to.equal(null);
        expect(res.results[0].id).to.equal(id);

        sandbox.restore();
    });
});

describe('testing Simba.submitContractMethod', () => {
    it('request method(s) should be called with correct params', async () => {
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

        const sandbox = sinon.createSandbox();
        const doPostRequestStub = sandbox.stub(RequestHandler.prototype, "doPostRequestWithFormData").resolves(await callFakeMethod("structTest5Submit"));
        sandbox.stub(RequestHandler.prototype, "getAuthAndOptions").resolves({});
        sandbox.stub(RequestHandler.prototype, "formDataFromFilePathsAndInputs").resolves({});
        sandbox.stub(RequestHandler.prototype, "formDataHeaders").resolves({});

        const res = await simba.submitContractMethod(appName, contractName, methodName, inputs, filePaths) as Record<any, any>;

        expect(doPostRequestStub.calledWith(
            "https://simba-dev-api.platform.simbachain.com/v2/apps/BrendanTestApp/contract/test_contract_vds5/structTest5/",
            sinon.match({}),
            sinon.match({}),
        )).to.be.true;

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

        sandbox.restore();
    });
});

describe('testing Simba.submitContractMethodSync', () => {
    it('request method(s) should be called with correct params', async () => {
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

        const sandbox = sinon.createSandbox();
        const doPostRequestStub = sandbox.stub(RequestHandler.prototype, "doPostRequestWithFormData").resolves(await callFakeMethod("structTest5Submit"));
        sandbox.stub(RequestHandler.prototype, "getAuthAndOptions").resolves({});
        sandbox.stub(RequestHandler.prototype, "formDataFromFilePathsAndInputs").resolves({});
        sandbox.stub(RequestHandler.prototype, "formDataHeaders").resolves({});
        
        const res = await simba.submitContractMethodSync(appName, contractName, methodName, inputs, filePaths) as Record<any, any>;
        
        expect(doPostRequestStub.calledWith(
            "https://simba-dev-api.platform.simbachain.com/v2/apps/BrendanTestApp/sync/contract/test_contract_vds5/structTest5/",
            sinon.match({}),
            sinon.match({}),
        )).to.be.true;


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

        sandbox.restore();
    });
});

describe('testing Simba.callContractMethod', () => {
    it('request method(s) should be called with correct params', async () => {
        const simba = new Simba();
        const methodName = "getNum";

        const sandbox = sinon.createSandbox();
        const doGetRequestStub = sandbox.stub(RequestHandler.prototype, "doGetRequest").resolves(await callFakeMethod("getNumCall"));
        sandbox.stub(RequestHandler.prototype, "getAuthAndOptions").resolves({});

        const res = await simba.callContractMethod(appName, contractName, methodName) as Record<any, any>;

        expect(doGetRequestStub.calledWith(
            "https://simba-dev-api.platform.simbachain.com/v2/apps/BrendanTestApp/contract/test_contract_vds5/getNum/",
            sinon.match({}),
            true,
        )).to.be.true;

        expect(res.request_id).to.exist;
        expect(res.value).to.equal(13);
        expect(res.state).to.equal("COMPLETED");

        sandbox.restore();
    });
});

describe('testing Simba.submitSignedTransaction', () => {
    it('request method(s) should be called with correct params', async () => {
        const simba = new Simba();
        const txn = transactionObject;

        const sandbox = sinon.createSandbox();
        const doPostRequestStub = sandbox.stub(RequestHandler.prototype, "doPostRequest").resolves(await callFakeMethod("submitSignedTransaction"));
        sandbox.stub(RequestHandler.prototype, "getAuthAndOptions").resolves({});


        const res: any = await simba.submitSignedTransaction(
            appName,
            nonPendingTransactionID,
            txn,
        );

        expect(doPostRequestStub.calledWith(
            "https://simba-dev-api.platform.simbachain.com/v2/apps/BrendanTestApp/transactions/8a2c5fbf-340f-4038-a3c0-bb8d088ecf1e/",
            sinon.match({}),
            sinon.match({"transaction":{"id":"8a2c5fbf-340f-4038-a3c0-bb8d088ecf1e","request_id":"418d2bc0-0b0c-455f-8ae2-1ba6ffdd63da","created_on":"2022-10-03T16:47:20.099589Z","finalized_on":null,"method":"structTest5","inputs":{"person":{"age":1000,"addr":{"town":"nyc","number":1234,"street":"rogers"},"name":"Lenny's Ghost"},"_bundleHash":"223873f49bb7623bfc7da8806f009bdead8e4aaafe5b6e56c0fb2b46471ca9e7"},"receipt":{},"error":null,"error_details":{},"state":"SUBMITTED","raw_transaction":{"to":"0x3daac1c8Bb80406D0eb2e7608C5d2fBcA92eD4a6","gas":"0x6c54","data":"0x47fb8c0a000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000001c0000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000003e800000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000000d4c656e6e7927732047686f737400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000004d200000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000006726f67657273000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000036e79630000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004032323338373366343962623736323362666337646138383036663030396264656164386534616161666535623665353663306662326234363437316361396537","from":"0xCa47475036474eAc0dF6697e6A6C74386f218236","nonce":"0x1a3","value":"0x0","chainId":"0x151","gasPrice":"0x0"},"signed_transaction":{"r":4.2809928544253906e+76,"s":5.268161053606005e+76,"v":710,"hash":"0x2a5b7db8fe8b81905ac602a1f09aedc943efd48cb5fa06e7b35537f636cf0976","rawTransaction":"0xf902898201a380826c54943daac1c8bb80406d0eb2e7608c5d2fbca92ed4a680b9022447fb8c0a000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000001c0000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000003e800000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000000d4c656e6e7927732047686f737400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000004d200000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000006726f67657273000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000036e796300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000040323233383733663439626237363233626663376461383830366630303962646561643865346161616665356236653536633066623262343634373163613965378202c6a05ea58f96ab195f30f409c52bba44df15a9e9ba7acdd00ba18f83cfb060309d0ba07478bc2248e434d89e887f7f128085c89018828e002c19caf23d6a138bdbf344"},"transaction_hash":"0x2a5b7db8fe8b81905ac602a1f09aedc943efd48cb5fa06e7b35537f636cf0976","bundle":"def70871-57b3-4711-905d-6935c939529e","block":null,"nonce":419,"from_address":"0xCa47475036474eAc0dF6697e6A6C74386f218236","to_address":null,"created_by":9,"contract":{"id":"f8896066-73c4-40b6-837e-7bcb8307b231","api_name":"test_contract_vds5"},"app":"fb5fd523-9982-4785-a0ea-89d277f4014b","blockchain":"3b288902-8438-492b-857a-58060d9c254a","origin":"SCAAS","transaction_type":"MC","confirmations":0,"value":"0"}}),
            true,
        )).to.be.true;
        
        expect(res.id).to.equal("3fa85f64-5717-4562-b3fc-2c963f66afa6");

        sandbox.restore();
    });
});

describe('testing Simba.saveDesign', () => {
    it('request method(s) should be called with correct params', async () => {
        const simba = new Simba();
        const designName = "EventContract99";

        const sandbox = sinon.createSandbox();
        const doPostRequestStub = sandbox.stub(RequestHandler.prototype, "doPostRequest").resolves(await callFakeMethod("saveDesign"));
        sandbox.stub(RequestHandler.prototype, "getAuthAndOptions").resolves({});

        const res = await simba.saveDesign(
            orgName,
            designName,
            sourceCode,
        ) as Record<any, any>;

        expect(doPostRequestStub.calledWith(
            "https://simba-dev-api.platform.simbachain.com/v2/organisations/brendan_birch_simbachain_com/contract_designs/",
            sinon.match({}),
            sinon.match({"name":"EventContract99","code":"Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IFVOTElDRU5TRUQKcHJhZ21hIHNvbGlkaXR5IF4wLjguMzsKCmNvbnRyYWN0IEV2ZW50Q29udHJhY3QgewogICAgCiAgICBldmVudCBMb2coYWRkcmVzcyBpbmRleGVkIHNlbmRlciwgc3RyaW5nIG1lc3NhZ2UpOwogICAgbWFwcGluZyhzdHJpbmcgPT4gdWludCkgcHVibGljIHVzZXJCYWxhbmNlczsKCiAgICBmdW5jdGlvbiBhZGRNYXBwaW5nKHN0cmluZyBtZW1vcnkgdXNlcklkKSBwdWJsaWMgewogICAgICAgIHVzZXJCYWxhbmNlc1t1c2VySWRdKys7CiAgICAgICAgZW1pdCBMb2cobXNnLnNlbmRlciwgIkRhdGEgcmVwb3J0ZWQiKTsKICAgICAgICByZXR1cm47CiAgICB9CgogICAgZnVuY3Rpb24gZ2V0QmFsYW5jZShzdHJpbmcgbWVtb3J5IHVzZXJJZCkgcHVibGljIHZpZXcgcmV0dXJucyAodWludCkgewogICAgICAgIHJldHVybiB1c2VyQmFsYW5jZXNbdXNlcklkXTsKICAgIH0KCn0=","language":"solidity"}),
            true,
        )).to.be.true;
        expect(res.id).to.exist;
        expect(res.name).to.equal(designName);
        expect(res.version).to.exist;
        expect(res.created_on).to.exist;
        expect(res.updated_on).to.exist;
        expect(res.code).to.exist;
        expect(res.language).to.exist;
        expect(res.metadata).to.exist;
        expect(Object.keys(res).includes("err")).to.equal(true);
        expect(res.mode).to.exist;
        expect(Object.keys(res).includes("model")).to.equal(true);
        expect(res.service_args).to.exist;
        expect(Object.keys(res).includes("asset_type")).to.equal(true);
        expect(res.organisation).to.exist;
        expect(Object.keys(res).includes("designset")).to.equal(true);

        sandbox.restore();
    });
});

describe('testing Simba.waitForDeployment', () => {
    it('request method(s) should be called with correct params', async () => {
        const simba = new Simba();

        const sandbox = sinon.createSandbox();
        const doGetRequestStub = sandbox.stub(RequestHandler.prototype, "doGetRequest").resolves(await callFakeMethod("waitForDeployment"));
        sandbox.stub(RequestHandler.prototype, "getAuthAndOptions").resolves({});

        const res = await simba.waitForDeployment(
            orgName,
            deploymentID,
        ) as Record<any, any>;

        expect(doGetRequestStub.calledWith(
            "https://simba-dev-api.platform.simbachain.com/v2/organisations/brendan_birch_simbachain_com/deployments/37cb8577-65bd-4669-8380-b0a3ba93e718/",
            sinon.match({}),
            true,
        )).to.be.true;

        expect(res.id).to.equal(deploymentID);
        expect(Object.keys(res).includes("current_txn")).to.equal(true);
        expect(res.blockchain).to.exist;
        expect(res.storage).to.exist;
        expect(res.updated_on).to.exist;
        expect(res.deployment).to.exist;
        expect(res.app_name).to.exist;
        expect(res.api_name).to.exist;
        expect(Object.keys(res).includes("artifact_id")).to.equal(true);
        expect(res.design_id).to.exist;
        expect(res.state).to.exist;
        expect(Object.keys(res).includes("error")).to.equal(true);
        expect(res.primary).to.exist;
        expect(res.organisation).to.exist;
        expect(res.generate_request_id).to.exist;

        sandbox.restore();
    });
});

describe('testing Simba.deployDesign', () => {
    it('request method(s) should be called with correct params', async () => {
        const simba = new Simba();

        const sandbox = sinon.createSandbox();
        const doPostRequestStub = sandbox.stub(RequestHandler.prototype, "doPostRequest").resolves(await callFakeMethod("deployDesign"));
        sandbox.stub(RequestHandler.prototype, "getAuthAndOptions").resolves({});
        const alreadyTakenAPIName = contractName;

        const res: any = await simba.deployDesign(
            orgName,
            appName,
            alreadyTakenAPIName,
            designID,
            Quorum,
        );

        expect(doPostRequestStub.calledWith(
                "https://simba-dev-api.platform.simbachain.com/v2/organisations/brendan_birch_simbachain_com/contract_designs/5114c41b-c03a-4674-b348-a0cd73d2c0d6/deploy/",
                sinon.match({}),
                sinon.match({"blockchain":"Quorum","storage":"no_storage","api_name":"test_contract_vds5","app_name":"BrendanTestApp","singleton":true}),
                true,
        )).to.be.true;

        expect(res.deployment_id).to.equal("someID");

        sandbox.restore();
    });
});

describe('testing Simba.deployArtifact', () => {
    it('request method(s) should be called with correct params', async () => {
        const simba = new Simba();
        const alreadyTakenAPIName = contractName;

        const sandbox = sinon.createSandbox();
        const doPostRequestStub = sandbox.stub(RequestHandler.prototype, "doPostRequest").resolves(await callFakeMethod("deployArtifact"));
        sandbox.stub(RequestHandler.prototype, "getAuthAndOptions").resolves({});

        
        const res: any = await simba.deployArtifact(
            orgName,
            appName,
            alreadyTakenAPIName,
            artifactID,
            Quorum,
        );

        expect(doPostRequestStub.calledWith(
            "https://simba-dev-api.platform.simbachain.com/v2/organisations/brendan_birch_simbachain_com/deployments/",
            sinon.match({}),
            sinon.match({"blockchain":"Quorum","storage":"no_storage","api_name":"test_contract_vds5","artifact_id":"4b80be26-c6a3-4aa6-82d1-f94925e5da2b","app_name":"BrendanTestApp","singleton":true}),
            true,
        )).to.be.true;

        expect(res.artifact_id).to.equal("3fa85f64-5717-4562-b3fc-2c963f66afa6");

        sandbox.restore();
    });
});

describe('testing Simba.waitForDeployDesign', () => {
    it('request method(s) should be called with correct params', async () => {
        const simba = new Simba();
        const alreadyTakenAPIName = contractName;

        const sandbox = sinon.createSandbox();
        const doGetRequestStub = sandbox.stub(RequestHandler.prototype, "doGetRequest").resolves({state: "COMPLETED"});
        sandbox.stub(RequestHandler.prototype, "getAuthAndOptions").resolves({});
        sandbox.stub(Simba.prototype, "deployDesign").resolves(await callFakeMethod("deployDesign"));

        await simba.waitForDeployDesign(
            orgName,
            appName,
            designID,
            alreadyTakenAPIName,
            Quorum,
        );

        expect(doGetRequestStub.calledWith(
            "https://simba-dev-api.platform.simbachain.com/v2/organisations/brendan_birch_simbachain_com/deployments/someID/",
            sinon.match({}),
            true,
        )).to.be.true;

        sandbox.restore();
    });
});

describe('testing Simba.waitForDeployArtifact', () => {
    it('request method(s) should be called with correct params', async () => {
        const simba = new Simba();
        const alreadyTakenAPIName = contractName;

        const sandbox = sinon.createSandbox();
        const doGetRequestStub = sandbox.stub(RequestHandler.prototype, "doGetRequest").resolves({state: "COMPLETED"});
        sandbox.stub(RequestHandler.prototype, "getAuthAndOptions").resolves({});
        sandbox.stub(Simba.prototype, "deployArtifact").resolves(await callFakeMethod("deployArtifact"));

        // sandbox.stub(Simba.prototype, "waitForDeployment").resolves(await callFakeMethod("waitForDeployment"))
        await simba.waitForDeployArtifact(
            orgName,
            appName,
            artifactID,
            alreadyTakenAPIName,
            Quorum,
        );

        expect(doGetRequestStub.calledWith(
            "https://simba-dev-api.platform.simbachain.com/v2/organisations/brendan_birch_simbachain_com/deployments/undefined/",
            sinon.match({}),
            true,
        )).to.be.true;

        sandbox.restore();
    });
});

describe('testing Simba.waitForOrgTransaction', () => {
    it('request method(s) should be called with correct params', async () => {
        const simba = new Simba();

        const sandbox = sinon.createSandbox();
        const doGetRequestStub = sandbox.stub(RequestHandler.prototype, "doGetRequest").resolves(await callFakeMethod("waitForOrgTransaction"));
        sandbox.stub(RequestHandler.prototype, "getAuthAndOptions").resolves({});

        const res = await simba.waitForOrgTransaction(
            orgName,
            transactionID,
        ) as Record<any, any>;

        expect(doGetRequestStub.calledWith(
            "https://simba-dev-api.platform.simbachain.com/v2/organisations/brendan_birch_simbachain_com/transactions/7eb73229-b1f8-4aa4-af4b-37f79c1df6bb/",
            sinon.match({}),
            true,
        )).to.be.true;

        expect(res.id).to.exist;
        expect(res.request_id).to.exist;
        expect(res.created_on).to.exist;
        expect(res.finalized_on).to.exist;
        expect(res.method).to.exist;
        expect(res.inputs).to.exist;
        expect(res.receipt).to.exist;
        expect(Object.keys(res).includes("error")).to.equal(true);
        expect(res.error_details).to.exist;
        expect(res.state).to.exist;
        expect(res.raw_transaction).to.exist;
        expect(res.signed_transaction).to.exist;
        expect(Object.keys(res).includes("bundle")).to.equal(true);
        expect(res.block).to.exist;
        expect(res.nonce).to.exist;
        expect(res.from_address).to.exist;
        expect(res.to_address).to.exist;
        expect(res.created_by).to.exist;
        expect(res.contract).to.exist;
        expect(res.app).to.exist;
        expect(res.blockchain).to.exist;
        expect(res.origin).to.exist;
        expect(res.transaction_type).to.exist;
        expect(res.confirmations).to.exist;
        expect(res.value).to.exist;

        sandbox.restore();
    });
});

describe('testing Simba.getDesigns', () => {
    it('request method(s) should be called with correct params', async () => {
        const simba = new Simba();

        const sandbox = sinon.createSandbox();
        const doGetRequestStub = sandbox.stub(RequestHandler.prototype, "doGetRequest").resolves(await callFakeMethod("getDesigns"));
        sandbox.stub(RequestHandler.prototype, "getAuthAndOptions").resolves({});

        const res = await simba.getDesigns(orgName) as Record<any, any>;

        expect(doGetRequestStub.calledWith(
            "https://simba-dev-api.platform.simbachain.com/v2/organisations/brendan_birch_simbachain_com/contract_designs/",
            sinon.match({}),
            true,
        )).to.be.true;

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
        expect(design.language).to.equal(solidity);
        expect(design.mode).to.exist;
        expect(Object.keys(design).includes("model")).to.equal(true);

        sandbox.restore();
    });
});

describe('testing Simba.getBlockchains', () => {
    it('request method(s) should be called with correct params', async () => {
        const simba = new Simba();

        const sandbox = sinon.createSandbox();
        const doGetRequestStub = sandbox.stub(RequestHandler.prototype, "doGetRequest").resolves(await callFakeMethod("getBlockchains"));
        sandbox.stub(RequestHandler.prototype, "getAuthAndOptions").resolves({});

        const res = await simba.getBlockchains(orgName) as Record<any, any>;

        expect(doGetRequestStub.calledWith(
            "https://simba-dev-api.platform.simbachain.com/v2/organisations/brendan_birch_simbachain_com/blockchains/",
            sinon.match({}),
            true,
        )).to.be.true;

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

        sandbox.restore();
    });
});

describe('testing Simba.getStorages', () => {
    it('request method(s) should be called with correct params', async () => {
        const simba = new Simba();

        const sandbox = sinon.createSandbox();
        const doGetRequest = sandbox.stub(RequestHandler.prototype, "doGetRequest").resolves(await callFakeMethod("getStorages"));
        sandbox.stub(RequestHandler.prototype, "getAuthAndOptions").resolves({});

        const res = await simba.getStorages(orgName) as Record<any, any>;

        expect(doGetRequest.calledWith(
            "https://simba-dev-api.platform.simbachain.com/v2/organisations/brendan_birch_simbachain_com/storage/",
            sinon.match({}),
            true,
        )).to.be.true;

        expect(res.count).to.be.greaterThan(0);
        expect(Object.keys(res).includes("next")).to.equal(true);
        expect(res.previous).to.equal(null);
        expect(res.results.length).to.be.greaterThan(0);
        
        const storage = res.results[0];
        expect(storage.id).to.exist;
        expect(storage.display_name).to.exist;
        expect(storage.name).to.exist;
        expect(storage.storage_type).to.exist;

        sandbox.restore();
    });
});

describe('testing Simba.getArtifacts', () => {
    it('request method(s) should be called with correct params', async () => {
        const simba = new Simba();

        const sandbox = sinon.createSandbox();
        const doGetRequestStub = sandbox.stub(RequestHandler.prototype, "doGetRequest").resolves(await callFakeMethod("getArtifacts"));
        sandbox.stub(RequestHandler.prototype, "getAuthAndOptions").resolves({});

        const res = await simba.getArtifacts(orgName) as Record<any, any>;

        expect(doGetRequestStub.calledWith(
            "https://simba-dev-api.platform.simbachain.com/v2/organisations/brendan_birch_simbachain_com/contract_artifacts/",
            sinon.match({}),
            true,
        )).to.be.true;

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

        sandbox.restore();
    });
});

describe('testing Simba.getArtifact', () => {
    it('request method(s) should be called with correct params', async () => {
        const simba = new Simba();
        const artifactID = "af76b1a9-365a-428f-8749-cd23280b4ead";

        const sandbox = sinon.createSandbox();
        const doGetRequestStub = sandbox.stub(RequestHandler.prototype, "doGetRequest").resolves(await callFakeMethod("getArtifact"));
        sandbox.stub(RequestHandler.prototype, "getAuthAndOptions").resolves({});

        const artifact = await simba.getArtifact(orgName, artifactID) as Record<any, any>;

        expect(doGetRequestStub.calledWith(
            "https://simba-dev-api.platform.simbachain.com/v2/organisations/brendan_birch_simbachain_com/contract_artifacts/af76b1a9-365a-428f-8749-cd23280b4ead/",
            sinon.match({}),
            true,
        )).to.be.true;

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

        sandbox.restore();
    });
});

describe('testing Simba.createArtifact', () => {
    it('request method(s) should be called with correct params', async () => {
        const simba = new Simba();
        const designID = "644ed6cc-8073-4c4b-9395-aa466a3a27e7";

        const sandbox = sinon.createSandbox();
        const doPostRequestStub = sandbox.stub(RequestHandler.prototype, "doPostRequest").resolves(await callFakeMethod("createArtifact"));
        sandbox.stub(RequestHandler.prototype, "getAuthAndOptions").resolves({});

        const artifact = await simba.createArtifact(orgName, designID) as Record<any, any>;

        expect(doPostRequestStub.calledWith(
            "https://simba-dev-api.platform.simbachain.com/v2/organisations/brendan_birch_simbachain_com/contract_artifacts/",
            sinon.match({}),
            sinon.match({"design_id":"644ed6cc-8073-4c4b-9395-aa466a3a27e7"}),
        )).to.be.true;

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

        sandbox.restore();
    });
});

describe('testing Simba.subscribe', () => {
    it('request method(s) should be called with correct params', async () => {
        const simba = new Simba();
        const notificationEndpoint = "https://a-fake-url/v2/a.fake.endpoint";
        const contractAPI = contractName;
        const txn = "structTest5";
        const subscriptionType = "METHOD";

        const sandbox = sinon.createSandbox();
        const resArray = [{
            endpoint: "fakeendpoint",
            txn: "faketxn",
            contract: "fakecontract",
            auth_type: "fakeauthtype",
        }];

        const doGetRequestStub = sandbox.stub(RequestHandler.prototype, "doGetRequest").resolves(resArray);
        const doPostRequestStub = sandbox.stub(RequestHandler.prototype, "doPostRequest").resolves(await callFakeMethod("subscribe"));
        sandbox.stub(RequestHandler.prototype, "getAuthAndOptions").resolves({});

        const res = await simba.subscribe(
            orgName,
            notificationEndpoint,
            contractAPI,
            txn,
            subscriptionType,
        ) as Record<any, any>;

        expect(doGetRequestStub.calledWith(
            "https://simba-dev-api.platform.simbachain.com/v2/organisations/brendan_birch_simbachain_com/subscriptions/",
            sinon.match({}),
            true,
        )).to.be.true;

        expect(doPostRequestStub.calledWith(
            "https://simba-dev-api.platform.simbachain.com/v2/organisations/brendan_birch_simbachain_com/subscriptions/",
            sinon.match({}),
            sinon.match({"endpoint":"https://a-fake-url/v2/a.fake.endpoint","txn":"structTest5","contract":"test_contract_vds5","auth_type":"","subscription_type":"METHOD"}),
            true,
        )).to.be.true;

        expect(res.id).to.exist;
        expect(res.endpoint).to.equal(notificationEndpoint);
        expect(res.txn).to.equal(txn);
        expect(res.contract).to.exist;
        expect(res.applications).to.exist;
        expect(res.filters).to.exist;

        sandbox.restore();
    });
});

describe('testing Simba.setNotificationConfig', () => {
    it('request method(s) should be called with correct params', async () => {
        const simba = new Simba();
        const scheme = "http";
        const authType = "";
        const authInfo = {};

        const sandbox = sinon.createSandbox();

        const resArray = [{
            scheme: "fakescheme",
            auth_type: "fakeauthtype",
            authInfo: "fakeauthinfo",
        }];

        const doGetRequestStub = sandbox.stub(RequestHandler.prototype, "doGetRequest").resolves(resArray);
        const doPostRequestStub = sandbox.stub(RequestHandler.prototype, "doPostRequest").resolves(await callFakeMethod("setNotificationConfig"));
        sandbox.stub(RequestHandler.prototype, "getAuthAndOptions").resolves({});

        const res = await simba.setNotificationConfig(orgName, scheme, authType, authInfo) as Record<any, any>;

        expect(doGetRequestStub.calledWith(
            "https://simba-dev-api.platform.simbachain.com/v2/organisations/brendan_birch_simbachain_com/notification_config/",
            sinon.match({}),
            true,
        )).to.be.true;

        expect(doPostRequestStub.calledWith(
            "https://simba-dev-api.platform.simbachain.com/v2/organisations/brendan_birch_simbachain_com/notification_config/",
            sinon.match({}),
            sinon.match({"scheme":"http","auth_type":"","auth_info":{}}),
            true,
        )).to.be.true;

        expect(res.id).to.exist;
        expect(res.scheme).to.equal(scheme);
        expect(res.auth_type).to.equal(authType)
        expect(res.auth_info).to.exist;
        expect(res.created_on).to.exist;
        expect(res.updated_on).to.exist;
        expect(res.organisation).to.exist;

        sandbox.restore();
    });
});