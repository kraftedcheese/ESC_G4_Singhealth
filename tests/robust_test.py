import unittest
from selenium import webdriver
from selenium.webdriver.firefox.options import Options
from selenium.webdriver.support.ui import WebDriverWait, Select
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.common.exceptions import ElementClickInterceptedException, NoAlertPresentException, StaleElementReferenceException
from selenium.webdriver.common.action_chains import ActionChains

import time
import random

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
        self.driver.maximize_window()

        self.actionchains = ActionChains(self.driver)

        # Setup Login Credentials for Tenant and Staff
        self.tenantUser = {
            "email": "test@test.com",
            "password": "password"
        }

        self.staffUser = {
            "email": "admin@test.com",
            "password": "password"
        }

    # Test 1
    # Monkey Testing
    def test_001_monkey(self):

        # Navigate to home login page
        self.enterHomePage()

        # Trigger Login Sequence
        self.loginToPage(self.staffUser["email"], self.staffUser["password"])

        # Check for Staff login page
        self.checkEnteredLoginPage("Staff")

        self.doMonkey(20)

    # Test 2
    # Protected Routes
    def test_002_routes(self):

        # Navigate to home login page
        self.enterHomePage()

        # Test for paths which should not be accessed without logging in
        PROTECTED_PATHS = ["directory", "home", "newaudit", "issues", "issueChat"]
        for path in PROTECTED_PATHS:
            new_path = APP_PATH + "/" + path
            self.driver.get(new_path) # Enter path
            self.waitAWhile(1)
            self.assertEqual(self.driver.current_url, "http://localhost:3000/signin", "Route not protected on Signin Screen")

        # Login as Tenant, and test for paths which should not be accessed by Tenant user
        # Trigger Login Sequence
        self.loginToPage(self.tenantUser["email"], self.tenantUser["password"])

        # Check for Staff login page
        self.checkEnteredLoginPage("Tenant")
        PROTECTED_STAFF_PATHS = ["directory", "newaudit", "newaudit/checklist", "newaudit/result"]
        for path in PROTECTED_STAFF_PATHS:
            new_path = APP_PATH + "/" + path
            self.driver.get(new_path) # Enter path
            self.waitAWhile(1)
            self.assertEqual(self.driver.current_url, "http://localhost:3000/home", "Staff Route not protected for Tenant")

        

    # Test 3
    # XSS Attack
    def test_003_XSS(self):
        xss_attack_strings = ["<script>alert(‘XSS’)</script>", \
                            "javascript:/*--></title></style></textarea></script></xmp><svg/onload='+/\"/+/onmouseover=1/+/[*/[]/+alert(1)//'>",
                            "<IMG SRC='javascript:alert('XSS');'>",
                            "<<SCRIPT>alert('XSS');//\<</SCRIPT>",
                            "<IMG SRC=javascript:alert(&quot;XSS&quot;)>",
                            "<IMG SRC=' &#14; javascript:alert('XSS');'>",
                            "<img src=x onerror='&#0000106&#0000097&#0000118&#0000097&#0000115&#0000099&#0000114&#0000105&#0000112&#0000116&#0000058&#0000097&#0000108&#0000101&#0000114&#0000116&#0000040&#0000039&#0000088&#0000083&#0000083&#0000039&#0000041'>"]

        # Navigate to home login page
        self.enterHomePage()

        for string in xss_attack_strings:
            # Trigger Login Sequence
            self.loginToPage(string, string)

            self.waitAWhile(1)
            alert = self.driver.switch_to.alert
            self.assertEqual(alert.text, "Invalid login fields!")
            alert.accept()
    


    # Quit the webdriver to close the browser window
    def tearDown(self):
        self.driver.quit()

    ######################################
    # Helper functions below
    ######################################
    def waitAWhile(self, seconds = 2):
        if SHOW_BROWSER:
            time.sleep(seconds)

    def doMonkey(self, times = 50):
        # Find all buttons in current webpage
        # self.waitAWhile(2)
        buttons = self.driver.find_elements_by_xpath("//button")
        count = 1

        while (count <= times):
        
            button = random.choice(buttons)
            
            fileButton = button.find_elements_by_xpath(".//input[@type='file']")
            
            if fileButton:
                continue
            try:
                button.click()
            except ElementClickInterceptedException:
                try:
                    # Try to find data-test = "close-popup"
                    closeButton = self.driver.find_elements_by_xpath("//button[@data-test='close-popup']")
                    if closeButton:
                        closeButton[0].click()
                        continue

                    self.driver.switch_to.alert
                except NoAlertPresentException:
                    point = self.driver.find_element_by_tag_name("html")
                    try:
                        self.actionchains.move_to_element_with_offset(point, 50, 50).click().perform()
                    except:
                        self.driver.execute_script("arguments[0].scrollIntoView(true);", point)
                        self.actionchains.move_to_element_with_offset(point, 50, 50).click().perform()
                        

            finally:
                count += 1
                print(count)
                self.waitAWhile(1)
                buttons = self.driver.find_elements_by_xpath("//button")
                while not buttons:
                    buttons = self.driver.find_elements_by_xpath("//button")


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

    def checkEnteredLoginPage(self, userType):
        self.waitUntilElementFound(f"//h6[.='Singhealth Audits - {userType}']")
        self.waitUntilElementFound("//p[.='Open Audits']")
        self.waitAWhile()

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

    def enterProfile(self):
        self.driver.find_element_by_xpath("//li[@data-test='profile']").click()

    def logout(self):
        self.driver.find_element_by_xpath("//li[@data-test='logout']").click()
        

if __name__ == '__main__':
    unittest.main(verbosity=2)