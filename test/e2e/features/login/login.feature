@login
Feature: Login
  As a user
  I want to login
  So that I can access Music Manager


  Background:
  User navigates to Music Manager
    Given I am on Music Manager login page


  Scenario: Log into Music Manager with success
    When I enter username as "admin"
    And I enter password as "admin"
    And I validate my credentials
    Then Login should success