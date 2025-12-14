const { test, expect } = require("@playwright/test");

test.describe("Login Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should login successfully and redirect to profile", async ({
    page,
  }) => {
    const testEmail = process.env.TEST_USER_EMAIL || "test@gmail.com";
    const testPassword = process.env.TEST_USER_PASSWORD || "Test123!";

    if (testEmail === "test@gmail.com" && testPassword === "Test123!") {
      test.skip(
        "Test wymaga ustawienia zmiennych środowiskowych TEST_USER_EMAIL i TEST_USER_PASSWORD z prawdziwymi danymi użytkownika Firebase."
      );
      return;
    }

    await page.goto("/public/user/signin");

    await expect(
      page.getByRole("heading", { name: /Zaloguj się/i })
    ).toBeVisible();

    await page.locator("#email").fill(testEmail);
    await page.locator("#password").fill(testPassword);

    await page.getByRole("button", { name: /Zaloguj się/i }).click();

    await page.waitForTimeout(2000);

    const errorSelectors = [
      '[role="alert"]',
      ".text-red-600",
      ".text-red-500",
      '[class*="failure"]',
      'div:has-text("błąd")',
      'div:has-text("Błąd")',
      'div:has-text("error")',
      'div:has-text("Error")',
    ];

    let hasError = false;
    let errorText = "";

    for (const selector of errorSelectors) {
      const errorElement = page.locator(selector);
      const count = await errorElement.count();
      if (count > 0) {
        hasError = true;
        errorText = await errorElement.first().textContent();
        break;
      }
    }

    if (hasError && errorText && errorText.trim().length > 0) {
      if (
        errorText.includes("invalid-credential") ||
        errorText.includes("Nieprawidłowe")
      ) {
        throw new Error(
          `Logowanie nie powiodło się - nieprawidłowe dane logowania. Sprawdź czy użytkownik ${testEmail} istnieje w Firebase.`
        );
      }
      throw new Error(`Logowanie nie powiodło się: ${errorText}`);
    }

    await expect(page).not.toHaveURL(/.*\/public\/user\/signin/, {
      timeout: 15000,
    });

    await expect(page.getByRole("button", { name: /Wyloguj/i })).toBeVisible({
      timeout: 10000,
    });

    const profileLink = page.locator('a[href*="/protected/user/profile"]');
    await expect(profileLink).toBeVisible({ timeout: 5000 });

    await profileLink.click();

    await expect(page).toHaveURL(/.*\/protected\/user\/profile/);

    await expect(
      page.getByRole("heading", { name: /Profil użytkownika/i })
    ).toBeVisible();
  });

  test("should redirect unauthenticated user to login page when accessing profile", async ({
    page,
  }) => {
    await page.goto("/protected/user/profile");

    await expect(page).toHaveURL(/.*\/public\/user\/signin/, {
      timeout: 10000,
    });

    await expect(
      page.getByRole("heading", { name: /Zaloguj się/i })
    ).toBeVisible();
  });
});
