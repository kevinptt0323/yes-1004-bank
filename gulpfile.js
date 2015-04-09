var gulp           = require('gulp'),
    minifyCSS      = require('gulp-minify-css'),
    uglify         = require('gulp-uglifyjs'),
    rename         = require("gulp-rename"),
    less           = require('gulp-less'),
    mainBowerFiles = require('main-bower-files'),
    del            = require('del');

var paths = {
  webpages: {
    src: ['./src/**/*.html', './src/**/*.php'],
    dest: './dist'
  },
  js: {
    src: './src/js/*.js',
    dest: './dist/js'
  },
  less: {
    src: './src/css/*.less',
    dest: './dist/css'
  },
  lib: {
    src: mainBowerFiles(),
    dest: './dist/lib'
  },
  fonts: {
    src: 'bower_components/semantic-ui/src/themes/default/**',
    dest: './dist/lib'
  }
};

gulp.task('clean', function(callback) {
  del(['dist'], callback);
});

gulp.task('web-pages', ['clean'], function() {
  return gulp.src(paths.webpages.src, {base: './src'})
    .pipe(gulp.dest(paths.webpages.dest));
});

/*
gulp.task('UglifyJS', ['clean'], function() {
  return gulp.src(paths.js)
    .pipe(rename(function(path) {
        path.basename += ".min";
        path.extname = ".js";
    }))
    .pipe(uglify({
      outSourceMap: true
    }))
    .pipe(gulp.dest('./dist/js/'));
});
*/

gulp.task('Javascript', ['clean'], function() {
  return gulp.src(paths.js.src)
    .pipe(gulp.dest(paths.js.dest));
});

gulp.task('Less', ['clean'], function() {
  return gulp.src(paths.less.src)
    .pipe(less())
    //.pipe(minifyCSS())
    .pipe(gulp.dest(paths.less.dest));
});

gulp.task('bower-files', ['clean'], function() {
  return gulp.src(paths.lib.src)
    .pipe(gulp.dest(paths.lib.dest));
});

gulp.task('fonts', ['clean'], function() {
  console.log(paths.fonts.src);
  return gulp.src(paths.fonts.src, { base: './bower_components/semantic-ui/src' })
    .pipe(gulp.dest(paths.fonts.dest));
});

gulp.task('default', ['web-pages', 'Javascript', 'Less', 'bower-files', 'fonts']);
