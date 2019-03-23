import { generateUxRefs, generateJsRef, generateStyleRef } from "../src";

test("generate ux refs", () =>
{
    const imoprted = [{ src: '../todo-item/todo-item.ux', name: 'todo-item' }];
    const refs = generateUxRefs(imoprted);
    expect(refs).toEqual(`<import src="../todo-item/todo-item.ux" name="todo-item"></import>`);
})

test("generate js ref", () =>
{
    const ref = generateJsRef("./todo-item/todo-item.tsx");
    expect(ref).toEqual(`<script>\r\n    export { default } from "./todo-item.js";\r\n</script>`);
})

test("generate style ref", () =>
{
    const imported = [{ src: './main.css', name: 'styles' }];
    const ref = generateStyleRef(imported);
    expect(ref).toEqual(`<style src="./main.css"></style>`);
})

test("generate style ref, less", () =>
{
    const imported = [{ src: './main.less', name: 'styles' }];
    const ref = generateStyleRef(imported);
    expect(ref).toEqual(`<style src="./main.less" lang="less"></style>`);
})