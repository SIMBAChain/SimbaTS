import axios from "axios";
import {
  AxiosResponse,
} from "axios";
import * as FormData from "form-data";
import * as fs from "fs";
import {
  getAuthOptions,
  QueryParams,
} from "./settings";
import {
  buildUrl,
} from "./utils";
import {
  Logger,
} from "tslog";
const log: Logger = new Logger();
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

class SimbaContract extends ParamCheckingContract {
  baseApiUrl: string;
  appName: string;
  contractName: string;
  contractUri: string;
  asyncContractUri: string;
  metadata: Record<any, any> | null = null;
  paramsRestricted: Record<any, any> | null = null;

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
  }

  async getMetadata(
    queryParams: QueryParams
  ): Promise<Record<any, any> | Error> {
    const funcName = "getMetaData";
    const par = {
      queryParams,
    };
    log.info(`[${funcName}] :: ENTER : ${JSON.stringify(par)}`);
    const url = buildUrl(this.baseApiUrl, `v2/apps/${this.contractUri}/?format=json`);
    const options = await getAuthOptions(queryParams);
    try {
      const res = await axios.get(url, options);
      const metadata = res.data["metadata"];
      log.info(`[${funcName}] :: EXIT : contract metadata: ${JSON.stringify(metadata)}`);
      // log.info(`metadata: ${JSON.parse(metadata)}`);
      this.metadata = metadata;
      return metadata;
    } catch (error) {
      if (error instanceof Error) {
        log.error(`[${funcName}] :: EXIT : ${error.message}`);
        return error;
      }
      const message = "Unknown error encountered";
      log.error(`[${funcName}] :: EXIT : ${message}`);
      throw new Error(message);
    }
  }

  async queryMethod(
    methodName: string,
    queryParams: QueryParams
  ): Promise<AxiosResponse<any> | Error> {
    const funcName = "queryMethod";
    const par = {
      methodName,
      queryParams,
    };
    log.info(`[${funcName}] :: ENTER : ${JSON.stringify(par)}`);
    const url = buildUrl(this.baseApiUrl, `v2/apps/${this.contractUri}/${methodName}/`);
    const options = await getAuthOptions(queryParams);
    try {
      const res = await axios.get(url, options);
      log.info(`[${funcName}] :: EXIT : res.data: ${JSON.stringify(res.data)}`);
      return res;
    } catch (error) {
      if (error instanceof Error) {
        log.error(`[${funcName}] :: EXIT : ${error.message}`);
        return error;
      }
      const message = "Unknown error encountered";
      log.error(`[${funcName}] :: EXIT : ${message}`);
      throw new Error(`${message}`);
    }
  }

  async callMethod(
    methodName: string,
    inputs: Record<any, any>,
    queryParams: QueryParams,
    asyncMethod: boolean = false
  ): Promise<AxiosResponse<any> | Error> {
    const funcName = "callMethod";
    const par = {
      methodName,
      inputs,
      queryParams,
      asyncMethod,
    };
    log.info(`[${funcName}] :: ENTER : ${JSON.stringify(par)}`);
    await this.validateParams(methodName, inputs);
    const contractUri = asyncMethod ?
      this.asyncContractUri :
      this.contractUri;
    const url = buildUrl(this.baseApiUrl, `v2/apps/${contractUri}/${methodName}/`);
    const data = inputs;
    const options = await getAuthOptions(queryParams);
    try {
      const res = await axios.post(url, data, options);
      log.info(`[${funcName}] :: EXIT : res.data: ${JSON.stringify(res.data)}`);
      return res;
    } catch (error) {
      if (error instanceof Error) {
        log.error(`[${funcName}] :: EXIT : error.message`);
        return error;
      }
      const message = "Unknown error encountered";
      log.error(`[${funcName}] :: EXIT : ${message}`);
      throw new Error(`${message}`);
    }
  }

  async callMethodAsync(
    methodName: string,
    inputs: Record<any, any>,
    queryParams: QueryParams
  ): Promise<AxiosResponse<any> | Error> {
    const funcName = "callMethodAsync";
    const par = {
      methodName,
      inputs,
      queryParams,
    };
    log.info(`[${funcName}] :: ENTER : ${JSON.stringify(par)}`);
    return await this.callMethod(methodName, inputs, queryParams, true);
  }

  async callContractMethodWithFiles(
    methodName: string,
    inputs: Record<any, any>,
    filePaths: Array<any> | undefined = undefined,
    queryParams: QueryParams,
    asyncMethod: boolean = false
  ): Promise<AxiosResponse<any, any> | Error> {
    const funcName = "callContractMethodWithFiles";
    const par = {
      methodName,
      inputs,
      filePaths,
      queryParams,
      asyncMethod,
    };
    log.info(`[${funcName}] :: ENTER : ${JSON.stringify(par)}`);
    await this.validateParams(methodName, inputs);
    const contractUri = asyncMethod ?
      this.asyncContractUri :
      this.contractUri;
    const url = buildUrl(this.baseApiUrl, `v2/apps/${contractUri}/${methodName}/`);
    // log.info(`[${funcName}] :: url: ${url}`);
    const options = await getAuthOptions(queryParams);
    let data = inputs;
    if (filePaths === undefined) {
      const res = await axios.post(url, data, options);
      log.info(`[${funcName}] :: EXIT : res.data: ${JSON.stringify(res.data)}`);
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
    })
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
      const res = await axios(axiosConfig);
      log.info(`[${funcName}] :: EXIT : res.data: ${JSON.stringify(res.data)}`);
      return res.data;
    } catch (error) {
      if (error instanceof Error) {
        log.error(`[${funcName}] :: EXIT : error.message`);
        return error;
      }
      const message = "Unknown error encountered";
      log.error(`[${funcName}] :: EXIT : ${message}`);
      throw new Error(message);
    }
  }

  async callContractMethodWithFilesAsync(
    methodName: string,
    inputs: Record<any, any>,
    filePaths: Array<any> | undefined = undefined,
    queryParams: QueryParams
  ): Promise<AxiosResponse<any, any> | Error> {
    const funcName = "callContractMethodWithFilesAsync";
    const par = {
      methodName,
      inputs,
      filePaths,
      queryParams,
    };
    log.info(`[${funcName}] :: ENTER : ${JSON.stringify(par)}`);
    return this.callContractMethodWithFiles(
        methodName,
        inputs,
        filePaths,
        queryParams,
        true
    );
  }

  async getTransactions(
    queryParams: QueryParams
  ): Promise<AxiosResponse<any> | Error> {
    const funcName = "getTransactions";
    const par = {
      queryParams,
    };
    log.info(`[${funcName}] :: ENTER : ${JSON.stringify(par)}`);
    const url = buildUrl(this.baseApiUrl, `v2/apps/${this.contractUri}/transactions/`);
    const options = await getAuthOptions(queryParams);
    try {
      const res = await axios.get(url, options);
      log.info(`[${funcName}] :: EXIT : res.data: ${JSON.stringify(res.data)}`);
      return res;
    } catch (error) {
      if (error instanceof Error) {
        log.error(`[${funcName}] :: EXIT : ${error.message}`);
        return error;
      }
      const message = "Unknown error encountered";
      log.error(`[${funcName}] :: EXIT : ${message}`);
      throw new Error(message);
    }
  }

  async validateBundleHash(
    bundleHash: string,
    queryParams: QueryParams
  ): Promise<AxiosResponse<any> | Error> {
    const funcName = "validateBundleHash";
    const par = {
      bundleHash,
      queryParams,
    };
    log.info(`[${funcName}] :: ENTER : ${JSON.stringify(par)}`);
    const url = buildUrl(this.baseApiUrl, `v2/apps${this.appName}/validate/${this.contractName}/${bundleHash}/`);
    const options = await getAuthOptions(queryParams);
    try {
      const res = await axios.get(url, options);
      log.info(`[${funcName}] :: EXIT : res.data: ${JSON.stringify(res.data)}`);
      return res;
    } catch (error) {
      if (error instanceof Error) {
        log.error(`[${funcName}] :: EXIT ${error.message}`);
        return error;
      }
      const message = "Unknown error encountered";
      log.error(`[${funcName}] :: EXIT : ${JSON.stringify(message)}`);
      throw new Error(message);
    }
  }

  async getTransactionStatuses(
    txnHashes: Array<string> | string | undefined = undefined,
    queryParams: QueryParams
  ): Promise<AxiosResponse<any> | Error> {
    const funcName = "getTransactionStatuses";
    const par = {
      txnHashes,
      queryParams,
    };
    log.info(`[${funcName}] :: ENTER : ${JSON.stringify(par)}`);
    const url = buildUrl(this.baseApiUrl, `v2/apps/${this.appName}/contract/${this.contractName}/transactions/`);
    const options = await getAuthOptions(queryParams);
    if (txnHashes && !Array.isArray(txnHashes)) {
      txnHashes = [txnHashes];
    }
    if ("filter[transaction_hash.in]" !in queryParams! && Array.isArray(txnHashes)) {
      queryParams["filter[transaction_hash.in]"] = txnHashes.join(",");
    }
    try {
      const res = await axios.get(url, options);
      log.info(`[${funcName}] :: EXIT : res.data: ${JSON.stringify(res.data)}`);
      return res;
    } catch (error) {
      if (error instanceof Error) {
        log.error(`[${funcName}] :: EXIT : ${error.message}`);
        return error;
      }
      const message = "Unknown error encountered";
      log.error(`[${funcName}] :: EXIT : ${message}`);
      throw new Error(message);
    }
  }


}

export {
  SimbaContract,
};
