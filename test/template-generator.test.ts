import { generateTemplate } from "../src";

test("generate from JSXElement MemberExpression", () =>
{
    const template = generateTemplate({ type: 'text', props: {}, children: ['{{todoContent}}'] });
    expect(template).toEqual(`<template><text>{{todoContent}}</text></template>`);
})

test("generate with props", () =>
{
    const template = generateTemplate({ type: 'text', props: {class:"demo"}, children: [] });
    expect(template).toEqual(`<template><text class="demo"></text></template>`);
})