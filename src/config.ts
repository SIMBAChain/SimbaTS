import Configstore from 'configstore';
import * as path from 'path';
import {cwd} from 'process';
import {
    Logger,
} from "tslog";
import * as dotenv from "dotenv";

const SIMBA_HOME = process.env.SIMBA_HOME;
const SIMBA_LOGGING_CONF = process.env.SIMBA_LOGGING_CONF;
console.log("simba logging conf: ", SIMBA_LOGGING_CONF)
const LOGGING_FILE_NAME = "simbats.logging.conf";
const LOG_LEVEL = "LOG_LEVEL";
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
     * this is what we use for logging throughout our plugins
     */
    public static get log(): Logger {
        const logLevel = SimbaConfig.logLevel;
        const logger: Logger = new Logger({minLevel:logLevel});
        return logger;
    }

    /**
     * how we get loglevel throughout our plugins
     */
    public static get logLevel(): LogLevel {
        if (SIMBA_LOGGING_CONF) {
            dotenv.config({ path: path.resolve(SIMBA_LOGGING_CONF, LOGGING_FILE_NAME) });
            return process.env[LOG_LEVEL] as LogLevel || LogLevel.INFO;
        } else {
            dotenv.config({ path: path.resolve(cwd(), LOGGING_FILE_NAME) });
            return process.env[LOG_LEVEL] as LogLevel || LogLevel.INFO;
        }
    }

    public static get baseURL(): string {
        SimbaConfig.log.debug(`:: SIMBA : ENTER :`);
        const baseURL = SimbaConfig.retrieveEnvVar(SimbaEnvVarKeys.SIMBA_API_BASE_URL);
        SimbaConfig.log.debug(`:: SIMBA : EXIT : baseURL : ${baseURL}`);
        return baseURL;
    }

    /**
     * for env vars, we search, in this order:
     * local project directory for:
     *  - .simbachain.env
     *  - simbachain.env
     *  - .env
     * 
     * then we look for a SIMBA_HOME env var at the system level,
     * and within that directory, we search for:
     *  - .simbachain.env
     *  - simbachain.env
     *  - .env
     * 
     * @param envVarKey key of environment variable we want to retrieve value
     */
     public static retrieveEnvVar(envVarKey: SimbaEnvVarKeys): string {
        const params = {
            envVarKey,
        }
        SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
        if (envVarKey === SimbaEnvVarKeys.SIMBA_AUTH_ENDPOINT) {
            SimbaConfig.log.debug(`:: SIMBA : EXIT :`);
            return DEFAULT_AUTH_ENDPOINT;
        }
        
        // first check local project:
        for (let i = 0; i < simbaEnvFilesArray.length; i++) {
            const fileName = simbaEnvFilesArray[i];
            dotenv.config({ path: path.resolve(cwd(), fileName) });
            const val = process.env[envVarKey];
            if (val) {
                SimbaConfig.log.debug(`:: SIMBA : EXIT : retrieved ${envVarKey} from your local project directory.`);
                return val;
            }
        }

        // we're now going to check SIMBA_HOME. so if it wasn't successfully defined at the beginning of this file,
        // we have a problem
        if (!SIMBA_HOME) {
            const message = `unable to find ${envVarKey} in local project, and your SIMBA_HOME environment variable is not set in your system environment variables. To solve, please do one of the following. First, you can create a ${SimbaEnvFiles.DOT_SIMBACHAIN_DOT_ENV}, ${SimbaEnvFiles.SIMBACHAIN_DOT_ENV}, or ${SimbaEnvFiles.DOT_ENV} file in the root of this project. Secondly/alternatively, you can, in the directory of your choice, create a ${SimbaEnvFiles.DOT_SIMBACHAIN_DOT_ENV}, ${SimbaEnvFiles.SIMBACHAIN_DOT_ENV}, or ${SimbaEnvFiles.DOT_ENV} file; then you can, as a system environment variable (eg in your .bash_profile) set a SIMBA_HOME environment variable that is defined as the path to that directory. Whichever solution you choose, then set the value for ${envVarKey} inside of your ${SimbaEnvFiles.DOT_SIMBACHAIN_DOT_ENV}, ${SimbaEnvFiles.SIMBACHAIN_DOT_ENV}, or ${SimbaEnvFiles.DOT_ENV} file.`;
            SimbaConfig.log.error(`:: SIMBA : EXIT : ${message}`);
            throw(message);
        }

        // now we check SIMBA_HOME directory
        for (let i = 0; i < simbaEnvFilesArray.length; i++) {
            const fileName = simbaEnvFilesArray[i];
            dotenv.config({ path: path.resolve(SIMBA_HOME, fileName) });
            const val = process.env[envVarKey];
            if (val) {
                SimbaConfig.log.debug(`:: SIMBA : EXIT : retrieved ${envVarKey} from your SIMBA_HOME directory`);
                return val;
            }
        }
        
        const message = `unable to find ${envVarKey} in local project or in your SIMBA_HOME directory. To solve, please make sure ${envVarKey} is set as an environment variable in ${SimbaEnvFiles.DOT_SIMBACHAIN_DOT_ENV}, ${SimbaEnvFiles.SIMBACHAIN_DOT_ENV}, or ${SimbaEnvFiles.DOT_ENV}. You can do this in either the top level of this project's directory, or in the directory that your system level SIMBA_HOME points to.`;

        SimbaConfig.log.debug(`:: SIMBA : EXIT : ${message}`);
        throw(message);
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