import axios from "axios";
import {
  SimbaConfig,
} from "./config";
import {
  AxiosResponse,
} from "axios";
import {
  RequestHandler,
  RequestMethods,
} from "./request_handler"
import FormData from "form-data";
import * as fs from "fs";
import {
  ParamCheckingContract,
} from "./param_checking_contract";

// interface Headers {
//   Authorization: string;
// }

// interface Options {
//   headers: Headers;
// }

// interface MethodParams {
//   headers: Headers,
//   methodName?: string,
//   opts?: Options,
//   inputs?: any,
//   asyncMethod?: boolean,
//   files?: any,
//   txnHashes?: Array<any>,
// }

export class SimbaContract extends ParamCheckingContract {
    baseApiUrl: string;
    appName: string;
    contractName: string;
    contractUri: string;
    asyncContractUri: string;
    metadata: Record<any, any> | null = null;
    paramsRestricted: Record<any, any> | null = null;
    requestHandler: RequestHandler;

    constructor(
        baseApiUrl: string,
        appName: string,
        contractName: string
    ) {
        super(appName, contractName, baseApiUrl);
        this.baseApiUrl = baseApiUrl;
        this.appName = appName;
        this.contractName = contractName;
        this.contractUri = `${this.appName}/contract/${this.contractName}`;
        this.asyncContractUri = `${this.appName}/async/contract/${this.contractName}`;
        this.requestHandler = new RequestHandler(this.baseApiUrl);
    }

    public async getMetadata(
        queryParams?: Record<any, any>
    ): Promise<Record<any, any> | Error> {
        const par = {
        queryParams,
        };
        SimbaConfig.log.debug(`:: ENTER : ${JSON.stringify(par)}`);
        const url = this.requestHandler.buildURL(this.baseApiUrl, `/apps/${this.contractUri}/?format=json`);
        const options = await this.requestHandler.getAuthAndOptions(undefined, queryParams);
        try {
            const res: any = await this.requestHandler.doHTTPRequest(url, RequestMethods.GET, options);
            if (!res.data) {
                const message = "unable to retrieve metadata"
                SimbaConfig.log.error(`:: SIMBA : EXIT : ${message}`);
                throw(message);
            }
            const metadata = res.data["metadata"];
            SimbaConfig.log.debug(`:: EXIT : contract metadata: ${JSON.stringify(metadata)}`);
            this.metadata = metadata;
            return metadata;
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

    public async queryMethod(
        methodName: string,
        queryParams?: Record<any, any>
    ): Promise<AxiosResponse<any> | void> {
        const par = {
        methodName,
        queryParams,
        };
        SimbaConfig.log.debug(`:: ENTER : ${JSON.stringify(par)}`);
        const url = this.requestHandler.buildURL(this.baseApiUrl, `/apps/${this.contractUri}/${methodName}/`);
        const options = await this.requestHandler.getAuthAndOptions(undefined, queryParams);
        try {
            const res: any = await this.requestHandler.doHTTPRequest(url, RequestMethods.GET, options);
            SimbaConfig.log.debug(`:: EXIT : res.data: ${JSON.stringify(res.data)}`);
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

    public async callMethod(
        methodName: string,
        inputs: Record<any, any>,
        queryParams?: Record<any, any>,
        asyncMethod: boolean = false
    ): Promise<AxiosResponse<any> | void> {
        const par = {
            methodName,
            inputs,
            queryParams,
            asyncMethod,
        };
        SimbaConfig.log.debug(`:: ENTER : ${JSON.stringify(par)}`);
        await this.validateParams(methodName, inputs);
        const contractUri = asyncMethod ?
            this.asyncContractUri :
            this.contractUri;
        const url = this.requestHandler.buildURL(this.baseApiUrl, `/apps/${contractUri}/${methodName}/`);
        const data = inputs;
        const options = await this.requestHandler.getAuthAndOptions(undefined, queryParams);
        try {
            const res: any = await axios.post(url, data, options);
            SimbaConfig.log.debug(`:: EXIT : res.data: ${JSON.stringify(res.data)}`);
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

    public async callMethodAsync(
        methodName: string,
        inputs: Record<any, any>,
        queryParams?: Record<any, any>
    ): Promise<AxiosResponse<any> | void> {
        const par = {
        methodName,
        inputs,
        queryParams,
        };
        SimbaConfig.log.debug(`:: ENTER : ${JSON.stringify(par)}`);
        return await this.callMethod(methodName, inputs, queryParams, true);
    }

    public async callContractMethodWithFiles(
        methodName: string,
        inputs: Record<any, any>,
        filePaths: Array<any> | undefined = undefined,
        queryParams?: Record<any, any>,
        asyncMethod: boolean = false
    ): Promise<AxiosResponse<any, any> | Error> {
        const par = {
            methodName,
            inputs,
            filePaths,
            queryParams,
            asyncMethod,
        };
        SimbaConfig.log.debug(`:: ENTER : ${JSON.stringify(par)}`);
        await this.validateParams(methodName, inputs);
        const contractUri = asyncMethod ?
        this.asyncContractUri :
        this.contractUri;
        const url = this.requestHandler.buildURL(this.baseApiUrl, `/apps/${contractUri}/${methodName}/`);
        // SimbaConfig.log.debug(`:: url: ${url}`);
        const options = await this.requestHandler.getAuthAndOptions(undefined, queryParams, false);
        let data = inputs;
        if (filePaths === undefined) {
            const res: any = await axios.post(url, data, options);
            SimbaConfig.log.debug(`:: EXIT : res.data: ${JSON.stringify(res.data)}`);
            return res;
        }

        const formData = new FormData();
        filePaths.forEach(fileName => {
            // you do NOT have to JSON.stringify the readStream below
            formData.append("_files", fs.createReadStream(fileName));
        });
        Object.keys(inputs).forEach(key => {
            // you do NOT have to JSON.stringify inputs[key] below
            formData.append(key, JSON.stringify(inputs[key]));
        });
        const formDataHeaders = formData.getHeaders();
        // you do NOT have to add content-type and accept headers
        // to headers
        // formData.getHeaders() contains content-type header
        const headers = {...options["headers"], ...formDataHeaders}

        const axiosConfig = {
            method: "POST" as any,
            url: url,
            headers: headers,
            data: formData
        };
        try {
            const res: any = await axios(axiosConfig);
            SimbaConfig.log.debug(`:: EXIT : res.data: ${JSON.stringify(res.data)}`);
            return res.data;
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

    public async callContractMethodWithFilesAsync(
        methodName: string,
        inputs: Record<any, any>,
        filePaths: Array<any> | undefined = undefined,
        queryParams?: Record<any, any>
    ): Promise<AxiosResponse<any, any> | Error> {
        const par = {
        methodName,
        inputs,
        filePaths,
        queryParams,
        };
        SimbaConfig.log.debug(`:: ENTER : ${JSON.stringify(par)}`);
        return this.callContractMethodWithFiles(
            methodName,
            inputs,
            filePaths,
            queryParams,
            true
        );
    }

    public async getTransactions(
        queryParams?: Record<any, any>
    ): Promise<AxiosResponse<any> | void> {
        const par = {
            queryParams,
        };
        SimbaConfig.log.debug(`:: ENTER : ${JSON.stringify(par)}`);
        const url = this.requestHandler.buildURL(this.baseApiUrl, `/apps/${this.contractUri}/transactions/`);
        const options = await this.requestHandler.getAuthAndOptions(undefined, queryParams);
        try {
            const res: any = await this.requestHandler.doHTTPRequest(url, RequestMethods.GET, options);
            SimbaConfig.log.debug(`:: EXIT : res.data: ${JSON.stringify(res.data)}`);
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

    public async validateBundleHash(
        bundleHash: string,
        queryParams?: Record<any, any>
    ): Promise<AxiosResponse<any> | void> {
        const par = {
            bundleHash,
            queryParams,
        };
        SimbaConfig.log.debug(`:: ENTER : ${JSON.stringify(par)}`);
        const url = this.requestHandler.buildURL(this.baseApiUrl, `/apps${this.appName}/validate/${this.contractName}/${bundleHash}/`);
        const options = await this.requestHandler.getAuthAndOptions(undefined, queryParams);
        try {
            const res: any = await this.requestHandler.doHTTPRequest(url, RequestMethods.GET, options);
            SimbaConfig.log.debug(`:: EXIT : res.data: ${JSON.stringify(res.data)}`);
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

    public async getTransactionStatuses(
        txnHashes: Array<string> | string | undefined = undefined,
        queryParams?: Record<any, any>
    ): Promise<AxiosResponse<any> | void> {
        const par = {
            txnHashes,
            queryParams,
        };
        SimbaConfig.log.debug(`:: ENTER : ${JSON.stringify(par)}`);
        const url = this.requestHandler.buildURL(this.baseApiUrl, `/apps/${this.appName}/contract/${this.contractName}/transactions/`);
        const options = await this.requestHandler.getAuthAndOptions(undefined, queryParams);
        if (txnHashes && !Array.isArray(txnHashes)) {
            txnHashes = [txnHashes];
        }
        if (queryParams) {
            if ("filter[transaction_hash.in]" !in queryParams && Array.isArray(txnHashes)) {
                queryParams["filter[transaction_hash.in]"] = txnHashes.join(",");
            }
        }
        try {
            const res: any = await this.requestHandler.doHTTPRequest(url, RequestMethods.GET, options);
            SimbaConfig.log.debug(`:: EXIT : res.data: ${JSON.stringify(res.data)}`);
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
}
