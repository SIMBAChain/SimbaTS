// import {
//     ParamCheckingContract,
// } from "../../param_checking_contract";

// import {
//     Simba,
// } from "../../";
// import { expect } from 'chai';
// import 'mocha';
// import * as path from 'path';
// import {cwd} from 'process';
// import * as fs from "fs";
// import {
//     appName,
//     contractName,
//     baseApiUrl,
// } from "../project_configs";
// import { FileHandler } from "../../filehandler";
// const pathToTestMetaData = path.join(cwd(), "test_data", "test_metadata.json");

// describe('testing ParamCheckingContract.getMetadata', () => {
//     it('both metadata objects should have the same fields and values', async () => {
//         const metadata = await FileHandler.parsedFile(pathToTestMetaData);
//         const pcc1 = new ParamCheckingContract(
//             appName,
//             contractName,
//             baseApiUrl,
//             metadata,
//         );
//         const pcc2  = new ParamCheckingContract(
//             appName,
//             contractName,
//             baseApiUrl,
//         );
//         const md1 = await pcc1.getMetadata();
//         const md2 = await pcc2.getMetadata();
//         expect(md1.contract.name).to.equal(md2.contract.name);
//     }).timeout(5000);
// });
