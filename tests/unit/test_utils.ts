import {
    getAddress,
    getArtifactID,
} from "../../src/utils";
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

describe('testing getArtifactID', () => {
    it('id should be deployment.primary', async () => {
        const deployment = {
            primary: "1234",
            artifact_id: "5678"
        };
        const artifact_id = getArtifactID(deployment);
        expect(artifact_id).to.equal(deployment.artifact_id);
    });
});
