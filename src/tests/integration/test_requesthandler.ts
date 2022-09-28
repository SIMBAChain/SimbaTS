import {
    RequestHandler,
} from "../../request_handler";
import { expect } from 'chai';
import 'mocha';

describe('testing RequestHandler.doPostRequest', () => {
    it('endpoint should return data with id', async () => {
        // original settings
        const rh = new RequestHandler();
        const url = "https://simba-dev-api.platform.simbachain.com/admin/users/organisation/add/";
        const data = {
            user: "brendan.birch@simbachain.com",
            solution_blocks: {},
            organisation_name: "brendan_birch_simbachain_com",
            role: "Owner",
        };
        // function
        // calling with the above data will not change anything for this user
        // since they are already an owner
        const options = await rh.getAuthAndOptions();
        const res = await rh.doPostRequest(url, options, data) as Record<any, any>;
        expect(res.organisation_name).to.equal(data.organisation_name);
    }).timeout(15000);
});

describe('testing RequestHandler.doGetRequest', () => {
    it('res.count should be greater than 0', async () => {
        // original settings
        const rh = new RequestHandler();
        const url = "https://simba-dev-api.platform.simbachain.com/v2/organisations/";
        const options = await rh.getAuthAndOptions();
        const res = await rh.doGetRequest(url, options) as Record<any, any>;
        expect(res.count).to.be.greaterThan(0);
    }).timeout(15000);
});

describe('testing RequestHandler.doPutRequest', () => {
    it('endpoint should return data with id', async () => {
        // original settings
        const rh = new RequestHandler();
        const url = "https://simba-dev-api.platform.simbachain.com/user/default_organisation/";
        const data = {
            default_organisation: "brendan_birch_simbachain_com",
        };
        const options = await rh.getAuthAndOptions();
        const res = await rh.doPutRequest(url, options, data) as Record<any, any>;
        expect(res.default_organisation).to.equal(data.default_organisation);
    }).timeout(15000);
});