import { readFileSync } from "fs";
import { resolve } from "path";

export function GetTestData(name: string)
{
    return readFileSync(resolve(__dirname, "../", name), "utf8");
}

export function TestDataPath(name: string)
{
    return resolve(__dirname, "../", name);
}