const gulp = require("gulp");

const ts = require("gulp-typescript");
const ts_project = ts.createProject("tsconfig.json");

gulp.task("compile", () =>
{
    return gulp.src("./src/**/*.ts")
        .pipe(ts_project())
        .js.pipe(gulp.dest("./build"));
});

gulp.task("build", gulp.series("compile"));