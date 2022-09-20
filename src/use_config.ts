import {
    SimbaConfig,
    SimbaEnvVariableKeys,
} from "./config"

console.log(SimbaConfig.retrieveEnvVar(SimbaEnvVariableKeys.SIMBA_AUTH_CLIENT_SECRET))