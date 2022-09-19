import axios from "axios";
import {
  buildUrl,
} from "./utils";
import {
  getAuthOptions,
  QueryParams,
} from "./settings";
import {
  Logger,
} from "tslog";
const log: Logger = new Logger();

// this logic will need to look different in langX,
// since we can't call "this" in constructor
// to get metadata
class ParamCheckingContract {
  appName: string;
  contractName: string;
  baseApiUrl: string;
  contractUri: string;
  asyncContractUri: string;
  metadata: Record<any, any> | null = null;
  paramsRestricted: Record<any, any> | null = null;

  constructor(
      appName: string,
      contractName: string,
      baseApiUrl: string = "https://api.sep.dev.simbachain.com/"
  ) {
    this.appName = appName;
    this.contractName = contractName;
    this.baseApiUrl = baseApiUrl;
    this.contractUri = `${this.appName}/contract/${this.contractName}`;
    this.asyncContractUri = `${this.appName}/async/contract/${this.contractName}`;
  }

  trueType(
    someObject: any
  ): string {
    return Object.prototype.toString.call(someObject).slice(8, -1).toLowerCase()
  }

  async getMetadata(
    queryParams: QueryParams
  ): Promise<Record<any, any> | Error> {
    const funcName = "getMetaData";
    log.info(`[${funcName}] :: ENTER : ${JSON.stringify(queryParams)}`);
    const url = buildUrl(this.baseApiUrl, `v2/apps/${this.contractUri}/?format=json`);
    const options = await getAuthOptions(queryParams);
    try {
      const res = await axios.get(url, options);
      const metadata = res.data["metadata"];
      log.info(`[${funcName}] :: EXIT : contract metadata: ${JSON.stringify(metadata)}`);
      return metadata;
    } catch (error) {
      if (error instanceof Error) {
        log.error(`[${funcName}] :: EXIT : ${error.message}`);
        return error;
      }
      const message = "Unknown error encountered";
      log.error(`[${funcName}] :: EXIT : ${message}`);
      throw new Error(message);
    }
  }

  isArray(param: string): boolean {
    return param.endsWith("]");
  }

  arrayRestrictions(
    arrString: string
  ): Record<number | string, string> {
    const funcName = "arrayRestrictions";
    log.info(`[${funcName}] :: ENTER : ${arrString}`);
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
    log.info(`[${funcName}] :: EXIT : ${JSON.stringify(arrLengths)}`);
    return arrLengths;
  }

  getDimensions(
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

  async paramRestrictions(
    queryParams?: QueryParams
  ): Promise<Record<any, any> | void> {
    const funcName = "paramRestrictions";
    log.info(`[${funcName}] :: ENTER : ${JSON.stringify(queryParams)}`);
    const metadata = await this.getMetadata(queryParams) as any;
    const methods = metadata["contract"]["methods"];
    // log.info(`[${funcName}] :: methods : ${JSON.stringify(methods)}`);
    const paramRest = {} as any;
    for (let method in methods) {
      if (method) {
        const methodKeys = methods[method];
        const methodParams = methodKeys["params"];
        // log.info(`[${funcName}] :: methodParams : ${JSON.stringify(methodParams)}`);
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
    log.info(`[${funcName}] :: EXIT : ${JSON.stringify(paramRest)}`);
    return paramRest;
  }

  checkArrayRestrictions(
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
    const funcName = "checkArrayRestrictions";
    log.info(`[${funcName}] :: ENTER : ${JSON.stringify(funcParams)}`);
    let levelRestriction;
    const strLevel = String(level);
    log.info(`strLevel: ${strLevel}`);
    if (strLevel in paramRestrictionsObj[paramName]) {
      levelRestriction = paramRestrictionsObj[paramName][strLevel]
      // log.info(`[${funcName}] :: levelRestriction : ${levelRestriction}`);
    } else {
      const message = "Passed array contains too many dimensions";
      log.error(message)
      throw new Error(message);
    }
    if (levelRestriction !== null) {
      if (arr.length !== Number(levelRestriction)) {
        const message =
          `Array length error for param ${paramName}. This param
          should have length ${Number(levelRestriction)}, but had
          length ${arr.length}`;
        log.error(`[${funcName}] :: EXIT : ${message}`);
        throw new Error(message);
      }
    }
    level += 1;
    for(const [i, element] of arr.entries()) {
      if (i > 0 && (this.trueType(arr[i]) !== this.trueType(arr[i-1]))) {
        const message = `Array element types ${arr[i]} and ${arr[i-1]}
        do not match`;
        log.error(`[${funcName}] :: EXIT : ${message}`);
        throw new Error(message);
      }
      if (Array.isArray(element)) {
        this.checkArrayRestrictions(element, paramName, paramRestrictionsObj, level);
      } else {
        if (paramRestrictionsObj[paramName]["containsUint"]) {
          if (!Number.isInteger(element)) {
            const message = `array elements must be int,
            but element is ${this.trueType(element)}`;
            log.error(`[${funcName}] :: EXIT : ${message}`);
            throw new Error(message);
          }
          if (element < 0) {
            const message = `array elements must be uint (>0), but
            element's value is ${element}`;
            log.error(`[${funcName}] :: EXIT : ${message}`);
            throw new Error(message);
          }
        }
      }
    }
    log.info(`[${funcName}] :: EXIT : ${true}`);
    return true;
  }

  checkUintRestriction(
    paramValue: number
  ): boolean | Error {
    const funcName = "checkUintRestriction";
    log.info(`[${funcName}] :: ENTER : ${JSON.stringify(paramValue)}`);
    if (paramValue < 0) {
      const message = `parameter must be positive,
      but parameter value is ${paramValue}`;
      log.error(`[${funcName}] :: EXIT : ${message}`);
      throw new Error(message);
    }
    if (!Number.isInteger(paramValue)) {
      const message = `parameter must be an integer,
      but parameter value is ${paramValue}`;
      log.error(`[${funcName}] :: EXIT : ${message}`);
      throw new Error(message);
    }
    log.info(`[${funcName}] :: EXIT : ${true}`);
    return true;
  }

  async validateParams(
    methodName: string,
    inputs: Record<any, any> | null
  ): Promise<boolean | Error> {
    const funcName = "validateParams";
    const par = {
      methodName,
      inputs,
    };
    log.info(`[${funcName}] :: ENTER : ${JSON.stringify(par)}`);
    const paramRest = await this.paramRestrictions() as any;
    const methodRestrictions = paramRest[methodName] || null;
    if (!methodRestrictions) {
      log.info(`[${funcName}] :: EXIT : valid`);
      return true
    }
    const uintParams = methodRestrictions["uintParams"] || {};
    const arrayParams = methodRestrictions["arrayParams"] || {};
    for (const paramName in inputs) {
      log.info(`paramName: ${paramName}`);
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
    log.info(`[${funcName}] :: EXIT : passed validateParams, valid`);
    return true;
  }
}

export {
  ParamCheckingContract,
};
