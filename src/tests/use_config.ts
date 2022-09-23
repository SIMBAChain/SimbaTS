import {
    SimbaConfig,
    SimbaEnvVarKeys,
} from "../config"

console.log(SimbaConfig.retrieveEnvVar(SimbaEnvVarKeys.SIMBA_AUTH_BASE_URL))