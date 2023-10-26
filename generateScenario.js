const feature_functionality = require('./parser/parser.js');

/* Define the path to the feature file to be processed */
const featureFilePath = process.argv[2];

/* Get the output file path from command line arguments */
const outputFilePath = process.argv[2].replace(".feature", ".test.js");

/* Check if the input file (feature file) path is provided as an argument */
if (!featureFilePath || !featureFilePath.endsWith('.feature')) {
    console.log('\x1b[31m%s\x1b[0m', 'Please provide the input file path as an argument - File should be .feature');
    process.exit(1);
}

/* Check if the output file path is provided as an argument */
if (!outputFilePath) {
    console.log('\x1b[31m%s\x1b[0m', 'Invalid output file: ' + outputFilePath);
    process.exit(1);
}

console.log('\x1b[32m%s\x1b[0m', `File: ${featureFilePath} parsing started.`);
feature_functionality.parseFeature(featureFilePath, outputFilePath);
