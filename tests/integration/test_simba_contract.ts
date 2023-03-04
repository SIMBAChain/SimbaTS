import {
    SimbaContract,
} from "../../src/";
import {
    RequestHandler,
} from "../../src/request_handler";
import {
    baseApiUrl,
    appName,
    contractName,
    bundleHash,
} from "../project_configs";
import {
    FileHandler,
} from "../../src/filehandler";
import {
    callFakeMethod,
} from "../tests_setup/fake_method_caller";
import sinon from "sinon";
import * as path from 'path';
import {cwd} from 'process';
import * as fs from "fs";
import { expect } from 'chai';
import 'mocha';

describe('testing SimbaContract.callMethod', () => {
    it('specified fields should exist', async () => {
        const simbaContract = new SimbaContract(
            baseApiUrl,
            appName,
            contractName,
        );
        const methodName = "getNum";
        const sandbox = sinon.createSandbox();
        sandbox.stub(RequestHandler.prototype, "doGetRequest").resolves(await callFakeMethod("getNumCall"));
        const res = await simbaContract.callMethod(methodName) as Record<any, any>;
        expect(res.request_id).to.exist;
        expect(res.value).to.equal(13);
        expect(res.state).to.equal("COMPLETED");

        sandbox.restore();
    }).timeout(10000);
});

describe('testing SimbaContract.submitMethod', () => {
    it('specified fields should exist', async () => {
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

        const sandbox = sinon.createSandbox();
        sandbox.stub(RequestHandler.prototype, "doPostRequest").resolves(await callFakeMethod("structTest5Submit"))
        const res = await simbaContract.submitMethod(methodName, inputs, filePaths) as Record<any, any>;
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

        sandbox.restore();
    }).timeout(10000);
});

describe('testing SimbaContract.getTransactionsByMethod', () => {
    it('specified fields should exist', async () => {
        const simbaContract = new SimbaContract(
            baseApiUrl,
            appName,
            contractName,
        );
        const methodName = "structTest5";

        const sandbox = sinon.createSandbox();
        sandbox.stub(RequestHandler.prototype, "doGetRequest").resolves(await callFakeMethod("structTest5Transactions"));

        const res = await simbaContract.getTransactionsByMethod(methodName) as Record<any, any>;
        expect(res.count).to.be.equal(194)
        expect(res.next.includes("https://simba-dev-api.platform.simbachain.com/v2/apps/BrendanTestApp/contract/test_contract_vds5/structTest5/?limit=10&offset=10")).to.equal(true);
        expect(res.results.length).to.be.greaterThan(0);

        sandbox.restore();
    }).timeout(10000);
});

describe('testing SimbaContract.getTransactionsByMethod with queryParams', () => {
    it('specified fields should exist', async () => {
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

        const sandbox = sinon.createSandbox();
        sandbox.stub(RequestHandler.prototype, "doGetRequest").resolves(await callFakeMethod("structTest5TransactionsWithQueryParams"))
        const res = await simbaContract.getTransactionsByMethod(methodName, queryParams) as Record<any, any>;
        expect(res.count).to.be.equal(1);
        expect(res.next).to.equal(null)
        expect(res.results[0].id).to.equal(id);

        sandbox.restore();
    }).timeout(10000);
});

describe('testing SimbaContract.getBundle', () => {
    it('file should exist after invocation', async () => {
        // this method should not be mocked/stubbed

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
        expect(fs.existsSync(downloadLocation)).to.equal(true);
        FileHandler.removeFile(downloadLocation);
    }).timeout(10000);
});

describe('testing SimbaContract.getBundleFile', () => {
    it('file should exist after invocation', async () => {
        // this method should not be mocked/stubbed

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
        expect(fs.existsSync(downloadLocation)).to.equal(true);
        FileHandler.removeFile(downloadLocation);
    }).timeout(10000);
});

describe('testing SimbaContract.getManifestForBundleFromBundleHash', () => {
    it('specified fields should exist', async () => {
        const simbaContract = new SimbaContract(
            baseApiUrl,
            appName,
            contractName,
        );

        const sandbox = sinon.createSandbox();
        sandbox.stub(RequestHandler.prototype, "doGetRequest").resolves(await callFakeMethod("testContractVDS5Manifest"));

        const manifest = await simbaContract.getManifestFromBundleHash(bundleHash) as Record<any, any>;

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
    }).timeout(10000);
});