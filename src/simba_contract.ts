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
    ParamCheckingContract,
} from "./param_checking_contract";
import {
    Simba,
} from "./simba";

/**
 * Main class for submitting contract methods
 */
export class SimbaContract extends ParamCheckingContract {
    baseApiURL: string;
    appName: string;
    contractName: string;
    contractURI: string;
    syncContractURI: string;
    metadata: Record<any, any>;
    paramsRestricted: Record<any, any> | null = null;
    requestHandler: RequestHandler;
    simba: Simba;

    constructor(
        baseApiURL: string,
        appName: string,
        contractName: string
    ) {
        super(appName, contractName, baseApiURL);
        this.baseApiURL = baseApiURL;
        this.appName = appName;
        this.contractName = contractName;
        this.requestHandler = new RequestHandler(this.baseApiURL);
        this.simba = new Simba(this.baseApiURL)
    }

    /**
     * returns past invocations of contract method calls for methodName
     * @param methodName 
     * @returns {Promise<AxiosResponse<any> | Record<any, any>>}
     */
    public async callMethod(
        methodName: string,
    ): Promise<AxiosResponse<any> | Record<any, any>> {
        const params = {
            methodName,
        };
        SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
        const res = await this.simba.callContractMethod(
            this.appName,
            this.contractName,
            methodName,
        );
        SimbaConfig.log.debug(`:: SIMBA : EXIT : res :${res}`);
        return res;
    }

    /**
     * invokes methodName
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
        const res = await this.simba.submitContractMethod(
            this.appName,
            this.contractName,
            methodName,
            inputs,
            filePaths,
        );
        SimbaConfig.log.debug(`:: SIMBA : EXIT : res : ${res}`);
        return res;
    }

    /**
     * returns transactions for methodName
     * @param methodName 
     * @param queryParams 
     * @returns {Promise<AxiosResponse<any> | Record<any, any>>}
     */
    public async getTransactionsByMethod(
        methodName: string,
        queryParams?: Record<any, any>
    ): Promise<AxiosResponse<any> | Record<any, any>> {
        const params = {
            queryParams,
        };
        SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
        const res = await this.simba.getTransactionsByMethod(
            this.appName,
            this.contractName,
            methodName,
            queryParams,
        );
        SimbaConfig.log.debug(`:: SIMBA : EXIT : res : ${res}`);
        return res;
    }

    /**
     * returns events for eventName
     * @param eventName 
     * @param queryParams 
     * @returns {Promise<AxiosResponse<any> | Record<any, any>>}
     */
    public async getEvents(
        eventName: string,
        queryParams?: Record<any, any>,
    ): Promise<AxiosResponse<any> | Record<any, any>> {
        const params = {
            eventName,
            queryParams,
        };
        SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
        const res = await this.simba.getEvents(
            this.appName,
            this.contractName,
            eventName,
            queryParams,
        );
        SimbaConfig.log.debug(`:: SIMBA : EXIT : res : ${res}`);
        return res;
    }

    /**
     * validate bundleHash
     * @param bundleHash 
     * @returns {Promise<AxiosResponse<any> | Record<any, any> | void>}
     */
    public async validateBundleHash(
        bundleHash: string,
    ): Promise<AxiosResponse<any> | Record<any, any> | void> {
        const params = {
            bundleHash,
        };
        SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
        const res = await this.simba.validateBundleHash(
            this.appName,
            this.contractName,
            bundleHash,
        );
        SimbaConfig.log.debug(`:: SIMBA : EXIT : res : ${res}`);
        return res;
    }

    /**
     * get bundle from bundleHash
     * @param bundleHash 
     * @param downloadLocation 
     * @returns {Promise<AxiosResponse<any> | Record<any, any> | void | unknown>}
     */
    public async getBundle(
        bundleHash: string,
        downloadLocation: string,
    ): Promise<AxiosResponse<any> | Record<any, any> | void | unknown> {
        const params = {
            bundleHash,
            downloadLocation,
        };
        SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
        const res = await this.simba.getBundle(
            this.appName,
            this.contractName,
            bundleHash,
            downloadLocation,
        );
        SimbaConfig.log.debug(`:: SIMBA : EXIT : res : ${res}`);
        return res;
    }

    /**
     * get file from bundleHash
     * @param bundleHash 
     * @param fileName 
     * @param downloadLocation 
     * @returns {Promise<AxiosResponse<any> | Record<any, any> | void | unknown>}
     */
    public async getBundleFile(
        bundleHash: string,
        fileName: string,
        downloadLocation: string,
    ): Promise<AxiosResponse<any> | Record<any, any> | void | unknown> {
        const params = {
            bundleHash,
            fileName,
            downloadLocation,
        };
        SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
        const res = await this.simba.getBundleFile(
            this.appName,
            this.contractName,
            bundleHash,
            fileName,
            downloadLocation,
        );
        SimbaConfig.log.debug(`:: SIMBA : EXIT : res : ${res}`);
        return res;
    }

    /**
     * get manifest from bundleHash
     * @param bundleHash 
     * @returns {Promise<AxiosResponse<any> | Record<any, any> | void>}
     */
    public async getManifestFromBundleHash(
        bundleHash: string,
    ): Promise<AxiosResponse<any> | Record<any, any> | void> {
        const params = {
            bundleHash,
        };
        SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
        const res = await this.simba.getManifestForBundleFromBundleHash(
            this.appName,
            this.contractName,
            bundleHash,
        );
        SimbaConfig.log.debug(`:: SIMBA : EXIT : res : ${res}`);
        return res;
    }
}
