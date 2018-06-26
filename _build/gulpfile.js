// Include gulp
var gulp = require('gulp');

// Define base folders
var src = '../src/';
var dest = '../deploy/';

// Include Our Plugins
var jshint      = require('gulp-jshint');
var concat      = require('gulp-concat');
var declare     = require('gulp-declare');
var wrap        = require('gulp-wrap');
var handlebars  = require('gulp-handlebars');
var sass        = require('gulp-sass');
var uglify      = require('gulp-uglify');
var rename      = require('gulp-rename');
var merge       = require('merge-stream');

/**
 * --------------------------------------------------------
 * Gulp Tasks 
 * --------------------------------------------------------
 */
// Lint
gulp.task('lint', function() {
    return gulp.src(src + 'scripts/app/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Compile Sass
gulp.task('sass-dev', function() {
    return gulp.src(src + 'stylesheets/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest(dest + 'css'));
});

// Compile Sass
gulp.task('sass-prod', function() {
    return gulp.src(src + 'stylesheets/**/*.scss')
        .pipe(sass({ outputStyle: 'compressed' }))
        .pipe(gulp.dest(dest + 'css'));
});

// Concatenate & Minify JS for Development
gulp.task('scripts-dev', function() {
	var initializer = gulp.src(src + "scripts/init.js")
		.pipe(concat('init.js'))
		.pipe(gulp.dest(dest + "js"));

	var main = gulp.src(src + 'scripts/app/**/*.js')
        .pipe(concat('main.js'))
        .pipe(gulp.dest(dest + 'js'));

  return merge(initializer, main);
});

// Concatenate & Minify JS for Production
gulp.task('scripts-prod', function() {
	var initializer = gulp.src(src + "scripts/init.js")
        .pipe(concat('init.js'))
        .pipe(uglify())
		.pipe(gulp.dest(dest + "js"));

	var main = gulp.src(src + 'scripts/app/**/*.js')
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(dest + 'js'));

  return merge(initializer, main);
});

// Concatenate and minify HTML templates
gulp.task('html-tpl', function() {
    gulp.src(src + 'scripts/**/*.html')
        // Compile each Handlebars template source file to a template function
        .pipe(handlebars({
          handlebars: require('handlebars')
        }))
        // Wrap each template function in a call to Handlebars.template
        .pipe(wrap('Handlebars.template(<%= contents %>)'))
        .pipe(declare({
            root: 'templates',
            noRedeclare: true, // Avoid duplicate declarations
        }))
        // Concatenate down to a single file
        .pipe(concat('templates.js'))
        // Add the Handlebars module in the final output
        .pipe(wrap('define("templates", function() { var Handlebars = require("handlebars"); var templates = []; \n <%= contents %> return templates; });'))
        .pipe(wrap('<%= contents %>'))
        // Write the output into the templates folder
        .pipe(gulp.dest(dest + 'js/tpl'));
});

/**
 * --------------------------------------------------------
 * Development and Production tasks
 * --------------------------------------------------------
 */
gulp.task("dev", ["lint", "scripts-dev", "sass-dev", "html-tpl"]);
gulp.task("prod", ["lint", "scripts-prod", "sass-prod", "html-tpl"]);


/**
 * --------------------------------------------------------
 * Development and Production tasks
 * --------------------------------------------------------
 */
gulp.task('test', function (done) {
  // Define the Intern command line
  var command = [
    './node_modules/intern/runner.js',
    'config=../tests/intern'
  ];

  // Add environment variables, such as service keys
  var env = Object.create(process.env);

  // Spawn the Intern process
  var child = require('child_process').spawn('node', command, {
    // Allow Intern to write directly to the gulp process's stdout and
    // stderr.
    stdio: 'inherit',
    env: env
  });

  // Let gulp know when the child process exits
  child.on('close', function (code) {
    if (code) {
      done(new Error('Intern exited with code ' + code));
    }
    else {
      done();
    }
  });
});

// Default gulp task
gulp.task("default", ["dev"]);

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch(src + 'scripts/app/**/*.js', ['lint', 'scripts-dev']);
    gulp.watch(src + 'scripts/app/**/*.html', ['scripts-dev', 'html-tpl']);
    gulp.watch(src + 'stylesheets/**/*.scss', ['sass-dev']);
});