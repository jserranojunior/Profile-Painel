var gulp = require("gulp");


gulp.task("purge", () => {
  var rename = require("gulp-rename");
  const atimport = require("postcss-import");
  const postcss = require("gulp-postcss");
  const purgecss = require("@fullhuman/postcss-purgecss");
  const tailwindcss = require("tailwindcss");

  const TAILWIND_CONFIG = "./tailwind.config.js";
  const SOURCE_STYLESHEET = "./src/styles/tailwindfull.css";
  const DESTINATION_STYLESHEET = "./dist/assets/css";
  const cleanCSS = require("gulp-clean-css");
  return gulp.src(SOURCE_STYLESHEET)
    .pipe(
      postcss([
        atimport(),
        tailwindcss(TAILWIND_CONFIG),
        ...(process.env.NODE_ENV === "production"
          ? [
            purgecss({
              content: ["./build/*.html"],

              defaultExtractor: (content) => {
                const broadMatches =
                  content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || [];
                const innerMatches =
                  content.match(/[^<>"'`\s.()]*[^<>"'`\s.():=]/g) || [];

                return broadMatches.concat(innerMatches);
              },
            }),
          ]
          : []),
      ])
    )
    .pipe(cleanCSS({ compatibility: "ie8" }))
    .pipe(rename("tailwind-purge-min.css"))
    .pipe(gulp.dest(DESTINATION_STYLESHEET))

}
);

gulp.task("tail", gulp.parallel("purge"));
