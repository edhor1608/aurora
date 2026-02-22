import { expect, test, type Page } from "@playwright/test";

const ensureSignedIn = async (page: Page) => {
  const signInButton = page.getByRole("button", { name: "Sign in" });
  const signUpButton = page.getByRole("button", { name: "Sign up" });
  const sendButton = page.getByRole("button", { name: "Send" });

  for (let attempt = 0; attempt < 3; attempt += 1) {
    await signInButton.click();
    try {
      await expect(sendButton).toBeEnabled({ timeout: 5_000 });
      return;
    } catch {}

    await signUpButton.click();
    await signInButton.click();
    try {
      await expect(sendButton).toBeEnabled({ timeout: 5_000 });
      return;
    } catch {}
  }

  await expect(sendButton).toBeEnabled({ timeout: 20_000 });
};

test("requires auth before sending a message", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Aurora Hello World" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Send" })).toBeDisabled();
});

test("can sign up and send a persisted hello-world message", async ({ page }) => {
  const message = `hello world playwright ${Date.now()}`;

  await page.goto("/");
  await ensureSignedIn(page);

  await page.getByLabel("Message").fill(message);
  await page.getByRole("button", { name: "Send" }).click();

  await expect(page.getByText(message)).toBeVisible();
});
