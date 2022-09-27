import {
    FileHandler,
} from "../file_handler"
import * as path from 'path';
import {cwd} from 'process';

function main() {
    const pathToTestSimbachainEnv = path.join(cwd(), "test_data", ".test.simbachain.env");
    const pathToProjectSimbachainEnv = path.join(cwd(), ".simbachain.env");
    FileHandler.removeFile(pathToProjectSimbachainEnv);
}

main();