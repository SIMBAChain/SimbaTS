import {
    SimbaConfig,
    SimbaEnvVarKeys,
} from "../../config";
import {
    FileHandler,
} from "../file_handler"
import { expect } from 'chai';
import 'mocha';
import * as path from 'path';
import {cwd} from 'process';

describe('testing SimbaConfig.retrieveEnvVar', async () => {
    it('SIMBA_API_BASE_URL should be "fake_api_base_url"', async () => {
        const SIMBA_API_BASE_URL = SimbaConfig.retrieveEnvVar(SimbaEnvVarKeys.SIMBA_API_BASE_URL);
        expect(SIMBA_API_BASE_URL).to.equal("fake_api_base_url");
    });

    it('SIMBA_AUTH_BASE_URL should be "fake_auth_base_url"', async () => {
        const SIMBA_API_BASE_URL = SimbaConfig.retrieveEnvVar(SimbaEnvVarKeys.SIMBA_API_BASE_URL);
        expect(SIMBA_API_BASE_URL).to.equal("fake_api_base_url");
    });

    it('SIMBA_AUTH_CLIENT_ID should be "fake_id"', async () => {
        const SIMBA_API_BASE_URL = SimbaConfig.retrieveEnvVar(SimbaEnvVarKeys.SIMBA_API_BASE_URL);
        expect(SIMBA_API_BASE_URL).to.equal("fake_api_base_url");
    });

    it('SIMBA_AUTH_CLIENT_SECRET should be "fake_secret"', async () => {
        const SIMBA_API_BASE_URL = SimbaConfig.retrieveEnvVar(SimbaEnvVarKeys.SIMBA_API_BASE_URL);
        expect(SIMBA_API_BASE_URL).to.equal("fake_api_base_url");
    });

    it('SIMBA_AUTH_ENDPOINT should be "/o/"', async () => {
        const SIMBA_API_BASE_URL = SimbaConfig.retrieveEnvVar(SimbaEnvVarKeys.SIMBA_API_BASE_URL);
        expect(SIMBA_API_BASE_URL).to.equal("fake_api_base_url");
    });

    it('SIMBATS_LOG_LEVEL should be "info"', async () => {
        const SIMBA_API_BASE_URL = SimbaConfig.retrieveEnvVar(SimbaEnvVarKeys.SIMBATS_LOG_LEVEL);
        expect(SIMBA_API_BASE_URL).to.equal("info");
    });
});

describe('testing SimbaConfig.parseExpiry', async () => {
    it('expires_at and retrieved_at should exist after call', async () => {
        const nonParsedTokenPath = path.join(cwd(), "test_data", "non_parsed_access_token.json");
        const jsonToken = await FileHandler.parsedFile(nonParsedTokenPath);
        const parsedToken = SimbaConfig.parseExpiry(jsonToken);
        const expiresAt = parsedToken.expires_at;
        const retrievedAt = parsedToken.retrieved_at;
        expect(expiresAt).to.exist;
        expect(retrievedAt).to.exist;
    });
});

describe('testing SimbaConfig.getAndSetParsedAuthToken, SimbaConfig.getAuthTokenFromConfig', async () => {
    it('accessToken should equal DrgRKmLa06hCouFO6kWvSdHgy0FNBw', async () => {
        const nonParsedTokenPath = path.join(cwd(), "test_data", "non_parsed_access_token.json");
        const jsonToken = await FileHandler.parsedFile(nonParsedTokenPath);
        SimbaConfig.getAndSetParsedAuthToken(jsonToken);
        const tokenFromConfig = SimbaConfig.getAuthTokenFromConfig();
        expect(tokenFromConfig.access_token).to.equal(jsonToken.access_token);
        SimbaConfig.authConfig.clear();
    });
});

describe('testing SimbaConfig.tokenExpired, SimbaConfig.setAuthTokenField', async () => {
    it('should be true', async () => {
        const nonParsedTokenPath = path.join(cwd(), "test_data", "non_parsed_access_token.json");
        const jsonToken = await FileHandler.parsedFile(nonParsedTokenPath);
        SimbaConfig.getAndSetParsedAuthToken(jsonToken);
        const newNow = new Date();
        newNow.setSeconds(newNow.getSeconds() - 100);
        const newNowIso = newNow.toISOString();
        SimbaConfig.setAuthTokenField("expires_at", newNowIso)
        let tokenExpired = SimbaConfig.tokenExpired();
        expect(tokenExpired).to.equal(true);
        SimbaConfig.authConfig.clear();
    });
});
