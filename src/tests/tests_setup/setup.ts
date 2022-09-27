import {
    FileHandler,
} from "../file_handler"
import * as path from 'path';
import {cwd} from 'process';

async function main() {
    const pathToTestSimbachainEnv = path.join(cwd(), "..", "test_data", ".test.simbachain.env");
    const pathToProjectSimbachainEnv = path.join(cwd(), "..", ".simbachain.env");
    await FileHandler.transferFile(pathToTestSimbachainEnv, pathToProjectSimbachainEnv, false);
}

main();