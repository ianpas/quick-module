import { readFileSync } from "fs";

import traverse from "@babel/traverse";
import generate from "@babel/generator";
import { parse } from "@babel/parser";

import { isUxModule, isCssModule, uxPath } from "../utility/utility";

/**
 * @module 翻译器js部分
 */


type ModuleInfo = { src: string, name: string };
type ImportInfo = { ux: Array<ModuleInfo>, style: Array<ModuleInfo> };
type JsCompiledResult = { js_code: string, import_info: ImportInfo };

/**
* 从jsx文件提取js，主要是移除template方法和最终不需要的import代码
* @param {string} src 提取目标，jsx文件的绝对路径
* @returns {JsCompiledResult} 翻译后除了js代码，还返回引入ux，样式相关的信息
*/
export function compileJs(src: string): JsCompiledResult
{

    //
    const ux_imported: Array<ModuleInfo> = [];
    const style_imported: Array<ModuleInfo> = [];

    //
    const jsx_code = readFileSync(src, "utf8");
    const ast = parse(jsx_code, { sourceType: "module", plugins: ["jsx"] });

    traverse(ast, {
        enter(path)
        {
            if (path.isObjectMethod() && path.node.key.name === "template")
            {
                path.remove();
            }
            else if (path.isImportDeclaration())
            {
                const file_src = src;
                const import_src = path.node.source.value;

                if (isUxModule(import_src))
                {
                    ux_imported.push({
                        src: uxPath(file_src, import_src),
                        name: path.node.specifiers[0].local.name.replace(/_/g, "-")
                    });
                    path.remove();
                }
                else if (isCssModule(import_src))
                {
                    style_imported.push({
                        src: import_src,
                        name: path.node.specifiers[0].local.name
                    });
                    path.remove();
                }
            }
        }
    });

    //
    const result = {
        js_code: generate(ast).code,
        import_info: {
            ux: ux_imported,
            style: style_imported
        }
    }

    return result;
}