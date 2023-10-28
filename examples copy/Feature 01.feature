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