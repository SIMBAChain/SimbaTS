import {
    getAddress,
    getDeployedArtifactID,
} from "../../utils";
import { expect } from 'chai';
import 'mocha';


describe('testing getAddress', () => {
    it('address should be deployment.primary', async () => {
        const deployment = {
            primary: "0x",
        };
        const primary = getAddress(deployment);
        expect(primary).to.equal(deployment.primary);
    });
});

describe('testing getDeployedArtifactID', () => {
    it('id should be deployment.primary', async () => {
        const deployment = {
            primary: "1234",
        };
        const primary = getDeployedArtifactID(deployment);
        expect(primary).to.equal(deployment.primary);
    });
});
