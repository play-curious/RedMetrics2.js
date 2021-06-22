const gulp = require("gulp");
const tsc = require("gulp-typescript");
const esbuild = require("gulp-esbuild");

function iife() {
  return gulp
    .src("src/index.ts")
    .pipe(
      esbuild({
        tsconfig: "tsconfig.iife.json",
        outfile: "redmetrics.bundle.js",
        sourcemap: "external",
        format: "iife",
        minify: true,
        bundle: true,
        target: ["es2020", "chrome58", "firefox57", "safari11"],
        globalName: "RedMetrics",
        loader: {
          ".ts": "ts",
          ".json": "json",
        },
      })
    )
    .pipe(gulp.dest("dist/iife"));
}

function cjs() {
  return gulp
    .src("src/**/*.ts")
    .pipe(tsc("tsconfig.cjs.json"))
    .pipe(gulp.dest("dist/cjs"));
}

function esm() {
  return gulp
    .src("src/**/*.ts")
    .pipe(tsc("tsconfig.esm.json"))
    .pipe(gulp.dest("dist/esm"));
}

function watch() {
  return gulp.watch("src/**/*.ts", bundle);
}

const bundle = gulp.parallel(iife, cjs, esm);

exports.bundle = bundle;
exports.watch = gulp.series(bundle, watch);
exports.iife = iife;
exports.cjs = cjs;
exports.esm = esm;
