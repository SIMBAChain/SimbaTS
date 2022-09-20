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

export class Simba {
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
		SimbaConfig.log.debug(`:: SIMBA : ENTER :`);
    	const url = this.requestHandler.buildURL(this.baseApiUrl, "/user/whoami/");
    	const options = await this.requestHandler.getAuthAndOptions();
    	try {
			const res = await this.requestHandler.doHTTPRequest(url, RequestMethods.GET, options);
      		SimbaConfig.log.debug(`:: SIMBA : EXIT : ${res.data}`);
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
	): SimbaContract {
		const params = {
			appName,
			contractName,
		};
		SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
		const simbaContract = new SimbaContract(this.baseApiUrl, appName, contractName);
		SimbaConfig.log.debug(`:: SIMBA : EXIT :`);
		return simbaContract;
	}
	
	public async listApplications(): Promise<AxiosResponse<any> | void> {
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
	
	public async retrieveApplication(
		appId: string,
    	queryParams?: Record<any, any>
  	): Promise<AxiosResponse<any> | void> {
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/apps/${appId}/`);
    	const options = await this.requestHandler.getAuthAndOptions(undefined, queryParams);
		try {
			const res = await this.requestHandler.doHTTPRequest(url, RequestMethods.GET, options);
			SimbaConfig.log.debug(`:: SIMBA : EXIT : res.data : ${res.data}`);
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
	public async listApplicationTransactions(
    	appId: string,
    	queryParams?: Record<any, any>
	): Promise<AxiosResponse<any> | void> {
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/apps/${appId}/transactions/`);
		const options = await this.requestHandler.getAuthAndOptions(undefined, queryParams);
		try {
			const res = await this.requestHandler.doHTTPRequest(url, RequestMethods.GET, options);
			SimbaConfig.log.debug(`:: SIMBA : EXIT : res.data : ${res.data}`);
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

  	public async getApplicationContract(
    	appId: string,
    	contractName: string,
    	queryParams: Record<any, any>
  	): Promise<AxiosResponse<any> | void> {
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/apps/${appId}/contract/${contractName}/`);
		const options = await this.requestHandler.getAuthAndOptions(undefined, queryParams);
		try {
			const res = await this.requestHandler.doHTTPRequest(url, RequestMethods.GET, options);
			SimbaConfig.log.debug(`:: SIMBA : EXIT : res.data : ${res.data}`);
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

	public async listContractTranssactions(
    	appId: string,
    	contractName: string,
    	queryParams: Record<any, any>
  	): Promise<AxiosResponse<any> | void> {
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/apps/${appId}/contract/${contractName}/transactions/`);
		const options = await this.requestHandler.getAuthAndOptions(undefined, queryParams);
		try {
			const res = await this.requestHandler.doHTTPRequest(url, RequestMethods.GET, options);
			SimbaConfig.log.debug(`:: SIMBA : EXIT : res.data : ${res.data}`);
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

	public async listContracts(
		appId: string,
		queryParams: Record<any, any>
	): Promise<AxiosResponse<any> | void> {
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/apps/${appId}/contracts/`);
		const options = await this.requestHandler.getAuthAndOptions(undefined, queryParams);
		try {
			const res = await this.requestHandler.doHTTPRequest(url, RequestMethods.GET, options);
			SimbaConfig.log.debug(`:: SIMBA : EXIT : res.data : ${res.data}`);
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

  	public async validateBundle(
		appId: string,
		contractName: string,
		bundleHash: string,
		queryParams: Record<any, any>
	): Promise<AxiosResponse<any> | void> {
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/apps/${appId}/validate/${contractName}/${bundleHash}/`);
		const options = await this.requestHandler.getAuthAndOptions(undefined, queryParams);
		try {
			const res = await this.requestHandler.doHTTPRequest(url, RequestMethods.GET, options);
			SimbaConfig.log.debug(`:: SIMBA : EXIT : res.data : ${res.data}`);
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

	public async getBundle(
		appId: string,
		contractName: string,
		bundleHash: string,
		queryParams: Record<any, any>
	): Promise<AxiosResponse<any> | void> {
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/apps/${appId}/contract/${contractName}/bundle/${bundleHash}/`);
		const options = await this.requestHandler.getAuthAndOptions(undefined, queryParams);
		try {
			const res = await this.requestHandler.doHTTPRequest(url, RequestMethods.GET, options);
			SimbaConfig.log.debug(`:: SIMBA : EXIT : res.data : ${res.data}`);
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

	public async getBundleFile(
		appId: string,
		contractName: string,
		bundleHash: string,
		fileName: string,
		queryParams: Record<any, any>
	): Promise<AxiosResponse<any> | void> {
		const par = {
			appId,
			contractName,
			bundleHash,
			fileName,
			queryParams,
		};
		SimbaConfig.log.debug(`:: SIMBA : ENTER : ${JSON.stringify(par)}`);
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/apps/${appId}/contract/${contractName}/bundle/${bundleHash}/filename/${fileName}/`);
		const options = await this.requestHandler.getAuthAndOptions(undefined, queryParams);
		try {
			const res = await this.requestHandler.doHTTPRequest(url, RequestMethods.GET, options);
			SimbaConfig.log.debug(`bundleFile info: ${res.data}`);
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

	public async getManifestForBundleFromBundleHash(
		appId: string,
		contractName: string,
		bundleHash: string,
		queryParams: Record<any, any>
	): Promise<AxiosResponse<any> | void> {
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/apps/${appId}/contract/${contractName}/bundle/${bundleHash}/manifest/`);
		const options = await this.requestHandler.getAuthAndOptions(undefined, queryParams);
		try {
			const res = await this.requestHandler.doHTTPRequest(url, RequestMethods.GET, options);
			SimbaConfig.log.debug(`:: SIMBA : EXIT : res.data : ${res.data}`);
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

	public async listContractInfo(
		appId: string,
		contractName: string,
		queryParams: Record<any, any>
	): Promise<AxiosResponse<any> | void> {
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/apps/${appId}/contract/${contractName}/info/`);
		const options = await this.requestHandler.getAuthAndOptions(undefined, queryParams);
		try {
			const res = await this.requestHandler.doHTTPRequest(url, RequestMethods.GET, options);
			SimbaConfig.log.debug(`:: SIMBA : EXIT : res.data : ${res.data}`);
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

	public async getInstanceAddresses(
		appId: string,
		contractName: string,
		contractId: string,
		queryParams: Record<any, any>
	): Promise<AxiosResponse<any> | void> {
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/apps/${appId}/contract/${contractName}/contracts/${contractId}/`);
		const options = await this.requestHandler.getAuthAndOptions(undefined, queryParams);
		try {
			const res = await this.requestHandler.doHTTPRequest(url, RequestMethods.GET, options);
			SimbaConfig.log.debug(`:: SIMBA : EXIT : res.data : ${res.data}`);
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

	public async listContractInstances(
		appId: string,
		contractName: string,
		queryParams: Record<any, any>
	): Promise<AxiosResponse<any> | void> {
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/apps/${appId}/contract/${contractName}/contracts/`);
		const options = await this.requestHandler.getAuthAndOptions(undefined, queryParams);
		try {
			const res = await this.requestHandler.doHTTPRequest(url, RequestMethods.GET, options);
			SimbaConfig.log.debug(`:: SIMBA : EXIT : res.data : ${res.data}`);
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

	public async listEvents(
		appId: string,
		contractName: string,
		eventName: string,
		queryParams: Record<any, any>
	): Promise<AxiosResponse<any> | void> {
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/apps/${appId}/contract/${contractName}/events/${eventName}/`);
		const options = await this.requestHandler.getAuthAndOptions(undefined, queryParams);
		try {
			const res = await this.requestHandler.doHTTPRequest(url, RequestMethods.GET, options);
			SimbaConfig.log.debug(`:: SIMBA : EXIT : res.data : ${res.data}`);
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

	public async getReceipt(
		appId: string,
		contractName: string,
		receiptHash: string,
		queryMethod?: Record<any, any>,
	): Promise<AxiosResponse<any> | void> {
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/apps/${appId}/contract/${contractName}/receipt/${receiptHash}/`);
		const options = await this.requestHandler.getAuthAndOptions(undefined, queryMethod);
		try {
			const res = await this.requestHandler.doHTTPRequest(url, RequestMethods.GET, options);
			SimbaConfig.log.debug(`:: SIMBA : EXIT : res.data : ${res.data}`);
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

	public async getTransaction(
		appId: string,
		contractName: string,
		transactionHash: string,
		queryParams: Record<any, any>
	): Promise<AxiosResponse<any> | void> {
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/apps/${appId}/contract/${contractName}/transaction/${transactionHash}/`);
		const options = await this.requestHandler.getAuthAndOptions(undefined, queryParams);
		try {
			const res = await this.requestHandler.doHTTPRequest(url, RequestMethods.GET, options);
			SimbaConfig.log.debug(`:: SIMBA : EXIT : res.data : ${res.data}`);
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

	public async callSetterByAddress(
		appId: string,
		contractName: string,
		identifier: string,
		methodName: string,
		inputs: Record<any, any>,
		queryParams: Record<any, any>
	): Promise<AxiosResponse<any> | void> {
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/apps/${appId}/contract/${contractName}/address/${identifier}/${methodName}/`);
		const options = await this.requestHandler.getAuthAndOptions(undefined, queryParams);
		const data = inputs;
		try {
			const res = await this.requestHandler.doHTTPRequest(url, RequestMethods.POST, options, data);
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

	public async callGetterByAddress(
		appId: string,
		contractName: string,
		identifier: string,
		methodName: string,
		queryParams: Record<any, any>
	): Promise<AxiosResponse<any> | void> {
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/apps/${appId}/contract/${contractName}/address/${identifier}/${methodName}/`);
		const options = await this.requestHandler.getAuthAndOptions(undefined, queryParams);
		try {
			const res = await this.requestHandler.doHTTPRequest(url, RequestMethods.GET, options);
			SimbaConfig.log.debug(`:: SIMBA : EXIT : res.data : ${res.data}`);
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

	public async createInstanceAsset(
		appId: string,
		contractName: string,
		identifier: string,
		methodName: string,
		inputs: Record<any, any>,
		queryParams: Record<any, any>
	): Promise<AxiosResponse<any> | void> {
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/apps/${appId}/contract/${contractName}/asset/${identifier}/${methodName}`);
		const options = await this.requestHandler.getAuthAndOptions(undefined, queryParams);
		const data = inputs;
		try {
			const res = await this.requestHandler.doHTTPRequest(url, RequestMethods.POST, options, data);
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

	public async listContractMethods(
		appId: string,
		contractName: string,
		methodName: string,
		queryParams: Record<any, any>
	): Promise<AxiosResponse<any> | void> {
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/apps/${appId}/contract/${contractName}/${methodName}/`);
		const options = await this.requestHandler.getAuthAndOptions(undefined, queryParams);
		try {
			const res = await this.requestHandler.doHTTPRequest(url, RequestMethods.GET, options);
			SimbaConfig.log.debug(`:: SIMBA : EXIT : res.data : ${res.data}`);
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

	public async callContractMethod(
		appId: string,
		contractName: string,
		methodName: string,
		inputs: Record<any, any>,
		queryParams: Record<any, any>
	): Promise<AxiosResponse<any> | void> {
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/apps/${appId}/contract/${contractName}/${methodName}/`);
		const data = inputs;
		const options = await this.requestHandler.getAuthAndOptions(undefined, queryParams);
		try {
			const res = await this.requestHandler.doHTTPRequest(url, RequestMethods.POST, options, data);
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

	public async callSetterByAddressAsync(
		appId: string,
		contractName: string,
		identifier: string,
		methodName: string,
		inputs: Record<any, any>,
		queryParams: Record<any, any>
	): Promise<AxiosResponse<any> | void> {
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/apps/${appId}/async/contract/${contractName}/address/${identifier}/${methodName}/`);
		const data = inputs;
		const options = await this.requestHandler.getAuthAndOptions(undefined, queryParams);
		try {
			const res = await this.requestHandler.doHTTPRequest(url, RequestMethods.POST, options, data);
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

	public async createInstanceAssetAsync(
		appId: string,
		contractName: string,
		identifier: string,
		methodName: string,
		inputs: Record<any, any>,
		queryParams: Record<any, any>
	): Promise<AxiosResponse<any> | void> {
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/apps/${appId}/async/contract/${contractName}/asset/${identifier}/${methodName}`);
		const data = inputs;
		const options = await this.requestHandler.getAuthAndOptions(undefined, queryParams);
		try {
			const res = await this.requestHandler.doHTTPRequest(url, RequestMethods.POST, options, data);
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

	public async callContractMethodAsync(
		appId: string,
		contractName: string,
		methodName: string,
		inputs: Record<any, any>,
		queryParams: Record<any, any>
	): Promise<AxiosResponse<any> | void> {
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/apps/${appId}/async/contract/${contractName}/${methodName}`);
		const data = inputs;
		const options = await this.requestHandler.getAuthAndOptions(undefined, queryParams);
		try {
			const res = await this.requestHandler.doHTTPRequest(url, RequestMethods.POST, options, data);
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

	public async createContractInstance(
		appId: string,
		contractName: string,
		inputs: Record<any, any>,
		queryParams: Record<any, any>
	): Promise<AxiosResponse<any> | void> {
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/apps/${appId}/new/${contractName}/`);
		const data = inputs;
		const options = await this.requestHandler.getAuthAndOptions(undefined, queryParams);
		try {
			const res = await this.requestHandler.doHTTPRequest(url, RequestMethods.POST, options, data);
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

	public async submitSignedTransaction(
		appId: string,
		txnId: string,
		txn: Record<any, any>,
		queryParams: Record<any, any>
	): Promise<AxiosResponse<any> | void> {
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/apps/${appId}/transactions/${txnId}/`);
		const data = txn;
		const options = await this.requestHandler.getAuthAndOptions(undefined, queryParams);
		try {
			const res = await this.requestHandler.doHTTPRequest(url, RequestMethods.POST, options, data);
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