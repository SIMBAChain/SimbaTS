import {
    SimbaConfig,
} from "./config";
import {
    SimbaContract,
} from "./simba_contract";
import {
    RequestHandler,
} from "./request_handler";
import {
    AxiosResponse,
} from "axios";
import {
    SimbaSync,
} from "./simba_sync";

/**
 * extends SimbaContract, for submitting synchronous contract methods
 */
export class SimbaContractSync extends SimbaContract {
    baseApiUrl: string;
    appName: string;
    contractName: string;
    contractUri: string;
    metadata: Record<any, any>;
    paramsRestricted: Record<any, any> | null = null;
    requestHandler: RequestHandler;
    simbaSync: SimbaSync;

    constructor(
        baseApiUrl: string,
        appName: string,
        contractName: string
    ) {
        super(baseApiUrl, appName, contractName);
        this.baseApiUrl = baseApiUrl;
        this.appName = appName;
        this.contractName = contractName;
        this.requestHandler = new RequestHandler(this.baseApiUrl);
        this.simbaSync = new SimbaSync(this.baseApiURL)
    }

    /**
     * submit method synchronously
     * @param methodName 
     * @param inputs 
     * @param filePaths 
     * @param validateParams 
     * @returns {Promise<AxiosResponse<any> | Record<any, any>>}
     */
    public async submitMethod(
        methodName: string,
        inputs?: Record<any, any>,
        filePaths?: Array<string>,
        validateParams: boolean = true,
    ): Promise<AxiosResponse<any> | Record<any, any>> {
        const params = {
            methodName,
            inputs,
            filePaths,
        };
        SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
        if (validateParams && inputs) {
            await this.validateParams(methodName, inputs);
        }
        const res = await this.simbaSync.submitContractMethod(
            this.appName,
            this.contractName,
            methodName,
            inputs,
            filePaths,
        );
        SimbaConfig.log.debug(`:: SIMBA : EXIT : res : ${res}`);
        return res;
    }

}