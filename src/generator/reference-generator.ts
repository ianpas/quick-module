import { ModuleInfo } from "../compiler/js-compiler";
import { generateTag } from "./template-generator";
import { basename } from "path";

/**
 * 生成快应用中引入组件的import标签
 * @param {ModuleInfo[]} imported 引入组件的名字和路径
 * @returns {string} 将这些标签作为字符串返回，用于拼接最后的ux文件
 */
export function generateUxRefs(imported: Array<ModuleInfo>)
{
    const ux_refs = imported.map(each => generateTag({
        type: "import",
        props: { ...each }
    }));

    return ux_refs.join("\r\n");
}

/**
 * 生成快应用中引用js的标签
 * @param {string} jsx_src jsx文件的路径
 * @returns {string} 将这个标签作为字符串返回，用于拼接最后的ux文件
 */
export function generateJsRef(jsx_src: string)
{
    const script_name = basename(jsx_src).replace("jsx", "js");
    const script_tag = generateTag({
        type: "script",
        children: [`\r\n    export { default } from "./${script_name}";\r\n`]
    });
    return script_tag;
}

/**
 * 生成快应用中引用样式的标签
 * @param {ModuleInfo[]} imported 引入样式的信息
 * @returns {string} 将这个标签作为字符串返回，用于拼接最后的ux文件
 */
export function generateStyleRef(imported: ModuleInfo[])
{
    /**
     * @todo 好像只能使用一个样式标签，先暂时这样
     */
    if (imported.length === 1)
    {

        const style_info = imported[0];
        const style_tag = generateTag({
            type: "style",
            props: {
                src: style_info.src
            }
        });
        return style_tag;
    }
}