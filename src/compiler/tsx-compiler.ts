import { readFileSync } from "fs";

import * as ts from "typescript";

import traverse from "@babel/traverse";
import generate from "@babel/generator";
import { parse } from "@babel/parser";

import { toDashed, isUxModule, toUnderscored, isCssModule, combine, isDataModelKeyword, removeDataModelKeyword } from "../utility/utility";
import { Identifier, ObjectExpression, ObjectProperty, objectExpression, objectProperty, identifier, MemberExpression, ArrowFunctionExpression, jsxElement, jsxOpeningElement, jsxIdentifier, jsxClosingElement, JSXElement, jsxExpressionContainer, stringLiteral, jsxAttribute } from "@babel/types";

/**
 * 将tsx文件翻译为jsx
 * @param {string} src 需要翻译的tsx文件的绝对路径
 * @returns {string} 翻译得到的jsx代码
 */
export function compileTsx(src: string)
{
    const main_snippet = preprocessTsx(src);
    const style_import_snippets = extractStyleImport(src);
    const jsx_code = combine(...style_import_snippets, main_snippet);
    return jsx_code;
}

/**
 * 提取tsx文件中import css的部分，因为typescript把tsx翻译为jsx后，会删除声明了但没有用到的import代码
 * @param {string} src 需要翻译的tsx文件的绝对路径
 * @returns {string[]} 数组元素是每条import css的代码
 */
export function extractStyleImport(src: string)
{
    const tsx_code = readFileSync(src, "utf8");
    const ast = parse(tsx_code, { sourceType: "module", plugins: ["typescript", "jsx", "classProperties"] });

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

/**
 * 将tsx文件翻译为jsx
 * @param {string} src 需要翻译的tsx文件的绝对路径
 * @returns {string} 翻译得到的jsx代码
 */
export function preprocessTsx(src: string)
{

    const tsx_code = readFileSync(src, "utf8");
    const tsx_ast = parse(tsx_code, { sourceType: "module", plugins: ["typescript", "jsx", "classProperties"] });


    traverse(tsx_ast, {
        enter(path)
        {
            if (path.isJSXExpressionContainer())
            {
                const expression = path.node.expression;
                if (expression.type === "CallExpression" && (expression.callee as MemberExpression).property.name === "map")
                {
                    //
                    const raw_callee = generate((expression.callee as MemberExpression).object).code;
                    const callee = removeDataModelKeyword(raw_callee);

                    //
                    const arrow_function = expression.arguments[0] as ArrowFunctionExpression;
                    const [value_param, index_param] = arrow_function.params.map(param => (param as Identifier).name);
                    const for_directive = index_param ? `(${index_param},${value_param}) in ${callee}` : `${value_param} in ${callee}`;

                    path.replaceWith(jsxElement(
                        jsxOpeningElement(jsxIdentifier("block"), [jsxAttribute(jsxIdentifier("for"), stringLiteral(for_directive))]),
                        jsxClosingElement(jsxIdentifier("block")),
                        [arrow_function.body as JSXElement], false
                    ));
                }
                else if (expression.type === "Identifier")
                {
                    path.replaceWith(jsxExpressionContainer(stringLiteral(`${"{{"}${generate(expression).code}${"}}"}`)));
                }
            }
        }
    });

    traverse(tsx_ast, {
        enter(path)
        {
            /**
             * 处理props，把类型检测放到编译时。处理后仍为tsx代码
             */
            if (path.isClassProperty() && (path.node.key as Identifier).name === "props")
            {
                const obj_expression = path.node.value as ObjectExpression;
                for (const prop of obj_expression.properties)
                {
                    (prop as ObjectProperty).value = objectExpression([
                        objectProperty(
                            identifier("default"),
                            (prop as ObjectProperty).value
                        )
                    ]);
                }
            }
            else if (path.isThisExpression())
            {
                const parent_node = path.parentPath.node as MemberExpression;
                const prop_name = parent_node.property.name;
                if (isDataModelKeyword(prop_name))
                {
                    path.parentPath.replaceWithSourceString("this");
                }
            }
        }
    });

    const tsx_processed = generate(tsx_ast).code;

    /**
     * 使用typescript编译器的API将tsx代码翻译为jsx
     * @see {@link https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API}
     */
    const jsx_code = ts.transpileModule(tsx_processed, {
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
     * 因为如果组件名仍大写，生成vdom的时候会认为是自定义组件，报错找不到定义
     */
    const jsx_ast = parse(jsx_code, { sourceType: "module", plugins: ["jsx"] });

    /**
     * 方便查看ast的在线工具：@see {@link https://astexplorer.net/ }
     */
    traverse(jsx_ast, {
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
                /**
                 * 一致处理props传参和组件名
                 */
                const tag_name = generate(path.node).code;
                path.node.name = toDashed(tag_name);
            }
        }
    });

    const jsx_processed = generate(jsx_ast).code;

    return jsx_processed;
}