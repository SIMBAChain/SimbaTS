import {
    ParamCheckingContract,
} from "../../src/param_checking_contract";
import { expect } from 'chai';
import 'mocha';
import * as path from 'path';
import {cwd} from 'process';
import {
    appName,
    contractName,
    baseApiUrl,
} from "../project_configs";
import { FileHandler } from "../../src/filehandler";

describe('testing ParamCheckingContract.getMetadata', () => {
    it('both metadata objects should have the same fields and values', async () => {
        // leaving this test in integration, without mocking or stubbing

        const pathToTestMetaData = path.join(cwd(), "test_data", "test_metadata.json");
        const metadata = await FileHandler.parsedFile(pathToTestMetaData);
        const pcc1 = new ParamCheckingContract(
            appName,
            contractName,
            baseApiUrl,
            metadata,
        );
        const pcc2  = new ParamCheckingContract(
            appName,
            contractName,
            baseApiUrl,
        );
        const md1 = await pcc1.getMetadata();
        const md2 = await pcc2.getMetadata();
        expect(md1.contract.name).to.equal(md2.contract.name);
    }).timeout(10000);
});
