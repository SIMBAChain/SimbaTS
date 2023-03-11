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
    Simba,
} from "./simba";
import {
    SimbaContractSync,
} from "./simba_contract_sync";

/**
 * extends Simba object, for making synhronous method calls
 */
export class SimbaSync extends Simba {
	baseApiUrl: string;
	requestHandler: RequestHandler;
	
	constructor(
		baseApiUrl: string = SimbaConfig.baseURL,
		requestHandler: RequestHandler = new RequestHandler()
	) {
        super(baseApiUrl, requestHandler)
		this.baseApiUrl = baseApiUrl;
		this.requestHandler = requestHandler;
	}

    /**
     * returns synchronous version of SimbaContract (SimbaContractSync)
     * @param appName 
     * @param contractName 
     * @returns {SimbaContractSync}
     */
	public getSimbaContract(
		appName: string,
		contractName: string,
	): SimbaContractSync {
		const params = {
			appName,
			contractName,
		};
		SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
		const simbaContract = new SimbaContractSync(this.baseApiUrl, appName, contractName);
		SimbaConfig.log.debug(`:: SIMBA : EXIT :`);
		return simbaContract;
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
        const res = await this.submitContractMethodSync(
            appName,
            contractName,
            methodName,
            inputs,
            filePaths,
            parseDataFromResponse,
        );
        SimbaConfig.log.debug(`:: SIMBA : EXIT : res : ${res}`);
        return res;
    }
}