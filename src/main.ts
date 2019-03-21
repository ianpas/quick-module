#!/usr/bin/env node
import { compile } from "./index";
import * as watch from "node-watch";
import * as program from "commander";
import { resolve } from "path";

program.version("0.0.1")
    .option("-c, --compile <file_name>", "compile tsx file")
    .option("-w, --watch <file_name/dir_name>", "watch and compile tsx file")
    .parse(process.argv);

if (program.compile)
{
    const absolute_path = resolvePath(program.compile);
    compile(absolute_path);
}
else if (program.watch)
{
    const absolute_path = resolvePath(program.watch);
    console.log("to compile something..!");
    watch(absolute_path, { recursive: true }, (event, file) =>
    {
        if (file.endsWith(".tsx"))
        {
            try 
            {
                compile(file);
                console.log(`compile ${file} succeed.`)
            }
            catch (error) 
            {
                console.log(error);
            }
        }
    })
}

function resolvePath(file_name: string)
{
    if (file_name.startsWith("./") || file_name.startsWith("../"))
    {
        return resolve(process.cwd(), file_name);
    }
    else
    {
        return file_name;
    }
}