# Mocha-StepDefinition-Generator

This script is a Mocha step definition generator for BDD (Behavior-Driven Development) testing frameworks. They are designed to parse Gherkin-style feature files and generate Mocha step definitions for test automation using JavaScript. The generated step definitions can be used to create automated test scenarios based on the Given-When-Then syntax.

The script reads a feature file (usually with a `.feature` extension) and generate Mocha step definitions in a JavaScript test file (usually with a `.test.js` extension). They support scenarios, scenario outlines, and background steps commonly used in Gherkin feature files.

## Script

The script functionalities are:

1. Parse single feature file
2. Parse a directory - mainly only `.feature` files in that particular directory
3. Generate the below:

   - Unique describe block for the feature file
   - It blocks for background, scenario, and scenario outline
   - JSON object for bacgkround and scenarios (all parameterized data, integers and strings)
   - Array of JSON objects for scenario outline (all data within the Examples section)


## Code Execution Guide

To use the scripts to generate Mocha step definitions from a Gherkin-style feature file, follow these steps:

1. Make sure to install node from here: https://nodejs.org/en/download
2. Installation:
   - Install the dependency with this command:
     `npm i mocha-stepdefinition-generator"`
   - Import it using:
     `const msg = require('mocha-stepdefinition-generator');`
3. Single feature file execution steps:
   - Define an input file (Your feature file):
     `const input_file = 'sample.feature';`
   - Call the parser function:
     `msg.parseFeature(input_file);`
4. Feature files directory execution steps:

   - Define an input directory (Your feature files directory):
     `const input_directory = './examples copy';`
   - Call the parser function:
     `msg.parseFeatureFilesInDirectory(input_directory);`

5. Generated Output: The script will parse the feature file and generate Mocha step definitions based on the Scenarios. The generated step definitions will be written to the specified output file.
   - The generated test file will have a single describe block for the entire feature file
   - Individual it blocks for each background, scenario and scenario outline. Withing those it blocks, parametrized data will be added as JSON Object for backgrounds, and scenarios; whereas for scenario outlines, the data will be saved as an array og JSON Objects.
   - The steps will be added as comments in the blocks

## Examples

1. Single feature file execution

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

    Scenario Outline: Issue Fix
        Given "user1" is on the "test" page
        When "<value>" is "<tested>"
        And 123 is added
        Then "<validation>" is expected
        Examples:
            | value | tested | validation |
            | v1    | true   | false      |
            | v2    | false  | true       |      

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
        key1: 'Products',
      },
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

  it('Scenario Outline: Issue Fix', async () => {
    //Given "user1" is on the "test" page
    //When "<value>" is "<tested>"
    //And 123 is added
    //Then "<validation>" is expected

    const data = [
      {
        key1: 'user1',
      },
      {
        key2: 'test',
      },
      {
        key3: '123',
      },
      {
        value: 'v1',
        tested: 'true',
        validation: 'false',
      },
      {
        value: 'v2',
        tested: 'false',
        validation: 'true',
      },
    ];
  });
});

```

2. Feature file directory execution
   - Directory name: examples copy
   - Directory feature files:
     - `Feature 01.feature`
     - `Feature 02.feature`

``Feature 01`` content
```feature

    Feature: Feature 01

	Scenario: Successful Login with Valid Credentials
		Given User is on Home Page
		When User Navigate to LogIn Page
		And User enters UserName and Password
		Then Message displayed Login Successfully

	Scenario: Successful LogOut
		When User LogOut from the Application
		Then Message displayed LogOut Successfully

	Scenario Outline: User logs in with valid credentials
		Given the login page is open
		When the user enters "<username>" and "<password>"
		Then the user should be logged in

		Examples:
			| username | password |
			| user1    | pass123  |
			| admin    | admin123 |
			| guest    | guest123 |
```    
   
``Feature 01.feature`` output

```js
    const { mocha } = require('mocha');
    const { chai } = require('chai');

    describe('Feature:  Feature 01', function () {
      it('Successful Login with Valid Credentials', async () => {
        //User is on Home Page
        //User Navigate to LogIn Page
        //User enters UserName and Password
        //Message displayed Login Successfully

        const data = {};
      });

      it('Successful LogOut', async () => {
        //User LogOut from the Application
        //Message displayed LogOut Successfully

        const data = {};
      });

      it('Scenario Outline: User logs in with valid credentials', async () => {
        //Given the login page is open
        //When the user enters "<username>" and "<password>"
        //Then the user should be logged in

        const data = [
          {
            username: 'user1',
            password: 'pass123',
          },
          {
            username: 'admin',
            password: 'admin123',
          },
          {
            username: 'guest',
            password: 'guest123',
          },
        ];
      });
    });

```

``Feature 02`` content

```feature
    Feature: Feature 02

	Scenario Outline: Addition and Subtraction
		Given a value of <a>
		And another value of <b>
		When I add them
		Then the result should be <sum>

		Examples:
			| a | b | sum |
			| 2 | 3 | 5   |
			| 5 | 7 | 12  |
			| 8 | 2 | 10  |

  Scenario: Adding items to the cart
    Given the user is on the shopping site
    When the user adds a "T-shirt" to the cart
    And the user adds a "Jeans" to the cart
    Then the cart should contain 2 items
```
    
``Feature 02.feature`` output
   
```js
    const { mocha } = require('mocha');
    const { chai } = require('chai');

    describe('Feature:  Feature 02', function () {
      it('Scenario Outline: Addition and Subtraction', async () => {
        //Given a value of <a>
        //And another value of <b>
        //When I add them
        //Then the result should be <sum>

        const data = [
          {
            a: '2',
            b: '3',
            sum: '5',
          },
          {
            a: '5',
            b: '7',
            sum: '12',
          },
          {
            a: '8',
            b: '2',
            sum: '10',
          },
        ];
      });

      it('Adding items to the cart', async () => {
        //the user is on the shopping site
        //the user adds a "T-shirt" to the cart
        //the user adds a "Jeans" to the cart
        //the cart should contain 2 items

        const data = {
          key1: 'T-shirt',
          key2: 'Jeans',
          key3: 2,
        };
      });
    });

```

## Suggestions, Bugs

To report any bugs or provide suggestions please open an issue:
Github Repo: [Mocha-StepDefinition-Generator](https://github.com/Elie-A/Mocha-StepDefinition-Generator)
