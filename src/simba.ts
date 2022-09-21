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
			const res = await this.requestHandler.doGetRequest(url, options);
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

	public async fund(
		blockchain: string,
		address: string,
		amount: string | number,
	): Promise<AxiosResponse<any>> {
		const params = {
			blockchain,
			address,
			amount,
		};
		SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/user/account/${blockchain}/fund/`);
		const data = {
			address,
			amount,
		};
    	const options = await this.requestHandler.getAuthAndOptions();
    	try {
			const res = await this.requestHandler.doPostRequest(url, options, data);
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
	
	public async balance(
		blockchain: string,
		address: string,
	): Promise<AxiosResponse<any>> {
		const params = {
			blockchain,
			address,
		};
		SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/user/account/${blockchain}/balance/${address}/`);
    	const options = await this.requestHandler.getAuthAndOptions();
    	try {
			const res = await this.requestHandler.doGetRequest(url, options);
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

	public async adminSetWallet(
		userID: string,
		blockchain: string,
		pub: string,
		priv: string,
	): Promise<AxiosResponse<any>> {
		const params = {
			userID,
			blockchain,
			pub,
			priv
		};
		SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/v2/admin/users/${userID}/wallet/set/`);
		const data = {
			blockchain,
			identities: [{
				pub,
				priv,
			}]
		};
    	const options = await this.requestHandler.getAuthAndOptions();
    	try {
			const res = await this.requestHandler.doPostRequest(url, options, data);
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

	public async getWallet(
	): Promise<AxiosResponse<any>> {
		const params = {};
		SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/user/wallet/set/`);
    	const options = await this.requestHandler.getAuthAndOptions();
    	try {
			const res = await this.requestHandler.doGetRequest(url, options);
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

	public async createOrg(
		name: string,
		display: string,
	): Promise<AxiosResponse<any>> {
		const params = {
			name,
			display,
		};
		SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/v2/organisations/`);
		const data = {
			name,
			display_name: display,
		};
    	const options = await this.requestHandler.getAuthAndOptions();
    	try {
			const res = await this.requestHandler.doPostRequest(url, options, data);
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

	public async createApp(
		org: string,
		name: string,
		display: string,
		force: string,
	): Promise<AxiosResponse<any> | void> {
		const params = {
			org,
			name,
			display,
			force,
		};
		SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/v2/organisations/${org}/applications/${name}/`);
    	const options = await this.requestHandler.getAuthAndOptions();
		try {
			await this.requestHandler.doGetRequest(url, options);
		} catch (error) {
			if (axios.isAxiosError(error) && error.response && error.response.status === 404) {
				const data = {
					name,
					display_name: display,
				};
				try {
					const res = await this.requestHandler.doPostRequest(url, options, data);
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
	
	public async getApplications(): Promise<AxiosResponse<any>> {
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/v2/apps/`)
    	const options = await this.requestHandler.getAuthAndOptions();
    	try {
			const res = await this.requestHandler.doGetRequest(url, options);
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
	
	public async getApplication(
		appName: string,
    	queryParams?: Record<any, any>
  	): Promise<AxiosResponse<any> | void> {
		const params = {
			appName,
			queryParams,
		};
		SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/v2/apps/${appName}/`);
    	const options = await this.requestHandler.getAuthAndOptions(undefined, queryParams);
		try {
			const res = await this.requestHandler.doGetRequest(url, options);
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

	public async getApplicationTransactions(
    	appName: string,
    	queryParams?: Record<any, any>
	): Promise<AxiosResponse<any> | void> {
		const params = {
			appName,
			queryParams,
		};
		SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/v2/apps/${appName}/transactions/`);
		const options = await this.requestHandler.getAuthAndOptions(undefined, queryParams);
		try {
			const res = await this.requestHandler.doGetRequest(url, options);
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
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/v2/apps/${appName}/contract/${contractName}/`);
		const options = await this.requestHandler.getAuthAndOptions(undefined, queryParams);
		try {
			const res = await this.requestHandler.doGetRequest(url, options);
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

	public async getContractTranssactions(
    	appName: string,
    	contractName: string,
    	queryParams?: Record<any, any>
  	): Promise<AxiosResponse<any> | void> {
		const params = {
			appName,
			contractName,
			queryParams,
		}
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/v2/apps/${appName}/contract/${contractName}/transactions/`);
		const options = await this.requestHandler.getAuthAndOptions(undefined, queryParams);
		try {
			const res = await this.requestHandler.doGetRequest(url, options);
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

	public async getContracts(
		appName: string,
		queryParams?: Record<any, any>
	): Promise<AxiosResponse<any> | void> {
		const params = {
			appName,
			queryParams,
		};
		SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/v2/apps/${appName}/contracts/`);
		const options = await this.requestHandler.getAuthAndOptions(undefined, queryParams);
		try {
			const res = await this.requestHandler.doGetRequest(url, options);
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
	): Promise<AxiosResponse<any> | void> {
		const params = {
			appName,
			contractName,
			bundleHash,
		};
		SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/v2/apps/${appName}/validate/${contractName}/${bundleHash}/`);
		const options = await this.requestHandler.getAuthAndOptions();
		try {
			const res = await this.requestHandler.doGetRequest(url, options);
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
		downloadLocation: string,
	): Promise<AxiosResponse<any> | void> {
		const params = {
			appName,
			contractName,
			bundleHash,
			downloadLocation,
		};
		SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/v2/apps/${appName}/contract/${contractName}/bundle/${bundleHash}/`);
		const options = await this.requestHandler.getAuthAndOptions();
		try {
			const res = await this.requestHandler.doGetRequest(url, options);
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
		downloadLocation: string,
	): Promise<AxiosResponse<any> | void> {
		const params = {
			appName,
			contractName,
			bundleHash,
			fileName,
			downloadLocation,
		};
		SimbaConfig.log.debug(`:: SIMBA : ENTER : ${JSON.stringify(params)}`);
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/v2/apps/${appName}/contract/${contractName}/bundle/${bundleHash}/filename/${fileName}/`);
		const options = await this.requestHandler.getAuthAndOptions();
		try {
			const res = await this.requestHandler.doGetRequest(url, options);
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
	): Promise<AxiosResponse<any> | void> {
		const params = {
			appName,
			contractName,
			bundleHash,
		};
		SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/v2/apps/${appName}/contract/${contractName}/bundle/${bundleHash}/manifest/`);
		const options = await this.requestHandler.getAuthAndOptions();
		try {
			const res = await this.requestHandler.doGetRequest(url, options);
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

	public async getContractInfo(
		appName: string,
		contractName: string,
	): Promise<AxiosResponse<any> | void> {
		const params = {
			appName,
			contractName,
		};
		SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/v2/apps/${appName}/contract/${contractName}/info/`);
		const options = await this.requestHandler.getAuthAndOptions();
		try {
			const res = await this.requestHandler.doGetRequest(url, options);
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

	public async getEventsByContract(
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
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/v2/apps/${appName}/contract/${contractName}/events/${eventName}/`);
		const options = await this.requestHandler.getAuthAndOptions(undefined, queryParams);
		try {
			const res = await this.requestHandler.doGetRequest(url, options);
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
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/v2/apps/${appName}/contract/${contractName}/receipt/${receiptHash}/`);
		const options = await this.requestHandler.getAuthAndOptions(undefined, queryParams);
		try {
			const res = await this.requestHandler.doGetRequest(url, options);
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
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/v2/apps/${appName}/contract/${contractName}/transaction/${transactionHash}/`);
		const options = await this.requestHandler.getAuthAndOptions(undefined, queryParams);
		try {
			const res = await this.requestHandler.doGetRequest(url, options);
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

	public async getTransactionsByMethod(
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
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/v2/apps/${appName}/contract/${contractName}/${methodName}/`);
		const options = await this.requestHandler.getAuthAndOptions(undefined, queryParams);
		try {
			const res = await this.requestHandler.doGetRequest(url, options);
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

	public async getTransactionsByContract(
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
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/v2/apps/${appName}/contract/${contractName}/transactions/`);
		const options = await this.requestHandler.getAuthAndOptions(undefined, queryParams);
		try {
			const res = await this.requestHandler.doGetRequest(url, options);
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
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/v2/apps/${appName}/contract/${contractName}/address/${identifier}/${methodName}/`);
		const options = await this.requestHandler.getAuthAndOptions(undefined, queryParams);
		const data = inputs;
		try {
			const res = await this.requestHandler.doPostRequest(url, options, data);
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
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/v2/apps/${appName}/contract/${contractName}/address/${identifier}/${methodName}/`);
		const options = await this.requestHandler.getAuthAndOptions(undefined, queryParams);
		try {
			const res = await this.requestHandler.doGetRequest(url, options);
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
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/v2/apps/${appName}/contract/${contractName}/asset/${identifier}/${methodName}`);
		const options = await this.requestHandler.getAuthAndOptions(undefined, queryParams);
		const data = inputs;
		try {
			const res = await this.requestHandler.doPostRequest(url, options, data);
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

	public async getContractMethods(
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
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/v2/apps/${appName}/contract/${contractName}/${methodName}/`);
		const options = await this.requestHandler.getAuthAndOptions(undefined, queryParams);
		try {
			const res = await this.requestHandler.doGetRequest(url, options);
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

	public async submitContractMethod(
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
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/v2/apps/${appName}/contract/${contractName}/${methodName}/`);
		const data = inputs;
		const options = await this.requestHandler.getAuthAndOptions(undefined, queryParams);
		try {
			const res = await this.requestHandler.doPostRequest(url, options, data);
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
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/v2/apps/${appName}/contract/${contractName}/${methodName}/`);
		const data = inputs;
		const options = await this.requestHandler.getAuthAndOptions(undefined, queryParams);
		try {
			const res = await this.requestHandler.doPostRequest(url, options, data);
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
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/v2/apps/${appName}/async/contract/${contractName}/address/${identifier}/${methodName}/`);
		const data = inputs;
		const options = await this.requestHandler.getAuthAndOptions(undefined, queryParams);
		try {
			const res = await this.requestHandler.doPostRequest(url, options, data);
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
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/v2/apps/${appName}/async/contract/${contractName}/asset/${identifier}/${methodName}`);
		const data = inputs;
		const options = await this.requestHandler.getAuthAndOptions(undefined, queryParams);
		try {
			const res = await this.requestHandler.doPostRequest(url, options, data);
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
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/v2/apps/${appName}/async/contract/${contractName}/${methodName}`);
		const data = inputs;
		const options = await this.requestHandler.getAuthAndOptions(undefined, queryParams);
		try {
			const res = await this.requestHandler.doPostRequest(url, options, data);
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
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/v2/apps/${appName}/new/${contractName}/`);
		const data = inputs;
		const options = await this.requestHandler.getAuthAndOptions(undefined, queryParams);
		try {
			const res = await this.requestHandler.doPostRequest(url, options, data);
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
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/v2/apps/${appName}/transactions/${txnId}/`);
		const data = txn;
		const options = await this.requestHandler.getAuthAndOptions(undefined, queryParams);
		try {
			const res = await this.requestHandler.doPostRequest(url, options, data);
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