import axios from "axios";
import {
  SimbaConfig,
} from "./config";
import {
  AxiosResponse,
} from "axios";
import {
  RequestHandler,
} from "./request_handler"
import {
  SimbaContract,
  SimbaSync,
} from "./";
import utf8 from "utf8";
import { parse } from "path";

export class Simba extends SimbaSync {
	baseApiUrl: string;
	requestHandler: RequestHandler;
	
	constructor(
		baseApiUrl: string = SimbaConfig.baseURL,
		requestHandler: RequestHandler = new RequestHandler()
	) {
		super(baseApiUrl, requestHandler);
		this.baseApiUrl = baseApiUrl;
		this.requestHandler = requestHandler;
	}

	public async whoAmI(parseDataFromResponse: boolean = true): Promise<AxiosResponse<any> | Record<any, any>> {
		const params = {
			parseDataFromResponse,
		}
		SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
    	const url = this.requestHandler.buildURL(this.baseApiUrl, "/user/whoami/");
    	const options = await this.requestHandler.getAuthAndOptions();
    	try {
			const res: Record<any, any> = await this.requestHandler.doGetRequest(url, options, parseDataFromResponse);
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
		parseDataFromResponse: boolean = true,
	): Promise<AxiosResponse<any> | Record<any, any>> {
		const params = {
			blockchain,
			address,
			amount,
			parseDataFromResponse,
		};
		SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/user/account/${blockchain}/fund/`);
		const data = {
			address,
			amount,
		};
    	const options = await this.requestHandler.getAuthAndOptions();
    	try {
			const res = await this.requestHandler.doPostRequest(url, options, data, parseDataFromResponse);
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
		parseDataFromResponse: boolean = true,
	): Promise<AxiosResponse<any> | Record<any, any>> {
		const params = {
			blockchain,
			address,
			parseDataFromResponse,
		};
		SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/user/account/${blockchain}/balance/${address}/`);
    	const options = await this.requestHandler.getAuthAndOptions();
    	try {
			const res = await this.requestHandler.doGetRequest(url, options, parseDataFromResponse);
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
		parseDataFromResponse: boolean = true,
	): Promise<AxiosResponse<any> | Record<any, any>> {
		const params = {
			userID,
			blockchain,
			pub,
			priv,
			parseDataFromResponse,
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
			const res = await this.requestHandler.doPostRequest(url, options, data, parseDataFromResponse);
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

	public async getWallet(parseDataFromResponse: boolean = true,): Promise<AxiosResponse<any> | Record<any, any>> {
		const params = {
			parseDataFromResponse,
		};
		SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/user/wallet/set/`);
    	const options = await this.requestHandler.getAuthAndOptions();
    	try {
			const res = await this.requestHandler.doGetRequest(url, options, parseDataFromResponse);
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
		parseDataFromResponse: boolean = true,
	): Promise<AxiosResponse<any> | Record<any, any>> {
		const params = {
			name,
			display,
			parseDataFromResponse,
		};
		SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/v2/organisations/`);
		const data = {
			name,
			display_name: display,
		};
    	const options = await this.requestHandler.getAuthAndOptions();
    	try {
			const res = await this.requestHandler.doPostRequest(url, options, data, parseDataFromResponse);
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
		orgName: string,
		name: string,
		display: string,
		force: string,
		parseDataFromResponse: boolean = true,
	): Promise<AxiosResponse<any> | Record<any, any> | void> {
		const params = {
			orgName,
			name,
			display,
			force,
			parseDataFromResponse,
		};
		SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/v2/organisations/${orgName}/applications/${name}/`);
    	const options = await this.requestHandler.getAuthAndOptions();
		try {
			await this.requestHandler.doGetRequest(url, options, parseDataFromResponse);
		} catch (error) {
			if (axios.isAxiosError(error) && error.response && error.response.status === 404) {
				const data = {
					name,
					display_name: display,
				};
				try {
					const res = await this.requestHandler.doPostRequest(url, options, data, parseDataFromResponse);
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
		contractName: string,
		parseDataFromResponse: boolean = true,
	): SimbaContract {
		const params = {
			appName,
			contractName,
			parseDataFromResponse,
		};
		SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
		const simbaContract = new SimbaContract(this.baseApiUrl, appName, contractName);
		SimbaConfig.log.debug(`:: SIMBA : EXIT :`);
		return simbaContract;
	}
	
	public async getApplications(
		parseDataFromResponse: boolean = true,
	): Promise<AxiosResponse<any> | Record<any, any>> {
		const params = {
			parseDataFromResponse,
		}
		SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/v2/apps/`)
    	const options = await this.requestHandler.getAuthAndOptions();
    	try {
			const res = await this.requestHandler.doGetRequest(url, options, parseDataFromResponse);
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
    	queryParams?: Record<any, any>,
		parseDataFromResponse: boolean = true,
  	): Promise<AxiosResponse<any> | Record<any, any>> {
		const params = {
			appName,
			queryParams,
			parseDataFromResponse,
		};
		SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/v2/apps/${appName}/`);
    	const options = await this.requestHandler.getAuthAndOptions(undefined, queryParams);
		try {
			const res: Record<any, any> = await this.requestHandler.doGetRequest(url, options, parseDataFromResponse);
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
    	queryParams?: Record<any, any>,
		parseDataFromResponse: boolean = true,
	): Promise<AxiosResponse<any> | Record<any, any>> {
		const params = {
			appName,
			queryParams,
			parseDataFromResponse,
		};
		SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/v2/apps/${appName}/transactions/`);
		const options = await this.requestHandler.getAuthAndOptions(undefined, queryParams);
		try {
			const res: Record<any, any> = await this.requestHandler.doGetRequest(url, options, parseDataFromResponse);
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
    	queryParams?: Record<any, any>,
		parseDataFromResponse: boolean = true,
  	): Promise<AxiosResponse<any> | Record<any, any>> {
		const params = {
			appName,
			contractName,
			queryParams,
			parseDataFromResponse,
		};
		SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/v2/apps/${appName}/contract/${contractName}/`);
		const options = await this.requestHandler.getAuthAndOptions(undefined, queryParams);
		try {
			const res: Record<any, any> = await this.requestHandler.doGetRequest(url, options, parseDataFromResponse);
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
    	queryParams?: Record<any, any>,
		parseDataFromResponse: boolean = true,
  	): Promise<AxiosResponse<any> | Record<any, any>> {
		const params = {
			appName,
			contractName,
			queryParams,
			parseDataFromResponse,
		}
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/v2/apps/${appName}/contract/${contractName}/transactions/`);
		const options = await this.requestHandler.getAuthAndOptions(undefined, queryParams);
		try {
			const res: Record<any, any> = await this.requestHandler.doGetRequest(url, options, parseDataFromResponse);
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
		queryParams?: Record<any, any>,
		parseDataFromResponse: boolean = true,
	): Promise<AxiosResponse<any> | Record<any, any>> {
		const params = {
			appName,
			queryParams,
			parseDataFromResponse,
		};
		SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/v2/apps/${appName}/contracts/`);
		const options = await this.requestHandler.getAuthAndOptions(undefined, queryParams);
		try {
			const res: Record<any, any> = await this.requestHandler.doGetRequest(url, options, parseDataFromResponse);
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
		parseDataFromResponse: boolean = true,
	): Promise<AxiosResponse<any> | Record<any, any>> {
		const params = {
			appName,
			contractName,
			bundleHash,
			parseDataFromResponse,
		};
		SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/v2/apps/${appName}/validate/${contractName}/${bundleHash}/`);
		const options = await this.requestHandler.getAuthAndOptions();
		try {
			const res: Record<any, any> = await this.requestHandler.doGetRequest(url, options, parseDataFromResponse);
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
		parseDataFromResponse: boolean = true,
	): Promise<AxiosResponse<any> | Record<any, any>> {
		const params = {
			appName,
			contractName,
			bundleHash,
			downloadLocation,
			parseDataFromResponse,
		};
		SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/v2/apps/${appName}/contract/${contractName}/bundle/${bundleHash}/`);
		const options = await this.requestHandler.getAuthAndOptions();
		try {
			const res: Record<any, any> = await this.requestHandler.doGetRequest(url, options, parseDataFromResponse);
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
		parseDataFromResponse: boolean = true,
	): Promise<AxiosResponse<any> | Record<any, any>> {
		const params = {
			appName,
			contractName,
			bundleHash,
			fileName,
			downloadLocation,
			parseDataFromResponse,
		};
		SimbaConfig.log.debug(`:: SIMBA : ENTER : ${JSON.stringify(params)}`);
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/v2/apps/${appName}/contract/${contractName}/bundle/${bundleHash}/filename/${fileName}/`);
		const options = await this.requestHandler.getAuthAndOptions();
		try {
			const res: Record<any, any> = await this.requestHandler.doGetRequest(url, options, parseDataFromResponse);
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
		parseDataFromResponse: boolean = true,
	): Promise<AxiosResponse<any> | Record<any, any>> {
		const params = {
			appName,
			contractName,
			bundleHash,
			parseDataFromResponse,
		};
		SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/v2/apps/${appName}/contract/${contractName}/bundle/${bundleHash}/manifest/`);
		const options = await this.requestHandler.getAuthAndOptions();
		try {
			const res: Record<any, any> = await this.requestHandler.doGetRequest(url, options, parseDataFromResponse);
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
		parseDataFromResponse: boolean = true,
	): Promise<AxiosResponse<any> | Record<any, any>> {
		const params = {
			appName,
			contractName,
			parseDataFromResponse,
		};
		SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/v2/apps/${appName}/contract/${contractName}/info/`);
		const options = await this.requestHandler.getAuthAndOptions();
		try {
			const res: Record<any, any> = await this.requestHandler.doGetRequest(url, options, parseDataFromResponse);
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
		queryParams?: Record<any, any>,
		parseDataFromResponse: boolean = true,
	): Promise<AxiosResponse<any> | Record<any, any>> {
		const params = {
			appName,
			contractName,
			eventName,
			queryParams,
			parseDataFromResponse,
		};
		SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/v2/apps/${appName}/contract/${contractName}/events/${eventName}/`);
		const options = await this.requestHandler.getAuthAndOptions(undefined, queryParams);
		try {
			const res: Record<any, any> = await this.requestHandler.doGetRequest(url, options, parseDataFromResponse);
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
		parseDataFromResponse: boolean = true,
	): Promise<AxiosResponse<any> | Record<any, any>> {
		const params = {
			appName,
			contractName,
			receiptHash,
			queryParams,
			parseDataFromResponse,
		};
		SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/v2/apps/${appName}/contract/${contractName}/receipt/${receiptHash}/`);
		const options = await this.requestHandler.getAuthAndOptions(undefined, queryParams);
		try {
			const res: Record<any, any> = await this.requestHandler.doGetRequest(url, options, parseDataFromResponse);
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
		queryParams?: Record<any, any>,
		parseDataFromResponse: boolean = true,
	): Promise<AxiosResponse<any> | Record<any, any>> {
		const params = {
			appName,
			contractName,
			transactionHash,
			queryParams,
			parseDataFromResponse,
		};
		SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/v2/apps/${appName}/contract/${contractName}/transaction/${transactionHash}/`);
		const options = await this.requestHandler.getAuthAndOptions(undefined, queryParams);
		try {
			const res: Record<any, any> = await this.requestHandler.doGetRequest(url, options, parseDataFromResponse);
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
		queryParams?: Record<any, any>,
		parseDataFromResponse: boolean = true,
	): Promise<AxiosResponse<any> | Record<any, any>> {
		const params = {
			appName,
			contractName,
			methodName,
			queryParams,
			parseDataFromResponse,
		};
		SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/v2/apps/${appName}/contract/${contractName}/${methodName}/`);
		const options = await this.requestHandler.getAuthAndOptions(undefined, queryParams);
		try {
			const res: Record<any, any> = await this.requestHandler.doGetRequest(url, options, parseDataFromResponse);
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
		queryParams?: Record<any, any>,
		parseDataFromResponse: boolean = true,
	): Promise<AxiosResponse<any> | Record<any, any>> {
		const params = {
			appName,
			contractName,
			queryParams,
			parseDataFromResponse,
		};
		SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/v2/apps/${appName}/contract/${contractName}/transactions/`);
		const options = await this.requestHandler.getAuthAndOptions(undefined, queryParams);
		try {
			const res: Record<any, any> = await this.requestHandler.doGetRequest(url, options, parseDataFromResponse);
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

	public async callGetterByAddress(
		appName: string,
		contractName: string,
		identifier: string,
		methodName: string,
		queryParams?: Record<any, any>,
		parseDataFromResponse: boolean = true,
	): Promise<AxiosResponse<any> | Record<any, any>> {
		const params = {
			appName,
			contractName,
			identifier,
			methodName,
			queryParams,
			parseDataFromResponse,
		};
		SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/v2/apps/${appName}/contract/${contractName}/address/${identifier}/${methodName}/`);
		const options = await this.requestHandler.getAuthAndOptions(undefined, queryParams);
		try {
			const res: Record<any, any> = await this.requestHandler.doGetRequest(url, options, parseDataFromResponse);
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

	public async getContractMethods(
		appName: string,
		contractName: string,
		methodName: string,
		queryParams?: Record<any, any>,
		parseDataFromResponse: boolean = true,
	): Promise<AxiosResponse<any> | Record<any, any>> {
		const params = {
			appName,
			contractName,
			methodName,
			queryParams,
			parseDataFromResponse,
		};
		SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/v2/apps/${appName}/contract/${contractName}/${methodName}/`);
		const options = await this.requestHandler.getAuthAndOptions(undefined, queryParams);
		try {
			const res: Record<any, any> = await this.requestHandler.doGetRequest(url, options, parseDataFromResponse);
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
        filePaths?: Array<any>,
		parseDataFromResponse: boolean = true,
    ): Promise<AxiosResponse<any> | Record<any, any>> {
        const params = {
			appName,
			contractName,
            methodName,
            inputs,
            filePaths,
			parseDataFromResponse,
        };
        SimbaConfig.log.debug(`:: SIMBA : ENTER : ${JSON.stringify(params)}`);
        const url = this.requestHandler.buildURL(this.baseApiUrl, `/v2/apps/${appName}/contract/${contractName}/${methodName}/`);
        const options = await this.requestHandler.getAuthAndOptions(undefined, undefined, false);
        let data = inputs;
        if (!filePaths) {
            const res: Record<any, any> = await this.requestHandler.doPostRequest(url, data, options, parseDataFromResponse);
            SimbaConfig.log.debug(`:: EXIT : res.data: ${JSON.stringify(res.data)}`);
            return res;
        }
        const formData = this.requestHandler.formDataFromFilePathsAndInputs(
			inputs,
			filePaths,
		);
        const headers = this.requestHandler.formDataHeaders(
			options,
			formData,
		);
        try {
			const res = await this.requestHandler.doPostRequestWithFormData(
				url,
				formData,
				headers,
			);
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

    public async submitContractMethodSync(
		appName: string,
		contractName: string,
        methodName: string,
        inputs: Record<any, any>,
        filePaths?: Array<any>,
		parseDataFromResponse: boolean = true,
    ): Promise<AxiosResponse<any> | Record<any, any>> {
        const params = {
			appName,
			contractName,
            methodName,
            inputs,
            filePaths,
			parseDataFromResponse,
        };
        SimbaConfig.log.debug(`:: SIMBA : ENTER : ${JSON.stringify(params)}`);
        const url = this.requestHandler.buildURL(this.baseApiUrl, `/v2/apps/${appName}/sync/contract/${contractName}/${methodName}/`);
        const options = await this.requestHandler.getAuthAndOptions(undefined, undefined, false);
        let data = inputs;
        if (!filePaths) {
            const res: Record<any, any> = await this.requestHandler.doPostRequest(url, data, options, parseDataFromResponse);
            SimbaConfig.log.debug(`:: EXIT : res.data: ${JSON.stringify(res.data)}`);
            return res;
        }
        const formData = this.requestHandler.formDataFromFilePathsAndInputs(
			inputs,
			filePaths,
		);
        const headers = this.requestHandler.formDataHeaders(
			options,
			formData,
		);
        try {
			const res = await this.requestHandler.doPostRequestWithFormData(
				url,
				formData,
				headers,
				parseDataFromResponse,
			);
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

	// public async callContractMethod(
	// 	appName: string,
	// 	contractName: string,
	// 	methodName: string,
	// 	inputs: Record<any, any>,
	// 	queryParams?: Record<any, any>
	// ): Promise<AxiosResponse<any> | Record<any, any>> {
	// 	const params = {
	// 		appName,
	// 		contractName,
	// 		methodName,
	// 		inputs,
	// 		queryParams,
	// 	};
	// 	SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
	// 	const url = this.requestHandler.buildURL(this.baseApiUrl, `/v2/apps/${appName}/contract/${contractName}/${methodName}/`);
	// 	const data = inputs;
	// 	const options = await this.requestHandler.getAuthAndOptions(undefined, queryParams);
	// 	try {
	// 		const res = await this.requestHandler.doPostRequest(url, options, data, parseDataFromResponse);
	// 		return res;
	// 	} catch (error) {
	// 		if (axios.isAxiosError(error) && error.response) {
	// 			SimbaConfig.log.error(`${JSON.stringify(error.response.data)}`);
	// 		} else {
	// 			SimbaConfig.log.error(`${JSON.stringify(error)}`);
	// 		}
	// 		SimbaConfig.log.debug(`:: SIMBA : EXIT :`);
	// 		throw(error);
	// 	}
	// }

	public async submitSignedTransaction(
		appName: string,
		txnId: string,
		txn: Record<any, any>,
		parseDataFromResponse: boolean = true,
	): Promise<AxiosResponse<any> | Record<any, any>> {
		const params = {
			appName,
			txnId,
			txn,
			parseDataFromResponse,
		};
		SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/v2/apps/${appName}/transactions/${txnId}/`);
		const data = {
			transaction: txn,
		};
		const options = await this.requestHandler.getAuthAndOptions();
		try {
			const res = await this.requestHandler.doPostRequest(url, options, data, parseDataFromResponse);
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

	public async saveDesign(
		orgName: string,
		name: string,
		code: string,
		designID?: string,
		targetContract?: string,
		libraries?: Record<any, any>,
		encode: boolean = true,
		model?: string,
		binaryTargets?: Array<string>,
		parseDataFromResponse: boolean = true,
	): Promise<AxiosResponse<any> | Record<any, any>> {
		const params = {
			orgName,
			name,
			designID,
			code,
			targetContract,
			libraries,
			encode,
			model,
			binaryTargets,
			parseDataFromResponse,
		};
		SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
		const putURL = `/v2/organisations/${orgName}/contract_designs/${designID}/`;
		const postURL = `/v2/organisations/${orgName}/contract_designs/`;
		const options = await this.requestHandler.getAuthAndOptions();
		if (encode) {
			const utf8Code = utf8.encode(code);
			code = Buffer.from(utf8Code).toString('base64');
		}
		const data: Record<any, any> = {
			name,
			code,
			language: "solidity",
		};
		if (targetContract) {
			data.target_contract = targetContract;
		}
		if (libraries) {
			data.libraries = libraries;
		}
		if (model) {
			data.model = model;
		}
		if (binaryTargets) {
			data.binary_targets = binaryTargets;
		}
		let res: AxiosResponse<any> | Record<any, any>;
		try {
			if (designID) {
				const url = this.requestHandler.buildURL(this.baseApiUrl, putURL);
				res = this.requestHandler.doPutRequest(
					url,
					options,
					data,
					parseDataFromResponse,
				);
			} else {
				const url = this.requestHandler.buildURL(this.baseApiUrl, postURL);
				res = this.requestHandler.doPostRequest(
					url,
					options,
					data,
					parseDataFromResponse,
				);
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

	public async waitForDeployment(
		orgName: string,
		uid: string,
		totalTime: number = 0,
		maxTime: number = 480,
		parseDataFromResponse: boolean = true,
	): Promise<AxiosResponse<any> | Record<any, any>> {
		const params = {
			orgName,
			uid,
			totalTime,
			maxTime,
			parseDataFromResponse,
        };
        SimbaConfig.log.debug(`:: SIMBA : ENTER : ${JSON.stringify(params)}`);
        const url = this.requestHandler.buildURL(this.baseApiUrl, `/v2/organisations/${orgName}/deployments/${uid}/`);
		const options = await this.requestHandler.getAuthAndOptions();
		try {
			// parseDataFromResponse NEEDS to be true here, for res.state to exist
			const res: Record<any, any> = await this.requestHandler.doGetRequest(url, options, parseDataFromResponse);
			const state = res.state;
			if (state === "COMPLETED") {
				SimbaConfig.log.debug(`:: SIMBA : EXIT : res : ${res}`);
				return res;
			} else {
				if (totalTime > maxTime) {
					const message = `waited too long`;
					SimbaConfig.log.error(`:: SIMBA : EXIT : ${message}`);
					throw(message);
				}
				await new Promise(resolve => setTimeout(resolve, 2000));
				totalTime +=2;
				return await this.waitForDeployment(
					orgName,
					uid,
					totalTime,
					maxTime,
					parseDataFromResponse,
				);
			}
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

	public async deployDesign(
		orgName: string,
		appName: string,
		apiName: string,
		designID: string,
		blockchain: string,
		storage: string = "no_storage",
		displayName?: string,
		args?: Record<any, any>,
		parseDataFromResponse: boolean = true,
	): Promise<AxiosResponse<any> | Record<any, any>> {
		const params = {
			orgName,
			appName,
			apiName,
			designID,
			blockchain,
			storage,
			displayName,
			args,
			parseDataFromResponse,
		};
		SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/v2/organisations/${orgName}/contract_designs/${designID}/deploy/`);
		const options = await this.requestHandler.getAuthAndOptions();

		const data: Record<any, any> = {
			blockchain,
			storage,
			api_name: apiName,
			app_name: appName,
			singleton: true,
		};
		if (displayName) {
			data.display_name = displayName;
		}
		if (args) {
			data.args = args;
		}
		try {
			const res = await this.requestHandler.doPostRequest(url, options, data, parseDataFromResponse);
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

	public async deployArtifact(
		orgName: string,
		appName: string,
		apiName: string,
		artifactID: string,
		blockchain: string,
		storage: string = "no_storage",
		displayName?: string,
		args?: Record<any, any>,
		parseDataFromResponse: boolean = true,
	): Promise<AxiosResponse<any> | Record<any, any>> {
		const params = {
			orgName,
			appName,
			apiName,
			artifactID,
			blockchain,
			storage,
			displayName,
			args,
			parseDataFromResponse,
		};
		SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/v2/organisations/${orgName}/deployments/`);
		const options = await this.requestHandler.getAuthAndOptions();

		const data: Record<any, any> = {
			blockchain,
			storage,
			api_name: apiName,
			artifact_id: artifactID,
			app_name: appName,
			singleton: true,
		};
		if (displayName) {
			data.display_name = displayName;
		}
		if (args) {
			data.args = args;
		}
		try {
			const res = await this.requestHandler.doPostRequest(url, options, data, parseDataFromResponse);
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

	// // implement TS version of this python code tomorrow

	public async waitForDeployDesign(
		orgName: string,
		appName: string,
		designID: string,
		apiName: string,
		blockchain: string,
		storage: string = "no_storage",
		displayName?: string,
		args?: Record<any, any>,
		parseDataFromResponse: boolean = true,
	): Promise<AxiosResponse<any> | Array<any>> {
		const params = {
			orgName,
			appName,
			designID,
			apiName,
			blockchain,
			storage,
			displayName,
			args,
			// parseDataFromResponse must === true here
			parseDataFromResponse,
		}
		SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
		const res: Record<any, any> = await this.deployDesign(
			orgName,
			appName,
			apiName,
			designID,
			blockchain,
			storage,
			displayName,
			args,
			parseDataFromResponse,
		);
		const deploymentID = res.deployment_id;
		let address, contractID;
		try {
			const deployed = await this.waitForDeployment(orgName, deploymentID);
			address = this.getAddress(deployed);
			contractID = this.getDeployedArtifactID(deployed);
			const ret = [address, contractID];
			SimbaConfig.log.debug(`:: SIMBA : EXIT : ret : ${JSON.stringify(ret)}`);
			return ret;
		} catch (error) {
			const message = `failed to wait for deployment : ${error}`;
			SimbaConfig.log.error(`:: SIMBA : EXIT : ${message}`);
			throw(message);
		}
	}

	public async waitForDeployArtifact(
		orgName: string,
		appName: string,
		artifactID: string,
		apiName: string,
		blockchain: string,
		storage: string = "no_storage",
		displayName?: string,
		args?: Record<any, any>,
		parseDataFromResponse: boolean = true,
	): Promise<AxiosResponse<any> | Array<any>> {
		const params = {
			orgName,
			appName,
			artifactID,
			apiName,
			blockchain,
			storage,
			displayName,
			args,
			// parseDataFromResponse must === true here
			parseDataFromResponse,
		}
		SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
		const res: Record<any, any> = await this.deployArtifact(
			orgName,
			appName,
			apiName,
			artifactID,
			blockchain,
			storage,
			displayName,
			args,
			parseDataFromResponse,
		);
		const deploymentID = res.deployment_id;
		let address, contractID;
		try {
			const deployed = await this.waitForDeployment(orgName, deploymentID);
			address = this.getAddress(deployed);
			contractID = this.getDeployedArtifactID(deployed);
			const ret = [address, contractID];
			SimbaConfig.log.debug(`:: SIMBA : EXIT : ret : ${JSON.stringify(ret)}`);
			return ret;
		} catch (error) {
			const message = `failed to wait for deployment : ${error}`;
			SimbaConfig.log.error(`:: SIMBA : EXIT : ${message}`);
			throw(message);
		}
	}

	public async getDesigns(
		orgName: string,
		parseDataFromResponse: boolean = true,
	): Promise<AxiosResponse<any> | Record<any, any>> {
		const params = {
			orgName,
			parseDataFromResponse,
        };
        SimbaConfig.log.debug(`:: SIMBA : ENTER : ${JSON.stringify(params)}`);
        const url = this.requestHandler.buildURL(this.baseApiUrl, `/v2/organisations/${orgName}/contract_designs/`);
		const options = await this.requestHandler.getAuthAndOptions();
		try {
			// parseDataFromResponse NEEDS to be true here, for res.state to exist
			const res: Record<any, any> = await this.requestHandler.doGetRequest(url, options, parseDataFromResponse);
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

	public async getBlockchains(
		orgName: string,
		parseDataFromResponse: boolean = true,
	): Promise<AxiosResponse<any> | Record<any, any>> {
		const params = {
			orgName,
			parseDataFromResponse,
        };
        SimbaConfig.log.debug(`:: SIMBA : ENTER : ${JSON.stringify(params)}`);
        const url = this.requestHandler.buildURL(this.baseApiUrl, `/v2/organisations/${orgName}/blockchains/`);
		const options = await this.requestHandler.getAuthAndOptions();
		try {
			const res: Record<any, any> = await this.requestHandler.doGetRequest(url, options, parseDataFromResponse);
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

	public async getStorages(
		orgName: string,
		parseDataFromResponse: boolean = true,
	): Promise<AxiosResponse<any> | Record<any, any>> {
		const params = {
			orgName,
			parseDataFromResponse,
        };
        SimbaConfig.log.debug(`:: SIMBA : ENTER : ${JSON.stringify(params)}`);
        const url = this.requestHandler.buildURL(this.baseApiUrl, `/v2/organisations/${orgName}/storages/`);
		const options = await this.requestHandler.getAuthAndOptions();
		try {
			const res: Record<any, any> = await this.requestHandler.doGetRequest(url, options, parseDataFromResponse);
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

	public async getArtifact(
		orgName: string,
		artifactID: string,
		parseDataFromResponse: boolean = true,
	): Promise<AxiosResponse<any> | Record<any, any>> {
		const params = {
			orgName,
			artifactID,
			parseDataFromResponse,
        };
        SimbaConfig.log.debug(`:: SIMBA : ENTER : ${JSON.stringify(params)}`);
        const url = this.requestHandler.buildURL(this.baseApiUrl, `/v2/organisations/${orgName}/contract_artifacts/${artifactID}/`);
		const options = await this.requestHandler.getAuthAndOptions();
		try {
			const res: Record<any, any> = await this.requestHandler.doGetRequest(url, options, parseDataFromResponse);
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

	public async createArtifact(
		orgName: string,
		designID: string,
		parseDataFromResponse: boolean = true,
	): Promise<AxiosResponse<any> | Record<any, any>> {
		const params = {
			orgName,
			designID,
			parseDataFromResponse,
        };
        SimbaConfig.log.debug(`:: SIMBA : ENTER : ${JSON.stringify(params)}`);
        const url = this.requestHandler.buildURL(this.baseApiUrl, `/v2/organisations/${orgName}/contract_artifacts/`);
		const data = {
			design_id: designID,
		}
		const options = await this.requestHandler.getAuthAndOptions();
		try {
			const res: Record<any, any> = await this.requestHandler.doPostRequest(url, options, data, parseDataFromResponse);
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

	public async subscribe(
		orgName: string,
		notificationEndpoint: string,
		authType: string,
		contractAPI: string,
		txn: string,
		subscriptionType: string,
		parseDataFromResponse: boolean = true,
	): Promise<AxiosResponse<any> | Record<any, any>> {
		const params = {
			orgName,
			notificationEndpoint,
			authType,
			contractAPI,
			txn,
			subscriptionType,
			parseDataFromResponse,
		};
		SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/v2/organisations/${orgName}/subscriptions/`);
		const options = await this.requestHandler.getAuthAndOptions();
		const data = {
			endpoint: notificationEndpoint,
			txn,
			contract: contractAPI,
			auth_type: authType,
			subscription_type: subscriptionType,
		}
		try {
			const results = await this.requestHandler.doGetRequest(url, options, parseDataFromResponse) as Array<any>;
			for (let i = 0; i < results.length; i++) {
				const result: Record<any, any> = results[i];
				if (result.endpoint === notificationEndpoint &&
					result.txn === txn &&
					result.contract === contractAPI &&
					result.auth_type === authType
				) {
					SimbaConfig.log.debug(`:: SIMBA : EXIT : result : ${JSON.stringify(result)}`);
					return result;
				}
			}
			const sub = await this.requestHandler.doPostRequest(url, options, data, parseDataFromResponse);
			SimbaConfig.log.debug(`:: SIMBA : EXIT : sub : ${sub}`);
			return sub;
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