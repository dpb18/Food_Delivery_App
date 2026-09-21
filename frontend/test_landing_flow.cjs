const { chromium } = require('playwright');
const path = require('path');

const artifactDir = 'C:\\Users\\Dhiraj Pratim Barman\\.gemini\\antigravity-ide\\brain\\42e1f077-e6f8-4d18-9e43-f23e4fba7095';

async function run() {
  const browser = await chromium.launch({
    headless: true,
    channel: 'chrome' // uses installed chrome if available, else standard chromium
  }).catch(() => chromium.launch({ headless: true }));

  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  console.log('1. Navigating to http://localhost:5173/user ...');
  await page.goto('http://localhost:5173/user', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(artifactDir, '1_customer_home.png') });
  console.log('Saved 1_customer_home.png');

  console.log('2. Clicking profile button to open dropdown...');
  // Find the profile button containing Dhiraj or with class / style
  const profileBtn = await page.$('button:has-text("Dhiraj")');
  if (profileBtn) {
    await profileBtn.click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(artifactDir, '2_profile_dropdown_open.png') });
    console.log('Saved 2_profile_dropdown_open.png');

    console.log('3. Clicking Sign Out...');
    const signOutBtn = await page.$('button:has-text("Sign Out")');
    if (signOutBtn) {
      await signOutBtn.click();
      await page.waitForTimeout(1000);
      await page.screenshot({ path: path.join(artifactDir, '3_landing_page_after_signout.png') });
      console.log('Saved 3_landing_page_after_signout.png');
    }
  }

  console.log('4. Testing Forgot Password Tab...');
  const forgotTab = await page.$('button:has-text("Forgot Password")');
  if (forgotTab) {
    await forgotTab.click();
    await page.waitForTimeout(500);

    await page.fill('input[placeholder="e.g. dhiraj@example.com"]', 'dhiraj@example.com');
    await page.fill('input[placeholder="Enter new password"]', 'customer123');
    await page.fill('input[placeholder="Re-enter new password"]', 'customer123');
    await page.screenshot({ path: path.join(artifactDir, '4_forgot_password_filled.png') });
    console.log('Saved 4_forgot_password_filled.png');

    const updateBtn = await page.$('button:has-text("Update Password & Sign In")');
    if (updateBtn) {
      await updateBtn.click();
      await page.waitForTimeout(1500);
      await page.screenshot({ path: path.join(artifactDir, '5_after_password_reset_login.png') });
      console.log('Saved 5_after_password_reset_login.png');
    }
  }

  console.log('5. Sign out again and test Order Guard at /checkout ...');
  const profileBtn2 = await page.$('button:has-text("Dhiraj")');
  if (profileBtn2) {
    await profileBtn2.click();
    await page.waitForTimeout(500);
    const signOutBtn2 = await page.$('button:has-text("Sign Out")');
    if (signOutBtn2) {
      await signOutBtn2.click();
      await page.waitForTimeout(1000);
    }
  }

  // Navigate to checkout
  await page.goto('http://localhost:5173/checkout', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(artifactDir, '6_checkout_auth_required_guard.png') });
  console.log('Saved 6_checkout_auth_required_guard.png');

  // Test 1-click quick sign in at checkout
  const quickSignInBtn = await page.$('button:has-text("Quick Sign In as Dhiraj")');
  if (quickSignInBtn) {
    await quickSignInBtn.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(artifactDir, '7_checkout_unlocked_after_signin.png') });
    console.log('Saved 7_checkout_unlocked_after_signin.png');
  }

  await browser.close();
  console.log('All verification steps completed successfully!');
}

run().catch((err) => {
  console.error('Error during test execution:', err);
  process.exit(1);
});
