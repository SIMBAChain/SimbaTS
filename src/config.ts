import Configstore from 'configstore';
import * as path from 'path';
import {cwd} from 'process';
import {
    Logger,
} from "tslog";
const log: Logger = new Logger();

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
            this._projectConfigStore = new Configstore(`@simbachain/SimbaTS`, null, {
                configPath: path.join(cwd(), 'simba.json'),
            });
        }
        return this._projectConfigStore;
    }

    /**
     * this is what we use for logging throughout our plugins
     */
    public static get log(): Logger {
        SimbaConfig.log.debug(`:: SIMBA : ENTER :`);
        const logLevel = SimbaConfig.logLevel;
        const logger: Logger = new Logger({minLevel:logLevel});
        return logger;
    }

    public static get baseURL(): string {
        SimbaConfig.log.debug(`:: SIMBA : ENTER :`);
        const baseURL = SimbaConfig.ProjectConfigStore.get("baseURL");
        SimbaConfig.log.debug(`:: SIMBA : EXIT : baseURL : ${baseURL}`);
        return baseURL;
    }

    /**
     * how we get loglevel throughout our plugins
     */
    public static get logLevel(): LogLevel {
        SimbaConfig.log.debug(`:: SIMBA : ENTER :`);
        let logLevel = this.ProjectConfigStore.get('log_level') ? 
        this.ProjectConfigStore.get('log_level').toLowerCase() :
        LogLevel.INFO;
        if (!Object.values(LogLevel).includes(logLevel)) {
            logLevel = LogLevel.INFO;
        }SimbaConfig.log.debug(`:: SIMBA : EXIT :`);
        return logLevel;
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