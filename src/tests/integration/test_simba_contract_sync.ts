// import {
//     SimbaContractSync,
// } from "../../";
// import {
//     baseApiUrl,
//     appName,
//     contractName,
// } from "../project_configs";
// import * as path from 'path';
// import {cwd} from 'process';
// import { expect } from 'chai';
// import 'mocha';

// describe('testing SimbaContractSync.submitMethod', () => {
//     it('specified fields should exist', async () => {
//         const simbaContractSync = new SimbaContractSync(
//             baseApiUrl,
//             appName,
//             contractName,
//         );
//         const person = {
//             name: "Lenny's Ghost",
//             age: 1000,
//             addr: {
//                 street: "rogers",
//                 town: "nyc",
//                 number: 1234,
//             },
//         }
//         const methodName = "structTest5";
//         const inputs = {
//             person,
//         }
//         const imageFile1Path = path.join(cwd(), "test_data", "testimage1.png");
//         const imageFile2Path = path.join(cwd(), "test_data", "testimage2.png");
//         const filePaths = [imageFile1Path, imageFile2Path];
//         const res = await simbaContractSync.submitMethod(methodName, inputs, filePaths) as Record<any, any>;
//         expect(res.id).to.exist;
//         expect(res.request_id).to.exist;
//         expect(res.created_on).to.exist;
//         expect(res.finalized_on).to.equal(null);
//         expect(res.method).to.equal(methodName);
//         expect(res.inputs.person).to.exist;
//         expect(res.inputs["_bundleHash"]).to.exist;
//         expect(res.receipt).to.exist;
//         expect(Object.keys(res).includes("error")).to.equal(true);
//         expect(res.error_details).to.exist;
//         expect(res.state).to.equal("SUBMITTED");

//         const raw_transaction = res.raw_transaction;
//         expect(raw_transaction.from).to.exist;
//         expect(raw_transaction.to).to.exist;
//         expect(raw_transaction.chainId).to.exist;
//         expect(raw_transaction.nonce).to.exist;
//         expect(raw_transaction.data).to.exist;
//         expect(raw_transaction.value).to.exist;
//         expect(raw_transaction.gas).to.exist;
//         expect(raw_transaction.gasPrice).to.exist;

//         const signed_transaction = res.signed_transaction;
//         expect(signed_transaction.rawTransaction).to.exist;
//         expect(signed_transaction.hash).to.exist;
//         expect(signed_transaction.r).to.exist;
//         expect(signed_transaction.s).to.exist;
//         expect(signed_transaction.v).to.exist;

//         expect(res.transaction_hash).to.exist
//         expect(res.bundle).to.exist;
//         expect(res.block).to.equal(null);
//         expect(res.nonce).to.be.greaterThan(0);
//         expect(res.from_address).to.exist;
//         expect(res.to_address).to.equal(null);
//         expect(res.created_by).to.exist;
//         expect(res.contract.id).to.equal("f8896066-73c4-40b6-837e-7bcb8307b231");
//         expect(res.contract.api_name).to.equal(contractName);
//         expect(res.app).to.equal("fb5fd523-9982-4785-a0ea-89d277f4014b");
//         expect(res.blockchain).to.equal("3b288902-8438-492b-857a-58060d9c254a");
//         expect(res.origin).to.equal("SCAAS");
//         expect(res.transaction_type).to.equal("MC");
//         expect(res.confirmations).to.equal(0);
//         expect(res.value).to.equal("0");
//     }).timeout(10000);
// });