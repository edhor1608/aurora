if (!process.env.SITE_URL) {
  process.env.SITE_URL = "https://aurora.test";
}

if (!process.env.BETTER_AUTH_SECRET) {
  process.env.BETTER_AUTH_SECRET = "test-secret-for-vitest-only";
}
