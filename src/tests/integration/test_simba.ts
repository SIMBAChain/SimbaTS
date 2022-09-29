import {
    Simba,
} from "../../";
import { expect } from 'chai';
import 'mocha';
import {
    appName,
    contractName,
    mumbaiWallet,
    userEmail,
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
        const app = await simba.getApplication("BrendanTestApp") as Record<any, any>;
        expect(app.name).to.equal("BrendanTestApp");
        expect(app.id).to.exist;
        expect(app.display_name).to.exist;
        expect(app.created_on).to.exist;
        expect(app.components).to.exist;
        expect(app.organisation.name).to.equal("brendan_birch_simbachain_com");
        expect(app.metadata).to.exist;
        expect(app.openapi).to.exist;
    }).timeout(5000);
});

describe('testing Simba.getApplicationTransactions', () => {
    it('specified fields should exist', async () => {
        const simba = new Simba();
        const txns = await simba.getApplicationTransactions("BrendanTestApp") as Record<any, any>;
        expect(txns.count).to.be.greaterThan(193);
        expect(txns.next).to.include("https://simba-dev-api.platform.simbachain.com/v2/apps/BrendanTestApp/transactions/?limit=10&offset=10");
        expect(txns.previous).to.not.equal(undefined);
        expect(txns.results.length).to.be.greaterThan(0);
    }).timeout(5000);
});

describe('testing Simba.getApplicationContract', () => {
    it('s', async () => {
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
