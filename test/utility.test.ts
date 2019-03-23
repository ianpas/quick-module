import { uxPath } from "../src/utility/utility";
import { resolve } from "path";

test("resolve ux path", () =>
{
    const resolved = uxPath(resolve(__dirname, "./common/sample.tsx"), "components/lib.tsx");
    expect(resolved).toEqual(`../../node_modules/components/lib.tsx`);
})