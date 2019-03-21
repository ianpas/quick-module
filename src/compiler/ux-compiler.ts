import { generateUxRefs, generateJsRef, generateStyleRef } from "../generator/reference-generator";
import { generateVdom } from "../generator/vdom-generator";
import { generateTemplate } from "../generator/template-generator";

import { readFileSync } from "fs";

import * as formatXml from "xml-formatter";
import { ModuleInfo, ImportInfo } from "./js-compiler";
import { combine } from "../utility/utility";
import { preprocess } from "../preprocessor/preprocessor";

/**
 * 从预处理后的jsx代码，翻译得到ux文件中的代码
 * @param {string} src 预处理后的jsx文件的绝对路径 
 */
export function compileUx(src: string, import_info: ImportInfo)
{
    //
    const preprocessed = preprocess(readFileSync(src, "utf8"));

    //
    const template_snippet = compileTemplate({
        preprocessed, ux_imported: import_info.ux
    });

    const script_snippet = generateJsRef(src);
    const style_snippet = generateStyleRef(import_info.style);

    return combine(template_snippet, script_snippet, style_snippet);
}

/**
 * 从预处理后的jsx代码，翻译得到ux文件中template相关的代码
 * @param {string} preprocessed 预处理后的jsx代码
 */

export function compileTemplate({ preprocessed, ux_imported, prettify = true }: { preprocessed: string, ux_imported: Array<ModuleInfo>, prettify?: boolean })
{
    const ux_refs = generateUxRefs(ux_imported);
    const template = generateTemplate(generateVdom(preprocessed));
    const prettified = prettify ? formatXml(template, { collapseContent: true }) : template;
    return combine(ux_refs, prettified);
}