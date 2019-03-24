import { preprocess } from "../src";

function assert({ input, preprocessed }: { input: string, preprocessed: string })
{
    expect(preprocess(input)).toEqual(preprocessed);
}

test("JSXAttribute MemberExpression: this.method", () =>
{
    assert({
        input: `<input onChange={this.toggleTodo}></input>`,
        preprocessed: `<input onChange="{{toggleTodo}}"></input>;`
    })
})

test("JSXAttribute CallExpression", () =>
{
    assert({
        input: `<input checked={this.isChecked()} />`,
        preprocessed: `<input checked="{{isChecked()}}" />;`
    })
})

test("JSXAttribute Identifier: if or show", () =>
{
    assert({
        input: ` <div class="city" if={this.private.showCityList === true} show={this.private.showCityList === true}></div>`,
        preprocessed: `<div class="city" if="{{private.showCityList === true}}" show="{{private.showCityList === true}}"></div>;`
    })
})

test("JSXElement MemberExpression", () =>
{
    assert({
        input: `<text>{this.todoContent}</text>`,
        preprocessed: `<text>{"{{todoContent}}"}</text>;`
    })
})

