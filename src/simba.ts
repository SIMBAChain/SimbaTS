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
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/apps/`)
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
		appName: string,
    	queryParams?: Record<any, any>
  	): Promise<AxiosResponse<any> | void> {
		const params = {
			appName,
			queryParams,
		};
		SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/apps/${appName}/`);
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
    	appName: string,
    	queryParams?: Record<any, any>
	): Promise<AxiosResponse<any> | void> {
		const params = {
			appName,
			queryParams,
		};
		SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/apps/${appName}/transactions/`);
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
    	appName: string,
    	contractName: string,
    	queryParams?: Record<any, any>
  	): Promise<AxiosResponse<any> | void> {
		const params = {
			appName,
			contractName,
			queryParams,
		};
		SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/apps/${appName}/contract/${contractName}/`);
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
    	appName: string,
    	contractName: string,
    	queryParams?: Record<any, any>
  	): Promise<AxiosResponse<any> | void> {
		const params = {
			appName,
			contractName,
			queryParams,
		}
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/apps/${appName}/contract/${contractName}/transactions/`);
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
		appName: string,
		queryParams?: Record<any, any>
	): Promise<AxiosResponse<any> | void> {
		const params = {
			appName,
			queryParams,
		};
		SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/apps/${appName}/contracts/`);
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
		appName: string,
		contractName: string,
		bundleHash: string,
		queryParams?: Record<any, any>
	): Promise<AxiosResponse<any> | void> {
		const params = {
			appName,
			contractName,
			bundleHash,
			queryParams,
		};
		SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/apps/${appName}/validate/${contractName}/${bundleHash}/`);
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
		appName: string,
		contractName: string,
		bundleHash: string,
		queryParams?: Record<any, any>
	): Promise<AxiosResponse<any> | void> {
		const params = {
			appName,
			contractName,
			bundleHash,
			queryParams,
		};
		SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/apps/${appName}/contract/${contractName}/bundle/${bundleHash}/`);
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
		appName: string,
		contractName: string,
		bundleHash: string,
		fileName: string,
		queryParams?: Record<any, any>
	): Promise<AxiosResponse<any> | void> {
		const params = {
			appName,
			contractName,
			bundleHash,
			fileName,
			queryParams,
		};
		SimbaConfig.log.debug(`:: SIMBA : ENTER : ${JSON.stringify(params)}`);
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/apps/${appName}/contract/${contractName}/bundle/${bundleHash}/filename/${fileName}/`);
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
		appName: string,
		contractName: string,
		bundleHash: string,
		queryParams?: Record<any, any>
	): Promise<AxiosResponse<any> | void> {
		const params = {
			appName,
			contractName,
			bundleHash,
			queryParams,
		};
		SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/apps/${appName}/contract/${contractName}/bundle/${bundleHash}/manifest/`);
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
		appName: string,
		contractName: string,
		queryParams?: Record<any, any>
	): Promise<AxiosResponse<any> | void> {
		const params = {
			appName,
			contractName,
			queryParams,
		};
		SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/apps/${appName}/contract/${contractName}/info/`);
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
		appName: string,
		contractName: string,
		contractId: string,
		queryParams?: Record<any, any>
	): Promise<AxiosResponse<any> | void> {
		const params = {
			appName,
			contractName,
			contractId,
			queryParams,
		};
		SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/apps/${appName}/contract/${contractName}/contracts/${contractId}/`);
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
		appName: string,
		contractName: string,
		queryParams?: Record<any, any>
	): Promise<AxiosResponse<any> | void> {
		const params = {
			appName,
			contractName,
			queryParams,
		};
		SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/apps/${appName}/contract/${contractName}/contracts/`);
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
		appName: string,
		contractName: string,
		eventName: string,
		queryParams?: Record<any, any>
	): Promise<AxiosResponse<any> | void> {
		const params = {
			appName,
			contractName,
			eventName,
			queryParams,
		};
		SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/apps/${appName}/contract/${contractName}/events/${eventName}/`);
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
		appName: string,
		contractName: string,
		receiptHash: string,
		queryParams?: Record<any, any>,
	): Promise<AxiosResponse<any> | void> {
		const params = {
			appName,
			contractName,
			receiptHash,
			queryParams,
		};
		SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/apps/${appName}/contract/${contractName}/receipt/${receiptHash}/`);
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

	public async getTransaction(
		appName: string,
		contractName: string,
		transactionHash: string,
		queryParams?: Record<any, any>
	): Promise<AxiosResponse<any> | void> {
		const params = {
			appName,
			contractName,
			transactionHash,
			queryParams,
		};
		SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/apps/${appName}/contract/${contractName}/transaction/${transactionHash}/`);
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
		appName: string,
		contractName: string,
		identifier: string,
		methodName: string,
		inputs: Record<any, any>,
		queryParams?: Record<any, any>
	): Promise<AxiosResponse<any> | void> {
		const params = {
			appName,
			contractName,
			identifier,
			methodName,
			inputs,
			queryParams,
		};
		SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/apps/${appName}/contract/${contractName}/address/${identifier}/${methodName}/`);
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
		appName: string,
		contractName: string,
		identifier: string,
		methodName: string,
		queryParams?: Record<any, any>
	): Promise<AxiosResponse<any> | void> {
		const params = {
			appName,
			contractName,
			identifier,
			methodName,
			queryParams,
		};
		SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/apps/${appName}/contract/${contractName}/address/${identifier}/${methodName}/`);
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
		appName: string,
		contractName: string,
		identifier: string,
		methodName: string,
		inputs: Record<any, any>,
		queryParams?: Record<any, any>
	): Promise<AxiosResponse<any> | void> {
		const params = {
			appName,
			contractName,
			identifier,
			methodName,
			inputs,
			queryParams,
		};
		SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/apps/${appName}/contract/${contractName}/asset/${identifier}/${methodName}`);
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
		appName: string,
		contractName: string,
		methodName: string,
		queryParams?: Record<any, any>
	): Promise<AxiosResponse<any> | void> {
		const params = {
			appName,
			contractName,
			methodName,
			queryParams,
		};
		SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/apps/${appName}/contract/${contractName}/${methodName}/`);
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
		appName: string,
		contractName: string,
		methodName: string,
		inputs: Record<any, any>,
		queryParams?: Record<any, any>
	): Promise<AxiosResponse<any> | void> {
		const params = {
			appName,
			contractName,
			methodName,
			inputs,
			queryParams,
		};
		SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/apps/${appName}/contract/${contractName}/${methodName}/`);
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
		appName: string,
		contractName: string,
		identifier: string,
		methodName: string,
		inputs: Record<any, any>,
		queryParams?: Record<any, any>
	): Promise<AxiosResponse<any> | void> {
		const params = {
			appName,
			contractName,
			identifier,
			methodName,
			inputs,
			queryParams,
		};
		SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/apps/${appName}/async/contract/${contractName}/address/${identifier}/${methodName}/`);
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
		appName: string,
		contractName: string,
		identifier: string,
		methodName: string,
		inputs: Record<any, any>,
		queryParams?: Record<any, any>
	): Promise<AxiosResponse<any> | void> {
		const params = {
			appName,
			contractName,
			identifier,
			methodName,
			inputs,
			queryParams,
		};
		SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/apps/${appName}/async/contract/${contractName}/asset/${identifier}/${methodName}`);
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
		appName: string,
		contractName: string,
		methodName: string,
		inputs: Record<any, any>,
		queryParams?: Record<any, any>
	): Promise<AxiosResponse<any> | void> {
		const params = {
			appName,
			contractName,
			methodName,
			inputs,
			queryParams,
		};
		SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/apps/${appName}/async/contract/${contractName}/${methodName}`);
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
		appName: string,
		contractName: string,
		inputs: Record<any, any>,
		queryParams?: Record<any, any>
	): Promise<AxiosResponse<any> | void> {
		const params = {
			appName,
			contractName,
			inputs,
			queryParams,
		};
		SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/apps/${appName}/new/${contractName}/`);
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
		appName: string,
		txnId: string,
		txn: Record<any, any>,
		queryParams?: Record<any, any>
	): Promise<AxiosResponse<any> | void> {
		const params = {
			appName,
			txnId,
			txn,
			queryParams,
		};
		SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/apps/${appName}/transactions/${txnId}/`);
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