import unittest
from selenium import webdriver
from selenium.webdriver.firefox.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By

import time

WEBDRIVER_PATH = "/home/songgee/Documents/ESC_G4_Singhealth/frontend/singhealth/tests/geckodriver"
APP_PATH = "http://localhost:3000"
SHOW_BROWSER = True

# Only methods that start with 'test_' are considered tests and detected by unittest
class browserTest(unittest.TestCase):

    # Ran before all tests, setup our Webdriver
    def setUp(self):
        self.options = Options()
        self.options.headless = not SHOW_BROWSER

        self.driver = webdriver.Firefox(executable_path=WEBDRIVER_PATH, options = self.options)

    # Test 1
    # Test a successful login for Staff User
    # Test the entering of Directory page
    # Test Logout Button
    def test_staff_login_success(self):
        email = "admin@test.com"
        password = "password"

        # Navigate to home login page
        self.enterHomePage()

        self.loginToPage(email, password)

        # Check for Staff login page
        self.waitUntilElementFound("//h6[.='Singhealth Audits - Staff']")
        self.waitUntilElementFound("//p[.='Open Audits']")

        # Try to enter the directory page
        self.enterDirectoryPage()
        self.waitAWhile()

        self.clickMenuButton()
        self.waitAWhile(1)
        self.logout()

    # Test 2
    # Test a successful login for Tenant User
    # Test the entering of Directory page
    # Test Logout Button
    def test_tenant_login_success(self):
        email = "test@test.com"
        password = "password"

        # Navigate to home login page
        self.enterHomePage()

        self.loginToPage(email, password)
        
        # Check for Staff login page
        self.waitUntilElementFound("//h6[.='Singhealth Audits - Tenant']")
        self.waitUntilElementFound("//p[.='Open Audits']")

        # Try to enter the directory page
        self.enterDirectoryPage()
        self.waitAWhile()

        self.clickMenuButton()
        self.waitAWhile(1)
        self.logout()

    def test_failed_login_bad_email(self):
        email = "asdasdasdasd"
        password = "password"

        # Navigate to home login page
        self.enterHomePage()

        # Try to Login
        self.loginToPage(email, password)
        self.waitAWhile(1)

        alertText = self.driver.switch_to.alert.text
        assert alertText == "Invalid login fields!", "Alert Text not correct!"

        self.driver.switch_to.alert.accept()
        self.waitAWhile(1)

    def test_failed_login_wrong_password(self):
        email = "test@test.com"
        password = "definitelynotthecorrectpassword"

        # Navigate to home login page
        self.enterHomePage()

        # Try to Login
        self.loginToPage(email, password)
        self.waitAWhile()

        alertText = self.driver.switch_to.alert.text
        assert alertText == "Incorrect password, or user not found", "Alert Text not correct!"

        self.driver.switch_to.alert.accept()
        self.waitAWhile(1)


    def tearDown(self):
        self.driver.quit()

    ######################################
    # Helper functions below
    ######################################
    def waitAWhile(self, seconds = 3):
        if SHOW_BROWSER:
            time.sleep(seconds)

    def waitUntilElementFound(self, xpath):
        # If does not find, a TimeoutException is thrown
        WebDriverWait(self.driver, 10).until(
            lambda x: self.driver.find_element_by_xpath(xpath)
        )

    def enterHomePage(self):
        self.driver.get(APP_PATH)
        self.waitUntilElementFound("//h1[.='Sign in']")

    def loginToPage(self, email, password):
        # Find fields to input email and pass
        emailField = self.driver.find_element_by_id("email")
        passwordField = self.driver.find_element_by_id("password")

        emailField.clear()
        passwordField.clear()

        emailField.send_keys(email)
        passwordField.send_keys(password)

        # Try to login by clicking submit button
        self.driver.find_element_by_xpath("//button[@data-test='submit']").click()

    def enterDirectoryPage(self):
        self.driver.find_element_by_xpath("//button[@data-test='directory']").click()
        self.waitUntilElementFound("//h1[.='Directory']")

    def clickMenuButton(self):
        self.driver.find_element_by_xpath("//button[@data-test='menu']").click()

    def logout(self):
        self.driver.find_element_by_xpath("//li[@data-test='logout']").click()
        

if __name__ == '__main__':
    unittest.main()