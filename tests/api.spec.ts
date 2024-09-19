import { test, expect } from "@playwright/test";
import { tags } from "../test-data/tags";

test.beforeEach(async ({ page }) => {
  await page.route(
    "https://conduit-api.bondaracademy.com/api/tags",
    async (route) => {
      console.log("Intercepted route:", route.request().url());
      await route.fulfill({
        status: 200,
        body: JSON.stringify(tags),
        contentType: "application/json",
      });
    }
  );

  await page.goto("https://conduit.bondaracademy.com/");
  await page.route("**/api/articles?limit=10&offset=0", async (route) => {
    const response = await route.fetch();
    const body = await response.json();
    console.log(body);

    body.articles[0].title = "Ailo";
    body.articles[0].description = "Nordsletta";

    await route.fulfill({
      body: JSON.stringify(body),
    });
  });

  /*   // Ensure the API request is intercepted
  await page.waitForResponse(
    (response) => response.url().includes("/tags") && response.status() === 200
  ); */
});

test("has title", async ({ page }) => {
  await expect(page.locator(".navbar-brand")).toHaveText("conduit");
});
