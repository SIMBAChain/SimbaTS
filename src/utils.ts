import {
    SimbaConfig,
} from "./config";

export function getAddress(deployment: Record<any, any>): string | undefined {
    const params = {
        deployment,
    };
    SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
    const primary = deployment.primary;
    SimbaConfig.log.debug(`:: SIMBA : EXIT : primary: ${primary}`);
    return primary;
}

export function getArtifactID(deployment: Record<any, any>): string | undefined {
  const params = {
      deployment,
  };
  SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
  const primary = deployment.artifact_id;
  SimbaConfig.log.debug(`:: SIMBA : EXIT : primary: ${primary}`);
  return primary;
}