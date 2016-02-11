'use strict';

var _          = require('lodash');
var obj        = require('object-path');
var minimatch  = require('minimatch');
var Dependency = require('./Dependency');
var types      = require('./types.json');
var traverse   = require('traverse');
var path       = require('path');

/**
 * buildGlobs
 *
 * @class
 * @param {Object} dependencies a map of dependencies
 * @param {Array} bowerFiles an array bower component file paths
 * @param {Object} options
 *
 * @property {Object} globs the glob strings organized by type
 * @property {Object} globs.js an array of javascript Dependency objects
 * @property {Object} globs.css an array of css Dependency objects
 * @property {Object} globs.fonts an array of fonts path glob strings
 * @property {Object} globs.images an array of image path glob strings
 */
var buildGlobs = module.exports = function(dependencies, options) {
  options = options || {};

  this.globs = {
    // js is an array of objects because there can be multiple js files
    js: this.getOutputFiles('js', dependencies),
    // css is an array of objects because there can be multiple css files
    css: this.getOutputFiles('css', dependencies),
    // fonts is a flat array since all the fonts go to the same place
    fonts: [].concat(
      obj.get(dependencies, 'fonts.files')
    ),
    // images is a flat array since all the images go to the same place
    images: [].concat(
      obj.get(dependencies, 'images.files')
    )
  };
};

/**
 * getOutputFiles
 *
 * @param {String} type
 * @param {Object} dependencies
 * @param {Array} bowerFiles an array bower component file paths
 * @return {undefined}
 */
buildGlobs.prototype.getOutputFiles = function(type, dependencies) {
  var outputFiles;

  outputFiles = _.pick(dependencies, function(dependency, name) {
    // only select dependencies with valid file extensions
    return new RegExp('\.' + type + '$').test(name);
  });

  outputFiles = _.transform(outputFiles, function(result, dependency, name) {
    // convert to an array of dependencyObjects
    var dep = new Dependency(name, dependency);
    result.push(dep);
  }, [], this);

  return outputFiles;
};
