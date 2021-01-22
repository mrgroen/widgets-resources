import { red, yellow } from "colors";
import { mkdirSync, promises } from "fs";
import { join, relative } from "path";
import clear from "rollup-plugin-clear";
import command from "rollup-plugin-command";
import { cp } from "shelljs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import { collectNativeDependencies } from "../../../tools/pluggable-widgets-tools/configs/rollup-plugin-collect-native-dependencies";

const cwd = process.cwd();

export default async args => {
    const jsActionTargetFolder = `javascriptsource/${args.configProject ?? "nativemobileresources"}/actions`;
    const result = [];
    const files = await findFiles();
    const outDir = join(cwd, "dist");

    files.forEach((file, i) => {
        const fileInput = file.path.replace(join(cwd, "/"), "");
        const [fileOutput] = file.name.split(".");
        result.push({
            input: fileInput,
            output: {
                format: "es",
                file: join(outDir, `${fileOutput}.js`),
                sourcemap: false
            },
            external: nativeExternal,
            plugins: [
                ...(i === 0 ? [clear({ targets: [outDir] })] : []),
                collectNativeDependencies(nativeExternal, outDir, true, fileOutput, i === 0),
                nodeResolve({ preferBuiltins: false, mainFields: ["module", "browser", "main"] }),
                typescript({
                    noEmitOnError: false,
                    sourceMap: false,
                    inlineSources: false,
                    target: "es2019",
                    types: ["mendix-client", "big.js", "react-native"],
                    allowSyntheticDefaultImports: true
                }),
                command([
                    () => {
                        if (i === files.length - 1) {
                            const destinationFolder = join(cwd, "./tests/testProject/", jsActionTargetFolder);
                            const destinations = [
                                destinationFolder,
                                ...[
                                    process.env.MX_PROJECT_PATH
                                        ? join(process.env.MX_PROJECT_PATH, jsActionTargetFolder)
                                        : undefined
                                ]
                            ];

                            destinations.forEach(destination => {
                                mkdirSync(destination, { recursive: true });
                                cp("-r", join(outDir, "*"), destination);
                            });
                        }
                    }
                ])
            ],
            onwarn
        });
    });

    return result;

    async function findFiles(dir = join(cwd, "src")) {
        const directoryFiles = await promises.readdir(dir, { withFileTypes: true });
        const files = [];
        for (const file of directoryFiles) {
            if (file.isDirectory()) {
                files.push(...(await findFiles(join(dir, file.name))));
            } else if (/.*.((js|ts)x?)$/.test(file.name)) {
                files.push({ path: join(dir, file.name), name: file.name });
            }
        }
        return files;
    }

    function onwarn(warning) {
        const description =
            (warning.plugin ? `(${warning.plugin} plugin) ` : "") +
            (warning.loc ? `${relative(cwd, warning.loc.file)} (${warning.loc.line}:${warning.loc.column}) ` : "") +
            `Error: ${warning.message}` +
            (warning.frame ? warning.frame : "");

        // Many rollup warnings are indication of some critical issue, so we should treat them as errors,
        // except a short white-list which we know is safe _and_ not easily fixable.
        if (["CIRCULAR_DEPENDENCY", "THIS_IS_UNDEFINED", "UNUSED_EXTERNAL_IMPORT"].includes(warning.code)) {
            console.warn(yellow(description));
        } else if (args.watch) {
            // Do not break watch mode because of an error. Also don't use console.error, since it is overwritten by rollup
            console.warn(red(description));
        } else {
            console.error(red(description));
            process.exit(1);
        }
    }
};

const nativeExternal = [
    /^mendix\//,
    /^react-native(\/|$)/,
    "big.js",
    "react",
    /react-native-gesture-handler\/*/,
    "react-native-reanimated",
    "react-native-svg",
    "react-native-vector-icons",
    "react-navigation",
    "url-parse"
];
