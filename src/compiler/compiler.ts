import { compileTsx } from "./tsx-compiler";
import { writeFileSync } from "fs";

/**
 * @module 翻译器入口模块
 */

/**
 * @param {string} src 需要翻译的文件的绝对路径
 */
export function compile(src: string)
{
    const jsx_code = compileTsx(src);
    writeFileSync(src.replace(".tsx", ".jsx"), jsx_code, "utf8");
}