import {
    FileHandler,
} from "../file_handler"
import * as path from 'path';
import {cwd} from 'process';

function main() {
    const pathToProjectSimbachainEnv = path.join(cwd(), "..", ".simbachain.env");
    FileHandler.removeFile(pathToProjectSimbachainEnv);
}

main();