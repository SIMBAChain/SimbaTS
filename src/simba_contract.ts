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

    public async callMethod(
        methodName: string,
        inputs: Record<any, any>,
    ): Promise<AxiosResponse<any> | Record<any, any>> {
        const params = {
            methodName,
            inputs,
        };
        SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
        await this.validateParams(methodName, inputs);
        const res = await this.simba.callContractMethod(
            this.appName,
            this.contractName,
            methodName,
        );
        SimbaConfig.log.debug(`:: SIMBA : EXIT : res :${res}`);
        return res;
    }

    public async submitMethod(
        methodName: string,
        inputs?: Record<any, any>,
        filePaths?: Array<string>,
    ): Promise<AxiosResponse<any> | Record<any, any>> {
        const params = {
            methodName,
            inputs,
            filePaths,
        };
        SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
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

    public async listEvents(
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

    public async getBundle(
        bundleHash: string,
        downloadLocation?: string,
    ): Promise<AxiosResponse<any> | Record<any, any> | void> {
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

    public async getmanifestFromBundleHash(
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

    public async getBundleFile(
        bundleHash: string,
        fileName: string,
        downloadLocation?: string,
    ): Promise<AxiosResponse<any> | Record<any, any> | void> {
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
}
