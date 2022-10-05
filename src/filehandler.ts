import {
    SimbaConfig,
} from "./config";
import * as fs from "fs";
import * as path from 'path';
import * as stream from "stream";
import {promisify} from "util";

/**
 * helps read file once we've found it
 * @param filePath 
 * @param options 
 * @returns 
 */
export const promisifiedReadFile = (filePath: fs.PathLike, options: { encoding?: null; flag?: string }): Promise<Buffer> =>
    new Promise((resolve, reject) => {
        fs.readFile(filePath, options, (err: NodeJS.ErrnoException | null, data: Buffer) => {
            if (err) {
                return reject(err);
            }
            return resolve(data);
        });
    });

export class FileHandler {

    public static async transferFile(
        inputPath: string,
        outputPath: string,
        parseAsJson: boolean = true,
    ): Promise<void> {
        const buf = await promisifiedReadFile(inputPath, {flag: 'r'});
        let parsed;
        let data;
        if (parseAsJson) {
            parsed = JSON.parse(buf.toString());
            data = JSON.stringify(parsed);
        } else {
            data = buf;
        }
        SimbaConfig.log.info(`:: writing contents of ${inputPath} to ${outputPath}`);
        // before writing, need to recursively create path to outputPath
        this.makeDirectory(outputPath);
        fs.writeFileSync(outputPath, data);
    }

    public static async download(data: any, downloadLocation: string): Promise<any> {
        FileHandler.makeDirectory(downloadLocation);
        const writer = fs.createWriteStream(downloadLocation);
        if (data.data) {
            data.data.pipe(writer);
        } else {
            data.pipe(writer);
        }
        return new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
    }

    public static async parsedFile(filePath: string) {
        const buf = await promisifiedReadFile(filePath, {flag: 'r'});
        return JSON.parse(buf.toString());
    }

    public static makeDirectory(filePath: string) {
        const dirName = path.dirname(filePath);
        SimbaConfig.log.info(`:: creating directory ${filePath}`);
        if (!fs.existsSync(dirName)) {
            fs.mkdirSync(dirName, { recursive: true });
        }
    }

    public static removeFile(filePath: string) {
        SimbaConfig.log.info(`:: deleting file ${filePath}`);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }

    public static removeDirectory(filePath: string) {
        try {
            SimbaConfig.log.info(`:: deleting directory ${filePath}`);
            fs.rmSync(filePath, { recursive: true });
        } catch (err) {
            console.error(`Error while deleting ${filePath}.`);
        }
    }
}

