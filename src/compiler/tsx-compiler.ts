import { readFileSync } from "fs";

import * as ts from "typescript";

import traverse from "@babel/traverse";
import generate from "@babel/generator";
import { parse } from "@babel/parser";

import { isComponent, toDashed, isUxModule, toUnderscored, isCssModule, combine } from "../utility/utility";

/**
 * 将tsx文件翻译为jsx，主要是处理组件命名
 * @param {string} src 需要翻译的tsx文件的绝对路径
 * @returns {string} 翻译得到的jsx代码
 */
export function compileTsx(src: string)
{
    const main_snippet = renameComponent(src);
    const style_import_snippets = extractStyleImport(src);
    const jsx_code = combine(...style_import_snippets, main_snippet);
    return jsx_code;
}


/**
 * 处理tsx文件中的组件命名
 * @param {string} src 需要翻译的tsx文件的绝对路径
 * @returns {string} 处理了组件命名后得到的tsx代码
 */
export function renameComponent(src: string)
{
    /**
     * 使用typescript编译器的API将tsx代码翻译为jsx
     * @see {@link https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API}
     */
    const tsx_code = readFileSync(src, "utf8");
    const jsx_code = ts.transpileModule(tsx_code, {
        compilerOptions: {
            module: ts.ModuleKind.ES2015,
            jsx: ts.JsxEmit.Preserve,
            target: ts.ScriptTarget.ES2015
        }
    }).outputText;

    /**
     * 使用babel的parser, generator和traverse
     * @see {@link https://github.com/jamiebuilds/babel-handbook/blob/master/translations/en/plugin-handbook.md#toc-introduction}
     * 在两个地方对组件名进行处理，import部分和jsx部分
     */
    const ast = parse(jsx_code, { sourceType: "module", plugins: ["jsx"] });

    /**
     * 方便查看ast的在线工具：@see {@link https://astexplorer.net/ }
     */
    traverse(ast, {
        enter(path)
        {
            if (path.isImportDeclaration())
            {
                if (isUxModule(path.node.source.value))
                {
                    path.node.specifiers[0].local.name = toUnderscored(path.node.specifiers[0].local.name);
                    path.node.leadingComments = [];
                    path.node.trailingComments = [];
                }
            }
            else if (path.isJSXIdentifier())
            {
                const tag_name = generate(path.node).code;
                if (isComponent(tag_name))
                {
                    path.node.name = toDashed(tag_name);
                }
            }
        }
    });

    const renamed = generate(ast).code;
    return renamed;
}

/**
 * 提取tsx文件中import css的部分，因为typescript把tsx翻译为jsx后，会删除声明了但没有用到的import代码
 * @param {string} src 需要翻译的tsx文件的绝对路径
 * @returns {string[]} 数组元素是每条import css的代码
 */
export function extractStyleImport(src: string)
{
    const tsx_code = readFileSync(src, "utf8");
    const ast = parse(tsx_code, { sourceType: "module", plugins: ["typescript", "jsx"] });

    const style_imported: Array<string> = [];

    traverse(ast, {
        enter(path)
        {
            if (path.isImportDeclaration())
            {
                const import_src = path.node.source.value;
                if (isCssModule(import_src))
                {
                    path.node.leadingComments = [];
                    path.node.trailingComments = [];
                    style_imported.push(generate(path.node).code);
                }
            }
        }
    });

    return style_imported;
}