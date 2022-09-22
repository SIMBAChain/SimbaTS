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

export class SimbaSync {
	baseApiUrl: string;
	requestHandler: RequestHandler;
	
	constructor(
		baseApiUrl: string = SimbaConfig.baseURL,
		requestHandler: RequestHandler = new RequestHandler()
	) {
		this.baseApiUrl = baseApiUrl;
		this.requestHandler = requestHandler;
	}

    public getAddress(deployment: Record<any, any>): string | undefined {
        const params = {
            deployment,
        };
        SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
        const primary = deployment.primary;
        SimbaConfig.log.debug(`:: SIMBA : EXIT : primary: ${primary}`);
        return primary;
    }

    public getDeployedArtifactID(deployment: Record<any, any>): string | undefined {
        const params = {
            deployment,
        };
        SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
        const primary = deployment.primary;
        SimbaConfig.log.debug(`:: SIMBA : EXIT : primary: ${primary}`);
        return primary;
    }

}