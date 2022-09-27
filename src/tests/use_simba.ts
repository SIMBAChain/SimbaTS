import { SimbaConfig } from "../config";
import {
    Simba,
} from "../simba";

async function main() {
    const simba = new Simba();
    const apps = await simba.getApplications();
    console.log(`apps : ${JSON.stringify(apps)}\n\n`);

    const app = await simba.getApplicationContract("BrendanTestApp", "test_contract_vds5");
    console.log(`app : ${JSON.stringify(app)}`)

    const contractName = "test_contract_vds5";
    const appName = "BrendanTestApp";
    let methodName = "setNum";
    let inputs = {
        "_ourNum": 13,
    } as any;
    let res = await simba.submitContractMethod(
        appName,
        contractName,
        methodName,
        inputs,
    );
    console.log(`submitMethod res : ${JSON.stringify(res)}`);
    res = await simba.submitContractMethodSync(
        appName,
        contractName,
        methodName,
        inputs,
    );
    console.log(`submitMethod res : ${JSON.stringify(res)}`);
    SimbaConfig.log.debug("debug coming through?")

    const name = "Lenny's Ghost";
    const age = 1000;
    const street = "rogers";
    const _number = 1234;
    const town = "nyc";
    const addr = {
        street,
        number: _number,
        town,
    }
    const person = {
        name,
        age,
        addr,
    }
    const image1Path = "/Users/brendanbirch/development/simba/sep/SimbaTS/src/tests/testimage.png";
    let filePaths = [image1Path];
    methodName = "structTest5";
    inputs = {
        person,
    }
    res = await simba.submitContractMethodSync(
        appName,
        contractName,
        methodName,
        inputs,
        filePaths,
    );
    console.log(`filepath method res : ${JSON.stringify(res)}`);
}

main();