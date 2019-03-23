import { compileToJs } from "../src";
import { TestDataPath, GetTestData } from "./utility/utility";

test("compile jsx to js", () =>
{
    const jsx_code = GetTestData("common/sample.jsx");
    const { js_code, import_info } = compileToJs(jsx_code, TestDataPath("common/sample.tsx"));
    const to_compare = GetTestData("common/sample.js");
    expect(js_code).toEqual(to_compare);
    expect(import_info).toEqual({
        ux: [{ src: '../todo-item/todo-item.ux', name: 'todo-item' }],
        style: [{ src: './main.css', name: 'styles' }]
    });
})