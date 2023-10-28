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
