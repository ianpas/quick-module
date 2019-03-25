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

                /**
                 * 坑：一个非常坑的事情是，使用new创建的对象，那些方法不是挂在对象实例上，而是__proto__上
                 * 但快应用会把返回实例的__proto__改造，这样就会丢失原来的方法
                 * 解决方法是把那些方法挪到返回的对象实例上
                 */

                const move_methods_str = `
                    const props = Object.getOwnPropertyNames(${class_name}.prototype);
                    props.forEach(prop =>
                    {
                        if (prop !== "constructor")
                        {
                            __INSTANCE__[prop] = __INSTANCE__.__proto__[prop];
                        }
                    })
                 `;
                const move_methods_node = parse(move_methods_str, { sourceType: "script" });
                path.insertBefore(move_methods_node)
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