// import * as dotenv from "dotenv";
import * as msal from "@azure/msal-node";
// dotenv.config();
import {
  Logger,
} from "tslog";
const log: Logger = new Logger();
import {
  MSAL_CLIENT_ID,
  MSAL_CLIENT_SECRET,
  MSAL_TENANT,
  MSAL_SEP_RESOURCE_PRINCIPAL_ID,
} from "./msal_settings";

// NOTE: this module does not yet implement keycloak
// for Auth, msal must currently be used

type QueryParams = Record<any, any> | undefined;

interface ProviderInterface {
  MSAL: string,
  KEYCLOAK: string,
};

const baseAuthUrls: ProviderInterface = {
  MSAL: "https://login.microsoftonline.com/",
  KEYCLOAK: "DEFINE HERE",
};

const clientIds: ProviderInterface = {
  MSAL: MSAL_CLIENT_ID,
  KEYCLOAK: "DEFINE HERE",
};

const clientSecrets: ProviderInterface = {
  MSAL: MSAL_CLIENT_SECRET,
  KEYCLOAK: "DEFINE HERE",
};

// keycloak not yet implemented, use msal
const _provider = {
  MSAL: true,
  KEYCLOAK: false,
};

// set this var if your org is simbachain
const SEP_RESOURCE_PRINCIPAL_ID = MSAL_SEP_RESOURCE_PRINCIPAL_ID;

const TENANT_ID = MSAL_TENANT;
const PROVIDER = _provider["MSAL"] ? "MSAL" : "KEYCLOAK";
const CLIENT_ID = clientIds[PROVIDER];
const CLIENT_SECRET = clientSecrets[PROVIDER];
const BASE_AUTH_URL = baseAuthUrls[PROVIDER]; // 
const AUTHORITY = `${BASE_AUTH_URL}${TENANT_ID}`;
// const KC_AUTH_HOST = BASE_AUTH_URL;
// SEP_RESOURCE_PRINCIPAL_ID should be used if your org is simbachain

// const SCOPE = process.env.AZURE_APP_ID || `api://${SEP_RESOURCE_PRINCIPAL_ID || CLIENT_ID}/.default`;
const SCOPE = `api://${SEP_RESOURCE_PRINCIPAL_ID || CLIENT_ID}/.default`;

const SCOPES = [SCOPE];
const AUTH_FLOW = "client_credentials";

// const AUTH_ENDPOINT = process.env.AUTH_ENDPOINT || `/${TENANT_ID}/oauth2/v2.0/`;
const AUTH_ENDPOINT = `/${TENANT_ID}/oauth2/v2.0/`;

// const BASE_API_URL = process.env.BASE_API_URL || "https://api.sep.dev.simbachain.com";
const BASE_API_URL = "https://api.sep.dev.simbachain.com";


const msalConfig = {
  auth: {
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    authority: AUTHORITY,
  }
}

// keycloak not yet implemented
// const keycloakConfig = {
//   clientId: CLIENT_ID,
//   clientSecret: CLIENT_SECRET,
//   authHost: KC_AUTH_HOST,
//   realm: TENANT_ID,
// }

const cca = new msal.ConfidentialClientApplication(msalConfig);
// cosnt kca = new KeyCloakClient(keycloakConfig);

/**
 * Acquires token with client credentials.
 */
async function getToken() {
  const funcName = "getToken";
  log.info(`[${funcName}] :: ENTER : PROVIDER : ${PROVIDER}`);
  switch (PROVIDER) {
    case "MSAL": {
      log.info(`[${funcName}] :: EXIT :`);
      return await cca.acquireTokenByClientCredential({
        scopes: SCOPES,
      });
    }
    case "KEYCLOAK": {
      // return await kca.login();
      // return "need to implement"
    }
    default: {
      throw new Error("No provider is configured");
    }
  }
}

/**
 * returns options parameter that includes header with auth token
 * @return {Promise<any>}
 */
async function getAuthOptions(
  queryParams: Record<any, any> | undefined = undefined
): Promise<any> {
  const funcName = "getAuthOptions";
  log.info(`[${funcName}] :: ENTER :`);
  const authResponse = await getToken();
  // log.info(`authResponse: ${JSON.stringify(authResponse)}`)
  const accessToken = authResponse?.accessToken;
  // log.info(`accessToken: ${accessToken}`);
  let options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  } as any;
  if (queryParams !== undefined && queryParams !== null) {
    options.params = queryParams;
  }
  log.info(`[${funcName}] :: EXIT :`);
  return options;
}

export {
  CLIENT_SECRET,
  CLIENT_ID,
  SCOPE,
  BASE_AUTH_URL,
  TENANT_ID,
  AUTH_ENDPOINT,
  BASE_API_URL,
  AUTH_FLOW,
  getAuthOptions,
  QueryParams,
}
