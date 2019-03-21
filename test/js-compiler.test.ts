import { compileJs } from "../src";
import { TestDataPath, GetTestData } from "./utility/utility";

test("compile jsx to js", () =>
{
    const { js_code, import_info } = compileJs(TestDataPath("common/sample.jsx"));
    const to_compare = GetTestData("common/sample.js");
    expect(js_code).toEqual(to_compare);
    expect(import_info).toEqual({
        ux: [{ src: '../todo-item/todo-item.ux', name: 'todo-item' }],
        style: [{ src: './main.css', name: 'styles' }]
    });
})