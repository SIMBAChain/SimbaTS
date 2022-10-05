import {
    Simba,
} from "../../simba";
import { expect } from 'chai';
import 'mocha';
import {
    baseApiUrl,
    appName,
    contractName,
} from "../project_configs"

describe('testing Simba.getSimbaContract', () => {
    it('simba.simbaContract.baseApiUrl should be baseApiUrl', async () => {
        const simba = new Simba();
        const simbaContract = simba.getSimbaContract(appName, contractName);
        expect(simbaContract.baseApiURL).to.equal(baseApiUrl);
    });
});