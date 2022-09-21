import {
    Simba,
} from "../simba";

async function main() {
    const simba = new Simba();
    const apps = await simba.listApplications();
    console.log(`apps : ${JSON.stringify(apps)}\n\n`);

    const app = await simba.getApplicationContract("BrendanTestApp", "test_contract_vds5");
    console.log(`app : ${JSON.stringify(app)}`)
}

main();