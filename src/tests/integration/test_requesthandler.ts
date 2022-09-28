import {
    RequestHandler,
} from "../../request_handler";
import {
    SimbaConfig,
    AUTHKEY,
} from "../../config";
import * as path from 'path';
import {cwd} from 'process';
import { expect } from 'chai';
import 'mocha';

describe('testing RequestHandler.doPostRequestWithFormData', () => {
    it('res.id should exist', async () => {
        const appName = "BrendanTestApp";
        const contractName = "test_contract_vds5";
        const methodName = "structTest5";
        const url = `https://simba-dev-api.platform.simbachain.com/v2/apps/${appName}/contract/${contractName}/${methodName}/`
        const person = {
            name: "Lenny's Ghost",
            age: 1000,
            addr: {
                street: "rogers",
                town: "nyc",
                number: 1234,
            },
        }
        const inputs = {
            person,
        }
        const imageFile1Path = path.join(cwd(), "test_data", "testimage1.png");
        const imageFile2Path = path.join(cwd(), "test_data", "testimage2.png");
        const filePaths = [imageFile1Path, imageFile2Path];
        const rh = new RequestHandler();
        const formData = rh.formDataFromFilePathsAndInputs(inputs, filePaths) as any;
        const options = await rh.getAuthAndOptions();
        const fdHeaders = rh.formDataHeaders(options, formData);
        const res = await rh.doPostRequestWithFormData(url, formData, fdHeaders) as Record<any, any>;
        expect(res.id).to.exist;
    }).timeout(15000);
});

describe('testing RequestHandler.formDataHeaders', () => {
    it('fdHeaders["content-type"] should contain "multipart/form-data; boundary="', async () => {
        const person = {
            name: "Lenny's Ghost",
            age: 1000,
            addr: {
                street: "rogers",
                town: "nyc",
                number: 1234,
            },
        }
        const inputs = {
            person,
        }
        const imageFile1Path = path.join(cwd(), "test_data", "testimgage1.png");
        const imageFile2Path = path.join(cwd(), "test_data", "testimgage2.png");
        const filePaths = [imageFile1Path, imageFile2Path];
        const rh = new RequestHandler();
        const formData = rh.formDataFromFilePathsAndInputs(inputs, filePaths) as any;
        const options = await rh.getAuthAndOptions();
        const fdHeaders = rh.formDataHeaders(options, formData);
        expect(fdHeaders["content-type"].includes("multipart/form-data; boundary=")).to.equal(true);
    }).timeout(15000);
});

describe('testing RequestHandler.formDataFromFilePathsAndInputs', () => {
    it('formData["_boundary"] should exist', async () => {
        const person = {
            name: "Lenny's Ghost",
            age: 1000,
            addr: {
                street: "rogers",
                town: "nyc",
                number: 1234,
            },
        }
        const inputs = {
            person,
        }
        const imageFile1Path = path.join(cwd(), "test_data", "testimgage1.png");
        const imageFile2Path = path.join(cwd(), "test_data", "testimgage2.png");
        const filePaths = [imageFile1Path, imageFile2Path];
        const rh = new RequestHandler();
        const formData = rh.formDataFromFilePathsAndInputs(inputs, filePaths) as any;
        expect(formData["_boundary"]).to.exist;
    }).timeout(15000);
});

describe('testing RequestHandler.setAndGetAuthToken', () => {
    it('authToken.access_token should match authConfig', async () => {
        const rh = new RequestHandler();
        const authTokenFromAPI = await rh.setAndGetAuthToken();
        // get access_token from authConfig
        const authTokenFromConfig = SimbaConfig.authConfig.get(AUTHKEY);
        const accessTokenFromConfig = authTokenFromConfig.access_token;
        const accessTokenFromAPI = authTokenFromAPI.access_token;
        expect(accessTokenFromConfig).to.equal(accessTokenFromAPI);
    }).timeout(15000);
});

describe('testing RequestHandler.getAuthTokenFromClientCreds', () => {
    it('expires_at, expires_in, access_token, scope, retrieved_at, token_type should all be present as fields', async () => {
        const rh = new RequestHandler();
        const authToken = await rh.getAuthTokenFromClientCreds();
        expect(authToken.expires_at).to.exist;
        expect(authToken.expires_in).to.exist;
        expect(authToken.access_token).to.exist;
        expect(authToken.scope).to.exist;
        expect(authToken.retrieved_at).to.exist;
        expect(authToken.token_type).to.exist;
    }).timeout(15000);
});

describe('testing RequestHandler.accessTokenHeader', () => {
    it('return value headers Authorization : "Bearer <val>" should match authConfig', async () => {
        const rh = new RequestHandler();
        const headers = await rh.accessTokenHeader();
        // get access_token from authConfig
        const authToken = SimbaConfig.authConfig.get(AUTHKEY);
        const accessTokenFromConfig = authToken.access_token;
        const accessTokenFromHeaders = headers.Authorization.split(" ")[1];
        expect(accessTokenFromConfig).to.equal(accessTokenFromHeaders);
    }).timeout(15000);
});

describe('testing RequestHandler.getAuthAndOptions', () => {
    it('return value should contain .headers.Authorization, .headers["Content-Type"] and .params', async () => {
        const rh = new RequestHandler();
        const queryParams = {
            "someParam": "someValue",
        };
        const options = await rh.getAuthAndOptions(undefined, queryParams, true);
        const params = options.params;
        const headers = options.headers;
        expect(params.someParam).to.equal(queryParams.someParam);
        expect(headers["Content-Type"]).to.equal("application/json");
        expect(headers.Authorization.startsWith("Bearer")).to.equal(true);
    }).timeout(15000);
});

describe('testing RequestHandler.doPostRequest', () => {
    it('endpoint should return data with id', async () => {
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
        const rh = new RequestHandler();
        const url = "https://simba-dev-api.platform.simbachain.com/v2/organisations/";
        const options = await rh.getAuthAndOptions();
        const res = await rh.doGetRequest(url, options) as Record<any, any>;
        expect(res.count).to.be.greaterThan(0);
    }).timeout(15000);
});

describe('testing RequestHandler.doPutRequest', () => {
    it('res.defauult_organisation should equal data.default_organisation', async () => {
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

describe('testing RequestHandler.doDeleteRequest', () => {
    it('needs to be implemented', async () => {
        // needs to be implemented
    }).timeout(15000);
});

