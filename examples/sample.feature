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
