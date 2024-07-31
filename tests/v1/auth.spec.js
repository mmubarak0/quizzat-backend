// set application mode to testing
const request = require("supertest");
const app = require("../../api/app");
const db = require("../../api/utils/db");
const { DATABASE_NAME, USERS_COLLECTION } = require("../../config");

const database = db.db(DATABASE_NAME);
const users = database.collection(USERS_COLLECTION);

// example test only will be removed later.
describe("GET /", () => {
  // this test should always pass
  test("should return 200 OK", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
  });
  test("should return 404 NOT FOUND", async () => {
    const res = await request(app).get("/notfound");
    expect(res.statusCode).toBe(404);
  });
});

// test user sign up.
describe("POST /api/v1/auth/register", () => {
  test("should return 201 CREATED", async () => {
    const res = await request(app).post("/api/v1/auth/register").send({
      email: "test@mail.com",
      password: "password",
      firstName: "test",
      lastName: "user",
    });
    expect(res.statusCode).toBe(201);
    if (res.status_code === 201) {
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toBe(["User created successfully."]);
      expect(res.body).toHaveProperty("accesstoken");
      expect(res.body).toHaveProperty("refreshToken");
      expect(res.body).toHaveProperty("data");
      expect(res.body.data).toHaveProperty("_id");
      expect(res.body.data).toHaveProperty("email");
      expect(res.body.data).toHaveProperty("firstName");
      expect(res.body.data).toHaveProperty("lastName");
      expect(res.body.data.email).toBe("test@mail.com");
      expect(res.body.data.firstName).toBe("test");
      expect(res.body.data.password).toBeUndefined();
      expect(res.body.data.lastName).toBe("user");
    }
  });
});

beforeAll(async () => {
  // clear the database
  await users.deleteMany({});
});

afterAll(async () => {
  // clear the database
  await users.deleteMany({});
  await db.close();
});
