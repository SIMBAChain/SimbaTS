import {
    RequestHandler,
} from "../request_handler"

async function main() {
    const rh = new RequestHandler();
    const token = await rh.getAuthTokenFromClientCreds();
    console.log(`token : ${JSON.stringify(token)}`);
}

main();