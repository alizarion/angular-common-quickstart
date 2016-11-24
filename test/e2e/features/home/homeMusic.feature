@homePage
Feature: Home page
  As a user
  I want to go to home page
  So that I can see all musics


  Background:
  User navigates to home page
    Given User is on the Home page


  Scenario: All music are displayed in home page
    When Empty when
    Then all musics are displayed :
      | artist           | title                      |
      | Carly Rae Jepsen | I Really Like You          |
      | Kygo             | Firestone ft. Conrad Sewel |
      | The Weeknd       | Can't Feel My Face         |
      | One Direction    | Drag Me Down               |
      | Demi Lovato      | Cool for the Summer        |
      | Taylor Swift     | Wildest Dreams             |