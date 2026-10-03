import { test, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";
async function add(page, note, amount, kind = "expense") {
  await page.getByRole("button", { name: "Add transaction" }).click();
  await page.getByLabel("Description", { exact: true }).fill(note);
  await page.getByLabel("Amount (USD)", { exact: true }).fill(amount);
  await page
    .getByRole("combobox", { name: "Type", exact: true })
    .selectOption(kind);
  await page.getByRole("button", { name: "Save transaction" }).click();
}
test("ledger CRUD, cents arithmetic, filters, persistence and chart", async ({
  page,
}) => {
  await page.goto("/");
  await add(page, "Demo lunch", "12.34");
  await add(page, "Demo income", "100", "income");
  await expect(page.locator(".stat.accent strong")).toHaveText("$87.66");
  await expect(page.getByRole("img")).toHaveAttribute(
    "aria-label",
    /Food: \$12.34/,
  );
  await page
    .getByRole("button", { name: "Edit Demo lunch", exact: true })
    .click();
  await page.getByLabel("Amount (USD)", { exact: true }).fill("15.50");
  await page.getByRole("button", { name: "Save transaction" }).click();
  await page.reload();
  await expect(page.locator(".stat.accent strong")).toHaveText("$84.50");
  await page.getByLabel("Search transactions").fill("lunch");
  await expect(page.locator("tbody tr")).toHaveCount(1);
  await page
    .getByRole("button", { name: "Delete Demo lunch", exact: true })
    .click();
  await page.getByRole("button", { name: "Keep transaction" }).click();
  await expect(page.locator("tbody tr")).toHaveCount(1);
  await page
    .getByRole("button", { name: "Delete Demo lunch", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Delete transaction", exact: true })
    .click();
  await expect(page.locator("tbody tr")).toHaveCount(0);
});
test("export neutralizes spreadsheet formulas", async ({ page }) => {
  await page.goto("/");
  await add(page, "=SUM(1,1)", "10");
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export filtered CSV" }).click();
  const download = await downloadPromise;
  const csv = await readFile(await download.path(), "utf8");
  expect(csv).toContain('"\'=SUM(1,1)"');
});
test("malformed storage and mobile layout", async ({ page }) => {
  await page.addInitScript(() =>
    localStorage.setItem("pennyscope.entries.v1", '{"broken":true}'),
  );
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Load sample transactions" }).click();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
