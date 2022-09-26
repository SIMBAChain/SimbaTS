import {
    getAddress,
    getDeployedArtifactID,
} from "../../utils"
import * as fs from "fs";
import { expect } from 'chai';
import 'mocha';
import * as path from 'path';
import {cwd} from 'process';


describe('testing getAddress', () => {
    it('address should be 0x', async () => {
        const deployment = {
            primary: "0x",
        };
        const primary = getAddress(deployment);
        expect(primary).to.equal(deployment.primary);
    });
});
