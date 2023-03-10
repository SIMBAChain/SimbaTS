import {
    SimbaContract,
} from "../../src/";
import {
    baseApiUrl,
    appName,
    contractName,
    bundleHash,
} from "../project_configs";
import {
    FileHandler,
} from "../../src/filehandler";
import * as path from 'path';
import {cwd} from 'process';
import * as fs from "fs";
import { expect } from 'chai';
import 'mocha';


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
    }).timeout(20000);
});
