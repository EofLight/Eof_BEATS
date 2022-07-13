const { src, dest, task, series, watch, parallel } = require("gulp");
const rm = require("gulp-rm");
const sass = require("gulp-sass")(require("node-sass"));
const concat = require("gulp-concat");
const browserSync = require("browser-sync").create();
const reload = browserSync.reload;
const sassGlob = require("gulp-sass-glob");
const autoprefixer = require("gulp-autoprefixer");
const px2rem = require("gulp-smile-px2rem");
const gcmq = require("gulp-group-css-media-queries");
const cleanCSS = require("gulp-clean-css");
const sourcemaps = require("gulp-sourcemaps");
const babel = require("gulp-babel");
const uglify = require("gulp-uglify");
const svgo = require("gulp-svgo");
const svgSprite = require("gulp-svg-sprite");
const guilpif = require("gulp-if");
//sass.compiler = require("node-sass");

const env = process.env.NODE_ENV;

task("clean", () => {
  return src("docs/**/*", { read: false }).pipe(rm());
});

const filesToCopy = ["src/img/**/*", "!src/img/*.svg", "src/img/sprite.svg"];

task("copy", () => {
  return src(filesToCopy)
    .pipe(dest("docs/img"))
    .pipe(reload({ stream: true }));
});
task("copy:html", () => {
  return src("src/*.html")
    .pipe(dest("docs"))
    .pipe(reload({ stream: true }));
});

const styles = [
  "node_modules/normalize.css/normalize.css",
  "src/css/main.scss",
];

task("css", () => {
  return (
    src(styles)
      .pipe(guilpif(env === "dev", sourcemaps.init()))
      .pipe(concat("main.scss"))
      .pipe(sassGlob())
      .pipe(sass().on("error", sass.logError))
      .pipe(guilpif(env === "prod", gcmq()))
      //.pipe(px2rem())
      .pipe(
        guilpif(
          env === "dev",
          autoprefixer({
            cascade: false,
          })
        )
      )
      .pipe(guilpif(env === "prod", cleanCSS()))
      .pipe(guilpif(env === "dev", sourcemaps.write()))
      .pipe(dest("./docs"))
      .pipe(reload({ stream: true }))
  );
});
const libs = ["src/scripts/*.js"];

task("scripts", () => {
  return src(libs)
    .pipe(guilpif(env === "dev", sourcemaps.init()))
    .pipe(concat("main-js.js", { newLine: ";" }))
    .pipe(
      guilpif(
        env === "prod",
        babel({
          presets: ["@babel/env"],
        })
      )
    )
    .pipe(guilpif(env === "prod", uglify()))
    .pipe(guilpif(env === "dev", sourcemaps.write()))
    .pipe(dest("./docs"))
    .pipe(reload({ stream: true }));
});

task("icons", () => {
  return src("src/img/**/*.svg").pipe(dest("./docs/img"));
});

task("server", () => {
  browserSync.init({
    server: {
      baseDir: "./docs",
    },
    open: false,
  });
});

task("watch",()=>{
    watch("./src/css/**/*.scss", series("css"));
    watch("./src/*.html", series("copy:html"));
    watch("./src/img/**/*", series("copy"));
    watch("./src/scripts/*js", series("scripts"));
    watch("./src/img/**/*.svg", series("icons"));
})

task(
  "default",
  series(
    "clean",
    parallel("copy:html", "copy", "css", "scripts", "icons"),
    parallel("watch","server")
  )
);

task(
    "build",
    series(
      "clean",
      parallel("copy:html", "copy", "css", "scripts", "icons")
    )
  );
