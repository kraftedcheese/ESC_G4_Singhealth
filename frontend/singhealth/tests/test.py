import unittest
from selenium import webdriver
from selenium.webdriver.firefox.options import Options
from selenium.webdriver.support.ui import WebDriverWait, Select
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By

import time

WEBDRIVER_PATH = "/home/songgee/Documents/ESC_G4_Singhealth/frontend/singhealth/tests/geckodriver"
PROFILE_PATH = "./testingProfile"
APP_PATH = "http://localhost:3000"
SHOW_BROWSER = True

# Only methods that start with 'test_' are considered tests and detected by unittest
class BrowserTest(unittest.TestCase):

    # Ran before all tests, setup our Webdriver
    def setUp(self):
        self.options = Options()
        self.options.headless = not SHOW_BROWSER
        # self.options.add_argument("-profile")
        # self.options.add_argument(PROFILE_PATH)

        self.driver = webdriver.Firefox(executable_path=WEBDRIVER_PATH, options = self.options)

    # Test 1
    # Test a successful login for Staff User
    # Test the entering of Directory page
    # Test Logout Button
    def test_001_staff_login(self):
        firstUserDetails = {
            "name": "Tenant One",
            "email": "tenantone@test.com",
            "password": "password",
            "phone": "95959595",
            "unit": "01-11"
        }

        secondUserDetails = {
            "name": "Tenant Two",
            "phone": "99999999",
            "unit": "02-22"
        }

        loginEmail = "admin@test.com"
        loginPassword = "password"

        # Navigate to home login page
        self.enterHomePage()

        self.loginToPage(loginEmail, loginPassword)

        # Check for Staff login page
        self.waitUntilElementFound("//h6[.='Singhealth Audits - Staff']")
        self.waitUntilElementFound("//p[.='Open Audits']")
        self.waitAWhile()

        # Try to enter the directory page
        self.enterDirectoryPage()
        self.waitAWhile()

        # Add a new Tenant with our userDetails
        self.createNewTenant(firstUserDetails)
        self.waitAWhile()

        # Edit existing tenant 
        self.editExistingTenant(firstUserDetails, secondUserDetails)
        self.waitAWhile()

        # Delete existing tenant 
        self.deleteExistingTenant(secondUserDetails)
        self.waitAWhile()

        # Logout
        self.clickMenuButton()
        self.waitAWhile(1)
        self.logout()

    # Test 2
    # Test a successful login for Tenant User
    # Test the entering of Directory page
    # Test Logout Button
    def test_002_tenant_login_success(self):
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

    # Test 3
    # Test a failed login using invalid fields
    # Check for display of alert popup
    def test_003_failed_login_bad_email(self):
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

    # Test 4
    # Test a failed login with a wrong password
    # Check for display of alert popup
    def test_004_failed_login_wrong_password(self):
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


    # Quit the webdriver to close the browser window
    def tearDown(self):
        self.driver.quit()

    ######################################
    # Helper functions below
    ######################################
    def waitAWhile(self, seconds = 2):
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

    def createNewTenant(self, user):
        self.driver.find_element_by_xpath("//button[@data-test='add']").click()
        self.waitUntilElementFound("//div[.='Add Tenant']")

        # Insert fields from user dict
        for key, value in user.items():
            self.driver.find_element_by_xpath(f"//input[@name='{key}']").send_keys(f"{value}")
 
        # Select F&B Radio button
        # self.driver.find_element_by_xpath("//input[@name='F&B']").click()

        # Select institution
        self.driver.find_element_by_id("mui-component-select-institution").click()
        self.driver.find_element_by_xpath("//li[@data-value='KKH']").click()

        # Select Contract End Date
        self.driver.find_element_by_xpath("//input[@name='contract_date']").clear()
        self.driver.find_element_by_xpath("//input[@name='contract_date']").send_keys("01/06/2021")
        self.waitAWhile()
        self.driver.find_element_by_xpath("//button[@data-test='submit']").click()

        # Wait until we reach the Directory page again
        self.waitUntilElementFound("//h1[.='Directory']")

    def editExistingTenant(self, oldUser, newUser):
        name = oldUser["name"]
        self.driver.find_element_by_xpath(f"//button[@data-test='{name}expand']").click()
        self.driver.find_element_by_xpath(f"//button[@data-test='{name}edit']").click()
        self.waitUntilElementFound("//div[.='Edit Tenant']")

        # Insert fields from user dict
        for key, value in newUser.items():
            self.driver.find_element_by_xpath(f"//input[@name='{key}']").clear()
            self.driver.find_element_by_xpath(f"//input[@name='{key}']").send_keys(f"{value}")

        # Select institution
        self.driver.find_element_by_id("mui-component-select-institution").click()
        self.driver.find_element_by_xpath("//li[@data-value='NCCS']").click()

        # Select Contract End Date
        self.driver.find_element_by_xpath("//input[@name='contract_date']").clear()
        self.driver.find_element_by_xpath("//input[@name='contract_date']").send_keys("02/09/2021")
        
        self.waitAWhile()
        self.driver.find_element_by_xpath("//button[@data-test='submit']").click()

        # Wait until we reach the Directory page again
        self.waitUntilElementFound("//h1[.='Directory']")

    def deleteExistingTenant(self, user):
        name = user["name"]
        self.driver.find_element_by_xpath(f"//button[@data-test='{name}expand']").click()
        self.driver.find_element_by_xpath(f"//button[@data-test='{name}delete']").click()

        # Wait until we reach the Directory page again
        self.waitUntilElementFound("//h1[.='Directory']")


    def clickMenuButton(self):
        self.driver.find_element_by_xpath("//button[@data-test='menu']").click()

    def logout(self):
        self.driver.find_element_by_xpath("//li[@data-test='logout']").click()
        

if __name__ == '__main__':
    unittest.main()