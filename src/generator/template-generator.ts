import { IVirtualDom } from "./vdom-generator";

/**
 * 将vdom翻译成快应用中的template标签部分
 * @param {IVirtualDom} vdom 比如：{ type: 'text', props: {}, children: ['hi'] }
 * @returns {string} 快应用中的template标签部分，比如`<template><text>hi</text></template>`
 */
export function generateTemplate(vdom: IVirtualDom)
{
    const template = generateTag({
        type: "template",
        children: [vdom]
    });

    return template;
}

/**
 * 生成vdom对应的快应用组件标签
 * @param {IVirtualDom} vdom 比如：{ type: 'text', props: {}, children: ['hi'] }
 * @returns {string} 快应用中的标签，比如`<text>hi</text>`
 */
export function generateTag(vdom: IVirtualDom)
{
    const name = vdom.type;
    const props = generateProps(vdom.props);
    const children = generateChildren(vdom.children);
    const tag = `<${name}${props ? " " + props : ""}>${children}</${name}>`;
    return tag;
}

/**
 * 使用vdom中的props生成标签中的属性，主要是从json对象转换成包含一连串key=value的字符串
 * @param {{ [index: string]: string | number }} props 标签中的属性
 */
function generateProps(props: { [index: string]: string | number })
{
    const prop_list = [];
    for (const key in props)
    {
        const prop_key = genearateKey(key);
        const prop_value = generateValue(props[key]);

        if(prop_key==="else")
        {
            prop_list.push(`${prop_key}`);
        }
        else
        {
            prop_list.push(`${prop_key}=${prop_value}`);
        }
    }
    return prop_list.join(" ");
}

function genearateKey(key: string)
{
    return key;
}

function generateValue(value: string | number)
{
    return `"${value}"`;
}

function generateChildren(children: Array<IVirtualDom | string>)
{
    if (!children || children.length === 0)
    {
        return "";
    }

    const child_list: Array<string> = children.map(child => typeof child === "string" ? child : generateTag(child));
    return child_list.join("");
}

