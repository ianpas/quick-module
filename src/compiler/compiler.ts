import { compileTsx } from "./tsx-compiler";
import { writeFileSync } from "fs";

/**
 * 翻译tsx文件，输出等价的ux和js文件
 * @param {string} src 需要翻译的文件的绝对路径
 */
export function compile(src: string):void
{
    const jsx_code = compileTsx(src);
    writeFileSync(src.replace(".tsx", ".jsx"), jsx_code, "utf8");
}