import { writeFileSync } from "fs";

import { compileTsx } from "./tsx-compiler";
import { compileToJs } from "./js-compiler";
import { compileToUx } from "./ux-compiler";

/**
 * 翻译tsx文件，输出等价的ux和js文件
 * @param {string} tsx_src 需要翻译的文件的绝对路径
 */
export function compile(tsx_src: string): void
{
    //
    const jsx_code = compileTsx(tsx_src);

    //
    const { js_code, import_info } = compileToJs(jsx_code, tsx_src);
    const js_path = tsx_src.replace(".tsx", ".js");
    writeFileSync(js_path, js_code, "utf8");

    //
    const ux_code = compileToUx(jsx_code, tsx_src, import_info);
    const ux_path = tsx_src.replace(".tsx", ".ux");
    writeFileSync(ux_path, ux_code, "utf8");
}