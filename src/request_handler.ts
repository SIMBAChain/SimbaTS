import axios from "axios";
import {
    AxiosResponse,
} from "axios";
import utf8 from "utf8";
import FormData from "form-data";
import * as fs from "fs";
import {
    SimbaConfig,
    AUTHKEY,
    SimbaEnvVarKeys,
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
    ): string {
        const params = {
            baseURL,
            endpoint,
        }
        SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
        let fullURL;
        if (baseURL.endsWith("/") && endpoint.startsWith("/")) {
            fullURL = `${baseURL.slice(0, -1)}${endpoint}`;
        } else if (!baseURL.endsWith("/") && !endpoint.startsWith("/")) {
            fullURL = `${baseURL}/${endpoint}`
        } else {
            fullURL = `${baseURL}${endpoint}`;
        }
        SimbaConfig.log.debug(`:: SIMBA : EXIT : fullURL : ${fullURL}`);
        return fullURL;
    }

    private async doHTTPRequest(
        url: string,
        method: string,
        options: Record<any, any>,
        data?: Record<any, any>,
        parseDataFromResponse: boolean = true,
    ): Promise<AxiosResponse<any> | Record<any, any> | Array<any>> {
        const params = {
            url,
            method,
            options,
            data,
        }
        SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
        let res: AxiosResponse<any>;
        try {
            switch (method) {
                case RequestMethods.POST: {
                    data = data ? data : {};
                    res = await axios.post(url, data, options);
                break;
            }
            case RequestMethods.PUT: {
                data = data ? data : {};
                res = await axios.put(url, data, options);
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
        if (res.data && parseDataFromResponse) {
            SimbaConfig.log.debug(`:: SIMBA : EXIT : res.data : ${res.data}`);
            const resData: Record<any, any> = res.data;
            return resData;
        }
        SimbaConfig.log.debug(`:: SIMBA : EXIT : res : ${res}`);
        return res;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                SimbaConfig.log.error(`${JSON.stringify(error.response.data)}`);
            } else {
                SimbaConfig.log.error(`${error}`);
            }
            SimbaConfig.log.debug(`:: SIMBA : EXIT :`);
            throw(error);
        }
    }

    public async doPostRequest(
        url: string,
        options: Record<any, any>,
        data?: Record<any, any>,
        parseDataFromResponse: boolean = true,
    ): Promise<AxiosResponse<any> | Record<any, any> | Array<any>> {
        const params = {
            url,
            options,
            data,
            parseDataFromResponse,
        };
        SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
        const res = await this.doHTTPRequest(url, RequestMethods.POST, options, data, parseDataFromResponse);
        SimbaConfig.log.debug(`:: SIMBA : EXIT : res : ${res}`);
        return res;
    }

    public async doGetRequest(
        url: string,
        options: Record<any, any>,
        parseDataFromResponse: boolean = true,
        responseType?: string,
    ): Promise<AxiosResponse<any> | Record<any, any> | Array<any>> {
        const params = {
            url,
            options,
            parseDataFromResponse,
        };
        if (responseType) {
            options.responseType = responseType;
        }
        SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
        const res = await this.doHTTPRequest(url, RequestMethods.GET, options, undefined, parseDataFromResponse);
        SimbaConfig.log.debug(`:: SIMBA : EXIT : res : ${res}`);
        return res;
    }

    public async doPutRequest(
        url: string,
        options: Record<any, any>,
        data?: Record<any, any>,
        parseDataFromResponse: boolean = true,
    ): Promise<AxiosResponse<any> | Record<any, any> | Array<any>> {
        const params = {
            url,
            options,
            data,
            parseDataFromResponse,
        };
        SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
        const res = await this.doHTTPRequest(url, RequestMethods.PUT, options, data, parseDataFromResponse);
        SimbaConfig.log.debug(`:: SIMBA : EXIT : res : ${res}`);
        return res;
    }

    public async doDeleteRequest(
        url: string,
        options: Record<any, any>,
        data?: Record<any, any>,
        parseDataFromResponse: boolean = true,
    ): Promise<AxiosResponse<any> | Record<any, any> | Array<any>> {
        const params = {
            url,
            options,
            data,
            parseDataFromResponse,
        };
        SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
        const res = await this.doHTTPRequest(url, RequestMethods.DELETE, options, data, parseDataFromResponse);
        SimbaConfig.log.debug(`:: SIMBA : EXIT : res : ${res}`);
        return res;
    }

    public formDataHeaders(
        options: Record<any, any>,
        formData: FormData,
    ): Record<any, any> {
        const params = {
            options,
            formData,
        };
        if (options.headers["Content-Type"]) {
            delete options.headers["Content-Type"];
        }
        if (options.headers["content-type"]) {
            delete options.headers["content-type"];
        }
        SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
        const formDataHeaders = formData.getHeaders();
        const headers = {...options["headers"], ...formDataHeaders}
        SimbaConfig.log.debug(`:: SIMBA : EXIT`);
        return headers;
    }

    public formDataFromFilePathsAndInputs(
        inputs: Record<any, any>,
        filePaths: Array<string>,
    ): FormData {
        const params = {
            filePaths,
        };
        SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
        const formData = new FormData();
        filePaths.forEach(fileName => {
            // you do NOT have to JSON.stringify the readStream below
            formData.append("_files", fs.createReadStream(fileName));
        });
        Object.keys(inputs).forEach(key => {
            // you do NOT have to JSON.stringify inputs[key] below
            formData.append(key, JSON.stringify(inputs[key]));
        });
        SimbaConfig.log.debug(`:: SIMBA : EXIT :`);
        return formData;
    }

    private async doPostOrPutRequestWithFormData(
        url: string,
        method: RequestMethods.POST | RequestMethods.PUT,
        formData: FormData,
        headers: Record<any, any>,
        parseDataFromResponse: boolean = true,
    ): Promise<AxiosResponse<any> | Record<any, any> | Array<any>> {
        const params = {
            url,
            method,
            formData,
            headers,
            parseDataFromResponse,
        };
        SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
        const axiosConfig = {
            method: method,
            url: url,
            headers: headers,
            data: formData
        };
        try {
            const res = await axios(axiosConfig);
            if (res.data && parseDataFromResponse) {
                SimbaConfig.log.debug(`:: SIMBA : EXIT : res.data : ${JSON.stringify(res.data)}`);
                return res.data;
            }
            SimbaConfig.log.debug(`:: SIMBA : EXIT : res : ${res}`);
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

    public async doPostRequestWithFormData(
        url: string,
        formData: FormData,
        headers: Record<any, any>,
        parseDataFromResponse: boolean = true,
    ): Promise<AxiosResponse<any> | Record<any, any> | Array<any>> {
        const params = {
            url,
            formData,
            headers,
            parseDataFromResponse,
        };
        SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
        const res = await this.doPostOrPutRequestWithFormData(
            url,
            RequestMethods.POST,
            formData,
            headers,
            parseDataFromResponse,
        );
        SimbaConfig.log.debug(`:: SIMBA : EXIT :`);
        return res;
    }

    public async doPutRequestWithFormData(
        url: string,
        formData: FormData,
        headers: Record<any, any>,
        parseDataFromResponse: boolean = true,
    ): Promise<AxiosResponse<any> | Record<any, any> | Array<any>> {
        const params = {
            url,
            formData,
            headers,
            parseDataFromResponse,
        };
        SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
        const res = await this.doPostOrPutRequestWithFormData(
            url,
            RequestMethods.PUT,
            formData,
            headers,
            parseDataFromResponse,
        );
        SimbaConfig.log.debug(`:: SIMBA : EXIT :`);
        return res;
    }

    public async getAuthTokenFromClientCreds(): Promise<Record<any, any>> {
        SimbaConfig.log.debug(`:: SIMBA : ENTER :`);
        const clientID = SimbaConfig.retrieveEnvVar(SimbaEnvVarKeys.SIMBA_AUTH_CLIENT_ID);
        const clientSecret = SimbaConfig.retrieveEnvVar(SimbaEnvVarKeys.SIMBA_AUTH_CLIENT_SECRET);
        const authEndpoint = `${SimbaConfig.retrieveEnvVar(SimbaEnvVarKeys.SIMBA_AUTH_ENDPOINT)}token/`;
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
            const url = this.buildURL(this.baseURL, authEndpoint);
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
    public async accessTokenHeader(): Promise<Record<any, any>> {
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
            const message = `unable to obtain auth token`;
            SimbaConfig.log.error(`:: SIMBA : ${message}`);
            throw(message);
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
        const headers: Record<any, any> = await this.accessTokenHeader();
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