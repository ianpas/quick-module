/**
 * 将符合jsx约定的组件名变为符合快应用约定的组件名
 * 如: TodoItem -> todo-item
 * @param {string} name 组件名
 */
export function toDashed(name: string)
{
    return name.replace(/[A-Z]/g, "-$&").toLowerCase().slice(1)
}

/**
 * 将符合jsx约定的组件名变为符合快应用约定的组件名的中间步骤
 * 如: TodoItem -> todo_item
 * @param {string} import_src 引入路径
 */
export function toUnderscored(name: string)
{
    return name.replace(/[A-Z]/g, "_$&").toLowerCase().slice(1)
}

/**
 * 根据标签名判断是否为自定义组件，根据jsx约定，首字母大写的标签代表自定义的组件
 * @param {string} tag_name 标签名
 */
export function isComponent(tag_name: string)
{
    return /^[A-Z]/.test(tag_name);
}

/**
 * 从import中的路径来判断要引入的模块是否为ux文件
 * @param {string} import_src 引入路径
 */
export function isUxModule(import_src: string)
{
    return import_src.endsWith(".ux");
}

/**
 * 从import中的路径来判断要引入的模块是否为样式文件
 * @param {string} import_src 引入路径
 */
export function isCssModule(import_src: string)
{
    const suffixes = [".css", ".scss", ".less"];
    for (const suffix of suffixes)
    {
        if (import_src.endsWith(suffix))
        {
            return true;
        }
    }
    return false;
}

/**
 * 将各个代码片段组合成一整段代码
 * @param {string[]} snippets 一堆代码片段
 */
export function combine(...snippets: Array<string>)
{
    return snippets.join("\r\n\r\n");
}