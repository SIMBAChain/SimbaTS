import {
    SimbaConfig,
    SimbaEnvVarKeys,
} from "../../src/config";
import {
    FileHandler,
} from "../../src/filehandler"
import { expect } from 'chai';
import 'mocha';
import * as path from 'path';
import {cwd} from 'process';

describe('testing SimbaConfig.retrieveEnvVar', async () => {
    it('should exist', async () => {
        const SIMBA_API_BASE_URL = SimbaConfig.retrieveEnvVar(SimbaEnvVarKeys.SIMBA_API_BASE_URL);
        expect(SIMBA_API_BASE_URL).to.exist;
    });

    it('should exist', async () => {
        const SIMBA_API_BASE_URL = SimbaConfig.retrieveEnvVar(SimbaEnvVarKeys.SIMBA_API_BASE_URL);
        expect(SIMBA_API_BASE_URL).to.exist;
    });

    it('should exist', async () => {
        const SIMBA_API_BASE_URL = SimbaConfig.retrieveEnvVar(SimbaEnvVarKeys.SIMBA_API_BASE_URL);
        expect(SIMBA_API_BASE_URL).to.exist;
    });

    it('should exist', async () => {
        const SIMBA_API_BASE_URL = SimbaConfig.retrieveEnvVar(SimbaEnvVarKeys.SIMBA_API_BASE_URL);
        expect(SIMBA_API_BASE_URL).to.exist;
    });

    it('should exist', async () => {
        const SIMBA_API_BASE_URL = SimbaConfig.retrieveEnvVar(SimbaEnvVarKeys.SIMBA_API_BASE_URL);
        expect(SIMBA_API_BASE_URL).to.exist;
    });

    it('should exist', async () => {
        const SIMBA_API_BASE_URL = SimbaConfig.retrieveEnvVar(SimbaEnvVarKeys.SIMBA_LOG_LEVEL);
        expect(SIMBA_API_BASE_URL).to.exist;
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

describe('tests setEnvVars', () => {
    it('SimbaConfig.envVars should be present after calling .setEnvVars', async () => {
        // for this test, you need to have env vars set for:
            // SIMBA_AUTH_CLIENT_ID
            // SIMBA_AUTH_CLIENT_SECRET
        SimbaConfig.envVars = {};
        SimbaConfig.setEnvVars();
        const envVars = SimbaConfig.envVars;
        // following two tests ensure .envVars was both set and returned
        expect(Object.values(envVars).length).to.be.greaterThan(0);
    });

    it('SimbaConfig.envVars should be present after calling .retrieveEnvVar()', async () => {
        // for this test, you need to have env vars set for:
            // SIMBA_AUTH_CLIENT_ID
            // SIMBA_AUTH_CLIENT_SECRET
        SimbaConfig.envVars = {};
        SimbaConfig.retrieveEnvVar(SimbaEnvVarKeys.SIMBA_AUTH_CLIENT_ID);
        const envVars = SimbaConfig.envVars;
        // following two tests ensure .envVars was both set and returned
        expect(Object.values(envVars).length).to.be.greaterThan(0);
    });
});

describe('tests retrieveEnvVar', () => {
    it('vals from retrieveEnvVar should be same as from process.env', async () => {
        // for this test, you need to have env vars set for:
            // SIMBA_AUTH_CLIENT_ID
            // SIMBA_AUTH_CLIENT_SECRET
        const IDFromMethod = SimbaConfig.retrieveEnvVar(SimbaEnvVarKeys.SIMBA_AUTH_CLIENT_ID);
        expect(IDFromMethod).to.equal("6lS6sae75lJx3m6KaCKKBbmxCkJM9g1aClrZtDtm");
    });
});
