/// <binding ProjectOpened='watch' />
'use strict';

// package.json dependencies explained:

/*

    "~1.0.2" = semver syntax for "fetch latest patch version", e.g. if 1.0.2 was stated but 1.0.4 is available, pulls 1.0.4

    @babel/core: babel transpiles modern ES syntax down to older syntax, for cross-browser compatibility

    @babel/preset-env: preset environment for babel
    
    codemirror: because the Portal makes heavy use of codemirror in Product Type Maintenance
    
    cm6-theme-*: because codemirror themes

    @popperjs/core: popper because popper rocks

    @progress/kendo-theme-default: because the default theme from Telerik is the least visually offensive

    @rollup/plugin-node-resolve: node plugin resolver for rollup

    autoprefixer: sadly in 2023 we still need css vendor prefixes in some cases, this does that

    bootstrap: because bootstrap kicks ass
    
    del: for deleting generated files in our Clean wossname

    eslint4b-prebuilt-2: codemirror linter

    font-awesome: don't really mind pulling FA here, though I do have an account and their modern way is to pull a bundle from their CDN

    gulp: gulp is necessary for doing all our lovely magic

    gulp-babel: babel plugin for gulp

    gulp-best-rollup-2: rollup plugin for gulp, requires @rollup/plugin-node-resolve

    gulp-concat: for concatenating files in a gulp vinyl stream

    gulp-csso: for gulp css based operations, is supported by sourcemaps plugin

    gulp-filter: for filtering files out of a gulp stream

    gulp-postcss: for piping css through things like autoprefixer

    gulp-rename: for renaming files in a vinyl stream

    gulp-sass: for compiling sass into css

    gulp-sourcemaps: for building sourcemaps while compiling or minifying

    gulp-terser: for minifying js

    knockout: because it's brilliant

    knockout.validation: because knockout validation is brilliant

    knockout-kendo: because knockout-kendo is brilliant

    knockout-pre-rendered: because knockout-pre-rendered is brilliant

    material: Google's MDC core

    material-components-web: because we pinch things out of here such as floaty label wossnames

    mdb-ui-kit: this is a material design bootstrap thing from some cool people, I just pull it in because I then pilfer it for their ripple effect

    merge-stream: this is for merging vinyl streams

    rollup: this is for rolling up es6 modules into UMD files, uses through gulp-rollup,

    sass: required by gulp-sass, this is the actual compiler

    udoc: required to convert EMF / WMF embedded images from Office programs into web-renderable images
*/

const
    gulp = require('gulp'),
    concat = require('gulp-concat'),
    csso = require('gulp-csso'),
    debug = require('gulp-debug'),
    del = require('del'),
    sass = require('gulp-sass')(require('sass')),
    filter = require('gulp-filter'),
    terser = require('gulp-terser'),
    sourcemaps = require('gulp-sourcemaps'),
    merge = require('merge-stream'),
    babel = require('gulp-babel'),
    postcss = require('gulp-postcss'),
    rename = require('gulp-rename'),
    autoprefixer = require('autoprefixer'),
    rollup = require('rollup'),
    rollupNodeResolve = require('@rollup/plugin-node-resolve'),
    gulprollup = require('gulp-best-rollup-2');

// handy glob tester: https://codepen.io/mrmlnc/full/OXQjMe
const micromatches = {
    scss: ['css/src/**/*.scss'],
    scssCopyErrata: ['css/src/**/*.*', '!css/src/**/*.scss'],
    js: ['js/src/**/!(*.min).{js,mjs}', '!js/src/**/*.rollup.js'],
    rollup: ['js/src/**/*.rollup.js']
}

const destinations = {
    css: 'css/dist',
    js: 'js/dist',
    rollupjs: 'js/src',
}

function wildcardscss() {
    var tasks = gulp
        .src(micromatches.scss, { since: gulp.lastRun(wildcardscss) })
        .pipe(debug())
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.mapSources(function (sourcePath, file) {
            return `/${destinations.css}/${sourcePath}`;
        }))
        .pipe(sass({
            includePaths: ['node_modules']
        }).on('error', sass.logError))
        //.pipe(postcss([autoprefixer()]))
        .pipe(sourcemaps.write(''))
        .pipe(gulp.dest(destinations.css))
        .pipe(filter('**/*.css'))
        .pipe(csso({
            sourceMap: true
        }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(sourcemaps.write('', {
            sourceMappingURL: (file) => {
                let replaced = file.relative.replace(/\\/g, '/');
                let final = `/${destinations.css}/${replaced}.map`;
                //console.log(`file.relative: "${file.relative}"`);
                //console.log(`replaced: ${replaced}`);
                //console.log(`final: ${final}`);
                return final;
            }
        }))
        .pipe(gulp.dest(destinations.css));

    return merge(tasks);
}

function wildcardjs() {
    var tasks = gulp
        .src(micromatches.js, { since: gulp.lastRun(wildcardjs) })
        .pipe(debug())
        .pipe(sourcemaps.init())
        //.pipe(babel({
        //    presets: ['@babel/preset-env']
        //}))
        .pipe(terser(
            // {
            // mangle: false
            // }
        ))
        .pipe(rename({ suffix: '.min', extname: '.js' }))
        .pipe(sourcemaps.write('', {
            sourceMappingURL: (file) => {
                let replaced = file.relative.replace(/\\/g, '/');
                let final = `/${destinations.js}/${replaced}.map`;
                //console.log(`file.relative: "${file.relative}"`);
                //console.log(`replaced: ${replaced}`);
                //console.log(`final: ${final}`);
                return final;
            }
        }))
        .pipe(gulp.dest(destinations.js));

    return merge(tasks);
}

function wildcardrollup() {
    var tasks = gulp
        .src(micromatches.rollup, { since: gulp.lastRun(wildcardrollup) })
        .pipe(gulprollup({
            rollup: rollup,
            plugins: [rollupNodeResolve()]
        }, 'umd'))
        .pipe(rename(function (path) {
            path.basename = path.basename.replace(/\.rollup/g, '.bundle');
            return path;
        }))
        .pipe(gulp.dest(destinations.rollupjs))
    return merge(tasks);
}

function scssCopyErrata() {
    var tasks = gulp
        .src(micromatches.scssCopyErrata)
        .pipe(gulp.dest(destinations.css));

    return merge(tasks);
}

function cleanDestinationDirectories() {
    return del(['css/dist/**/*', 'js/dist/**/*']);
}

gulp.task('watch', function () {

    gulp.watch(micromatches.scss, { usePolling: true }, gulp.series([wildcardscss, scssCopyErrata]));

    gulp.watch(micromatches.js, { usePolling: true }, gulp.series([wildcardjs]))

    gulp.watch(micromatches.rollup, { usePolling: true }, gulp.series([wildcardrollup]));

    gulp.watch(micromatches.scssCopyErrata, { usePolling: true }, gulp.series([scssCopyErrata]));

});

gulp.task('clean', gulp.series([cleanDestinationDirectories]))