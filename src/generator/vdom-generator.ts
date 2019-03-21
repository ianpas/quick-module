import { transformSync } from "@babel/core";
import { parse } from "@babel/parser";
import generate from "@babel/generator";
import traverse from "@babel/traverse";

import * as requireFromString from "require-from-string";

/**
 * 读入预处理后的jsx代码，生成template函数所描述的vdom
 * @param {string} preprocessed 预处理后的jsx代码
 */
export function generateVdom(preprocessed: string)
{
    const jsx_element = extractJsxElementFromTemplate(preprocessed);
    const vdom = generateVdomFromJsxElement(jsx_element);
    return vdom;
}

/**
 * 读入预处理后的jsx代码，将template函数返回部分的代码作为字符串返回。
 * 
 * @param {string} preprocessed 预处理后的jsx代码，比如
   export default {
   template()
        {
            return (
                <text>hi</text>
            );
        }
    }
 * @returns {string} template函数中返回部分的jsx对象代码，比如"<text>hi</text>"
 * 
 */
export function extractJsxElementFromTemplate(preprocessed: string)
{
    const ast = parse(preprocessed, { sourceType: "module", plugins: ["jsx"] });

    let jsx_element = "";

    traverse(ast, {
        enter(path)
        {
            if (path.isReturnStatement())
            {
                const method_root = path.parentPath.parent;
                if (method_root.type === "ObjectMethod" && method_root.key.name === "template")
                {
                    jsx_element = generate(path.node.argument).code;
                }
            }
        }
    });

    return jsx_element;
}

/**
 * 从jsx对象的代码，生成并返回这个jsx对象描述的vdom
 * @param {string} jsx_element jsx对象的代码，比如："<text>hi</text>"
 * @returns {IVirtualDom} 比如：{ type: 'text', props: {}, children: ['hi'] }
 */
export function generateVdomFromJsxElement(jsx_element: string)
{
    const options = {
        plugins: [
            [
                "@babel/plugin-transform-react-jsx",
                {
                    "pragma": "createElement",
                    "throwIfNamespace": false
                }
            ]
        ],
        /**
         * 坑：如果不指定cwd，默认为"."，会出现找不到@babel/plugin-transform-react-jsx的错误
         * @see{@link https://stackoverflow.com/questions/52808956/babel-core-transform-function-cannot-find-plugin}
         */
        cwd: __dirname
    };
    const jsx_transformed = transformSync(jsx_element, options).code;
    const pragma = `function createElement(type, props, ...children)
    {
        return { type, props: props || {}, children: children || [] };
    }`;
    const code = `${pragma}\r\nmodule.exports=${jsx_transformed}`

    /**
     * 这里要做的事情是，从代码字符串生成对象，即从jsx的字符串，生成vdom。
     * 所以需要动态计算，或者说动态执行js代码，现在的做法是使用require-from-string
     * 从字符串生成一个模块对象，然后得到这个对象
     * @see {@link https://www.npmjs.com/package/require-from-string}
     * @todo 寻求更好的做法
     */
    const vdom: IVirtualDom = requireFromString(code);
    return vdom;
}

export interface IVirtualDom
{
    type: string;
    props?: { [index: string]: string | number },
    children?: Array<IVirtualDom | string>
}