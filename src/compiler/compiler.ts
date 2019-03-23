import { writeFileSync } from "fs";

import { compileTsx } from "./tsx-compiler";
import { compileToJs } from "./js-compiler";
import { compileToUx } from "./ux-compiler";

/**
 * 翻译tsx文件，输出等价的ux和js文件
 * @param {string} src 需要翻译的文件的绝对路径
 */
export function compile(src: string): void
{
    //
    const jsx_code = compileTsx(src);
    const jsx_path = src.replace(".tsx", ".jsx");
    writeFileSync(jsx_path, jsx_code, "utf8");

    //
    const { js_code, import_info } = compileToJs(jsx_path);
    const js_path = jsx_path.replace(".jsx", ".js");
    writeFileSync(js_path, js_code, "utf8");

    //
    const ux_code = compileToUx(jsx_path, import_info);
    const ux_path = jsx_path.replace(".jsx", ".ux");
    writeFileSync(ux_path, ux_code, "utf8");
}