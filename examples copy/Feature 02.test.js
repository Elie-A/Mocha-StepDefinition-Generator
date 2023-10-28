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
