import { renameComponent, extractStyleImport, compileTsx } from "../src";
import { GetTestData, TestDataPath } from "./utility/utility";

test("rename component", () =>
{
    const renamed = renameComponent(TestDataPath("common/sample.tsx"));
    const to_compare = GetTestData("common/sample-renamed.jsx");
    expect(renamed).toEqual(to_compare);
})

test("extract style import", () =>
{
    const style_imported = extractStyleImport(TestDataPath("common/sample.tsx"));
    expect(style_imported).toEqual(['import styles from "./main.css";']);
})

test("compile tsx to jsx", () =>
{
    const compiled = compileTsx(TestDataPath("common/sample.tsx"));
    const to_compare = GetTestData("common/sample.jsx");
    expect(compiled).toEqual(to_compare);
})