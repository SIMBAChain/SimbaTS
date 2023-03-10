import {
    Simba,
} from "../../src/";
import { expect } from 'chai';
import 'mocha';
import * as path from 'path';
import {cwd} from 'process';
import * as fs from "fs";
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
} from "../project_configs";
import { FileHandler } from "../../src/filehandler";

import {
    RequestHandler,
} from "../../src/request_handler";
import {
    callFakeMethod,
} from "../tests_setup/fake_method_caller";
import sinon from "sinon";


// endpoint still needs to be fixed
describe.skip('testing Simba.fund', () => {
    it('implement', async () => {
        const simba = new Simba();
        const res = await simba.fund(
            mumbai,
            mumbaiWallet,
            1,
        );
    }).timeout(5000);
});

// filtering not supported yet - backend needs to implement
describe.skip('testing Simba.getApplicationTransactions with queryParams', () => {
    it('request method(s) should be called with correct params', async () => {
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

// filtering not supported yet - backend needs to implement
describe.skip('testing Simba.getContracts with queryParams', () => {
    it('request method(s) should be called with correct params', async () => {
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

describe('testing Simba.getBundle', () => {
    it('file should exist after invocation', async () => {
        // don't mock/stub this method
        const simba = new Simba();
        const downloadLocation = path.join(cwd(), "test_data", "downloadedBundle.tar.gz");
        FileHandler.removeFile(downloadLocation);
        await simba.getBundle(
            appName,
            contractName,
            bundleHash,
            downloadLocation,
        ) as Record<any, any>;
        expect(fs.existsSync(downloadLocation)).to.equal(true);
        FileHandler.removeFile(downloadLocation);
    }).timeout(10000);
});

describe('testing Simba.getBundleFile', () => {
    it('file should exist after invocation', async () => {
        // don't mock/stub this method

        const simba = new Simba();
        const fileName = "testimage1.png";
        const downloadLocation = path.join(cwd(), "test_data", "testimage1FromAPIcall.png");
        FileHandler.removeFile(downloadLocation);
        await simba.getBundleFile(
            appName,
            contractName,
            bundleHash,
            fileName,
            downloadLocation,
        ) as Record<any, any>;
        expect(fs.existsSync(downloadLocation)).to.equal(true);
        FileHandler.removeFile(downloadLocation);
    }).timeout(10000);
});

// filtering not supported yet - backend needs to implement
describe.skip('testing Simba.getEvents with queryParams', () => {
    it('request method(s) should be called with correct params', async () => {
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
        expect(res.count).to.exist;
        expect(Object.keys(res).includes("next")).to.equal(true);
        expect(Object.keys(res).includes("previous")).to.equal(true);
        expect(res.results.length).to.exist;
    }).timeout(10000);
});

// filtering not supported yet - backend needs to implement
describe.skip('testing Simba.adminGetEvents with queryParams', () => {
    it('request method(s) should be called with correct params', async () => {
        const simba = new Simba();
        const id = "195a5391-84f4-4743-8dfe-d898309db809";
        const queryParams = {
            id,
        }
        const res = await simba.adminGetEvents(queryParams) as Record<any, any>;
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
    }).timeout(10000);
});
