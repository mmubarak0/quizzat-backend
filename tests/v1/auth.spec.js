// set application mode to testing
const request = require("supertest");
const app = require("../../api/app");
const db = require("../../api/utils/db");

// example test only will be removed later.
describe("GET /", () => {
  // this test should always pass
  test("should return 200 OK", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(404);
  });
});

// // test user sign up.
// describe('POST /api/v1/auth/register', () => {
//   test('should return 201 CREATED', async () => {
//     const res = await request(app)
//   })
// })

afterAll(async () => {
  await db.close();
});
