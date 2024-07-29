const request = require("supertest");
const app = require("../../api/app");
const db = require("../../api/utils/db");

// example test only will be removed later.
describe("GET /", () => {
  // this test should always pass
  test("should return 200 OK", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toEqual(404);
  });
});

afterAll(async () => {
  await db.close();
});
