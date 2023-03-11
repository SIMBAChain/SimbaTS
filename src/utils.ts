import {
    SimbaConfig,
} from "./config";

/**
 * parse address from a deployment object
 * @param deployment 
 * @returns {string | undefined}
 */
export function getAddress(deployment: Record<any, any>): string | undefined {
    const params = {
        deployment,
    };
    SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
    const primary = deployment.primary;
    SimbaConfig.log.debug(`:: SIMBA : EXIT : primary: ${primary}`);
    return primary;
}

/**
 * get artifact ID from deployment object
 * @param deployment 
 * @returns {string | undefined}
 */
export function getArtifactID(deployment: Record<any, any>): string | undefined {
  const params = {
      deployment,
  };
  SimbaConfig.log.debug(`:: SIMBA : ENTER : params : ${JSON.stringify(params)}`);
  const primary = deployment.artifact_id;
  SimbaConfig.log.debug(`:: SIMBA : EXIT : primary: ${primary}`);
  return primary;
}