import axios from "axios";
import {
  AxiosResponse,
} from "axios";
import {
  SimbaContract,
} from "./simba_contract";
import {
  buildUrl,
} from "./utils";
import {
  BASE_API_URL,
  getAuthOptions,
  QueryParams,
} from "./settings";
import {
  Logger,
} from "tslog";
const log: Logger = new Logger();

enum RequestMethods {
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
  GET = "GET",
}

class Simba {
  baseApiUrl: string;
  constructor(
    baseApiUrl: string = BASE_API_URL
  ) {
    this.baseApiUrl = baseApiUrl;
  }

  async doHTTPRequest(
    url: string,
    method: string,
    options: Record<any, any>,
    data: Record<any, any>
  ): Promise<AxiosResponse<any> | void> {
    const params = {
      url,
      method,
      options,
      data,
    }
    log.info(`:: ENTER : params : ${JSON.stringify(params)}`);
    let res;
    try {
      switch (method) {
        case RequestMethods.POST: {
          res = await axios.post(url, data, options);
          break;
        }
        case RequestMethods.POST: {
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
          log.error(`SIMBA: unrecognized request method: ${method}`);
          return;
        }
      }
      log.debug(`:: EXIT : res : ${JSON.stringify(res)}`);
      return res;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
          log.debug(`${JSON.stringify(error.response.data)}`);
      } else {
          log.debug(`${JSON.stringify(error)}`);
      }
    }
  }

  async whoAmI(): Promise<AxiosResponse<any> | Error> {
    const funcName = "whoAmI";
    log.info(`[${funcName}] :: ENTER :`);
    const url = buildUrl(this.baseApiUrl, "/user/whoami/");
    const options = await getAuthOptions();
    try {
      const res = await axios.get(url, options);
      log.info(`[${funcName}] :: EXIT : ${res.data}`);
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

  getContract(
    appName: string,
    contractName: string
  ): SimbaContract | Error {
    const funcName = "getContract";
    const par = {
      appName,
      contractName,
    };
    log.info(`[${funcName}] :: ENTER : ${JSON.stringify(par)}`);
    try {
      const simbaContract = new SimbaContract(this.baseApiUrl, appName, contractName);
      log.info(`[${funcName}] :: EXIT :`);
      return simbaContract;
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

  async listApplications() {
    const url = this.baseApiUrl;
    let options = await getAuthOptions();
    const res = await axios.get(url, options);
    return res;
  }

  async retrieveApplication(
    appId: string,
    queryParams: QueryParams = undefined
  ) {
    const url = buildUrl(this.baseApiUrl, `v2/apps/${appId}/`);
    let authOptions = await getAuthOptions(queryParams);
    const res = await axios.get(url, authOptions);
    return res;
  }

  async listApplicationTransactions(
    appId: string,
    queryParams: QueryParams = undefined
  ) {
    const url = buildUrl(this.baseApiUrl, `v2/apps/${appId}/transactions/`);
    const options = await getAuthOptions(queryParams);
    const res = await axios.get(url, options);
    return res;
  }

  async getApplicationContract(
    appId: string,
    contractName: string,
    queryParams: QueryParams = undefined
  ) {
    const url = buildUrl(this.baseApiUrl, `v2/apps/${appId}/contract/${contractName}/`);
    const options = await getAuthOptions(queryParams);
    const res = await axios.get(url, options);
    return res;
  }

  async listContractTranssactions(
    appId: string,
    contractName: string,
    queryParams: QueryParams = undefined
  ) {
    const url = buildUrl(this.baseApiUrl, `v2/apps/${appId}/contract/${contractName}/transactions/`);
    const options = await getAuthOptions(queryParams);
    const res = await axios.get(url, options);
    return res;
  }

  async listContracts(
    appId: string,
    queryParams: QueryParams = undefined
  ) {
    const url = buildUrl(this.baseApiUrl, `v2/apps/${appId}/contracts/`);
    const options = await getAuthOptions(queryParams);
    const res = await axios.get(url, options);
    return res;
  }

  async validateBundle(
    appId: string,
    contractName: string,
    bundleHash: string,
    queryParams: QueryParams = undefined
  ) {
    const url = buildUrl(this.baseApiUrl, `v2/apps/${appId}/validate/${contractName}/${bundleHash}/`);
    const options = await getAuthOptions(queryParams);
    const res = await axios.get(url, options);
    return res;
  }

  async getBundle(
    appId: string,
    contractName: string,
    bundleHash: string,
    queryParams: QueryParams = undefined
  ) {
    const url = buildUrl(this.baseApiUrl, `v2/apps/${appId}/contract/${contractName}/bundle/${bundleHash}/`);
    const options = await getAuthOptions(queryParams);
    const res = await axios.get(url, options);
    return res;
  }

  async getBundleFile(
    appId: string,
    contractName: string,
    bundleHash: string,
    fileName: string,
    queryParams: QueryParams = undefined
  ): Promise<AxiosResponse<any> | Error> {
    const funcName = "getBundleFile";
    const par = {
      appId,
      contractName,
      bundleHash,
      fileName,
      queryParams,
    };
    log.info(`[${funcName}] :: ENTER : ${JSON.stringify(par)}`);
    const url = buildUrl(this.baseApiUrl, `v2/apps/${appId}/contract/${contractName}/bundle/${bundleHash}/filename/${fileName}/`);
    const options = await getAuthOptions(queryParams);
    try {
      const res = await axios.get(url, options);
      log.info(`bundleFile info: ${res.data}`);
      return res;
    } catch (error) {
      if (error instanceof Error) {
        log.error(`[${funcName}] :: ENTER : ${error.message}`);
        return error;
      }
      const message = "Unknown error encountered";
      log.error(`[${funcName}] :: EXIT : ${message}`);
      throw new Error(message);
    }
  }

  async getManifestForBundleFromBundleHash(
    appId: string,
    contractName: string,
    bundleHash: string,
    queryParams: QueryParams = undefined
  ) {
    const url = buildUrl(this.baseApiUrl, `v2/apps/${appId}/contract/${contractName}/bundle/${bundleHash}/manifest/`);
    const options = await getAuthOptions(queryParams);
    const res = await axios.get(url, options);
    return res;
  }

  async listContractInfo(
    appId: string,
    contractName: string,
    queryParams: QueryParams = undefined
  ) {
    const url = buildUrl(this.baseApiUrl, `v2/apps/${appId}/contract/${contractName}/info/`);
    const options = await getAuthOptions(queryParams);
    const res = await axios.get(url, options);
    return res;
  }

  async getInstanceAddresses(
    appId: string,
    contractName: string,
    contractId: string,
    queryParams: QueryParams = undefined
  ) {
    const url = buildUrl(this.baseApiUrl, `v2/apps/${appId}/contract/${contractName}/contracts/${contractId}/`);
    const options = await getAuthOptions(queryParams);
    const res = await axios.get(url, options);
    return res;
  }

  async listContractInstances(
    appId: string,
    contractName: string,
    queryParams: QueryParams = undefined
  ) {
    const url = buildUrl(this.baseApiUrl, `v2/apps/${appId}/contract/${contractName}/contracts/`);
    const options = await getAuthOptions(queryParams);
    const res = await axios.get(url, options);
    return res;
  }

  async listEvents(
    appId: string,
    contractName: string,
    eventName: string,
    queryParams: QueryParams = undefined
  ) {
    const url = buildUrl(this.baseApiUrl, `v2/apps/${appId}/contract/${contractName}/events/${eventName}/`);
    const options = await getAuthOptions(queryParams);
    const res = await axios.get(url, options);
    return res;
  }

  async getReceipt(
    appId: string,
    contractName: string,
    receiptHash: string,
    queryMethod: QueryParams
  ) {
    const url = buildUrl(this.baseApiUrl, `v2/apps/${appId}/contract/${contractName}/receipt/${receiptHash}/`);
    const options = await getAuthOptions(queryMethod);
    const res = await axios.get(url, options);
    return res;
  }

  async getTransaction(
    appId: string,
    contractName: string,
    transactionHash: string,
    queryParams: QueryParams = undefined
  ) {
    const url = buildUrl(this.baseApiUrl, `v2/apps/${appId}/contract/${contractName}/transaction/${transactionHash}/`);
    const options = await getAuthOptions(queryParams);
    const res = await axios.get(url, options);
    return res;
  }

  async callSetterByAddress(
    appId: string,
    contractName: string,
    identifier: string,
    methodName: string,
    inputs: Record<any, any>,
    queryParams: QueryParams = undefined
  ) {
    const url = buildUrl(this.baseApiUrl, `v2/apps/${appId}/contract/${contractName}/address/${identifier}/${methodName}/`);
    const options = await getAuthOptions(queryParams);
    const data = inputs;
    const res = await axios.post(url, data, options);
    return res;
  }

  async callGetterByAddress(
    appId: string,
    contractName: string,
    identifier: string,
    methodName: string,
    queryParams: QueryParams = undefined
  ) {
    const url = buildUrl(this.baseApiUrl, `v2/apps/${appId}/contract/${contractName}/address/${identifier}/${methodName}/`);
    const options = await getAuthOptions(queryParams);
    const res = await axios.get(url, options);
    return res;
  }

  async createInstanceAsset(
    appId: string,
    contractName: string,
    identifier: string,
    methodName: string,
    inputs: Record<any, any>,
    queryParams: QueryParams = undefined
  ) {
    const url = buildUrl(this.baseApiUrl, `v2/apps/${appId}/contract/${contractName}/asset/${identifier}/${methodName}`);
    const options = await getAuthOptions(queryParams);
    const data = inputs;
    const res = await axios.post(url, data, options);
    return res;
  }

  async listContractMethods(
    appId: string,
    contractName: string,
    methodName: string,
    queryParams: QueryParams = undefined
  ) {
    const url = buildUrl(this.baseApiUrl, `v2/apps/${appId}/contract/${contractName}/${methodName}/`);
    const options = await getAuthOptions(queryParams);
    const res = await axios.get(url, options);
    return res;
  }

  async callContractMethod(
    appId: string,
    contractName: string,
    methodName: string,
    inputs: Record<any, any>,
    queryParams: QueryParams = undefined
  ) {
    const url = buildUrl(this.baseApiUrl, `v2/apps/${appId}/contract/${contractName}/${methodName}/`);
    const data = inputs;
    const options = await getAuthOptions(queryParams);
    const res = await axios.post(url, data, options);
    return res;
  }

  async callSetterByAddressAsync(
    appId: string,
    contractName: string,
    identifier: string,
    methodName: string,
    inputs: Record<any, any>,
    queryParams: QueryParams = undefined
  ) {
    const url = buildUrl(this.baseApiUrl, `v2/apps/${appId}/async/contract/${contractName}/address/${identifier}/${methodName}/`);
    const data = inputs;
    const options = await getAuthOptions(queryParams);
    const res = await axios.post(url, data, options);
    return res;
  }

  async createInstanceAssetAsync(
    appId: string,
    contractName: string,
    identifier: string,
    methodName: string,
    inputs: Record<any, any>,
    queryParams: QueryParams = undefined
  ) {
    const url = buildUrl(this.baseApiUrl, `v2/apps/${appId}/async/contract/${contractName}/asset/${identifier}/${methodName}`);
    const data = inputs;
    const options = await getAuthOptions(queryParams);
    const res = await axios.post(url, data, options);
    return res;
  }

  async callContractMethodAsync(
    appId: string,
    contractName: string,
    methodName: string,
    inputs: Record<any, any>,
    queryParams: QueryParams = undefined
  ) {
    const url = buildUrl(this.baseApiUrl, `v2/apps/${appId}/async/contract/${contractName}/${methodName}`);
    const data = inputs;
    const options = await getAuthOptions(queryParams);
    const res = await axios.post(url, data, options);
    return res;
  }

  async createContractInstance(
    appId: string,
    contractName: string,
    inputs: Record<any, any>,
    queryParams: QueryParams = undefined
  ) {
    const url = buildUrl(this.baseApiUrl, `v2/apps/${appId}/new/${contractName}/`);
    const data = inputs;
    const options = await getAuthOptions(queryParams);
    const res = await axios.post(url, data, options);
    return res;
  }

  async submitSignedTransaction(
    appId: string,
    txnId: string,
    txn: Record<any, any>,
    queryParams: QueryParams = undefined
  ) {
    const url = buildUrl(this.baseApiUrl, `v2/apps/${appId}/transactions/${txnId}/`);
    const data = txn;
    const options = await getAuthOptions(queryParams);
    const res = await axios.post(url, data, options);
    return res;
  }
}

export {
  Simba,
};
