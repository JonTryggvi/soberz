import { browser, by, element } from "protractor";

describe('Log in', () => {
  it('1.0: Should log into system', async () => {
    browser.get('/home/login');
    browser.sleep(3000);
    element(by.id('mat-input-0')).sendKeys('jontryggvi@jontryggvi.is');
    element(by.id('mat-input-1')).sendKeys('123#$%');
    element(by.className('form-submit')).click();
    browser.sleep(2000);
  })
})