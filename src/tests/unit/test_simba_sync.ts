import {
    SimbaSync,
} from "../../simba_sync";
import { expect } from 'chai';
import 'mocha';
import {
    baseApiUrl,
    appName,
    contractName,
} from "../project_configs";

describe('testing Simba.getSimbaContract', () => {
    it('simba.simbaContract.baseApiUrl should be baseApiUrl', async () => {
        const simba = new SimbaSync(baseApiUrl);
        const simbaContractSync = simba.getSimbaContract(appName, contractName);
        expect(simbaContractSync.baseApiURL).to.equal(baseApiUrl);
    });
});