import Configstore from 'configstore';
import * as path from 'path';
import {cwd} from 'process';
import {
    Logger,
} from "tslog";
import * as dotenv from "dotenv";
import * as os from "os";
import {default as chalk} from 'chalk';

const SIMBA_HOME = process.env.SIMBA_HOME || os.homedir();
const DEFAULT_AUTH_ENDPOINT = "/o/";

export enum SimbaEnvVarKeys {
    SIMBA_AUTH_CLIENT_ID = "SIMBA_AUTH_CLIENT_ID",
    SIMBA_AUTH_CLIENT_SECRET = "SIMBA_AUTH_CLIENT_SECRET",
    SIMBA_API_BASE_URL = "SIMBA_API_BASE_URL",
    SIMBA_AUTH_BASE_URL = "SIMBA_AUTH_BASE_URL",
    SIMBA_AUTH_SCOPE = "SIMBA_AUTH_SCOPE",
    SIMBA_AUTH_REALM = "SIMBA_AUTH_REALM",
    SIMBA_AUTH_ENDPOINT = "SIMBA_AUTH_ENDPOINT",
    SIMBA_LOGGING_HOME = "SIMBA_LOGGING_HOME",
    SIMBA_HOME = "SIMBA_HOME",
    SIMBA_LOG_LEVEL = "SIMBA_LOG_LEVEL",
}

enum SimbaEnvFiles {
    DOT_SIMBACHAIN_DOT_ENV = ".simbachain.env",
    SIMBACHAIN_DOT_ENV = "simbachain.env",
    DOT_ENV = ".env",
}

// for ordered iteration purposes
export const simbaEnvFilesArray = [
    SimbaEnvFiles.DOT_SIMBACHAIN_DOT_ENV,
    SimbaEnvFiles.SIMBACHAIN_DOT_ENV,
    SimbaEnvFiles.DOT_ENV,
]

export const AUTHKEY = "SIMBAAUTH";

export enum LogLevel {
    SILLY = "silly",
    TRACE = "trace",
    DEBUG = "debug",
    INFO = "info",
    WARN = "warn",
    ERROR = "error",
    FATAL = "fatal",
}

export class SimbaConfig {
    public static _authConfig: Configstore;
    public static _projectConfigStore: Configstore;
    public static simbaEnvVarFileConfigured: boolean | undefined = false;
    public static simbaEnvVarFile: string | undefined;
    public static envVars: Record<any, any> = {};
    /**
     * handles our auth / access token info
     */
    public static get authConfig(): Configstore {
        if (!this._authConfig) {
            this._authConfig = new Configstore(`@simbachain/SimbaTS`, null, {
                configPath: path.join(cwd(), 'authconfig.json'),
            });
        }
        return this._authConfig;
    }

    /**
     * handles project info, contained in simba.json
     */
    public static get ProjectConfigStore(): Configstore {
        if (!this._projectConfigStore) {
            this._projectConfigStore = new Configstore(`@simbachain/simbats`, null, {
                configPath: path.join(cwd(), 'simba.json'),
            });
        }
        return this._projectConfigStore;
    }

    /**
     * this is what we use for logging
     */
    public static get log(): Logger {
        const logLevel = SimbaConfig.logLevel;
        const logger: Logger = new Logger({minLevel:logLevel});
        return logger;
    }

    /**
     * how we get loglevel
     */
    public static get logLevel(): LogLevel {
        const level = SimbaConfig.retrieveEnvVar(SimbaEnvVarKeys.SIMBA_LOG_LEVEL)
        if (level && !Object.values(LogLevel).includes(level as LogLevel)) {
            console.error(`SimbaConfig.logLevel :: SIMBA : EXIT : unrecognized SIMBA_LOG_LEVEL - ${level} set in ${SimbaConfig.simbaEnvVarFile} : ${level} : using level "info" instead. Please note that LOG_LEVEL can be one of ${Object.values(LogLevel)}`);
            return LogLevel.INFO;
        }
        if (!level) {
            return LogLevel.INFO;
        }
        return process.env[SimbaEnvVarKeys.SIMBA_LOG_LEVEL] as LogLevel;
    }

    public static get baseURL(): string {
        SimbaConfig.log.debug(`:: SIMBA : ENTER :`);
        const baseURL = SimbaConfig.retrieveEnvVar(SimbaEnvVarKeys.SIMBA_API_BASE_URL);
        SimbaConfig.log.debug(`:: SIMBA : EXIT : baseURL : ${baseURL}`);
        return baseURL;
    }

    /**
     * helper function for setting env vars, so we're not repeating loop code
     * @param dir 
     * @param foundKeys 
     * @returns 
     */
    private static setEnvVarsFromDirectory(dir: string, foundKeys: Array<any>) {
        if (!foundKeys.length) {
            foundKeys.push(SimbaEnvVarKeys.SIMBA_AUTH_ENDPOINT);
            SimbaConfig.envVars[SimbaEnvVarKeys.SIMBA_AUTH_ENDPOINT] = DEFAULT_AUTH_ENDPOINT;
        }
        for (let i = 0; i < simbaEnvFilesArray.length; i++) {
            if (foundKeys.length === Object.values(SimbaEnvVarKeys).length) {
                SimbaConfig.log.debug(`:: EXIT : ${JSON.stringify(SimbaConfig.envVars)}`)
                return;
            }
            const fileName = simbaEnvFilesArray[i];
            dotenv.config({
                override: true,
                path: path.resolve(dir, fileName),
            });

            for (let j = 0; j < Object.values(SimbaEnvVarKeys).length; j++) {
                const envVarKey = Object.values(SimbaEnvVarKeys)[j];
                if (foundKeys.includes(envVarKey)) {
                    continue;
                } else {
                    const simbaKey = Object.values(SimbaEnvVarKeys)[j];
                    const val = process.env[simbaKey];
                    if (val) {
                        SimbaConfig.envVars[simbaKey] = val;
                        foundKeys.push(envVarKey)
                    }

                }
            }
        }
    }

    /**
     * this method only gets called once, when a process first tries to retrieve an env var
     * if SimbaConfig.envVars's values is zero length, then we call this method
     * 
     * The code is a bit convoluted, so here's the process:
     * 1. iterate through file names of (.simbachain.env, simbachain.env, .env) in our project root
     * 2. we then loop through each of our SimbaEnvVarKeys until we find all of them, or
     * we have finished going through all files (not all env vars are necessary to be set)
     * 3. we then run through 1-4 again, but we use SIMBA_HOME instead of project root
     * 4. set as SimbaConfig.envVars once finished
     * @returns {Promise<Record<any, any>>}
     */
    public static setEnvVars(): Record<any, any> {
        const foundKeys: Array<any> = [];
        SimbaConfig.setEnvVarsFromDirectory(cwd(), foundKeys);
        SimbaConfig.setEnvVarsFromDirectory(SIMBA_HOME, foundKeys);
        return SimbaConfig.envVars;
    }

    /**
     * retrieves value for env var key. looks for:
     * 
     * if SimbaConfig.envVars values has zero length, we first call SimbaConfig.setEnvVars
     * @param SimbaEnvVarKeys
     * @returns 
     */
    public static retrieveEnvVar(envVarKey: SimbaEnvVarKeys): string {
        let envVars;
        if (!Object.values(SimbaConfig.envVars).length) {
            envVars = SimbaConfig.setEnvVars();
        } else {
            envVars = SimbaConfig.envVars;
        }

        const val = envVars[envVarKey];
        if (val) {
            return val;
        }

        const message = `Unable to find value for ${envVarKey}. You can set this in one of the following file names: .simbachain.env, simbachain.env, or .env; and these files can live in your local project root (best option) or in the directory that SIMBA_HOME points to in your system env vars.`
        // SimbaConfig.log.error(`${chalk.redBright(`:: EXIT : ${message}`)}`);
        throw new Error(message);
    }

    public static setAuthToken(authToken: Record<any, any>) {
        SimbaConfig.log.debug(`:: SIMBA : ENTER :`);
        SimbaConfig.authConfig.set(AUTHKEY, authToken);
        SimbaConfig.log.debug(`:: SIMBA : EXIT :`);
        return;
    }

    public static getAuthTokenFromConfig(): Record<any, any> {
        SimbaConfig.log.debug(`:: SIMBA : ENTER :`);
        const authToken = SimbaConfig.authConfig.get(AUTHKEY) ?
            SimbaConfig.authConfig.get(AUTHKEY) :
            {};
        SimbaConfig.log.debug(`:: SIMBA : EXIT :`);
        return authToken;
    }

    public static parseExpiry(authToken: Record<any, any>): Record<any, any> {
        SimbaConfig.log.debug(`:: SIMBA : ENTER :`);
        if ('expires_in' in authToken) {
            const retrievedAt = new Date();
            const expiresIn = parseInt(authToken.expires_in, 10) * 1000;
            const expiresAt = new Date(Date.parse(retrievedAt.toISOString()) + expiresIn);
            authToken.retrieved_at = retrievedAt.toISOString();
            authToken.expires_at = expiresAt.toISOString();
            if (authToken.refresh_expires_in) {
                const refreshExpiresIn = parseInt(authToken.refresh_expires_in, 10) * 1000;
                const refreshExpiresAt = new Date(Date.parse(retrievedAt.toISOString()) + refreshExpiresIn);
                authToken.refresh_expires_at = refreshExpiresAt.toISOString();
            }
        }
        SimbaConfig.log.debug(`:: SIMBA : EXIT :`);
        return authToken;
    }

    public static getAndSetParsedAuthToken(authToken: Record<any, any>): Record<any, any> {
        SimbaConfig.log.debug(`:: SIMBA : ENTER :`);
        const parsedToken = SimbaConfig.parseExpiry(authToken);
        SimbaConfig.setAuthToken(parsedToken);
        SimbaConfig.log.debug(`:: SIMBA : EXIT :`);
        return parsedToken;
    }

    /**
     * checks if auth token is expired. used as a check before we make http call
     * idea is to check for bad token before http call, if possible
     * @returns 
     */
    public static tokenExpired(): boolean {
        SimbaConfig.log.debug(`:: SIMBA : ENTER :`);
        if (!SimbaConfig.authConfig.has(AUTHKEY)) {
            SimbaConfig.log.debug(`:: SIMBA : EXIT : no auth token exists, exiting with true`);
            return true;
        }
        const authToken = SimbaConfig.authConfig.get(AUTHKEY);
        if (!authToken.expires_at) {
            SimbaConfig.log.debug(`:: SIMBA : EXIT : true`);
            return true;
        }
        if (new Date(authToken.expires_at) <= new Date()) {
            SimbaConfig.log.debug(`:: SIMBA : EXIT : auth token expired, returning true`);
            return true;
        }
        SimbaConfig.log.debug(`:: SIMBA : EXIT : false`);
        return false;
    }

    /**
     * checks if refresh token is expired. used as a check before we make http call
     * idea is to check for bad token before http call, if possible
     * 
     * Note: likely won't use, since the SDK will use client creds, and the
     * access token for client creds does not have a refresh token
     * @returns 
     */
    public refreshTokenExpired(): boolean {
        SimbaConfig.log.debug(`:: SIMBA : ENTER :`);
        if (!SimbaConfig.authConfig.has(AUTHKEY)) {
            SimbaConfig.log.debug(`:: SIMBA : EXIT : true`);
            return true;
        }
        const authToken = SimbaConfig.authConfig.get(AUTHKEY);
        if (!authToken.refresh_expires_at) {
            SimbaConfig.log.debug(`:: SIMBA : EXIT : true`);
            return true;
        }
        if (new Date(authToken.refresh_expires_at) <= new Date()) {
            SimbaConfig.log.debug(`:: SIMBA : EXIT : refresh_token expired, returning true`);
            return true;
        }
        SimbaConfig.log.debug(`:: SIMBA : EXIT : false`);
        return false;
    }

    public static setAuthTokenField(fieldKey: string, fieldVal: any) {
        const params = {
            fieldKey,
            fieldVal,
        };
        const authToken = SimbaConfig.authConfig.get(AUTHKEY) ?
            SimbaConfig.authConfig.get(AUTHKEY) :
            {};
        SimbaConfig.log.debug(`:: SIMBA : ENTER : ${JSON.stringify(params)}`);
        authToken[fieldKey] = fieldVal;
        SimbaConfig.authConfig.set(AUTHKEY, authToken);
        SimbaConfig.log.debug(`:: SIMBA : EXIT`);
        return;
    }

}