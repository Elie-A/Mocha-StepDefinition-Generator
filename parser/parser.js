const fs = require('fs').promises;
const path = require('path');
const prettier = require('prettier');

const FeatureModel = require('../models/featureModel.js');
let feature_model = new FeatureModel();

const BackgroundModel = require('../models/backgroundModel.js');
let background_model = new BackgroundModel();

const ScenarioModel = require('../models/scenarioModel.js');
let scenario_model = new ScenarioModel();

const ScenarioOutlineModel = require('../models/scenarioOutlineModel.js');
let scenario_outline_model = new ScenarioOutlineModel();

let isInsideBackgroundBlock, isInsideScenarioBlock, isInsideScenarioOutlineBlock = false;
let readHeaders = false;
let tempData = [];
let dataToWrite = [];
let outputString = '';

const featurePattern = /^Feature:(.+)/;
const backgroundPattern = /^Background:(.+)/;
const scenarioPattern = /^Scenario:(.+)/;
const scenarioOutlinePattern = /^Scenario Outline(:)?(.+)?/;
const examplesPattern = /^Examples(:)?(.+)?/;
const stepPattern = /^(Given|When|Then|And|But|\*) (.+)$/;
const paramPattern = /"([^"]+)"|\b\d+\b/g;

async function parseFeatureFilesInDirectory(directoryPath) {
    try {
        const stats = await fs.stat(directoryPath);

        if (!stats.isDirectory()) {
            throw new Error('The specified path is not a directory.');
        }

        const files = await fs.readdir(directoryPath);

        if (files.length === 0) {
            throw new Error('No files with .feature extension found in the directory.');
        }

        const featureFiles = files.filter(file => file.endsWith('.feature'));

        if (featureFiles.length === 0) {
            throw new Error('No .feature files found in the directory.');
        }

        for (const file of featureFiles) {
            const filePath = path.join(directoryPath, file);
            dataToWrite = [];
            await parseFeature(filePath);
        }
    } catch (error) {
        console.error('\x1b[31m%s\x1b[0m', 'Error reading directory:', error.message);
    }
}

async function parseFeature(feature_path) {
    const stats = await fs.stat(feature_path);

    if (!stats.isFile()) {
        throw new Error('The specified path is not a file.');
    }

    const output_path = feature_path.replace('.feature', '.test.js');
    const fileStream = await fs.readFile(feature_path, 'utf8'); // Read the file content

    const lines = fileStream.split('\n');
    for (const line of lines) {
        parseFeatureLine(line);
    }

    if (!background_model.isEmpty()) {
        dataToWrite.push(background_model);
    }
    if (!scenario_model.isEmpty()) {
        dataToWrite.push(scenario_model);
    }
    if (!scenario_outline_model.isEmpty() && scenario_outline_model.scenario_outline_headers.length > 0 && scenario_outline_model.scenario_outline_data.length > 0) {
        dataToWrite.push(scenario_outline_model);
    }

    await printDataToConsole(dataToWrite);
    console.log('\x1b[32m%s\x1b[0m', `File: ${feature_path} parsing finished.`);
    await writeDataToFile(dataToWrite, output_path);
    console.log('\x1b[32m%s\x1b[0m', `Output File: ${output_path}`);
    await resetData();
}

function parseFeatureLine(line) {
    let featureMatch, backgroundMatch, scenarioMatch, scenarioOutlineMatch, examplesMatch, stepMatch, paramMatch;

    line = line.trim();

    if (line.startsWith('@') || line.startsWith('#')) {
        return;
    } else if (line.trim() === '' || line.length === 0) {
        if (!background_model.isEmpty()) {
            dataToWrite.push(background_model);
            background_model = new BackgroundModel();
        }
        if (!scenario_model.isEmpty()) {
            dataToWrite.push(scenario_model);
            scenario_model = new ScenarioModel();
        }
        if (!scenario_outline_model.isEmpty() && scenario_outline_model.scenario_outline_headers.length > 0 && scenario_outline_model.scenario_outline_data.length > 0) {
            dataToWrite.push(scenario_outline_model);
            scenario_outline_model = new ScenarioOutlineModel();
        }
    } else {
        featureMatch = line.match(featurePattern);
        backgroundMatch = line.match(backgroundPattern);
        scenarioMatch = line.match(scenarioPattern);
        scenarioOutlineMatch = line.match(scenarioOutlinePattern);
        examplesMatch = line.match(examplesPattern);
        stepMatch = line.match(stepPattern);

        if (featureMatch) {
            feature_model.feature_name = featureMatch[1];
            isInsideBackgroundBlock = false;
            isInsideScenarioBlock = false;
            isInsideScenarioOutlineBlock = false;

            background_model = new BackgroundModel();
            scenario_model = new ScenarioModel();
            scenario_outline_model = new ScenarioOutlineModel();

            feature_name = featureMatch[1].trim();
            dataToWrite.push(feature_model);

        } else if (backgroundMatch) {
            isInsideBackgroundBlock = true;
            isInsideScenarioBlock = false;
            isInsideScenarioOutlineBlock = false;

            background_model.background_name = backgroundMatch[1].trim();

        } else if (stepMatch && isInsideBackgroundBlock) {
            let stepText = stepMatch[2];
            background_model.background_steps.push(stepText);
            paramMatch = stepText.match(paramPattern);
            if(paramMatch){
                tempData.push(...paramMatch);
            }
            background_model.background_data = [...tempData];
        } else if (scenarioMatch) {
            isInsideBackgroundBlock = false;
            isInsideScenarioOutlineBlock = false;
            isInsideScenarioBlock = true;
            tempData = [];
            scenario_model.scenario_name = scenarioMatch[1].trim();
        } else if (stepMatch && isInsideScenarioBlock) {
            let stepText = stepMatch[2];
            scenario_model.scenario_steps.push(stepText);
            paramMatch = stepText.match(paramPattern);
            if(paramMatch){
                tempData.push(...paramMatch);
            }
            scenario_model.scenario_data = [...tempData];
        } else if (scenarioOutlineMatch) {
            readHeaders = false;
            isInsideBackgroundBlock = false;
            isInsideScenarioBlock = false;
            isInsideScenarioOutlineBlock = true;
            tempData = [];
            scenario_outline_model.scenario_outline_name = scenarioOutlineMatch[0];    
        } else if(stepMatch && isInsideScenarioOutlineBlock) {
            let stepText = stepMatch[0];
            scenario_outline_model.scenario_outline_steps.push(stepText);
            paramMatch = stepText.match(paramPattern);
            if(paramMatch && !paramMatch.some(item => item.includes("<"))){
                tempData.push(...paramMatch);
            }
        } else if (!examplesMatch) {
            if (line.startsWith('\|') && !readHeaders) {
                scenario_outline_model.scenario_outline_headers = line.split('|').map(element => element.trim()).filter(element => element !== '');
                readHeaders = true;
            } else if (line.startsWith('\|') && readHeaders) {
                const lineArray = line.split('|').map(element => element.trim()).filter(element => element !== '');
                if (lineArray.length > 0) {
                    tempData.push(lineArray);
                }
            }
        }
        if (isInsideScenarioOutlineBlock) {
            scenario_outline_model.scenario_outline_data = [...tempData];
        }
    }
}

function importsBlock(){
    return `const { mocha } = require("mocha");\n` + `const { chai } = require("chai");\n\n`
}

function openDescribeBlock(feature_name) {
    return `describe('Feature: ${feature_name}', function() {`;
}

function openItBlock(match) {
    return `  it('${match}', async () => {`;
}

function writeStepsAsComments(steps){
    let stepsAsComment = '';
    for (const index in steps){
        stepsAsComment += '//' + steps[index] + '\n';
    }
    return stepsAsComment
}

function writeJsonData(data) {
    return `  const data = ${JSON.stringify(data, null, 2)};\n`;
}

function closeBlock() {
    return `});`;
}

function generateJsonObjectData(data) {
    const jsonObject = {};

    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            const value = data[key];
            const keyIndex = parseInt(key, 10) + 1;

            if (!isNaN(value)) {
                jsonObject[`key${keyIndex}`] = parseFloat(value);
            } else {
                // Remove double quotes from the value if present
                const cleanedValue = value.replace(/^"(.*)"$/, '$1');
                jsonObject[`key${keyIndex}`] = cleanedValue;
            }
        }
    }

    return jsonObject;
}

function generateScenarioOutlineData(modelInstance) {
    const scenarioOutlineData = [];
    if (modelInstance instanceof ScenarioOutlineModel) {
        const headers = modelInstance.scenario_outline_headers;
        if (headers.length === 0) {
            return scenarioOutlineData;
        }
        for (let i = 0; i < modelInstance.scenario_outline_data.length; i++) {
            const dataObject = {};
            if (Array.isArray(modelInstance.scenario_outline_data[i])) {
                // Handle array data
                for (let j = 0; j < headers.length; j++) {
                    const header = headers[j];
                    dataObject[header] = modelInstance.scenario_outline_data[i][j];
                }
            } else {
                // Handle non-array data with dynamic keys
                const data = modelInstance.scenario_outline_data[i];
                const keyIndex = i + 1; // Dynamic key index
                for (const key in data) {
                    if (data.hasOwnProperty(key)) {
                        const value = data;
                        const cleanedValue = value.replace(/^"(.*)"$/, '$1');
                        dataObject[`key${keyIndex}`] = cleanedValue;
                    }
                }
            }
            scenarioOutlineData.push(dataObject);
        }
    }
    return scenarioOutlineData;
}

async function printDataToConsole(dataToWrite){
    if (dataToWrite.length > 0) {
        for (const model of dataToWrite) {
            if (model instanceof FeatureModel) {
                console.log('\x1b[35m%s\x1b[0m', importsBlock());
                console.log('\x1b[32m%s\x1b[0m', openDescribeBlock(model.feature_name));
                console.log('\n');
            } else if (model instanceof BackgroundModel) {
                console.log('\x1b[33m%s\x1b[0m', openItBlock(model.background_name));
                console.log('\x1b[33m%s\x1b[0m', writeStepsAsComments(model.background_steps));
                console.log('\x1b[34m%s\x1b[0m', writeJsonData(generateJsonObjectData(model.background_data)));
                console.log('\x1b[33m%s\x1b[0m', closeBlock());
                console.log('\n');                    
            } else if (model instanceof ScenarioModel) {
                console.log('\x1b[33m%s\x1b[0m', openItBlock(model.scenario_name));
                console.log('\x1b[33m%s\x1b[0m', writeStepsAsComments(model.scenario_steps));
                console.log('\x1b[34m%s\x1b[0m', writeJsonData(generateJsonObjectData(model.scenario_data)));
                console.log('\x1b[33m%s\x1b[0m', closeBlock());
                console.log('\n');
            } else {
                console.log('\x1b[33m%s\x1b[0m', openItBlock(model.scenario_outline_name));
                console.log('\x1b[33m%s\x1b[0m', writeStepsAsComments(model.scenario_outline_steps));
                console.log('\x1b[34m%s\x1b[0m', writeJsonData(generateScenarioOutlineData(model)));
                console.log('\x1b[33m%s\x1b[0m', closeBlock());
                console.log('\n');
            }
        }
    }
    console.log('\x1b[33m%s\x1b[0m', closeBlock());
}

async function writeDataToFile(dataToWrite, output_path){
        if (dataToWrite.length > 0) {
        outputString += importsBlock();
        for (const model of dataToWrite) {
            if (model instanceof FeatureModel) {
                outputString += openDescribeBlock(model.feature_name) + '\n';
            } else if (model instanceof BackgroundModel) {
                outputString += openItBlock(model.background_name) + '\n';
                outputString += writeStepsAsComments(model.background_steps) + '\n';
                outputString += writeJsonData(generateJsonObjectData(model.background_data)) + '\n';
                outputString += closeBlock() + '\n\n';
            } else if (model instanceof ScenarioModel) {
                outputString += openItBlock(model.scenario_name) + '\n';
                outputString += writeStepsAsComments(model.scenario_steps) + '\n';
                outputString += writeJsonData(generateJsonObjectData(model.scenario_data)) + '\n';
                outputString += closeBlock() + '\n\n';
            } else {
                outputString += openItBlock(model.scenario_outline_name) + '\n';
                outputString += writeStepsAsComments(model.scenario_outline_steps) + '\n';
                outputString += writeJsonData(generateScenarioOutlineData(model)) + '\n';
                outputString += closeBlock() + '\n\n';
            }
        }
    }
    outputString += closeBlock() + '\n\n';

    const formattedOutput = prettier.format(outputString, {
        parser: 'babel',
        semi: true,
        singleQuote: true,
        trailingComma: 'all',
    });

    formattedOutput.then((formattedString) => {
        fs.writeFile(output_path, formattedString, (err) => {
            if (err) {
                console.error('\x1b[31m%s\x1b[0m', 'Error writing to file:', err);
            } else {
                console.log('\x1b[32m%s\x1b[0m', 'Output saved to file: ' + output_path);
            }
        });
    }).catch((error) => {
        console.error('\x1b[31m%s\x1b[0m', 'Error formatting the output:', error);
    });
}

async function resetData(){
    dataToWrite = [];
    tempData = [];
    outputString = '';
    feature_model = new FeatureModel();
    background_model = new BackgroundModel();
    scenario_model = new ScenarioModel();
    scenario_outline_model = new ScenarioOutlineModel();
}

module.exports = { parseFeature, parseFeatureFilesInDirectory };
