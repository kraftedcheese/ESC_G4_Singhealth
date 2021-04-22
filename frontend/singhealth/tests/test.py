import unittest
from selenium import webdriver
from selenium.webdriver.firefox.options import Options
from selenium.webdriver.support.ui import WebDriverWait, Select
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException

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

        # profile = webdriver.FirefoxProfile()

        # profile.set_preference("browser.download.folderList", 2)
        # profile.set_preference("browser.download.manager.showWhenStarting", False)
        # profile.set_preference("browser.download.dir", "/home/songgee/Documents")
        # profile.set_preference("browser.helperApps.neverAsk.saveToDisk", "text/csv,attachment/csv,application/csv")
        # self.options.add_argument("-profile")
        # self.options.add_argument(PROFILE_PATH)

        self.driver = webdriver.Firefox(executable_path=WEBDRIVER_PATH, options = self.options)
        # self.driver = webdriver.Firefox(executable_path=WEBDRIVER_PATH, options = self.options, firefox_profile = profile)


        # Setup Login Credentials for Tenant and Staff
        self.tenantUser = {
            "email": "test@test.com",
            "password": "password"
        }

        self.staffUser = {
            "email": "admin@test.com",
            "password": "password"
        }

        # Setup Dummy Tenants to be created
        self.firstUserDetails = {
            "name": "Tenant One",
            "email": "tenantone@test.com",
            "password": "password",
            "phone": "95959595",
            "unit": "01-11"
        }

        self.secondUserDetails = {
            "name": "Tenant Two",
            "phone": "99999999",
            "unit": "02-22"
        }

    ##########################################
    # TEST SUITE 1: User Login
    ##########################################

    # 1. Staff Login with Correct Credentials
    def test_1_1_staff_login_success(self):
        # Navigate to home login page
        self.enterHomePage()
        self.loginToPage(self.staffUser["email"], self.staffUser["password"])

        # Check for Staff login page
        self.checkEnteredLoginPage("Staff")
        self.waitAWhile(100)

        # Logout
        self.clickMenuButton()
        self.waitAWhile(1)
        self.logout()

    # 2. Tenant Login with Correct Credentials
    def test_1_2_tenant_login_success(self):
        # Navigate to home login page
        self.enterHomePage()
        self.loginToPage(self.tenantUser["email"], self.tenantUser["password"])

        # Check for Staff login page
        self.checkEnteredLoginPage("Tenant")

        # Logout
        self.clickMenuButton()
        self.waitAWhile(1)
        self.logout()

    # 3. Invalid Email Format
    def test_1_3_invalid_email_format(self):
        # Navigate to home login page
        self.enterHomePage()

        # Login with bad email
        self.loginToPage("notAValidEmail", self.staffUser["password"])
        self.waitAWhile(1)

        alertText = self.driver.switch_to.alert.text
        assert alertText == "Invalid login fields!", "Alert Text not correct!"

        self.driver.switch_to.alert.accept()
        self.waitAWhile(1)

    # 4. Valid Email with Wrong Password
    def test_1_4_valid_email_wrong_password(self):
        # Navigate to home login page
        self.enterHomePage()

        # Login with bad email
        self.loginToPage(self.staffUser["email"], "definitelynotthecorrectpassword")
        self.waitAWhile(3)

        alertText = self.driver.switch_to.alert.text
        assert alertText == "Incorrect password, or user not found", "Alert Text not correct!"

        self.driver.switch_to.alert.accept()
        self.waitAWhile(1)

    # 5. Empty Inputs
    def test_1_5_empty_inputs(self):
        # Navigate to home login page
        self.enterHomePage()

        # Login with bad email
        self.loginToPage("", "")
        self.waitAWhile(1)

        alertText = self.driver.switch_to.alert.text
        assert alertText == "Invalid login fields!", "Alert Text not correct!"

        self.driver.switch_to.alert.accept()
        self.waitAWhile(1)

    ##########################################
    # TEST SUITE 2: Profile
    ##########################################

    # 1. Staff entering Profile Page
    def test_2_1_staff_profile(self):
        # Navigate to home login page
        self.enterHomePage()
        self.loginToPage(self.staffUser["email"], self.staffUser["password"])

        # Check for Staff login page
        self.checkEnteredLoginPage("Staff")
        self.waitAWhile()

        # Enter the Profile Page
        self.clickMenuButton()
        self.enterProfile()
        self.waitAWhile()

        # Logout
        self.clickMenuButton()
        self.waitAWhile(1)
        self.logout()

    # 2. Tenant entering Profile Page
    def test_2_2_tenant_profile(self):
        # Navigate to home login page
        self.enterHomePage()
        self.loginToPage(self.tenantUser["email"], self.tenantUser["password"])

        # Check for Staff login page
        self.checkEnteredLoginPage("Tenant")
        self.waitAWhile()

        # Enter the Profile Page
        self.clickMenuButton()
        self.enterProfile()
        self.waitAWhile()

        # Logout
        self.clickMenuButton()
        self.waitAWhile(1)
        self.logout()

    ##########################################
    # TEST SUITE 3: Directory
    ##########################################

    # 1. Staff can enter and view Directory Page
    def test_3_1_staff_directory(self):
        # Navigate to home login page
        self.enterHomePage()
        self.loginToPage(self.staffUser["email"], self.staffUser["password"])

        # Check for Staff login page
        self.checkEnteredLoginPage("Staff")
        self.waitAWhile()

        # Enter the Directory Page
        self.enterDirectoryPage()
        self.waitAWhile()

        # Logout
        self.clickMenuButton()
        self.waitAWhile(1)
        self.logout()

    # 2. Tenant should not be able to enter Directory Page (Does not exist for Tenant User)
    def test_3_2_tenant_directory(self):
        # Navigate to home login page
        self.enterHomePage()
        self.loginToPage(self.tenantUser["email"], self.tenantUser["password"])

        # Check for Staff login page
        self.checkEnteredLoginPage("Tenant")
        self.waitAWhile()

        # Try to enter the Directory Page
        # Make sure that we cannot find the directory element
        with self.assertRaises(NoSuchElementException):
            self.enterDirectoryPage()
        self.waitAWhile()

        # Logout
        self.clickMenuButton()
        self.waitAWhile(1)
        self.logout()

    ##########################################
    # TEST SUITE 4: Tenant
    ##########################################

    # 1. Staff creating New Tenant and editing Tenant info
    def test_4_1_staff_create_and_edit_tenant(self):
        # Navigate to home login page
        self.enterHomePage()
        self.loginToPage(self.staffUser["email"], self.staffUser["password"])

        # Check for Staff login page
        self.checkEnteredLoginPage("Staff")
        self.waitAWhile()

        # Enter the Directory Page
        self.enterDirectoryPage()
        self.waitAWhile()

        # Add a new Tenant with our userDetails
        self.createNewTenant(self.firstUserDetails)
        self.waitAWhile()

        # Edit existing tenant 
        self.editExistingTenant(self.firstUserDetails, self.secondUserDetails)
        self.waitAWhile()

        # Logout
        self.clickMenuButton()
        self.waitAWhile(1)
        self.logout()

    # 2. Staff deleting Tenant
    # (Special Case, only run at the end to remove Tenant)
    def test_7_2_staff_delete_tenant(self):
        # Navigate to home login page
        self.enterHomePage()
        self.loginToPage(self.staffUser["email"], self.staffUser["password"])

        # Check for Staff login page
        self.checkEnteredLoginPage("Staff")
        self.waitAWhile()

        # Enter the Directory Page
        self.enterDirectoryPage()
        self.waitAWhile()

        # Delete existing tenant 
        self.deleteExistingTenant(self.secondUserDetails)
        self.waitAWhile()

        # Logout
        self.clickMenuButton()
        self.waitAWhile(1)
        self.logout()
        
    ##########################################
    # TEST SUITE 5: Audits, Issues
    ##########################################

    # 1. Staff creating Audit for Tenant (All Ok)
    def test_5_1_staff_create_audit_all_ok(self):
        # Navigate to home login page
        self.enterHomePage()
        self.loginToPage(self.staffUser["email"], self.staffUser["password"])

        # Check for Staff login page
        self.checkEnteredLoginPage("Staff")
        self.waitAWhile()

        # Enter audit page
        self.enterAudit()

        # Select tenant name
        self.driver.find_element_by_xpath("//div[@data-test='tenant_select']").click()
        self.driver.find_element_by_xpath("//li[@data-value='Tenant Two']").click()
        self.waitAWhile(1)

        # Select F&B Audit
        self.driver.find_element_by_xpath("//button[@data-test='fnb_nonfnb']").click()

        # Select 'OK' for fields
        for i in range(0, 34):
            self.driver.find_element_by_xpath(f"//button[@data-test='{i}ok']").click()

        # Submit audit
        self.driver.find_element_by_xpath("//button[@data-test='submit']").click()
        self.waitUntilElementFound("//h3[.='Results']")

        # TODO: Send Email, and then click Complete Audit
        self.clickSendEmailButton()
        # self.clickDownloadCSVButton()
        self.driver.find_element_by_xpath("//button[@data-test='submit']").click()
        self.clickCompleteAuditButton()

        # Logout
        self.clickMenuButton()
        self.waitAWhile(1)
        self.logout()

    # 2. Staff creating Audit for Tenant (At least one Issue)
    def test_5_2_staff_create_audit_one_issue(self):
        # Navigate to home login page
        self.enterHomePage()
        self.loginToPage(self.staffUser["email"], self.staffUser["password"])

        # Check for Staff login page
        self.checkEnteredLoginPage("Staff")
        self.waitAWhile()

        # Enter audit page
        self.enterAudit()

        # Select tenant name
        self.driver.find_element_by_xpath("//div[@data-test='tenant_select']").click()
        self.driver.find_element_by_xpath("//li[@data-value='Tenant Two']").click()
        self.waitAWhile(1)

        # Select F&B Audit
        self.driver.find_element_by_xpath("//button[@data-test='fnb_nonfnb']").click()

        # Select 'OK' for fields
        for i in range(0, 33):
            self.driver.find_element_by_xpath(f"//button[@data-test='{i}ok']").click()

        self.driver.find_element_by_xpath("//button[@data-test='34not_ok']").click()
        self.driver.execute_script("window.scrollTo(0,document.body.scrollHeight)")
        self.waitAWhile()

        # Select Contract End Date
        self.driver.find_element_by_xpath("//input[@name='due_date']").clear()
        self.driver.find_element_by_xpath("//input[@name='due_date']").send_keys("16/09/2021")

        # Insert Description of issue
        self.driver.find_element_by_xpath("//input[@name='Workplace Safety and Health.Electrical panels / DBs are covered..desc']").send_keys("Exposed electrical panels")

        # Submit audit
        self.driver.find_element_by_xpath("//button[@data-test='submit']").click()
        self.waitUntilElementFound("//h3[.='Results']")

        # TODO: Send Email, and then click Complete Audit
        self.clickSendEmailButton()
        # self.clickDownloadCSVButton()
        self.driver.find_element_by_xpath("//button[@data-test='submit']").click()
        self.clickCompleteAuditButton()

        # Logout
        self.clickMenuButton()
        self.waitAWhile(1)
        self.logout()
        

    # # Test 1
    # # Test a successful login for Staff User
    # # Test the entering of Directory page
    # # Test the creation, editing, and deletion of Tenant
    # # Test Logout Button
    # def test_001_staff_login_and_create_edit_delete(self):
    #     firstUserDetails = {
    #         "name": "Tenant One",
    #         "email": "tenantone@test.com",
    #         "password": "password",
    #         "phone": "95959595",
    #         "unit": "01-11"
    #     }

    #     secondUserDetails = {
    #         "name": "Tenant Two",
    #         "phone": "99999999",
    #         "unit": "02-22"
    #     }

    #     loginEmail = "admin@test.com"
    #     loginPassword = "password"

    #     # Navigate to home login page
    #     self.enterHomePage()

    #     self.loginToPage(loginEmail, loginPassword)

    #     # Check for Staff login page
    #     self.checkEnteredLoginPage("Staff")

    #     # Try to enter the directory page
    #     self.enterDirectoryPage()
    #     self.waitAWhile()

    #     # Add a new Tenant with our userDetails
    #     self.createNewTenant(firstUserDetails)
    #     self.waitAWhile()

    #     # Edit existing tenant 
    #     self.editExistingTenant(firstUserDetails, secondUserDetails)
    #     self.waitAWhile()

    #     # Delete existing tenant 
    #     self.deleteExistingTenant(secondUserDetails)
    #     self.waitAWhile()

    #     # Logout
    #     self.clickMenuButton()
    #     self.waitAWhile(1)
    #     self.logout()

    # # Test 2
    # # Test a successful login for Tenant User
    # # Test the entering of Profile Page
    # # Test Logout Button
    # def test_002_tenant_login_success(self):
    #     email = "test@test.com"
    #     password = "password"

    #     # Navigate to home login page
    #     self.enterHomePage()

    #     self.loginToPage(email, password)
        
    #     # Check for Staff login page
    #     self.checkEnteredLoginPage("Tenant")
    #     self.waitAWhile()

    #     # Enter the Profile Page
    #     self.clickMenuButton()
    #     self.enterProfile()
    #     self.waitUntilElementFound("//h1[.='Profile']")
    #     self.waitAWhile()

    #     self.clickMenuButton()
    #     self.waitAWhile(1)
    #     self.logout()

    # # Test 3
    # # Test a failed login using invalid fields
    # # Check for display of alert popup
    # def test_003_failed_login_bad_email(self):
    #     email = "asdasdasdasd"
    #     password = "password"

    #     # Navigate to home login page
    #     self.enterHomePage()

    #     # Try to Login
    #     self.loginToPage(email, password)
    #     self.waitAWhile(1)

    #     alertText = self.driver.switch_to.alert.text
    #     assert alertText == "Invalid login fields!", "Alert Text not correct!"

    #     self.driver.switch_to.alert.accept()
    #     self.waitAWhile(1)

    # # Test 4
    # # Test a failed login with a wrong password
    # # Check for display of alert popup
    # def test_004_failed_login_wrong_password(self):
    #     email = "test@test.com"
    #     password = "definitelynotthecorrectpassword"

    #     # Navigate to home login page
    #     self.enterHomePage()

    #     # Try to Login
    #     self.loginToPage(email, password)
    #     self.waitAWhile()

    #     alertText = self.driver.switch_to.alert.text
    #     assert alertText == "Incorrect password, or user not found", "Alert Text not correct!"

    #     self.driver.switch_to.alert.accept()
    #     self.waitAWhile(1)

    # # Test 5
    # # Test a successful login for Staff User
    # # Test the creation of an Audit (Staff able to see successful submission screen, and view their audit on the main page)
    # # Test Logout Button
    # def test_005_staff_login_and_create_audit(self):

    #     loginEmail = "admin@test.com"
    #     loginPassword = "password"

    #     # Navigate to home login page
    #     self.enterHomePage()

    #     self.loginToPage(loginEmail, loginPassword)

    #     # Check for Staff login page
    #     self.checkEnteredLoginPage("Staff")

    #     # Enter audit page
    #     self.driver.find_element_by_xpath("//button[@data-test='new_audit']").click()
    #     self.waitUntilElementFound("//h1[.='New Audit']")

    #     # Select tenant name
    #     self.driver.find_element_by_xpath("//div[@data-test='tenant_select']").click()
    #     self.driver.find_element_by_xpath("//li[@data-value='Fairprice']").click()
    #     self.waitAWhile(1)

    #     # Select F&B Audit
    #     self.driver.find_element_by_xpath("//button[@data-test='fnb_nonfnb']").click()

    #     # Select 'OK' for fields
    #     for i in range(0, 18):
    #         self.driver.find_element_by_xpath(f"//button[@data-test='{i}ok']").click()

    #     for i in range(24, 39):
    #         self.driver.find_element_by_xpath(f"//button[@data-test='{i}ok']").click()

    #     # Select 'Not Ok' for last field
    #     self.driver.find_element_by_xpath("//button[@data-test='39not_ok']").click()
    #     self.driver.execute_script("window.scrollTo(0,document.body.scrollHeight)")
    #     self.waitAWhile()

    #     # Select Contract End Date
    #     self.driver.find_element_by_xpath("//input[@name='due_date']").clear()
    #     self.driver.find_element_by_xpath("//input[@name='due_date']").send_keys("16/09/2021")

    #     # Insert Description of issue
    #     self.driver.find_element_by_xpath("//input[@name='Workplace Safety and Health.Electrical panels / DBs are covered..desc']").send_keys("Exposed electrical panels")

    #     # Submit audit
    #     self.driver.find_element_by_xpath("//button[@data-test='submit']").click()
    #     self.waitUntilElementFound("//h3[.='Results']")
    #     self.driver.find_element_by_xpath("//button[@data-test='submit']").click()
    #     self.waitAWhile(5)

    #     # Handle alert message
    #     alertText = self.driver.switch_to.alert.text
    #     assert alertText == "Completed submission successfully!"
    #     self.driver.switch_to.alert.accept()

    #     # Check that we have entered back to the login page
    #     self.checkEnteredLoginPage("Staff")
    #     self.driver.execute_script("window.scrollTo(0,document.body.scrollHeight)")
    #     self.waitAWhile()

    #     # Logout
    #     self.clickMenuButton()
    #     self.waitAWhile(1)
    #     self.logout()


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
        self.waitUntilElementFound("//h1[.='Profile']")

    def enterAudit(self):
        self.driver.find_element_by_xpath("//button[@data-test='new_audit']").click()
        self.waitUntilElementFound("//h1[.='New Audit']")

    def clickSendEmailButton(self):
        self.driver.find_element_by_xpath("//button[@data-test='email']").click()
        self.waitAWhile(2)
        self.driver.switch_to.alert.accept()

    def clickDownloadCSVButton(self):
        self.driver.find_element_by_xpath("//button[@data-test='download']").click()
        self.waitAWhile(2)
        self.driver.switch_to.alert.dismiss()

    def clickCompleteAuditButton(self):
        self.driver.find_element_by_xpath("//button[@data-test='submit']").click()
        self.waitAWhile(2)

        # Handle alert message
        alertText = self.driver.switch_to.alert.text
        assert alertText == "Completed submission successfully!"
        self.driver.switch_to.alert.accept()
        self.waitAWhile(3)


    def logout(self):
        self.driver.find_element_by_xpath("//li[@data-test='logout']").click()
        

if __name__ == '__main__':
    unittest.main(verbosity=2)