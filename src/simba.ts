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
import {
  SimbaContract,
} from "./simba_contract";
import {
  buildUrl,
} from "./utils";
// import {
//   BASE_API_URL,
//   getAuthOptions,
//   QueryParams,
// } from "./settings";
import {
  Logger,
} from "tslog";
const log: Logger = new Logger();

const BASE_API_URL = SimbaConfig.baseURL;

class Simba {
	baseApiUrl: string;
	requestHandler: RequestHandler;
	
	constructor(
		baseApiUrl: string = SimbaConfig.baseURL,
		requestHandler: RequestHandler = new RequestHandler()
	) {
		this.baseApiUrl = baseApiUrl;
		this.requestHandler = requestHandler;
	}
	
	public async whoAmI(): Promise<AxiosResponse<any> | void> {
		SimbaConfig.log.info(`:: SIMBA : ENTER :`);
    	const url = this.requestHandler.buildURL(this.baseApiUrl, "/user/whoami/");
    	const options = await this.requestHandler.getAuthAndOptions();
    	try {
			const res = await this.requestHandler.doHTTPRequest(url, RequestMethods.GET, options);
      		SimbaConfig.log.info(`:: SIMBA : EXIT : ${res!.data}`);
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
	
	public getContract(
		appName: string,
    	contractName: string
	): SimbaContract | Error {
		const params = {
			appName,
			contractName,
		};
		SimbaConfig.log.info(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
		const simbaContract = new SimbaContract(this.baseApiUrl, appName, contractName);
		SimbaConfig.log.info(`:: SIMBA : EXIT :`);
		return simbaContract;
	}
	
	async listApplications() {
		const url = this.baseApiUrl;
    	let options = await this.requestHandler.getAuthAndOptions()
    	try {
			const res = await this.requestHandler.doHTTPRequest(url, RequestMethods.GET, options);
			SimbaConfig.log.debug(`:: SIMBA : EXIT :`);
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
    SimbaConfig.log.info(`:: SIMBA : ENTER : ${JSON.stringify(par)}`);
    const url = buildUrl(this.baseApiUrl, `v2/apps/${appId}/contract/${contractName}/bundle/${bundleHash}/filename/${fileName}/`);
    const options = await getAuthOptions(queryParams);
    try {
      const res = await axios.get(url, options);
      SimbaConfig.log.info(`bundleFile info: ${res.data}`);
      return res;
    } catch (error) {
      if (error instanceof Error) {
        SimbaConfig.log.error(`:: SIMBA : ENTER : ${error.message}`);
        return error;
      }
      const message = "Unknown error encountered";
      SimbaConfig.log.error(`:: SIMBA : EXIT : ${message}`);
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
