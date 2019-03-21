import { TestDataPath, GetTestData } from "./utility/utility";
import { compileUx } from "../src";

test("generate ux file code", () =>
{
    const ux = compileUx(TestDataPath("common/sample.jsx"), {
        ux: [{ src: '../todo-item/todo-item.ux', name: 'todo-item' }],
        style: [{ src: './main.css', name: 'styles' }]
    });

    expect(ux).toEqual(GetTestData("common/sample.ux"));
})