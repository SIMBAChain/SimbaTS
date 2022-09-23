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


// this logic will need to look different in langX,
// since we can't call "this" in constructor
// to get metadata
class ParamCheckingContract {
    appName: string;
    contractName: string;
    baseApiUrl: string;
    contractUri: string;
    asyncContractUri: string;
    metadata: Record<any, any>;
    paramsRestricted: Record<any, any> | null = null;
    requestHandler: RequestHandler;

    constructor(
        appName: string,
        contractName: string,
        baseApiUrl: string,
    ) {
        this.appName = appName;
        this.contractName = contractName;
        this.baseApiUrl = baseApiUrl;
        this.contractUri = `${this.appName}/contract/${this.contractName}`;
        this.asyncContractUri = `${this.appName}/async/contract/${this.contractName}`;
        this.requestHandler = new RequestHandler(this.baseApiUrl);
    }

    trueType(
        someObject: any
    ): string {
        return Object.prototype.toString.call(someObject).slice(8, -1).toLowerCase()
    }

    public async getMetadata(): Promise<Record<any, any>> {
        SimbaConfig.log.debug(`:: SIMBA : ENTER :`);
        if (this.metadata) {
            SimbaConfig.log.debug(`:: SIMBA : EXIT :`);
            return this.metadata;
        }
        const url = this.requestHandler.buildURL(this.baseApiUrl, `/apps/${this.contractUri}/?format=json`);
        const options = await this.requestHandler.getAuthAndOptions();
        try {
            const res: Record<any, any> = await this.requestHandler.doGetRequest(url, options);
            if (!res.data) {
                const message = "unable to retrieve metadata"
                SimbaConfig.log.error(`:: SIMBA : EXIT : ${message}`);
                throw(message);
            }
            const metadata = res.data["metadata"];
            SimbaConfig.log.debug(`:: EXIT : contract metadata: ${JSON.stringify(metadata)}`);
            this.metadata = metadata;
            return metadata;
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

    private isArray(param: string): boolean {
        return param.endsWith("]");
    }

    private arrayRestrictions(
        arrString: string
    ): Record<number | string, string> {
        SimbaConfig.log.debug(`:: ENTER : ${arrString}`);
        let reverseArray = "";
        for (let i = arrString.length-1; i >= 0; i--) {
            const char = arrString[i];
            switch (char) {
                case ("["): {
                    reverseArray += "]";
                    break;
                }
                    case ("]"): {
                    reverseArray += "[";
                    break;
                }
                    default: {
                    reverseArray += char;
                    break;
                }
            }
        }
        const arrLengths = {} as any;
        for (let i = 0; i < this.getDimensions(arrString); i++) {
            const arrLen = reverseArray.slice(
                reverseArray.indexOf("[")+1, reverseArray.indexOf("]")
            );
            arrLengths[i] = arrLen ?
                Number(arrLen) : null;
            reverseArray = reverseArray.slice(reverseArray.indexOf("]")+1)
        }
        SimbaConfig.log.debug(`:: EXIT : ${JSON.stringify(arrLengths)}`);
        return arrLengths;
    }

    private getDimensions(
        param: string,
        dims: number = 0
    ): number {
        if (!param.includes("[")) {
            return dims
        }
        param = param.slice(param.indexOf("[")+1);
        dims += 1;
        return this.getDimensions(param, dims);
    }

    private async paramRestrictions(): Promise<Record<any, any> | void> {
        SimbaConfig.log.debug(`:: SIMBA : ENTER :`);
        const metadata = await this.getMetadata() as any;
        const methods = metadata["contract"]["methods"];
        // SimbaConfig.log.debug(`:: methods : ${JSON.stringify(methods)}`);
        const paramRest = {} as any;
        for (let method in methods) {
            if (method) {
                const methodKeys = methods[method];
                const methodParams = methodKeys["params"];
                // SimbaConfig.log.debug(`:: methodParams : ${JSON.stringify(methodParams)}`);
                for (let param in methodParams) {
                    if (param) {
                        const paramName = methodParams[param]["name"];
                        const rawType = methodParams[param]["type"];
                        const containsOrIsUint = rawType.startsWith("uint");
                        if (!containsOrIsUint && !this.isArray(paramName)) {
                            continue;
                        }
                        if (paramRest[method] === undefined) {
                            paramRest[method] = {};
                        }
                        if (containsOrIsUint && !this.isArray(rawType)) {
                            if (paramRest[method]["uintParams"] === undefined) {
                                paramRest[method]["uintParams"] = [paramName];
                            } else {
                                paramRest[method]["uintParams"].push(paramName);
                            }
                        } else {
                            if (this.isArray(rawType)) {
                                if (paramRest[method]["arrayParams"] === undefined) {
                                paramRest[method]["arrayParams"] = {};
                                }
                                const _arrayRestrictions = this.arrayRestrictions(rawType);
                                _arrayRestrictions["containsUint"] = containsOrIsUint;
                                paramRest[method]["arrayParams"][paramName] = _arrayRestrictions;
                            }
                        }
                    }
                }
            }
        }
        SimbaConfig.log.debug(`:: EXIT : ${JSON.stringify(paramRest)}`);
        return paramRest;
    }

    private checkArrayRestrictions(
        arr: Array<any>,
        paramName: string,
        paramRestrictionsObj: Record<any, any>,
        level: number = 0
    ): boolean | Error {
        const funcParams = {
            arr,
            paramName,
            paramRestrictionsObj,
            level,
        };
        SimbaConfig.log.debug(`:: ENTER : ${JSON.stringify(funcParams)}`);
        let levelRestriction;
        const strLevel = String(level);
        SimbaConfig.log.debug(`strLevel: ${strLevel}`);
        if (strLevel in paramRestrictionsObj[paramName]) {
            levelRestriction = paramRestrictionsObj[paramName][strLevel]
            // SimbaConfig.log.debug(`:: levelRestriction : ${levelRestriction}`);
        } else {
            const message = "Passed array contains too many dimensions";
            SimbaConfig.log.error(message)
            throw(message);
        }
        if (levelRestriction !== null) {
            if (arr.length !== Number(levelRestriction)) {
                const message =
                `Array length error for param ${paramName}. This param
                should have length ${Number(levelRestriction)}, but had
                length ${arr.length}`;
                SimbaConfig.log.error(`:: EXIT : ${message}`);
                throw(message);
            }
        }
        level += 1;
        for(const [i, element] of arr.entries()) {
        if (i > 0 && (this.trueType(arr[i]) !== this.trueType(arr[i-1]))) {
            const message = `Array element types ${arr[i]} and ${arr[i-1]}
            do not match`;
            SimbaConfig.log.error(`:: EXIT : ${message}`);
            throw(message);
        }
        if (Array.isArray(element)) {
            this.checkArrayRestrictions(element, paramName, paramRestrictionsObj, level);
        } else {
            if (paramRestrictionsObj[paramName]["containsUint"]) {
                if (!Number.isInteger(element)) {
                    const message = `array elements must be int,
                    but element is ${this.trueType(element)}`;
                    SimbaConfig.log.error(`:: EXIT : ${message}`);
                    throw(message);
                }
                if (element < 0) {
                    const message = `array elements must be uint (>0), but
                    element's value is ${element}`;
                    SimbaConfig.log.error(`:: EXIT : ${message}`);
                    throw(message);
                }
            }
        }
        }
        SimbaConfig.log.debug(`:: EXIT : ${true}`);
        return true;
    }

    checkUintRestriction(
        paramValue: number
    ): boolean | Error {
        SimbaConfig.log.debug(`:: ENTER : ${JSON.stringify(paramValue)}`);
        if (paramValue < 0) {
            const message = `parameter must be positive,
            but parameter value is ${paramValue}`;
            SimbaConfig.log.error(`:: EXIT : ${message}`);
            throw(message);
        }
        if (!Number.isInteger(paramValue)) {
            const message = `parameter must be an integer,
            but parameter value is ${paramValue}`;
            SimbaConfig.log.error(`:: EXIT : ${message}`);
            throw(message);
        }
        SimbaConfig.log.debug(`:: EXIT : ${true}`);
        return true;
    }

    async validateParams(
        methodName: string,
        inputs: Record<any, any> | null
    ): Promise<boolean | Error> {
        const par = {
        methodName,
        inputs,
        };
        SimbaConfig.log.debug(`:: ENTER : ${JSON.stringify(par)}`);
        const paramRest = await this.paramRestrictions() as any;
        const methodRestrictions = paramRest[methodName] || null;
        if (!methodRestrictions) {
        SimbaConfig.log.debug(`:: EXIT : valid`);
        return true
        }
        const uintParams = methodRestrictions["uintParams"] || {};
        const arrayParams = methodRestrictions["arrayParams"] || {};
        for (const paramName in inputs) {
        SimbaConfig.log.debug(`paramName: ${paramName}`);
        if (paramName !== undefined) {
            if (paramName in uintParams) {
            const paramValue = inputs[paramName];
            this.checkUintRestriction(paramValue);
            }
            if (paramName in arrayParams) {
            const paramValue = inputs[paramName];
            this.checkArrayRestrictions(paramValue, paramName, arrayParams);
            }
        }
        }
        SimbaConfig.log.debug(`:: EXIT : passed validateParams, valid`);
        return true;
    }
}

export {
  ParamCheckingContract,
};
