import { extractStyleImport, compileTsx, preprocessTsx } from "../src";
import { GetTestData, TestDataPath } from "./utility/utility";
import { writeFileSync } from "fs";
import { resolve } from "path";

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

test("transform props", () =>
{
    const transformed = preprocessTsx(TestDataPath("common/props.tsx"));
    expect(transformed).toEqual(GetTestData("common/props.jsx"));
})