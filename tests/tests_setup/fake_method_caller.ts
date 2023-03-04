import {
    FileHandler,
} from "../../src/filehandler";
import * as path from "path";
import {cwd} from "process";

export async function callFakeMethod(
    methodKey: string,
): Promise<any> {
    console.log(`getting fake return data for key ${methodKey}`);
    const allData: any = await FileHandler.parsedFile(
        path.join(cwd(),
        "..",
        "tests",
        "test_data",
        "method_return_data.json",
        )
    );
    const methodReturnData = allData[methodKey];
    if (!methodReturnData) {
        throw new Error(`no key found for ${methodKey}`);
    }
    return methodReturnData;
}