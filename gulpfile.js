'use strict';

const gulp = require('gulp');
const plumber = require('gulp-plumber');
const sass = require('gulp-sass');
const rigger = require('gulp-rigger');
const rimraf = require('rimraf');
const browserSync = require("browser-sync").create();
const nodemon = require('nodemon');
const autoprefixer = require("gulp-autoprefixer");
const reload = browserSync.reload;

var path = {
	build: {
		html: '.',
		css: 'css/',
		js: 'js/'
	},
	src: {
		html: 'src/html/[^_]*.html',
		style: 'src/sass/*.scss',
		js: 'src/js/*.js'
	},
	watch: {
		html: 'src/html/**/*.html',
		style: 'src/sass/**/*.scss',
		js: 'src/js/**/*.js'
	}
};

var appPath = {
	build: {
		js: 'js/'
	},
	src: {
		js: 'src/app/*.js'
	},
	watch: {
		js: 'src/app/**/*.js'
	}
};

var serverPath = {
	build: {
		js: '.'
	},
	src: {
		js: 'src/server/*.js'
	},
	watch: {
		js: 'src/server/**/*.js'
	}
}

gulp.task('clean', function (cb) {
	rimraf('./*.html', cb);
	rimraf('./css/', cb);
});

gulp.task('html:build', function () {
	return gulp.src(path.src.html)
		.pipe(rigger())
		.pipe(gulp.dest(path.build.html))
		.on('end',reload)
});

gulp.task('style:build', function () {
	return gulp.src(path.src.style)
		.pipe(plumber({
			errorHandler: function (err) {
				console.log(err);
				this.emit('end');
			}
		}))
		.pipe(sass({
			errorHandler: function (err) {
				console.log(err);
				this.emit('end');
			}
		}))
		.pipe(autoprefixer())
		.pipe(gulp.dest(path.build.css))
		.on('end',reload)
});

gulp.task('js:build', function () {
	return gulp.src(path.src.js)
		.pipe(plumber())
		.pipe(gulp.dest(path.build.js))
		.on('end',function(){
			setTimeout(function(){
				reload();
			},100);
		})
});

gulp.task('appJs:build', function () {
	return gulp.src(appPath.src.js)
		.pipe(plumber())
		.pipe(gulp.dest(appPath.build.js))
		.on('end',reload)
});

gulp.task('server:build', function () {
	return gulp.src(serverPath.src.js)
		.pipe(gulp.dest(serverPath.build.js))
		.on('end', function() {
			nodemon.emit('restart');
			console.log('nodemon restarted :D');
		})
});

gulp.task('build', gulp.series(
	'html:build',
	'style:build',
	'js:build',
	'appJs:build',
	'server:build'
));

gulp.task('nodemon', function() {
	var started = false;

	return nodemon({
		script: 'server.js',
	}).on('start',function() {
		if (!started) {
			gulp.parallel('webserver','watch')();
			started = true;
		}
	});
});

gulp.task('webserver', function () {
	browserSync.init({
		proxy: "localhost:3100",
		host: 'localhost',
		port: 9008,
		logPrefix: "Zzz",
		ghostMode: {
			clicks: false,
			forms: false,
			scroll: false
		}
	});
});

gulp.task('watch', function(){
	gulp.watch(path.watch.html, gulp.series('html:build'));
	gulp.watch(path.watch.style, gulp.series('style:build'));
	gulp.watch(path.watch.js, gulp.series('js:build'));
	gulp.watch(appPath.watch.js, gulp.series('appJs:build'));
	gulp.watch(serverPath.watch.js, gulp.series('server:build'));
});


gulp.task('run', gulp.series('nodemon'));
