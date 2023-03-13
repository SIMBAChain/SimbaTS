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
} from "./simba_contract";
import utf8 from "utf8";
import {
	getAddress,
	getArtifactID,
} from "./utils";
import {
	FileHandler,
} from "./filehandler";

/**
 * main class for interacting with SIMBA platform
 */
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

	/**
	 * generate SimbaContract class instance
	 * @param appName 
	 * @param contractName 
	 * @returns {SimbaContract}
	 */
	public getSimbaContract(
		appName: string,
		contractName: string,
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

	/**
	 * return user information
	 * @param parseDataFromResponse 
	 * @returns {Promise<AxiosResponse<any> | Record<any, any>>}
	 */
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

	/**
	 * fund wallet
	 * @param blockchain 
	 * @param address 
	 * @param amount 
	 * @param parseDataFromResponse 
	 * @returns {Promise<AxiosResponse<any> | Record<any, any>>}
	 */
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
	
	/**
	 * get balance from wallet
	 * @param blockchain 
	 * @param address 
	 * @param parseDataFromResponse 
	 * @returns {Promise<AxiosResponse<any> | Record<any, any>>}
	 */
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

	/**
	 * set wallet - admin perms required
	 * @param userID 
	 * @param blockchain 
	 * @param pub 
	 * @param priv 
	 * @param parseDataFromResponse 
	 * @returns {Promise<AxiosResponse<any> | Record<any, any>>}
	 */
	public async adminSetWallet(
		userID: string | number,
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

	/**
	 * set wallet - no admin perms required
	 * @param blockchain 
	 * @param pub 
	 * @param priv 
	 * @param parseDataFromResponse 
	 * @returns {Promise<AxiosResponse<any> | Record<any, any>>}
	 */
	public async setWallet(
		blockchain: string,
		pub: string,
		priv: string,
		parseDataFromResponse: boolean = true,
	): Promise<AxiosResponse<any> | Record<any, any>> {
		const params = {
			blockchain,
			pub,
			priv,
			parseDataFromResponse,
		};
		SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/user/wallet/set/`);
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

	/**
	 * get wallet
	 * @param parseDataFromResponse 
	 * @returns {Promise<AxiosResponse<any> | Record<any, any>>}
	 */
	public async getWallet(parseDataFromResponse: boolean = true,): Promise<AxiosResponse<any> | Record<any, any>> {
		const params = {
			parseDataFromResponse,
		};
		SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/user/wallet/`);
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

	/**
	 * create organisation
	 * @param name 
	 * @param display 
	 * @param parseDataFromResponse 
	 * @returns {Promise<AxiosResponse<any> | Record<any, any>>}
	 */
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

	/**
	 * 
	 * @param orgName 
	 * @param appName 
	 * @param display 
	 * @param parseDataFromResponse 
	 * @returns {Promise<AxiosResponse<any> | Record<any, any> | void>}
	 */
	public async createApp(
		orgName: string,
		appName: string,
		display: string,
		parseDataFromResponse: boolean = true,
	): Promise<AxiosResponse<any> | Record<any, any> | void> {
		const params = {
			orgName,
			appName,
			display,
			parseDataFromResponse,
		};
		SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
		const getURL = this.requestHandler.buildURL(this.baseApiUrl, `/v2/organisations/${orgName}/applications/${appName}/`);
    	const postURL = this.requestHandler.buildURL(this.baseApiUrl, `/v2/organisations/${orgName}/applications/`);
		const options = await this.requestHandler.getAuthAndOptions();
		try {
			const res = await this.requestHandler.doGetRequest(getURL, options, parseDataFromResponse);
		} catch (error) {
			if (axios.isAxiosError(error) && error.response && error.response.status === 404) {
				const data = {
					name: appName,
					display_name: display,
				};
				try {
					const res = await this.requestHandler.doPostRequest(postURL, options, data, parseDataFromResponse);
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
		const message = `app ${appName} for org ${orgName} already exists`;
		SimbaConfig.log.error(`${message}`);
		throw new Error(message);
	}
	
	/**
	 * get application
	 * @param orgName 
	 * @param appName 
	 * @param parseDataFromResponse 
	 * @returns {Promise<AxiosResponse<any> | Record<any, any>>}
	 */
	public async getApplication(
		orgName: string,
		appName: string,
		parseDataFromResponse: boolean = true,
  	): Promise<AxiosResponse<any> | Record<any, any>> {
		const params = {
			orgName,
			appName,
			parseDataFromResponse,
		};
		SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/v2/organisations/${orgName}/applications/${appName}/`);
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

	/**
	 * get transactions for application
	 * @param appName 
	 * @param queryParams 
	 * @param parseDataFromResponse 
	 * @returns {Promise<AxiosResponse<any> | Record<any, any>>}
	 */
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

	/**
	 * get contract from application
	 * @param appName 
	 * @param contractName 
	 * @param parseDataFromResponse 
	 * @returns {Promise<AxiosResponse<any> | Record<any, any>>}
	 */
  	public async getApplicationContract(
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
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/v2/apps/${appName}/contract/${contractName}/`);
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

	/**
	 * get transactions for contract
	 * @param appName 
	 * @param contractName 
	 * @param queryParams 
	 * @param parseDataFromResponse 
	 * @returns {Promise<AxiosResponse<any> | Record<any, any>>}
	 */
	public async getContractTransactions(
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
		SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/v2/apps/${appName}/contract/${contractName}/transactions/`);
		const options = await this.requestHandler.getAuthAndOptions(undefined, queryParams);
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

	/**
	 * get contracts for application
	 * @param appName 
	 * @param queryParams 
	 * @param parseDataFromResponse 
	 * @returns {Promise<AxiosResponse<any> | Record<any, any>>}
	 */
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

	/**
	 * validate bundleHash
	 * @param appName 
	 * @param contractName 
	 * @param bundleHash 
	 * @param parseDataFromResponse 
	 * @returns {Promise<AxiosResponse<any> | Record<any, any>>}
	 */
  	public async validateBundleHash(
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

	/**
	 * get bundle from bundleHash and contractName and appName
	 * @param appName 
	 * @param contractName 
	 * @param bundleHash 
	 * @param downloadLocation 
	 * @param parseDataFromResponse 
	 * @returns {Promise<AxiosResponse<any> | Record<any, any> | unknown>}
	 */
	public async getBundle(
		appName: string,
		contractName: string,
		bundleHash: string,
		downloadLocation: string,
		parseDataFromResponse: boolean = true,
	): Promise<AxiosResponse<any> | Record<any, any> | unknown> {
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
			const responseType = "stream";
			const res = await this.requestHandler.doGetRequest(url, options, parseDataFromResponse, responseType) as unknown;
			SimbaConfig.log.debug(`:: SIMBA : EXIT : res : ${res}`);
			await FileHandler.download(res, downloadLocation);
			return res;
		} catch (error) {
			if (axios.isAxiosError(error) && error.response) {
				SimbaConfig.log.error(`${JSON.stringify(error.response.data)}`);
			} else {
				if (axios.isAxiosError(error)) {
					SimbaConfig.log.error(`${JSON.stringify(error)}`);
				} else {
					SimbaConfig.log.error(`${error}`);
				}
			}
			SimbaConfig.log.debug(`:: SIMBA : EXIT :`);
			throw(error);
		}
	}

	/**
	 * get file from fileName, bundleHash, contractName, and appName
	 * @param appName 
	 * @param contractName 
	 * @param bundleHash 
	 * @param fileName 
	 * @param downloadLocation 
	 * @param parseDataFromResponse 
	 * @returns {Promise<AxiosResponse<any> | Record<any, any> | unknown>}
	 */
	public async getBundleFile(
		appName: string,
		contractName: string,
		bundleHash: string,
		fileName: string,
		downloadLocation: string,
		parseDataFromResponse: boolean = true,
	): Promise<AxiosResponse<any> | Record<any, any> | unknown> {
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
			const responseType = "stream";
			const res = await this.requestHandler.doGetRequest(url, options, parseDataFromResponse, responseType) as unknown;
			SimbaConfig.log.debug(`:: SIMBA : EXIT : res : ${res}`);
			await FileHandler.download(res, downloadLocation);
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

	/**
	 * get manifest for bundle from bundleHash
	 * @param appName 
	 * @param contractName 
	 * @param bundleHash 
	 * @param parseDataFromResponse 
	 * @returns {Promise<AxiosResponse<any> | Record<any, any>>}
	 */
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

	/**
	 * get contract info from contractName and appName
	 * @param appName 
	 * @param contractName 
	 * @param parseDataFromResponse 
	 * @returns {Promise<AxiosResponse<any> | Record<any, any>>}
	 */
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

	/**
	 * get events from appName, contractName, and eventName
	 * @param appName 
	 * @param contractName 
	 * @param eventName 
	 * @param queryParams 
	 * @param parseDataFromResponse 
	 * @returns {Promise<AxiosResponse<any> | Record<any, any>>}
	 */
	public async getEvents(
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

	/**
	 * get events - admin perms required
	 * @param queryParams 
	 * @param parseDataFromResponse 
	 * @returns {Promise<AxiosResponse<any> | Record<any, any>>}
	 */
	public async adminGetEvents(
		queryParams?: Record<any, any>,
		parseDataFromResponse: boolean = true,
	): Promise<AxiosResponse<any> | Record<any, any>> {
		const params = {
			queryParams,
			parseDataFromResponse,
		};
		SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/admin/events/`);
		const options = await this.requestHandler.getAuthAndOptions(undefined, queryParams);
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

	/**
	 * get receipt from appName, contractName, and receiptHash
	 * @param appName 
	 * @param contractName 
	 * @param receiptHash 
	 * @param parseDataFromResponse 
	 * @returns {Promise<AxiosResponse<any> | Record<any, any>>}
	 */
	public async getReceipt(
		appName: string,
		contractName: string,
		receiptHash: string,
		parseDataFromResponse: boolean = true,
	): Promise<AxiosResponse<any> | Record<any, any>> {
		const params = {
			appName,
			contractName,
			receiptHash,
			parseDataFromResponse,
		};
		SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/v2/apps/${appName}/contract/${contractName}/receipt/${receiptHash}/`);
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

	/**
	 * get transaction from appName, contractName, and transactionHash
	 * @param appName 
	 * @param contractName 
	 * @param transactionHash 
	 * @param parseDataFromResponse 
	 * @returns {Promise<AxiosResponse<any> | Record<any, any>>}
	 */
	public async getTransaction(
		appName: string,
		contractName: string,
		transactionHash: string,
		parseDataFromResponse: boolean = true,
	): Promise<AxiosResponse<any> | Record<any, any>> {
		const params = {
			appName,
			contractName,
			transactionHash,
			parseDataFromResponse,
		};
		SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/v2/apps/${appName}/contract/${contractName}/transaction/${transactionHash}/`);
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

	/**
	 * get transactions by method
	 * @param appName 
	 * @param contractName 
	 * @param methodName 
	 * @param queryParams 
	 * @param parseDataFromResponse 
	 * @returns {Promise<AxiosResponse<any> | Record<any, any>>}
	 */
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

	/**
	 * get transactions by contract
	 * @param appName 
	 * @param contractName 
	 * @param queryParams 
	 * @param parseDataFromResponse 
	 * @returns {Promise<AxiosResponse<any> | Record<any, any>>}
	 */
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

	/**
	 * submit contract method
	 * @param appName 
	 * @param contractName 
	 * @param methodName 
	 * @param inputs 
	 * @param filePaths 
	 * @param parseDataFromResponse 
	 * @returns {Promise<AxiosResponse<any> | Record<any, any>>}
	 */
    public async submitContractMethod(
		appName: string,
		contractName: string,
        methodName: string,
        inputs?: Record<any, any>,
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
        // addContentType needs to be false below, or it botches formData boundaries
		const options = await this.requestHandler.getAuthAndOptions(undefined, undefined, true);
        inputs = inputs || {};
		let data = inputs;
        if (!filePaths) {
            const res: Record<any, any> = await this.requestHandler.doPostRequest(url, options, data, parseDataFromResponse);
            SimbaConfig.log.debug(`:: EXIT : res: ${JSON.stringify(res)}`);
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

	/**
	 * submit contract method synchronously
	 * @param appName 
	 * @param contractName 
	 * @param methodName 
	 * @param inputs 
	 * @param filePaths 
	 * @param parseDataFromResponse 
	 * @returns {Promise<AxiosResponse<any> | Record<any, any>>}
	 */
    public async submitContractMethodSync(
		appName: string,
		contractName: string,
        methodName: string,
        inputs?: Record<any, any>,
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
		// addContentType needs to be false below, or it botches formData boundaries
        const options = await this.requestHandler.getAuthAndOptions(undefined, undefined, false);
        inputs = inputs || {};
		let data = inputs;
        if (!filePaths) {
            const res: Record<any, any> = await this.requestHandler.doPostRequest(url, options, data, parseDataFromResponse);
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

	/**
	 * returns previous invocations of contract method
	 * @param appName 
	 * @param contractName 
	 * @param methodName 
	 * @param args 
	 * @param parseDataFromResponse 
	 * @returns {Promise<AxiosResponse<any> | Record<any, any>>}
	 */
	public async callContractMethod(
		appName: string,
		contractName: string,
		methodName: string,
		args?: Record<any, any>,
		parseDataFromResponse: boolean = true,
	): Promise<AxiosResponse<any> | Record<any, any>> {
		const params = {
			appName,
			contractName,
			methodName,
			args,
		};
		SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/v2/apps/${appName}/contract/${contractName}/${methodName}/`);
		const options = await this.requestHandler.getAuthAndOptions(undefined, args);
		try {
			const res = await this.requestHandler.doGetRequest(url, options, parseDataFromResponse);
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

	/**
	 * submit signed transaction for contract method
	 * @param appName 
	 * @param txnId 
	 * @param txn 
	 * @param parseDataFromResponse 
	 * @returns {Promise<AxiosResponse<any> | Record<any, any>>}
	 */
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

	/**
	 * save contract design to SIMBA platform
	 * @param orgName 
	 * @param name 
	 * @param code 
	 * @param designID 
	 * @param targetContract 
	 * @param libraries 
	 * @param encode 
	 * @param model 
	 * @param binaryTargets 
	 * @param parseDataFromResponse 
	 * @returns {Promise<AxiosResponse<any> | Record<any, any>>}
	 */
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

	/**
	 * wait for deployment to be COMPLETED state
	 * @param orgName 
	 * @param uid 
	 * @param totalTime 
	 * @param maxTime 
	 * @param parseDataFromResponse 
	 * @returns {Promise<AxiosResponse<any> | Record<any, any>>}
	 */
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
			if (state === "FAILED") {
				const message = `:: SIMBA : EXIT : transaction failed: ${JSON.stringify(res)}`;
				SimbaConfig.log.error(`:: SIMBA : EXIT : ${message}`);
				throw(message);
			}
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
				totalTime += 2;
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

	/**
	 * deploy contract design
	 * @param orgName 
	 * @param appName 
	 * @param apiName 
	 * @param designID 
	 * @param blockchain 
	 * @param storage 
	 * @param displayName 
	 * @param args 
	 * @param parseDataFromResponse 
	 * @returns {Promise<AxiosResponse<any> | Record<any, any>>}
	 */
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

	/**
	 * deploy contract artifact
	 * @param orgName 
	 * @param appName 
	 * @param apiName 
	 * @param artifactID 
	 * @param blockchain 
	 * @param storage 
	 * @param displayName 
	 * @param args 
	 * @param parseDataFromResponse 
	 * @returns {Promise<AxiosResponse<any> | Record<any, any>>}
	 */
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

	/**
	 * wait for contract design to be COMPLETED state
	 * @param orgName 
	 * @param appName 
	 * @param designID 
	 * @param apiName 
	 * @param blockchain 
	 * @param storage 
	 * @param displayName 
	 * @param args 
	 * @param parseDataFromResponse 
	 * @returns {Promise<AxiosResponse<any> | Record<any, any>>}
	 */
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
			address = getAddress(deployed);
			contractID = getArtifactID(deployed);
			const ret = [address, contractID];
			SimbaConfig.log.debug(`:: SIMBA : EXIT : ret : ${JSON.stringify(ret)}`);
			return ret;
		} catch (error) {
			const message = `failed to wait for deployment : ${error}`;
			SimbaConfig.log.error(`:: SIMBA : EXIT : ${message}`);
			throw(message);
		}
	}

	/**
	 * wait for contract artifact to be COMPLETED state
	 * @param orgName 
	 * @param appName 
	 * @param artifactID 
	 * @param apiName 
	 * @param blockchain 
	 * @param storage 
	 * @param displayName 
	 * @param args 
	 * @param parseDataFromResponse 
	 * @returns {Promise<AxiosResponse<any> | Record<any, any>>}
	 */
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
			address = getAddress(deployed);
			contractID = getArtifactID(deployed);
			const ret = [address, contractID];
			SimbaConfig.log.debug(`:: SIMBA : EXIT : ret : ${JSON.stringify(ret)}`);
			return ret;
		} catch (error) {
			const message = `failed to wait for deployment : ${error}`;
			SimbaConfig.log.error(`:: SIMBA : EXIT : ${message}`);
			throw(message);
		}
	}

	/**
	 * wait for transaction to be COMPLETED state
	 * @param orgName 
	 * @param uid 
	 * @param totalTime 
	 * @param maxTime 
	 * @param parseDataFromResponse 
	 * @returns {Promise<AxiosResponse<any> | Record<any, any>>}
	 */
	public async waitForOrgTransaction(
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
        const url = this.requestHandler.buildURL(this.baseApiUrl, `/v2/organisations/${orgName}/transactions/${uid}/`);
		const options = await this.requestHandler.getAuthAndOptions();
		try {
			// parseDataFromResponse NEEDS to be true here, for res.state to exist
			const res: Record<any, any> = await this.requestHandler.doGetRequest(url, options, parseDataFromResponse);
			const state = res.state;
			if (state === "FAILED") {
				const message = `:: SIMBA : EXIT : transaction failed: ${JSON.stringify(res)}`;
				SimbaConfig.log.error(`:: SIMBA : EXIT : ${message}`);
				throw(message);
			}
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
				totalTime += 2;
				return await this.waitForOrgTransaction(
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

	/**
	 * get contract designs
	 * @param orgName 
	 * @param parseDataFromResponse 
	 * @returns {Promise<AxiosResponse<any> | Record<any, any>>}
	 */
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

	/**
	 * get blockchains for organisation
	 * @param orgName 
	 * @param parseDataFromResponse 
	 * @returns {Promise<AxiosResponse<any> | Record<any, any>>}
	 */
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

	/**
	 * get storages for organisation
	 * @param orgName 
	 * @param parseDataFromResponse 
	 * @returns {Promise<AxiosResponse<any> | Record<any, any>>}
	 */
	public async getStorages(
		orgName: string,
		parseDataFromResponse: boolean = true,
	): Promise<AxiosResponse<any> | Record<any, any>> {
		const params = {
			orgName,
			parseDataFromResponse,
        };
        SimbaConfig.log.debug(`:: SIMBA : ENTER : ${JSON.stringify(params)}`);
        const url = this.requestHandler.buildURL(this.baseApiUrl, `/v2/organisations/${orgName}/storage/`);
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

	/**
	 * get contract artifacts for organisation
	 * @param orgName 
	 * @param queryParams 
	 * @param parseDataFromResponse 
	 * @returns {Promise<AxiosResponse<any> | Record<any, any>>}
	 */
	public async getArtifacts(
		orgName: string,
		queryParams?: Record<any, any>,
		parseDataFromResponse: boolean = true,
	): Promise<AxiosResponse<any> | Record<any, any>> {
		const params = {
			orgName,
			queryParams,
			parseDataFromResponse,
        };
        SimbaConfig.log.debug(`:: SIMBA : ENTER : ${JSON.stringify(params)}`);
        const url = this.requestHandler.buildURL(this.baseApiUrl, `/v2/organisations/${orgName}/contract_artifacts/`);
		const options = await this.requestHandler.getAuthAndOptions(undefined, queryParams);
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

	/**
	 * get contract artifact
	 * @param orgName 
	 * @param artifactID 
	 * @param parseDataFromResponse 
	 * @returns {Promise<AxiosResponse<any> | Record<any, any>>}
	 */
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

	/**
	 * create contract artifact for organisation
	 * @param orgName 
	 * @param designID 
	 * @param parseDataFromResponse 
	 * @returns {Promise<AxiosResponse<any> | Record<any, any>>}
	 */
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

	/**
	 * create subscription organisation 
	 * @param orgName 
	 * @param notificationEndpoint 
	 * @param contractAPI 
	 * @param txn 
	 * @param subscriptionType 
	 * @param authType 
	 * @param parseDataFromResponse 
	 * @returns {Promise<AxiosResponse<any> | Record<any, any>>}
	 */
	public async subscribe(
		orgName: string,
		notificationEndpoint: string,
		contractAPI: string,
		txn: string,
		subscriptionType: string,
		authType: string = "",
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

	/**
	 * set notification config for organisation
	 * @param orgName 
	 * @param scheme 
	 * @param authType 
	 * @param authInfo 
	 * @param parseDataFromResponse 
	 * @returns 
	 */
	public async setNotificationConfig(
		orgName: string,
		scheme: string,
		authType?: string,
		authInfo?: Record<any, any>,
		parseDataFromResponse: boolean = true,
	): Promise<AxiosResponse<any> | Record<any, any>> {
		const params = {
			orgName,
			scheme,
			authType,
			authInfo,
			parseDataFromResponse,
		};
		SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
		const url = this.requestHandler.buildURL(this.baseApiUrl, `/v2/organisations/${orgName}/notification_config/`);
		authType = authType ? authType : "";
		authInfo = authInfo ? authInfo : {};
		const options = await this.requestHandler.getAuthAndOptions();
		const data = {
			scheme,
			auth_type: authType,
			auth_info: authInfo,
		}
		try {
			const results = await this.requestHandler.doGetRequest(url, options, parseDataFromResponse) as Array<any>;
			for (let i = 0; i < results.length; i++) {
				const result: Record<any, any> = results[i];
				if (result.scheme === scheme &&
					result.auth_type === authType &&
					result.authInfo === authInfo
				) {
					SimbaConfig.log.debug(`:: SIMBA : EXIT : result : ${JSON.stringify(result)}`);
					return result;
				}
			}
			const conf = await this.requestHandler.doPostRequest(url, options, data, parseDataFromResponse);
			SimbaConfig.log.debug(`:: SIMBA : EXIT : sub : ${conf}`);
			return conf;
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