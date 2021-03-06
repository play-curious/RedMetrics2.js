const gulp = require("gulp");
const esbuild = require("gulp-esbuild");

function buildIife(bundle = false, minify = false) {
  let outfile = "rm2";
  if (bundle) outfile += ".bundle";
  if (minify) outfile += ".min";
  outfile += ".js";

  // This extremely strange syntax creates a dynamically named function
  // More info at https://stackoverflow.com/a/41854075
  return {
    [outfile]() {
      return gulp
        .src("src/index.ts")
        .pipe(
          esbuild({
            tsconfig: "tsconfig.iife.json",
            outfile,
            sourcemap: "external",
            format: "iife",
            minify,
            bundle,
            target: ["es2020", "chrome58", "firefox57", "safari11"],
            globalName: "rm2",
            loader: {
              ".ts": "ts",
              ".json": "json",
            },
          })
        )
        .pipe(gulp.dest("dist/iife"));
    },
  }[outfile];
}

function cjs() {
  return gulp
    .src("src/**/*.ts")
    .pipe(
      esbuild({
        tsconfig: "tsconfig.cjs.json",
        sourcemap: "external",
        format: "cjs",
        loader: {
          ".ts": "ts",
          ".json": "json",
        },
      })
    )
    .pipe(gulp.dest("dist/cjs"));
}

function esm() {
  return gulp
    .src("src/**/*.ts")
    .pipe(
      esbuild({
        tsconfig: "tsconfig.esm.json",
        sourcemap: "external",
        format: "esm",
        loader: {
          ".ts": "ts",
          ".json": "json",
        },
      })
    )
    .pipe(gulp.dest("dist/esm"));
}

function watch() {
  return gulp.watch("src/**/*.ts", bundle);
}

const iife = gulp.parallel(
  buildIife(false, false),
  buildIife(false, true),
  buildIife(true, false),
  buildIife(true, true)
);

const bundle = gulp.parallel(iife, cjs, esm);

exports.bundle = bundle;
exports.watch = gulp.series(bundle, watch);
exports.cjs = cjs;
exports.esm = esm;
exports.iife = iife;
