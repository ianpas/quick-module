import { generateVdomFromJsxElement, generateVdom } from "../src";

test("generate vdom from simple jsx", () =>
{
    const vdom = generateVdomFromJsxElement(`<text>hi</text>`);
    expect(vdom).toEqual({ type: 'text', props: {}, children: ['hi'] });
})

test("generate vdom from JSXElement MemberExpression", () =>
{
    const vdom = generateVdomFromJsxElement(`<text>{"{{todoContent}}"}</text>`);
    expect(vdom).toEqual({ type: 'text', props: {}, children: ['{{todoContent}}'] });
})

test("generate vdom from jsx code", () =>
{
    const vdom = generateVdom(`
        class Test {
            template()
            {
                return (
                    <text>hi</text>
                );
            }
        }
        export default Test`
    );

    expect(vdom).toEqual({ type: 'text', props: {}, children: ['hi'] });
})