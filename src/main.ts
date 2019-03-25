#!/usr/bin/env node
import { compile } from "./index";
import * as watch from "node-watch";
import * as program from "commander";
import { resolve } from "path";
import * as traverse from "filewalker";
import * as isDirectory from "is-directory";

program.version("0.0.1")
    .option("-c, --compile <file_name>", "compile tsx file")
    .option("-w, --watch <file_name/dir_name>", "watch and compile tsx file")
    .parse(process.argv);

if (program.compile)
{
    const absolute_path = resolvePath(program.compile);
    if (isDirectory.sync(absolute_path))
    {
        traverse(absolute_path).on("file", (relative, stats, absolute) =>
        {
            if (absolute.endsWith(".tsx"))
            {
                compile(absolute);
            }
        }).walk();
    }
    else
    {
        compile(absolute_path);
    }
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


/**
 * utility
 */

function isRelative(target: string)
{
    return target.startsWith("./") || target.startsWith("../");
}

function resolvePath(target: string)
{
    return isRelative(target) ? resolve(process.cwd(), target) : target;
}