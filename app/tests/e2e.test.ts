import { test, expect } from "@playwright/test";

test("opens page, open add connection dialog, close dialog", async ({
  page,
}) => {
  await page.goto("http://localhost:5173");
  await expect(page).toHaveTitle("Device Signal Chain");
  await page.getByText("Add connection").click();
  await expect(page.getByText("Source")).toBeVisible();
  await page.getByText("Close").click();
  await expect(page.getByText("Source")).toBeHidden();
});
