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
