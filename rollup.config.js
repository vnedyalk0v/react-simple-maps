import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import { dts } from "rollup-plugin-dts";

import pkg from "./package.json" with { type: "json" };

const external = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
  "react/jsx-runtime",
];

const isProduction = process.env.NODE_ENV === "production";

export default [
  // UMD build for browsers
  {
    input: "src/index.ts",
    external,
    output: {
      name: "reactSimpleMaps",
      file: pkg.browser,
      format: "umd",
      extend: true,
      sourcemap: true,
      globals: {
        react: "React",
        "react-dom": "ReactDOM",
        "react/jsx-runtime": "React",
        "d3-geo": "d3",
        "d3-zoom": "d3",
        "d3-selection": "d3",
        "d3-color": "d3",
        "d3-interpolate": "d3",
        "topojson-client": "topojson",
      },
    },
    plugins: [
      resolve({
        browser: true,
        preferBuiltins: false,
      }),
      commonjs(),
      typescript({
        tsconfig: "./tsconfig.build.json",
        outDir: undefined,
        declaration: false,
        declarationMap: false,
        sourceMap: true,
      }),
      terser({
        compress: {
          drop_console: isProduction,
        },
        format: {
          comments: false,
        },
      }),
    ],
  },
  // ESM and CJS builds for Node.js
  {
    input: "src/index.ts",
    external,
    output: [
      {
        file: pkg.main,
        format: "cjs",
        sourcemap: true,
        exports: "named",
      },
      {
        file: pkg.module,
        format: "es",
        sourcemap: true,
      },
    ],
    plugins: [
      resolve({
        preferBuiltins: false,
      }),
      commonjs(),
      typescript({
        tsconfig: "./tsconfig.build.json",
        outDir: undefined,
        declaration: false,
        declarationMap: false,
        sourceMap: true,
      }),
    ],
  },
  // Type definitions bundle
  {
    input: "dist/types/index.d.ts",
    output: {
      file: "dist/index.d.ts",
      format: "es",
    },
    plugins: [dts()],
  },
];
