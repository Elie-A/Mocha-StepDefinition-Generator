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