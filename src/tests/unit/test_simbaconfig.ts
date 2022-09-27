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
        const pathToTestSimbachainEnv = path.join(cwd(), "test_data", ".test.simbachain.env");
        const pathToProjectSimbachainEnv = path.join(cwd(), ".simbachain.env");
        await FileHandler.transferFile(pathToTestSimbachainEnv, pathToProjectSimbachainEnv, false);
        const SIMBA_API_BASE_URL = SimbaConfig.retrieveEnvVar(SimbaEnvVarKeys.SIMBA_API_BASE_URL);
        expect(SIMBA_API_BASE_URL).to.equal("fake_api_base_url");
        FileHandler.removeFile(pathToProjectSimbachainEnv);
    });

    it('SIMBA_AUTH_BASE_URL should be "fake_auth_base_url"', async () => {
        const pathToTestSimbachainEnv = path.join(cwd(), "test_data", ".test.simbachain.env");
        const pathToProjectSimbachainEnv = path.join(cwd(), ".simbachain.env");
        await FileHandler.transferFile(pathToTestSimbachainEnv, pathToProjectSimbachainEnv, false);
        const SIMBA_API_BASE_URL = SimbaConfig.retrieveEnvVar(SimbaEnvVarKeys.SIMBA_API_BASE_URL);
        expect(SIMBA_API_BASE_URL).to.equal("fake_api_base_url");
        FileHandler.removeFile(pathToProjectSimbachainEnv);
    });

    it('SIMBA_AUTH_CLIENT_ID should be "fake_id"', async () => {
        const pathToTestSimbachainEnv = path.join(cwd(), "test_data", ".test.simbachain.env");
        const pathToProjectSimbachainEnv = path.join(cwd(), ".simbachain.env");
        await FileHandler.transferFile(pathToTestSimbachainEnv, pathToProjectSimbachainEnv, false);
        const SIMBA_API_BASE_URL = SimbaConfig.retrieveEnvVar(SimbaEnvVarKeys.SIMBA_API_BASE_URL);
        expect(SIMBA_API_BASE_URL).to.equal("fake_api_base_url");
        FileHandler.removeFile(pathToProjectSimbachainEnv);
    });

    it('SIMBA_AUTH_CLIENT_SECRET should be "fake_secret"', async () => {
        const pathToTestSimbachainEnv = path.join(cwd(), "test_data", ".test.simbachain.env");
        const pathToProjectSimbachainEnv = path.join(cwd(), ".simbachain.env");
        await FileHandler.transferFile(pathToTestSimbachainEnv, pathToProjectSimbachainEnv, false);
        const SIMBA_API_BASE_URL = SimbaConfig.retrieveEnvVar(SimbaEnvVarKeys.SIMBA_API_BASE_URL);
        expect(SIMBA_API_BASE_URL).to.equal("fake_api_base_url");
        FileHandler.removeFile(pathToProjectSimbachainEnv);
    });

    it('SIMBA_AUTH_ENDPOINT should be "/o/"', async () => {
        const pathToTestSimbachainEnv = path.join(cwd(), "test_data", ".test.simbachain.env");
        const pathToProjectSimbachainEnv = path.join(cwd(), ".simbachain.env");
        await FileHandler.transferFile(pathToTestSimbachainEnv, pathToProjectSimbachainEnv, false);
        const SIMBA_API_BASE_URL = SimbaConfig.retrieveEnvVar(SimbaEnvVarKeys.SIMBA_API_BASE_URL);
        expect(SIMBA_API_BASE_URL).to.equal("fake_api_base_url");
        FileHandler.removeFile(pathToProjectSimbachainEnv);
    });

    it('SIMBATS_LOG_LEVEL should be "silly"', async () => {
        const pathToTestSimbachainEnv = path.join(cwd(), "test_data", ".test.simbachain.env");
        const pathToProjectSimbachainEnv = path.join(cwd(), ".simbachain.env");
        await FileHandler.transferFile(pathToTestSimbachainEnv, pathToProjectSimbachainEnv, false);
        const SIMBA_API_BASE_URL = SimbaConfig.retrieveEnvVar(SimbaEnvVarKeys.SIMBATS_LOG_LEVEL);
        expect(SIMBA_API_BASE_URL).to.equal("silly");
        FileHandler.removeFile(pathToProjectSimbachainEnv);
    });
});
