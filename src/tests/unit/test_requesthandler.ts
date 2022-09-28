import {
    RequestHandler,
} from "../../request_handler";
import { expect } from 'chai';
import 'mocha';

describe('testing RequestHandler.buildURL', async () => {
    it('results should all be the same', async () => {
        const rh = new RequestHandler();
        let endpoint = "/v2/apps/";
        const expected = "https://simba-dev-api.platform.simbachain.com/v2/apps/"
        let builtURL = rh.buildURL(rh.baseURL, endpoint);
        expect(builtURL).to.equal(expected);

        endpoint = "v2/apps/";
        builtURL = rh.buildURL(rh.baseURL, endpoint);
        expect(builtURL).to.equal(expected);

        const baseURLWithoutSlash = "https://simba-dev-api.platform.simbachain.com"
        builtURL = rh.buildURL(baseURLWithoutSlash, endpoint);
        expect(builtURL).to.equal(expected);

        endpoint = "/v2/apps/";
        builtURL = rh.buildURL(baseURLWithoutSlash, endpoint);
        expect(builtURL).to.equal(expected);
    });
});
