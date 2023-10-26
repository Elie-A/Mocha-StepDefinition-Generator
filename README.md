# Mocha-StepDefinition-Generator
Mocha-StepDefinition-Generator
# Mocha Step Definition Generator

## Introduction
Gihub link: https://github.com/Elie-A/Mocha-StepDefinition-Generator

This script is a Mocha step definition generator for BDD (Behavior-Driven Development) testing frameworks. They are designed to parse Gherkin-style feature files and generate Mocha step definitions for test automation using JavaScript. The generated step definitions can be used to create automated test scenarios based on the Given-When-Then syntax.

The script reads a feature file (usually with a `.feature` extension) and generate Mocha step definitions in a JavaScript test file (usually with a `.test.js` extension). They support scenarios, scenario outlines, and background steps commonly used in Gherkin feature files.

## Script
1. `generateScenarios.js`, located under generate_scenarios folder, designed to generate Mocha step definitions by creating:
- Unique describe block for the feature file
- It blocks for background, scenario, and scenario outline
- JSON object for bacgkround and scenarios (all parameterized data, integers and strings)
- Array of JSON objects for scenario outline (all data within the Examples section)

## Code Execution Guide

To use the scripts to generate Mocha step definitions from a Gherkin-style feature file, follow these steps:
1. Make sure to install node from here: https://nodejs.org/en/download
2. Execution steps:
    * Install the dependency with this command:
    ``npm i mocha-stepdefinition-generator"``
    * Import it using:
    ``const msg = require('mocha-stepdefinition-generator');``
    * Define an input file (Your feature file):
    ``const input = 'sample.feature';``
    * Call the parser function:
    ``msg.parseFeature(input);``
3. Generated Output: The script will parse the feature file and generate Mocha step definitions based on the Scenarios. The generated step definitions will be written to the specified output file.
    * The generated test file will have a single describe block for the entire feature file
    * Individual it blocks for each background, scenario and scenario outline. Withing those  it blocks, parametrized data will be added as JSON Object for backgrounds, and scenarios; whereas for scenario outlines, the data will be saved as an array og JSON Objects.
    * The steps will be added as comments in the blocks 

## Examples
1. Generate Scenarios

```feature
Feature: Test Feature
# comment line
    Background: Valid user session
        Given user with id 1 is logged in

    Scenario Outline: Sort Products
        Given user is on the "Products" page
        When user selects "<sort>" from the dropdown
        Then items are sorted by "<sort>" in "<order>" order

        Examples:
            | sort                | order |
            | Name (A to Z)       | ASC   |
            | Name (Z to A)       | DESC  |
            | Price (low to high) | ASC   |
            | Price (high to low) | DESC  |

    Scenario: Validate invoice and pay
        Given user is on the "Checkout" page
        When user clicks on "pay" button
        Then invoice with id starting with "invoice_" is generated
        And user validates the amount
        * user validates the 10 percent taxes
        * user pays the requested amount
```

```js
const { mocha } = require('mocha');
const { chai } = require('chai');

describe('Feature:  Test Feature', function () {
  it('Valid user session', async () => {
    //user with id 1 is logged in

    const data = {
      key1: 1,
    };
  });

  it('Scenario Outline: Sort Products', async () => {
    //Given user is on the "Products" page
    //When user selects "<sort>" from the dropdown
    //Then items are sorted by "<sort>" in "<order>" order

    const data = [
      {
        sort: 'Name (A to Z)',
        order: 'ASC',
      },
      {
        sort: 'Name (Z to A)',
        order: 'DESC',
      },
      {
        sort: 'Price (low to high)',
        order: 'ASC',
      },
      {
        sort: 'Price (high to low)',
        order: 'DESC',
      },
    ];
  });

  it('Validate invoice and pay', async () => {
    //user is on the "Checkout" page
    //user clicks on "pay" button
    //invoice with id starting with "invoice_" is generated
    //user validates the amount
    //user validates the 10 percent taxes
    //user pays the requested amount

    const data = {
      key1: 'Checkout',
      key2: 'pay',
      key3: 'invoice_',
      key4: 10,
    };
  });
});
```
## Suggestions, Bugs
To report any bugs or provide suggestions please open an issue

