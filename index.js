const feature_functionality = require('./parser/parser.js');

module.exports = {
  parseFeature: feature_functionality.parseFeature,
  parseFeatureFilesInDirectory: feature_functionality.parseFeatureFilesInDirectory
};