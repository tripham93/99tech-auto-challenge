@bdd @regression
Feature: Customer login and cart checkout
  A customer can authenticate and complete an order from the storefront.

  @ui @credentials
  Scenario: A signed-in customer purchases a catalog item
    Given a registered customer opens the sign-in form
    When the customer submits valid credentials
    Then the storefront welcomes the customer
    When the customer adds the first catalog item to the cart
    And the customer submits the order
    Then the purchase confirmation shows the cart total

  @ui @negative
  Scenario: An unknown account cannot sign in
    Given the sign-in form is open
    When a visitor submits an unknown username
    Then an account-not-found message is shown