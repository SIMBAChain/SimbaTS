import {
    ParamCheckingContract,
} from "../../param_checking_contract";
import { expect } from 'chai';
import 'mocha';
import * as path from 'path';
import {cwd} from 'process';
import * as fs from "fs";
import {
    appName,
    contractName,
    baseApiUrl,
} from "../project_configs";
import { FileHandler } from "../../filehandler";
const pathToTestMetaData = path.join(cwd(), "test_data", "test_metadata.json");

describe('testing ParamCheckingContract.isArray', () => {
    it('both metadata objects should have the same fields and values', async () => {
        const metadata = await FileHandler.parsedFile(pathToTestMetaData);
        const pcc = new ParamCheckingContract(
            appName,
            contractName,
            baseApiUrl,
            metadata,
        );
        const arrParam = "uint[3][4]";
        const nonArrayParam = "string"
        expect(pcc.isArray(arrParam)).to.equal(true);
        expect(pcc.isArray(nonArrayParam)).to.equal(false);
    });
});

describe('testing ParamCheckingContract.isArray', () => {
    it('both metadata objects should have the same fields and values', async () => {
        const metadata = await FileHandler.parsedFile(pathToTestMetaData);
        const pcc = new ParamCheckingContract(
            appName,
            contractName,
            baseApiUrl,
            metadata,
        );
        const arrParam = "uint[3][4]";
        const nonArrayParam = "string"
        expect(pcc.isArray(arrParam)).to.equal(true);
        expect(pcc.isArray(nonArrayParam)).to.equal(false);
    });
});

describe('testing ParamCheckingContract.arrayRestrictions', () => {
    it('should be null, 99725, 40, 3', async () => {
        const metadata = await FileHandler.parsedFile(pathToTestMetaData);
        const pcc = new ParamCheckingContract(
            appName,
            contractName,
            baseApiUrl,
            metadata,
        );
        const arrParam = "uint[3][40][99725][]";
        const restrictions = pcc.arrayRestrictions(arrParam);
        expect(restrictions["0"]).to.equal(null);
        expect(restrictions["1"]).to.equal(99725);
        expect(restrictions["2"]).to.equal(40);
        expect(restrictions["3"]).to.equal(3);
    });
});

describe('testing ParamCheckingContract.getDimensions', () => {
    it('should be 0, 3, 5', async () => {
        const metadata = await FileHandler.parsedFile(pathToTestMetaData);
        const pcc = new ParamCheckingContract(
            appName,
            contractName,
            baseApiUrl,
            metadata,
        );
        const nonArray = "string";
        const arr1 = "uint[1][2][3]";
        const arr2 = "[][][][][]";
        expect(pcc.getDimensions(nonArray)).to.equal(0);
        expect(pcc.getDimensions(arr1)).to.equal(3);
        expect(pcc.getDimensions(arr2)).to.equal(5);
    });
});

describe('testing ParamCheckingContract.paramRestrictions', () => {
    it('specified method object params should match', async () => {
        const metadata = await FileHandler.parsedFile(pathToTestMetaData);
        const pcc = new ParamCheckingContract(
            appName,
            contractName,
            baseApiUrl,
            metadata,
        );
        const restr = await pcc.paramRestrictions() as Record<any, any>;

        const anArrRestr = restr.anArr;
        expect(anArrRestr.arrayParams.first["0"]).to.equal(null);
        expect(anArrRestr.arrayParams.first.containsUint).to.equal(true);

        const setNumRestr = restr.setNum;
        expect(setNumRestr.uintParams[0]).to.equal("_ourNum");

        const twoArrsRestr = restr.twoArrs;
        expect(twoArrsRestr.arrayParams.first["0"]).to.equal(null);
        expect(twoArrsRestr.arrayParams.first.containsUint).to.equal(true);
        expect(twoArrsRestr.arrayParams.second["0"]).to.equal(null);
        expect(twoArrsRestr.arrayParams.second.containsUint).to.equal(true);

        const nestedArr0Restr = restr.nestedArr0;
        expect(nestedArr0Restr.arrayParams.first["0"]).to.equal(null);
        expect(nestedArr0Restr.arrayParams.first["1"]).to.equal(null);
        expect(nestedArr0Restr.arrayParams.first.containsUint).to.equal(true);

        const nestedArr1Restr = restr.nestedArr1;
        expect(nestedArr1Restr.arrayParams.first["0"]).to.equal(5);
        expect(nestedArr1Restr.arrayParams.first["1"]).to.equal(null);
        expect(nestedArr1Restr.arrayParams.first.containsUint).to.equal(true);

        const nestedArr2Restr = restr.nestedArr2;
        expect(nestedArr2Restr.arrayParams.first["0"]).to.equal(null);
        expect(nestedArr2Restr.arrayParams.first["1"]).to.equal(4);
        expect(nestedArr2Restr.arrayParams.first.containsUint).to.equal(true);

        const nestedArr3Restr = restr.nestedArr3;
        expect(nestedArr3Restr.arrayParams.first["0"]).to.equal(3);
        expect(nestedArr3Restr.arrayParams.first["1"]).to.equal(3);
        expect(nestedArr3Restr.arrayParams.first.containsUint).to.equal(true);

        const nestedArr4Restr = restr.nestedArr4;
        expect(nestedArr4Restr.arrayParams.first["0"]).to.equal(3);
        expect(nestedArr4Restr.arrayParams.first["1"]).to.equal(3);
        expect(nestedArr4Restr.arrayParams.first.containsUint).to.equal(true);

    });
});

describe('testing ParamCheckingContract.validateParams', () => {
    it('some should pass, some should fail because of param checking', async () => {
        const metadata = await FileHandler.parsedFile(pathToTestMetaData);
        const pcc = new ParamCheckingContract(
            appName,
            contractName,
            baseApiUrl,
            metadata,
        );
        const goodAnArrInputs = {
            first: [3],
        }
        await pcc.validateParams("anArr", goodAnArrInputs);
        const badAnArrInputs = {
            first: "hello",
        }
        try {
            await pcc.validateParams("anArr", badAnArrInputs);
        } catch (error) {
            expect(error).to.equal(`${badAnArrInputs.first} is not an array`);
        }

        const goodTwoArrsInputs = {
            first: [35, 24],
            second: [2, 22, 22, 22, 22],
        }
        await pcc.validateParams("twoArrs", goodTwoArrsInputs);

        const badTwoArrsInputs = {
            first: ["hello"],
            second: [3],
        }
        try {
            await pcc.validateParams("twoArrs", badTwoArrsInputs);
        } catch (error) {
            expect(error).to.equal('array elements for param "first" must be int, but element is string');
        }

        const goodNestedArr0Inputs = {
            first: [35, 24],
        }
        await pcc.validateParams("nenstedArr0", goodNestedArr0Inputs);

        const badNestedArr0Inputs = {
            first: ["hello"],
        }
        try {
            await pcc.validateParams("nestedArr0", badNestedArr0Inputs);
        } catch (error) {
            expect(error).to.equal('array elements for param "first" must be int, but element is string');
        }

        const goodNestedArr1Inputs = {
            first: [1, 1, 1, 1, 1],
        }
        await pcc.validateParams("nestedArr1", goodNestedArr1Inputs);

        const badNestedArr1Inputs1 = {
            first: ["hello"],
        }
        try {
            await pcc.validateParams("nestedArr1", badNestedArr1Inputs1);
        } catch (error) {
            expect(error).to.equal('Array length error for param first. param "first" should have length 5, but had length 1');
        }

        const badNestedArr1Inputs2 = {
            first: [1, 1, 1],
        }
        try {
            await pcc.validateParams("nestedArr1", badNestedArr1Inputs2);
        } catch (error) {
            expect(error).to.equal('Array length error for param first. param "first" should have length 5, but had length 3');
        }

        const goodNestedArr4Inputs = {
            first: [[2,2,2], [2,2,2], [2,2,2]],
        }
        await pcc.validateParams("nestedArr4", goodNestedArr4Inputs);

        const badNestedArr4Inputs1 = {
            first: ["hello"],
        }
        try {
            await pcc.validateParams("nestedArr4", badNestedArr4Inputs1);
        } catch (error) {
            expect(error).to.equal('Array length error for param first. param "first" should have length 3, but had length 1');
        }

        const badNestedArr4Inputs2 = {
            first: [[1,1,1],[1,1,1]],
        }
        try {
            await pcc.validateParams("nestedArr4", badNestedArr4Inputs2);
        } catch (error) {
            expect(error).to.equal('Array length error for param first. param "first" should have length 3, but had length 2');
        }

        const badNestedArr4Inputs3 = {
            first: [[1],[1,1,1], [1,1,1]],
        }
        try {
            await pcc.validateParams("nestedArr4", badNestedArr4Inputs3);
        } catch (error) {
            expect(error).to.equal('Array length error for param first. param "first" should have length 3, but had length 1');
        }
    });
});