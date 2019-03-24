import { TestDataPath, GetTestData } from "./utility/utility";
import { compileToUx, compileTemplate } from "../src";

test("generate ux file code", () =>
{
    const jsx_code = GetTestData("common/sample.jsx");
    const ux = compileToUx(jsx_code, TestDataPath("common/sample.tsx"), {
        ux: [{ src: './todo-item/todo-item.ux', name: 'todo-item' }],
        style: [{ src: './main.css', name: 'styles' }]
    });

    expect(ux).toEqual(GetTestData("common/sample.ux"));
})

test("compile template", () =>
{
    const preprocessed = `
        class Test {
            template() {
                return <div class="main-page">
                            hi
                        </div>;
            }
        }
        export default Test;
    `;
    const template = compileTemplate({
        preprocessed,
        ux_imported: [{ src: '../todo-item/todo-item.ux', name: 'todo-item' }],
        prettify: false
    });

    expect(template).toEqual(`<import src="../todo-item/todo-item.ux" name="todo-item"></import>\r\n\r\n<template><div class="main-page">hi</div></template>`);
})