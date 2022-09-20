// import * as dotenv from "dotenv";
// dotenv.config();
// import * as fs from "fs";
// import * as path from "path";
// import {
//   Logger,
// } from "tslog";
// const log: Logger = new Logger();

// // NOTE: we are handling tokens with msal, so
// // even though tokenExpired, saveToken, getSavedToken are
// // implemented, they are not used

// /**
//  *  Checks to see if a token has expired, by checking the 'expires' key
//     Adds an offset to allow for delays when performing auth processes
//  * @param {Record<any, any>} tokenData
//     the object to check for expiry. Should contain an 'expires' key
//  * @param {number} offset
//     To allow for delays in auth processes,
//     this number of seconds is added to the expiry time
//  * @returns {boolean} offset
//  */
// function tokenExpired(
//   tokenData: Record<any, any>,
//   offset?: number
// ): boolean {
//   const funcName = "tokenExpired";
//   offset = offset === undefined ?
//     60 :
//     offset;
//   if ("expires" in tokenData) {
//     const expires = tokenData["expires"];
//     let nowWOffset = new Date();
//     nowWOffset.setSeconds(nowWOffset.getSeconds() + offset);
//     log.info(`expires: ${expires}`)
//     log.info(`nowWOffset: ${nowWOffset}`);
//     if (nowWOffset >= expires) {
//       log.debug(`[${funcName}] :: Saved token expires within 60 seconds`);
//       return true;
//     }
//     log.debug(
//         `[${funcName}] :: Saved token valid for at least 60 seconds`
//     );
//     return false;
//   } else {
//     log.info(
//       `[${funcName}] :: No expiry date stored for token, assume expired`
//     );
//     return true;
//   }
// }

// function getSavedToken(clientId: string): any {
//   const tokenDir = process.env.TOKEN_DIR || "./";
//   const isDir = fs.statSync(tokenDir).isDirectory();
//   if (isDir) {
//     const tokenFile = path.join(tokenDir, `${clientId}_token.json`);
//     log.info(`tokenFile: ${tokenFile}`);
//     const isFile = fs.statSync(tokenFile).isFile();
//     if (isFile) {
//       const tokenData = JSON.parse(fs.readFileSync(tokenFile, 'utf8'));
//       // const tokenData = JSON.parse(data);
//       log.info(`Found saved token: ${tokenFile}`);
//       if (tokenExpired(tokenData)) {
//         log.error(`Token Expiry date elapsed`);
//         throw new Error("Token Expiry date elapsed");
//       }
//       return tokenData;
//     }
//     log.error("Token file not found");
//     throw new Error("Token file not found");
//   }
//   log.error("Token file not found");
//   throw new Error("Token directory not found");
// }

// /**
//  *  Saves the token data to a file.
//     Checks the TOKEN_DIR environment variable for alternative token storage locations,
//     otherwise uses the current working path
//     Creates the token directory if it doesn't already exist.
//     Adds an "expires" key to the auth token data, set to time "now" added to the expires_in time
//     This is used later to discover if the token has expired
//     Token files are named <client_id>_token.json
//  * @param {string|number} clientId 
//  * @param {Record<any, any>} tokenData 
//  */
// function saveToken(
//   clientId: string | number,
//   tokenData: any
// ): void {
//   const tokenDir = process.env.TOKEN_DIR || "./";
//   fs.mkdir(
//     tokenDir,
//     {recursive: true}, 
//     (err) => {
//     if (err) {
//       return console.error(err);
//     }
//     log.info('Directory created successfully!');
//   });
//   const tokenFile = path.join(tokenDir, `${clientId}_token.json`);
//   const expiryDate = new Date();
//   const expiry = expiryDate.setSeconds(expiryDate.getSeconds() + tokenData["expires_in"]);
//   tokenData["expires"] = expiry;
//   fs.writeFileSync(tokenFile, JSON.stringify(tokenData), "utf8");
// }

// function buildUrl(
//   baseUrl: string,
//   path: string
// ): string {
//   const fullUrl = baseUrl + path;
//   return fullUrl;
// }

// // const tokenData = {
// //   expires_in: 3599,
// // };
// // const clientId = "ababababab";
// // saveToken(clientId, tokenData);
// // const newSavedToken = getSavedToken("ababababab");
// // console.log("newSavedToken:", newSavedToken);

// export {
//   buildUrl,
//   saveToken,
//   getSavedToken,
// };
