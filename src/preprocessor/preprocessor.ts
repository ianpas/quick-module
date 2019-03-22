import { readFileSync, writeFileSync } from "fs";

import { parse } from "@babel/parser";
import generate from "@babel/generator";
import traverse from "@babel/traverse";
import { jsxExpressionContainer, stringLiteral } from "@babel/types";

/**
 * @module 预处理器模块，主要是将jsx中JSXExpressionContainer之类的翻译成快应用的写法
 */

/**
* @param {string} src 需要预处理的jsx文件的绝对路径
* @returns {string} 预处理后的jsx代码
*/
export function preprocessFile(src: string)
{
    const jsx_code = readFileSync(src, "utf8");
    const preprocessed = preprocess(jsx_code);
    return preprocessed;
}

/**
* @param {string} jsx_code 需要预处理的jsx文件代码
* @returns {string} 预处理后的jsx代码
*/
export function preprocess(jsx_code: string)
{
    const ast = parse(jsx_code, { sourceType: "module", plugins: ["jsx"] });

    traverse(ast, {
        enter(path)
        {
            if (path.isJSXExpressionContainer())
            {
                const expression_type = path.node.expression.type;
                const code = generate(path.node).code;
                let expression = code.slice(1, code.length - 1).replace("this.", "");
                if (isAccessingFromDataModel(expression))
                {
                    expression = expression.replace(`${getFirstObjectName(expression)}.`,"");
                }

                if (expression_type === "MemberExpression" && path.parent.type === "JSXAttribute")
                {
                    /**
                     * 回调函数的话，{{}}可以省略，这样可以一致处理使用this访问数据和函数
                     * @see {@link https://doc.quickapp.cn/framework/template.html?h=%E7%9C%81%E7%95%A5}
                     */
                    path.replaceWith(stringLiteral(`${"{{"}${expression}${"}}"}`));
                }
                else if (expression_type === "CallExpression" && path.parent.type === "JSXAttribute")
                {
                    path.replaceWith(stringLiteral(`${"{{"}${expression}${"}}"}`));
                }
                else if (expression_type === "MemberExpression" && path.parent.type === "JSXElement")
                {
                    path.replaceWith(jsxExpressionContainer(stringLiteral(`${"{{"}${expression}${"}}"}`)));
                }
            }
        }
    });

    const preprocessed = generate(ast).code;
    return preprocessed;
}

function isAccessingFromDataModel(expression:string): boolean
{
    const data_models = ["data","props","private","protected","public"];
    const obj = getFirstObjectName(expression);
    return data_models.includes(obj);
}

function getFirstObjectName(expression): string
{
    return expression.split(".")[0];
}