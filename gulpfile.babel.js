const gulp = require('gulp');
const gulpif = require('gulp-if');
const csso = require('gulp-csso');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const prefix = require('gulp-autoprefixer');
const del = require('del');
const webpack = require('webpack');

const argv = require('minimist')(process.argv.slice(2));
const log = require('fancy-log');

const findup = require('findup-sync');
const node_modules = findup('node_modules');
const tildeImporter = require('node-sass-tilde-importer');
const sassOptions = {
    importer: tildeImporter,
    includePaths: [node_modules] // this will find any node_modules above the current working directory
};

const config = {
    dev: argv.dev === true,
    src: {
        style: './src/assets/style/main.scss',
        script: './src/assets/script/main.js'
    },
    dest: 'dist'
};

const webpackConfig = require('./webpack.config')(config);
const webpackCompiler = webpack(webpackConfig);

// Gulp Task definitions
gulp.task('clean', del.bind(this, [config.dest]));
// gulp.task('clean', cb => del([config.dest], cb));
gulp.task('styles', () =>
    gulp.src(config.src.style)
        .pipe(gulpif(config.dev, sourcemaps.init()))
        .pipe(sass(sassOptions).on('error', sass.logError))
        .pipe(prefix('last 1 version'))
        .pipe(gulpif(!config.dev, csso()))
        .pipe(gulpif(config.dev, sourcemaps.write()))
        .pipe(gulp.dest(config.dest + '/assets/css/')));
gulp.task('scripts', done => {
    webpackCompiler.run((error, result) => {
        if (error) {
            log.error(error);
        }
        const jsonResult = result.toJson();
        jsonResult.errors?.forEach(log.error);
        done();
    });
});
gulp.task('default', gulp.series(
    'clean',
    gulp.parallel(
        'styles',
        'scripts'
    )
));
