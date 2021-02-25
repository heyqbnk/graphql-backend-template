/* eslint-disable @typescript-eslint/no-var-requires */
const {src, dest, series} = require('gulp');
const clean = require('gulp-clean');
const sourceMaps = require('gulp-sourcemaps');
const tsLoader = require('gulp-typescript');
const path = require('path');

/**
 * Compiles TypeScript into JavaScript.
 * @returns {null|*}
 */
function compileTypeScript() {
  // Create TypeScript compiler.
  const tsProject = tsLoader.createProject('../tsconfig.json', {
    rootDir: path.resolve(__dirname, '..'),
  });

  // Compile TS code and create source maps.
  return src('../src/**/*.ts', {base: '../src'})
    .pipe(sourceMaps.init())
    .pipe(tsProject())
    .pipe(sourceMaps.mapSources(sourcePath => sourcePath.replace('../../src', 'dist')))
    .pipe(sourceMaps.write('.', {includeContent: true, sourceRoot: '/'}))
    .pipe(dest('../build/dist'));
}

/**
 * Removes build directory.
 * @returns {null|*}
 */
function removeBuildDirectory() {
  return src('../build', {allowEmpty: true}).pipe(clean({force: true}));
}

/**
 * Copies files required for project lifecycle.
 */
function copyLifecycleFiles(done) {
  const files = ['../package.json', '../.env'];

  for (const file of files) {
    src(file).pipe(dest('../build'));
  }
  done();
}

exports.default = series(removeBuildDirectory, copyLifecycleFiles, compileTypeScript);
