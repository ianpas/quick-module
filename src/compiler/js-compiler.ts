import traverse from "@babel/traverse";
import generate from "@babel/generator";
import { parse } from "@babel/parser";

import { isUxModule, isCssModule, uxPath, absolutePath } from "../utility/utility";
import { stringLiteral, Identifier, variableDeclaration, variableDeclarator, identifier, newExpression } from "@babel/types";

export type ModuleInfo = { src: string, name: string };
export type ImportInfo = { ux: Array<ModuleInfo>, style: Array<ModuleInfo> };
export type JsCompiledResult = { js_code: string, import_info: ImportInfo };

/**
* 从jsx代码提取js，主要是移除template方法和最终不需要的import代码
* @param {string} src 提取目标，jsx代码
* @returns {JsCompiledResult} 翻译后除了js代码，还返回引入ux，样式相关的信息
*/
export function compileToJs(jsx_code: string, tsx_src: string): JsCompiledResult
{

    //
    const ux_imported: Array<ModuleInfo> = [];
    const style_imported: Array<ModuleInfo> = [];

    //
    const ast = parse(jsx_code, { sourceType: "module", plugins: ["jsx"] });

    traverse(ast, {
        enter(path)
        {
            if (path.isClassMethod() && (path.node.key as Identifier).name === "template")
            {
                path.remove();
            }
            else if (path.isExportDefaultDeclaration())
            {
                const class_name = (path.node.declaration as Identifier).name;
                const instance_name = "__INSTANCE__";
                (path.node.declaration as Identifier).name = instance_name;

                path.insertBefore(variableDeclaration("const", [
                    variableDeclarator(
                        identifier(instance_name),
                        newExpression(identifier(class_name), [])
                    )
                ]));
            }
            else if (path.isImportDeclaration())
            {
                const file_src = tsx_src;
                const import_src = path.node.source.value;
                const abs_src = absolutePath(file_src, import_src);

                if (isUxModule(abs_src))
                {
                    const ux_src = uxPath(file_src, import_src).replace(".tsx", ".ux");

                    ux_imported.push({
                        src: ux_src.endsWith(".ux") ? ux_src : `${ux_src}.ux`,
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