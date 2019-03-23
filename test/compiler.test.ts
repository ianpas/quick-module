import { compile } from "../src";
import { TestDataPath } from "./utility/utility";

test("compiler", () =>
{
    expect(() =>
    {
        compile(TestDataPath("common/compiler/sample.tsx"));
    }).not.toThrow();
})