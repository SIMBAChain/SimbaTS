import axios from "axios";
import {
    AxiosResponse,
} from "axios";
import utf8 from "utf8";
import {
    SimbaConfig,
    AUTHKEY,
    SimbaEnvFiles,
    SimbaEnvVariableKeys,
} from "./config";

export enum RequestMethods {
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE",
    GET = "GET",
}

export class RequestHandler {
    baseURL: string;

    constructor(baseURL: string = SimbaConfig.baseURL) {
        this.baseURL = baseURL;
    }

    public buildURL(
        baseURL: string,
        endpoint: string,
        version: string = "v2",
        useVersion: boolean = true
    ): string {
        const params = {
            baseURL,
            endpoint,
            version,
            useVersion,
        }
        SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
        const fullBaseURL = this.handleVersion(baseURL, version, useVersion);
        let fullURL;
        if (fullBaseURL.endsWith("/") && endpoint.startsWith("/")) {
            fullURL = `${fullBaseURL.slice(0, -1)}${endpoint}`;
        } else if (!fullBaseURL.endsWith("/") && !endpoint.startsWith("/")) {
            fullURL = `${fullBaseURL}/${endpoint}`
        } else {
            fullURL = `${fullBaseURL}${endpoint}`;
        }
        SimbaConfig.log.debug(`:: SIMBA : EXIT : fullURL : ${fullURL}`);
        return fullURL;
    }

    public handleVersion(
        baseURL: string,
        version: string = "v2",
        useVersion: boolean = true
    ): string {
        const params = {
            baseURL,
        }
        SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
        if (baseURL.endsWith(`/${version}/`) || baseURL.endsWith(`/${version}`)) {
            const extension = baseURL.endsWith(`/${version}`) ? `/${version}` : `/${version}/`;
            const shortenedBaseURL = baseURL.slice(0,-(extension.length));
            const fullURL =  useVersion ? `${shortenedBaseURL}/${version}/` : shortenedBaseURL;
            SimbaConfig.log.debug(`:: SIMBA : EXIT : fullURL : ${fullURL}`);
            return fullURL;
        }
        const fullURL = useVersion ? `${baseURL}/${version}/` : baseURL;
        SimbaConfig.log.debug(`:: SIMBA : EXIT : fullURL : ${fullURL}`);
        return fullURL;
    }

    public async doHTTPRequest(
        url: string,
        method: string,
        options: Record<any, any>,
        data?: Record<any, any>,
    ): Promise<AxiosResponse<any>> {
        const params = {
            url,
            method,
            options,
            data,
        }
        SimbaConfig.log.info(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
        let res;
        try {
            switch (method) {
                case RequestMethods.POST: {
                    data = data ? data : {};
                    res = await axios.post(url, data, options);
                break;
            }
            case RequestMethods.POST: {
                data = data ? data : {};
                res = await axios.post(url, data, options);
                break;
            }
            case RequestMethods.DELETE: {
                res = await axios.delete(url, options);
                break;
            }
            case RequestMethods.GET: {
                res = await axios.get(url, options);
                break;
            }
            default: {
                const message = `unrecognized request method: ${method}`;
                SimbaConfig.log.error(`:: SIMBA : EXIT : ${message}`);
                throw(message)
            }
        }
        SimbaConfig.log.debug(`:: SIMBA : EXIT : res : ${JSON.stringify(res)}`);
        return res;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                SimbaConfig.log.error(`${JSON.stringify(error.response.data)}`);
            } else {
                SimbaConfig.log.error(`${JSON.stringify(error)}`);
            }
            SimbaConfig.log.debug(`:: SIMBA : EXIT :`);
            throw(error);
        }
    }

    public async getAuthTokenFromClientCreds(): Promise<Record<any, any>> {
        SimbaConfig.log.debug(`:: SIMBA : ENTER :`);
        const clientID = SimbaConfig.retrieveEnvVar(SimbaEnvVariableKeys.SIMBA_AUTH_CLIENT_ID);
        const clientSecret = SimbaConfig.retrieveEnvVar(SimbaEnvVariableKeys.SIMBA_AUTH_CLIENT_SECRET);
        const authEndpoint = SimbaConfig.retrieveEnvVar(SimbaEnvVariableKeys.SIMBA_AUTH_ENDPOINT);
        const credential = `${clientID}:${clientSecret}`;
        const utf8EncodedCred = utf8.encode(credential);
        const base64EncodedCred = Buffer.from(utf8EncodedCred).toString('base64');
        const params = new URLSearchParams();
        params.append('grant_type', "client_credentials");
        const headers = {
            "content-type": "application/x-www-form-urlencoded",
            "Cache-Control": "no-cache",
            "Authorization": `Basic ${base64EncodedCred}`
        };
        const config = {
            headers,
        };
        try {
            const baseURL = this.handleVersion(this.baseURL, undefined, false);
            const url = `${baseURL}${authEndpoint}token/`;
            SimbaConfig.log.debug(`:: url : ${url}`);
            const res = await axios.post(url, params, config);
            let authToken = res.data;
            authToken = SimbaConfig.getAndSetParsedAuthToken(authToken);
            return authToken;
        } catch (error)  {
            if (axios.isAxiosError(error) && error.response) {
                SimbaConfig.log.error(`:: SIMBA : EXIT : ${JSON.stringify(error.response.data)}`);
            } else {
                SimbaConfig.log.error(`:: SIMBA : EXIT : ${JSON.stringify(error)}`);
            }
            throw(error);
        }
    }

    public async setAndGetAuthToken(): Promise<Record<any, any>> {
        SimbaConfig.log.debug(`:: SIMBA : ENTER :`);
        let authToken = this.getAuthTokenFromClientCreds();
        SimbaConfig.authConfig.set(AUTHKEY, authToken);
        SimbaConfig.log.debug(`:: SIMBA : EXIT :`);
        return authToken;
    }

    /**
     * returns headers with access token
     * @returns 
     */
    public async accessTokenHeader(): Promise<Record<any, any> | void> {
        SimbaConfig.log.debug(`:: SIMBA : ENTER :`);
        let authToken;
        if (SimbaConfig.tokenExpired()) {
            authToken = await this.getAuthTokenFromClientCreds();
            authToken = SimbaConfig.getAndSetParsedAuthToken(authToken);
        } else {
            authToken = SimbaConfig.getAuthTokenFromConfig();
        }
        if (authToken) {
            const accessToken = authToken.access_token;
            const headers = {
                Authorization: `Bearer ${accessToken}`,
            };
            SimbaConfig.log.debug(`:: SIMBA : EXIT :`);
            return headers;
        } else {
            SimbaConfig.log.error(`:: SIMBA : unable to obtain auth token`);
            return;
        }
    }

    public async getAuthAndOptions(
        contentType?: string,
        queryParams?: Record<any, any>,
        addContentType: boolean = true,
    ): Promise<Record<any, any>> {
        const params = {
            queryParams,
        }
        SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
        const config: Record<any, any> = {};
        const headers: Record<any, any> = this.accessTokenHeader();
        if (addContentType) {
            if (contentType) {
                headers["Content-Type"] = contentType;
            } else {
                headers["Content-Type"] = "application/json";
            }
        }
        config.headers = headers;
        if (queryParams) {
            config.params = queryParams;
        }
        SimbaConfig.log.debug(`:: SIMBA : EXIT :`);
        return config;
    }
}